#!/usr/bin/env python3
"""
The Lil Gift Corner - Backend API Testing Suite
Comprehensive testing for all API endpoints
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

class ECommerceAPITester:
    def __init__(self, base_url: str = "http://localhost:8001"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        
        # Test data
        self.admin_token = None
        self.user_token = None
        self.test_user_email = f"test_user_{datetime.now().strftime('%H%M%S')}@test.com"
        self.test_product_id = None
        self.test_cart_item_id = None
        self.session_id = f"test_session_{datetime.now().strftime('%H%M%S')}"
        
        # Test results
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.critical_failures = []

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
            if "critical" in test_name.lower() or "auth" in test_name.lower():
                self.critical_failures.append(test_name)

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

    def test_health_check(self):
        """Test basic health endpoint"""
        success, response = self.make_request('GET', '/health', expected_status=404)
        # Health endpoint might be at root level
        try:
            health_response = requests.get(f"{self.base_url}/health")
            success = health_response.status_code == 200
            details = f"Status: {health_response.status_code}"
        except:
            success = False
            details = "Health endpoint not accessible"
        
        self.log_test("Health Check", success, details)
        return success

    def test_admin_login(self):
        """Test admin authentication - CRITICAL"""
        data = {
            "email": "admin@thelilgiftcorner.com",
            "password": "Admin@123"
        }
        
        success, response = self.make_request('POST', '/auth/login', data)
        
        if success and 'token' in response:
            self.admin_token = response['token']
            self.session.headers.update({'Authorization': f'Bearer {self.admin_token}'})
            details = f"Admin logged in successfully, role: {response.get('user', {}).get('role', 'unknown')}"
        else:
            details = f"Login failed: {response.get('detail', 'Unknown error')}"
        
        self.log_test("CRITICAL - Admin Login", success, details)
        return success

    def test_user_registration(self):
        """Test user registration"""
        data = {
            "name": "Test User",
            "email": self.test_user_email,
            "password": "TestPass123!"
        }
        
        success, response = self.make_request('POST', '/auth/register', data, expected_status=200)
        
        if success and 'token' in response:
            self.user_token = response['token']
            details = f"User registered: {response.get('user', {}).get('email', 'unknown')}"
        else:
            details = f"Registration failed: {response.get('detail', 'Unknown error')}"
        
        self.log_test("User Registration", success, details)
        return success

    def test_user_login(self):
        """Test user login"""
        data = {
            "email": self.test_user_email,
            "password": "TestPass123!"
        }
        
        success, response = self.make_request('POST', '/auth/login', data)
        
        if success and 'token' in response:
            details = f"User login successful: {response.get('user', {}).get('email', 'unknown')}"
        else:
            details = f"Login failed: {response.get('detail', 'Unknown error')}"
        
        self.log_test("User Login", success, details)
        return success

    def test_get_products(self):
        """Test product listing"""
        success, response = self.make_request('GET', '/products')
        
        if success and isinstance(response, list):
            details = f"Retrieved {len(response)} products"
            if len(response) > 0:
                self.test_product_id = response[0].get('id')
        else:
            details = f"Failed to get products: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Get Products", success, details)
        return success

    def test_get_categories(self):
        """Test categories endpoint"""
        success, response = self.make_request('GET', '/products/categories')
        
        if success and 'categories' in response:
            details = f"Retrieved {len(response['categories'])} categories"
        else:
            details = f"Failed to get categories: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Get Categories", success, details)
        return success

    def test_get_single_product(self):
        """Test single product retrieval"""
        if not self.test_product_id:
            self.log_test("Get Single Product", False, "No product ID available")
            return False
        
        success, response = self.make_request('GET', f'/products/{self.test_product_id}')
        
        if success and 'id' in response:
            details = f"Retrieved product: {response.get('name', 'unknown')}"
        else:
            details = f"Failed to get product: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Get Single Product", success, details)
        return success

    def test_product_search(self):
        """Test product search"""
        success, response = self.make_request('GET', '/products?search=gift')
        
        if success and isinstance(response, list):
            details = f"Search returned {len(response)} results"
        else:
            details = f"Search failed: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Product Search", success, details)
        return success

    def test_add_to_cart(self):
        """Test adding item to cart"""
        if not self.test_product_id:
            self.log_test("Add to Cart", False, "No product ID available")
            return False
        
        data = {
            "product_id": self.test_product_id,
            "quantity": 2,
            "session_id": self.session_id
        }
        
        success, response = self.make_request('POST', '/cart', data, expected_status=200)
        
        if success and 'id' in response:
            self.test_cart_item_id = response['id']
            details = f"Added to cart: {response.get('quantity', 0)} items"
        else:
            details = f"Failed to add to cart: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Add to Cart", success, details)
        return success

    def test_get_cart(self):
        """Test cart retrieval"""
        success, response = self.make_request('GET', f'/cart/{self.session_id}')
        
        if success and 'items' in response:
            details = f"Cart has {len(response['items'])} items, total: {response.get('total', 0)}"
        else:
            details = f"Failed to get cart: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Get Cart", success, details)
        return success

    def test_update_cart(self):
        """Test cart item update"""
        if not self.test_product_id:
            self.log_test("Update Cart", False, "No product ID available")
            return False
        
        data = {
            "product_id": self.test_product_id,
            "quantity": 3,
            "session_id": self.session_id
        }
        
        success, response = self.make_request('PUT', '/cart', data)
        
        if success:
            details = f"Updated cart item quantity to {response.get('quantity', 0)}"
        else:
            details = f"Failed to update cart: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Update Cart", success, details)
        return success

    def test_checkout_session_creation(self):
        """Test checkout session creation"""
        data = {
            "session_id": self.session_id,
            "origin_url": self.base_url
        }
        
        success, response = self.make_request('POST', '/checkout/session', data)
        
        if success and 'url' in response:
            details = f"Checkout session created: {response.get('session_id', 'unknown')}"
        else:
            details = f"Checkout failed: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Checkout Session Creation", success, details)
        return success

    def test_admin_dashboard(self):
        """Test admin dashboard - requires admin auth"""
        if not self.admin_token:
            self.log_test("Admin Dashboard", False, "No admin token available")
            return False
        
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        success, response = self.make_request('GET', '/admin/dashboard', headers=headers)
        
        if success and 'total_products' in response:
            details = f"Dashboard loaded: {response.get('total_products', 0)} products, {response.get('total_orders', 0)} orders"
        else:
            details = f"Dashboard failed: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Admin Dashboard", success, details)
        return success

    def test_admin_products(self):
        """Test admin products management"""
        if not self.admin_token:
            self.log_test("Admin Products", False, "No admin token available")
            return False
        
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        success, response = self.make_request('GET', '/admin/products', headers=headers)
        
        if success and 'products' in response:
            details = f"Admin products loaded: {len(response['products'])} products"
        else:
            details = f"Admin products failed: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Admin Products", success, details)
        return success

    def test_admin_orders(self):
        """Test admin orders management"""
        if not self.admin_token:
            self.log_test("Admin Orders", False, "No admin token available")
            return False
        
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        success, response = self.make_request('GET', '/admin/orders', headers=headers)
        
        if success and 'orders' in response:
            details = f"Admin orders loaded: {len(response['orders'])} orders"
        else:
            details = f"Admin orders failed: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Admin Orders", success, details)
        return success

    def test_remove_from_cart(self):
        """Test removing item from cart"""
        if not self.test_cart_item_id:
            self.log_test("Remove from Cart", False, "No cart item ID available")
            return False
        
        success, response = self.make_request('DELETE', f'/cart/{self.test_cart_item_id}')
        
        if success:
            details = "Item removed from cart successfully"
        else:
            details = f"Failed to remove from cart: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Remove from Cart", success, details)
        return success

    def test_get_active_coupons(self):
        """Test active coupons endpoint"""
        success, response = self.make_request('GET', '/coupons/active')
        
        if success and isinstance(response, list):
            details = f"Retrieved {len(response)} active coupons"
        else:
            details = f"Failed to get coupons: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Get Active Coupons", success, details)
        return success

    def test_wishlist_functionality(self):
        """Test wishlist functionality - requires user auth"""
        if not self.user_token or not self.test_product_id:
            self.log_test("Wishlist Functionality", False, "Missing user token or product ID")
            return False
        
        headers = {'Authorization': f'Bearer {self.user_token}'}
        
        # Add to wishlist
        success, response = self.make_request('POST', f'/wishlist?product_id={self.test_product_id}', headers=headers)
        
        if success:
            details = "Added to wishlist successfully"
        else:
            details = f"Failed to add to wishlist: {response.get('detail', 'Unknown error')}"
        
        self.log_test("Wishlist Functionality", success, details)
        return success

    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting The Lil Gift Corner API Test Suite")
        print(f"🔗 Testing API: {self.api_url}")
        print("=" * 60)
        
        # Basic connectivity
        self.test_health_check()
        
        # Authentication tests (CRITICAL)
        self.test_admin_login()
        self.test_user_registration()
        self.test_user_login()
        
        # Product tests
        self.test_get_products()
        self.test_get_categories()
        self.test_get_single_product()
        self.test_product_search()
        
        # Cart tests
        self.test_add_to_cart()
        self.test_get_cart()
        self.test_update_cart()
        
        # Checkout tests
        self.test_checkout_session_creation()
        
        # Admin tests
        self.test_admin_dashboard()
        self.test_admin_products()
        self.test_admin_orders()
        
        # Additional tests
        self.test_get_active_coupons()
        self.test_wishlist_functionality()
        
        # Cleanup
        self.test_remove_from_cart()
        
        # Print results
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        print(f"✅ Tests Passed: {self.tests_passed}/{self.tests_run}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}/{self.tests_run}")
        print(f"🔥 Critical Failures: {len(self.critical_failures)}")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"  - {test['test']}: {test['details']}")
        
        if self.critical_failures:
            print(f"\n🚨 CRITICAL FAILURES: {', '.join(self.critical_failures)}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"\n📈 Success Rate: {success_rate:.1f}%")
        
        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "failed_tests": self.failed_tests,
            "critical_failures": self.critical_failures,
            "success_rate": success_rate
        }

def main():
    """Main test execution"""
    tester = ECommerceAPITester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    if len(results["critical_failures"]) > 0:
        print("\n🚨 CRITICAL FAILURES DETECTED - Backend needs immediate attention")
        return 2
    elif results["success_rate"] < 70:
        print(f"\n⚠️  LOW SUCCESS RATE ({results['success_rate']:.1f}%) - Multiple issues detected")
        return 1
    else:
        print(f"\n✅ Backend testing completed successfully ({results['success_rate']:.1f}% success rate)")
        return 0

if __name__ == "__main__":
    sys.exit(main())