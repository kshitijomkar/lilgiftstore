#!/usr/bin/env python3
"""
The Lil Gift Corner - User Profile & Order History Test
Focused testing for the critical fix: user_id association with orders
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

class UserProfileOrderTester:
    def __init__(self, base_url: str = "http://localhost:8001"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        
        # Test data
        self.user_token = None
        self.user_id = None
        self.test_user_email = f"profile_test_{datetime.now().strftime('%H%M%S')}@test.com"
        self.test_product_id = None
        self.test_order_id = None
        self.session_id = f"profile_session_{datetime.now().strftime('%H%M%S')}"
        
        # Test results
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
        if details:
            print(f"    {details}")
        
        if success:
            self.tests_passed += 1
        else:
            self.failed_tests.append({"test": test_name, "details": details})

    def make_request(self, method: str, endpoint: str, data: Dict = None, 
                    headers: Dict = None, expected_status: int = 200) -> tuple:
        """Make HTTP request and return success status and response"""
        url = f"{self.api_url}{endpoint}"
        
        try:
            if method.upper() == 'GET':
                response = self.session.get(url, headers=headers)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, headers=headers)
            else:
                return False, {"error": f"Unsupported method: {method}"}

            success = response.status_code == expected_status
            
            try:
                response_data = response.json()
            except:
                response_data = {"status_code": response.status_code, "text": response.text}
            
            return success, response_data
            
        except Exception as e:
            return False, {"error": str(e)}

    def test_user_registration_and_login(self):
        """Test user registration and login to get authenticated user"""
        # Register user
        data = {
            "name": "Profile Test User",
            "email": self.test_user_email,
            "password": "TestPass123!"
        }
        
        success, response = self.make_request('POST', '/auth/register', data)
        
        if success and 'token' in response:
            self.user_token = response['token']
            self.user_id = response['user']['id']
            details = f"User registered and logged in: {response['user']['email']}"
        else:
            details = f"Registration failed: {response.get('detail', 'Unknown error')}"
        
        self.log_test("User Registration & Login", success, details)
        return success

    def test_profile_access(self):
        """Test profile endpoint access"""
        if not self.user_token:
            self.log_test("Profile Access", False, "No user token available")
            return False
        
        headers = {'Authorization': f'Bearer {self.user_token}'}
        success, response = self.make_request('GET', '/user/profile', headers=headers)
        
        if success and 'id' in response:
            details = f"Profile accessed: {response.get('name', 'unknown')} ({response.get('email', 'unknown')})"
        else:
            details = f"Profile access failed: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Profile Access", success, details)
        return success

    def test_empty_order_history(self):
        """Test that new user has empty order history"""
        if not self.user_token:
            self.log_test("Empty Order History", False, "No user token available")
            return False
        
        headers = {'Authorization': f'Bearer {self.user_token}'}
        success, response = self.make_request('GET', '/user/orders', headers=headers)
        
        if success and 'orders' in response:
            order_count = len(response['orders'])
            if order_count == 0:
                details = "New user has empty order history (correct)"
            else:
                details = f"New user has {order_count} orders (unexpected)"
                success = False
        else:
            details = f"Order history access failed: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Empty Order History", success, details)
        return success

    def test_add_to_cart_with_user_id(self):
        """Test adding item to cart as authenticated user (should include user_id)"""
        # First get a product
        success, products = self.make_request('GET', '/products')
        if not success or not products:
            self.log_test("Add to Cart with User ID", False, "No products available")
            return False
        
        self.test_product_id = products[0]['id']
        
        # Add to cart as authenticated user
        data = {
            "product_id": self.test_product_id,
            "quantity": 1,
            "session_id": self.session_id
        }
        
        headers = {'Authorization': f'Bearer {self.user_token}'}
        success, response = self.make_request('POST', '/cart', data, headers=headers)
        
        if success and 'id' in response:
            # Check if user_id is included in cart item
            user_id_included = response.get('user_id') == self.user_id
            if user_id_included:
                details = f"Cart item created with user_id: {response.get('user_id')}"
            else:
                details = f"Cart item missing user_id. Got: {response.get('user_id')}, Expected: {self.user_id}"
                success = False
        else:
            details = f"Failed to add to cart: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Add to Cart with User ID", success, details)
        return success

    def test_cod_checkout_with_user_id(self):
        """Test COD checkout creates order with user_id"""
        if not self.test_product_id:
            self.log_test("COD Checkout with User ID", False, "No product in cart")
            return False
        
        # Create COD order
        order_data = {
            "session_id": self.session_id,
            "items": [{
                "product_id": self.test_product_id,
                "name": "Test Product",
                "price": 100.0,
                "quantity": 1
            }],
            "total_amount": 100.0,
            "payment_method": "cod",
            "status": "pending"
        }
        
        headers = {'Authorization': f'Bearer {self.user_token}'}
        success, response = self.make_request('POST', '/orders', order_data, headers=headers)
        
        if success and 'id' in response:
            self.test_order_id = response['id']
            # Check if user_id is included in order
            user_id_included = response.get('user_id') == self.user_id
            if user_id_included:
                details = f"COD order created with user_id: {response.get('user_id')}"
            else:
                details = f"COD order missing user_id. Got: {response.get('user_id')}, Expected: {self.user_id}"
                success = False
        else:
            details = f"COD order creation failed: {response.get('detail', 'Unknown error')}"
        
        self.log_test("COD Checkout with User ID", success, details)
        return success

    def test_order_appears_in_profile(self):
        """Test that created order appears in user's order history"""
        if not self.user_token or not self.test_order_id:
            self.log_test("Order Appears in Profile", False, "Missing user token or order ID")
            return False
        
        headers = {'Authorization': f'Bearer {self.user_token}'}
        success, response = self.make_request('GET', '/user/orders', headers=headers)
        
        if success and 'orders' in response:
            orders = response['orders']
            print(f"DEBUG: Found {len(orders)} orders in profile")
            if orders:
                print(f"DEBUG: First order keys: {list(orders[0].keys())}")
            
            order_found = any(order.get('id') == self.test_order_id for order in orders)
            
            if order_found:
                details = f"Order {self.test_order_id[:8]} found in user's order history ({len(orders)} total orders)"
            else:
                details = f"Order {self.test_order_id[:8]} NOT found in user's order history. Found {len(orders)} orders"
                if orders:
                    details += f". Available order IDs: {[order.get('id', 'no-id')[:8] for order in orders]}"
                success = False
        else:
            details = f"Failed to get user orders: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Order Appears in Profile", success, details)
        return success

    def test_order_details_correct(self):
        """Test that order details are correct in profile"""
        if not self.user_token:
            self.log_test("Order Details Correct", False, "No user token available")
            return False
        
        headers = {'Authorization': f'Bearer {self.user_token}'}
        success, response = self.make_request('GET', '/user/orders', headers=headers)
        
        if success and 'orders' in response and len(response['orders']) > 0:
            order = response['orders'][0]  # Get the first order
            
            # Check order has required fields
            required_fields = ['id', 'total_amount', 'status', 'created_at', 'user_id']
            missing_fields = [field for field in required_fields if field not in order]
            
            if not missing_fields and order.get('user_id') == self.user_id:
                details = f"Order details correct: {order.get('total_amount')} INR, status: {order.get('status')}"
            else:
                details = f"Order details incorrect. Missing fields: {missing_fields}, user_id: {order.get('user_id')}"
                success = False
        else:
            details = f"No orders found or failed to get orders: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Order Details Correct", success, details)
        return success

    def run_profile_order_tests(self):
        """Run focused tests for user profile and order history"""
        print("🎯 Starting User Profile & Order History Test Suite")
        print(f"🔗 Testing API: {self.api_url}")
        print("=" * 60)
        
        # Test the complete user journey
        self.test_user_registration_and_login()
        self.test_profile_access()
        self.test_empty_order_history()
        self.test_add_to_cart_with_user_id()
        self.test_cod_checkout_with_user_id()
        self.test_order_appears_in_profile()
        self.test_order_details_correct()
        
        # Print results
        print("\n" + "=" * 60)
        print("📊 USER PROFILE & ORDER HISTORY TEST RESULTS")
        print("=" * 60)
        print(f"✅ Tests Passed: {self.tests_passed}/{self.tests_run}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}/{self.tests_run}")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"  - {test['test']}: {test['details']}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"\n📈 Success Rate: {success_rate:.1f}%")
        
        if success_rate == 100:
            print("🎉 CRITICAL FIX VERIFIED: User profile and order history working correctly!")
        elif success_rate >= 80:
            print("⚠️  MOSTLY WORKING: Minor issues detected")
        else:
            print("🚨 CRITICAL ISSUES: User profile and order history not working properly")
        
        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "failed_tests": self.failed_tests,
            "success_rate": success_rate
        }

def main():
    """Main test execution"""
    tester = UserProfileOrderTester()
    results = tester.run_profile_order_tests()
    
    # Return appropriate exit code
    if results["success_rate"] < 80:
        print("\n🚨 CRITICAL ISSUES DETECTED - Profile/Order functionality needs attention")
        return 1
    else:
        print(f"\n✅ Profile & Order testing completed successfully ({results['success_rate']:.1f}% success rate)")
        return 0

if __name__ == "__main__":
    sys.exit(main())