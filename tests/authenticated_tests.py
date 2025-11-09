#!/usr/bin/env python3
"""
Comprehensive Authenticated Testing - User & Admin Flows
Tests login, protected endpoints, and admin functionality
"""
import requests
import json
import sys
from typing import Dict, Any, Optional

BASE_URL = "http://localhost:8001/api"
test_results = []

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def log_test(name: str, passed: bool, message: str = "", data: Any = None):
    """Log test result"""
    status = f"{Colors.GREEN}✅ PASS{Colors.RESET}" if passed else f"{Colors.RED}❌ FAIL{Colors.RESET}"
    test_results.append({"name": name, "passed": passed, "message": message, "data": data})
    print(f"{status} - {name}")
    if message:
        print(f"    {Colors.BLUE}{message}{Colors.RESET}")
    if data and not passed:
        print(f"    {Colors.RED}Response: {json.dumps(data, indent=2)}{Colors.RESET}")

def log_section(title: str):
    """Log section header"""
    print(f"\n{Colors.YELLOW}{'='*70}{Colors.RESET}")
    print(f"{Colors.YELLOW}{title}{Colors.RESET}")
    print(f"{Colors.YELLOW}{'='*70}{Colors.RESET}\n")

# =============================================================================
# USER AUTHENTICATION TESTS
# =============================================================================

def test_user_registration() -> tuple:
    """Test user registration"""
    log_section("👤 USER REGISTRATION TEST")
    
    import time
    unique_email = f"testuser{int(time.time())}@test.com"
    
    payload = {
        "name": "Test User",
        "email": unique_email,
        "password": "Test@123",
        "phone": "9876543210"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=payload)
        data = response.json() if response.status_code in [200, 201] else None
        success = response.status_code in [200, 201]
        
        log_test(
            "User Registration",
            success,
            f"Status: {response.status_code}, Email: {unique_email}",
            data if not success else None
        )
        
        return unique_email, "Test@123" if success else (None, None)
    except Exception as e:
        log_test("User Registration", False, str(e))
        return None, None

def test_user_login(email: str, password: str) -> Optional[str]:
    """Test user login and token generation"""
    log_section("🔐 USER LOGIN TEST")
    
    payload = {"email": email, "password": password}
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=payload)
        data = response.json() if response.ok else response.text
        
        if response.status_code == 200:
            token = data.get("token") or data.get("access_token")
            user_data = data.get("user", {})
            
            log_test(
                "User Login - Success",
                True,
                f"Token: {token[:20]}... | User: {user_data.get('name')} ({user_data.get('role')})"
            )
            
            log_test(
                "Token Generation",
                bool(token),
                f"Token length: {len(token) if token else 0} characters"
            )
            
            return token
        else:
            log_test("User Login - Failed", False, f"Status: {response.status_code}", data)
            return None
            
    except Exception as e:
        log_test("User Login", False, str(e))
        return None

def test_admin_login() -> Optional[str]:
    """Test admin login"""
    log_section("👨‍💼 ADMIN LOGIN TEST")
    
    payload = {
        "email": "admin@thelilgiftcorner.com",
        "password": "Admin@123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=payload)
        data = response.json() if response.ok else response.text
        
        if response.status_code == 200:
            token = data.get("token") or data.get("access_token")
            user_data = data.get("user", {})
            
            log_test(
                "Admin Login - Success",
                True,
                f"Token: {token[:20]}... | Role: {user_data.get('role')}"
            )
            
            log_test(
                "Admin Role Verification",
                user_data.get('role') == 'admin',
                f"Role: {user_data.get('role')}"
            )
            
            return token
        else:
            log_test("Admin Login - Failed", False, f"Status: {response.status_code}", data)
            return None
            
    except Exception as e:
        log_test("Admin Login", False, str(e))
        return None

# =============================================================================
# USER PROTECTED ENDPOINTS
# =============================================================================

def test_user_profile(token: str):
    """Test user profile endpoints"""
    log_section("👤 USER PROFILE TESTS")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get Profile
    try:
        response = requests.get(f"{BASE_URL}/user/profile", headers=headers)
        data = response.json() if response.ok else None
        
        log_test(
            "Get User Profile",
            response.status_code == 200,
            f"Status: {response.status_code} | User: {data.get('name') if data else 'N/A'}",
            data if response.status_code != 200 else None
        )
    except Exception as e:
        log_test("Get User Profile", False, str(e))
    
    # Update Profile
    try:
        update_payload = {"phone": "9999988888"}
        response = requests.put(f"{BASE_URL}/user/profile", json=update_payload, headers=headers)
        
        log_test(
            "Update User Profile",
            response.status_code == 200,
            f"Status: {response.status_code}",
            response.json() if response.status_code != 200 else None
        )
    except Exception as e:
        log_test("Update User Profile", False, str(e))

def test_user_wishlist(token: str, product_id: str):
    """Test wishlist operations"""
    log_section("❤️ WISHLIST TESTS")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Add to Wishlist
    try:
        response = requests.post(
            f"{BASE_URL}/wishlist",
            json={"product_id": product_id},
            headers=headers
        )
        log_test(
            "Add to Wishlist",
            response.status_code in [200, 201],
            f"Status: {response.status_code}",
            response.json() if response.status_code not in [200, 201] else None
        )
    except Exception as e:
        log_test("Add to Wishlist", False, str(e))
    
    # Get Wishlist
    try:
        response = requests.get(f"{BASE_URL}/wishlist", headers=headers)
        data = response.json() if response.ok else []
        
        log_test(
            "Get Wishlist",
            response.status_code == 200,
            f"Status: {response.status_code} | Items: {len(data)}",
            data if response.status_code != 200 else None
        )
    except Exception as e:
        log_test("Get Wishlist", False, str(e))
    
    # Check Product in Wishlist
    try:
        response = requests.get(f"{BASE_URL}/wishlist/check/{product_id}", headers=headers)
        
        log_test(
            "Check Product in Wishlist",
            response.status_code == 200,
            f"Status: {response.status_code}",
            response.json() if response.status_code != 200 else None
        )
    except Exception as e:
        log_test("Check Product in Wishlist", False, str(e))
    
    # Remove from Wishlist
    try:
        response = requests.delete(f"{BASE_URL}/wishlist/{product_id}", headers=headers)
        
        log_test(
            "Remove from Wishlist",
            response.status_code in [200, 204],
            f"Status: {response.status_code}"
        )
    except Exception as e:
        log_test("Remove from Wishlist", False, str(e))

def test_user_addresses(token: str):
    """Test address management"""
    log_section("📍 ADDRESS MANAGEMENT TESTS")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Add Address
    address_payload = {
        "name": "Home",
        "street": "123 Test Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "phone": "9876543210"
    }
    
    address_id = None
    
    try:
        response = requests.post(
            f"{BASE_URL}/user/addresses",
            json=address_payload,
            headers=headers
        )
        data = response.json() if response.ok else None
        address_id = data.get("id") if data else None
        
        log_test(
            "Add Address",
            response.status_code in [200, 201],
            f"Status: {response.status_code} | Address ID: {address_id}",
            data if response.status_code not in [200, 201] else None
        )
    except Exception as e:
        log_test("Add Address", False, str(e))
    
    # Get Addresses
    try:
        response = requests.get(f"{BASE_URL}/user/addresses", headers=headers)
        data = response.json() if response.ok else []
        
        log_test(
            "Get Addresses",
            response.status_code == 200,
            f"Status: {response.status_code} | Addresses: {len(data)}",
            data if response.status_code != 200 else None
        )
    except Exception as e:
        log_test("Get Addresses", False, str(e))
    
    # Update Address
    if address_id:
        try:
            update_payload = {"city": "Delhi"}
            response = requests.put(
                f"{BASE_URL}/user/addresses/{address_id}",
                json=update_payload,
                headers=headers
            )
            
            log_test(
                "Update Address",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
        except Exception as e:
            log_test("Update Address", False, str(e))
        
        # Delete Address
        try:
            response = requests.delete(
                f"{BASE_URL}/user/addresses/{address_id}",
                headers=headers
            )
            
            log_test(
                "Delete Address",
                response.status_code in [200, 204],
                f"Status: {response.status_code}"
            )
        except Exception as e:
            log_test("Delete Address", False, str(e))

def test_user_orders(token: str):
    """Test user orders"""
    log_section("📦 USER ORDERS TESTS")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/user/orders", headers=headers)
        data = response.json() if response.ok else []
        
        log_test(
            "Get User Orders",
            response.status_code == 200,
            f"Status: {response.status_code} | Orders: {len(data)}",
            data if response.status_code != 200 else None
        )
    except Exception as e:
        log_test("Get User Orders", False, str(e))

# =============================================================================
# ADMIN PROTECTED ENDPOINTS
# =============================================================================

def test_admin_dashboard(token: str):
    """Test admin dashboard"""
    log_section("📊 ADMIN DASHBOARD TESTS")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/admin/dashboard", headers=headers)
        data = response.json() if response.ok else None
        
        if response.status_code == 200 and data:
            log_test(
                "Admin Dashboard",
                True,
                f"Products: {data.get('total_products', 0)} | "
                f"Orders: {data.get('total_orders', 0)} | "
                f"Users: {data.get('total_users', 0)}"
            )
        else:
            log_test(
                "Admin Dashboard",
                False,
                f"Status: {response.status_code}",
                data
            )
    except Exception as e:
        log_test("Admin Dashboard", False, str(e))

def test_admin_analytics(token: str):
    """Test admin analytics"""
    log_section("📈 ADMIN ANALYTICS TESTS")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/admin/analytics/sales", headers=headers)
        data = response.json() if response.ok else None
        
        log_test(
            "Admin Sales Analytics",
            response.status_code == 200,
            f"Status: {response.status_code}",
            data if response.status_code != 200 else None
        )
    except Exception as e:
        log_test("Admin Sales Analytics", False, str(e))

def test_admin_products(token: str):
    """Test admin product management"""
    log_section("🎁 ADMIN PRODUCT MANAGEMENT TESTS")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get All Products (Admin)
    try:
        response = requests.get(f"{BASE_URL}/admin/products", headers=headers)
        data = response.json() if response.ok else []
        
        log_test(
            "Get All Products (Admin)",
            response.status_code == 200,
            f"Status: {response.status_code} | Products: {len(data)}",
            data if response.status_code != 200 else None
        )
    except Exception as e:
        log_test("Get All Products (Admin)", False, str(e))
    
    # Create Product
    product_payload = {
        "name": "Test Product",
        "description": "This is a test product",
        "price": 999,
        "category": "Gift Boxes",
        "stock": 50,
        "image_url": "https://images.unsplash.com/photo-1513885535751-8b9238bd345a"
    }
    
    product_id = None
    
    try:
        response = requests.post(
            f"{BASE_URL}/admin/products",
            json=product_payload,
            headers=headers
        )
        data = response.json() if response.ok else None
        product_id = data.get("id") if data else None
        
        log_test(
            "Create Product",
            response.status_code in [200, 201],
            f"Status: {response.status_code} | Product ID: {product_id}",
            data if response.status_code not in [200, 201] else None
        )
    except Exception as e:
        log_test("Create Product", False, str(e))
    
    # Update Product
    if product_id:
        try:
            update_payload = {"price": 1299}
            response = requests.put(
                f"{BASE_URL}/admin/products/{product_id}",
                json=update_payload,
                headers=headers
            )
            
            log_test(
                "Update Product",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
        except Exception as e:
            log_test("Update Product", False, str(e))
        
        # Update Stock
        try:
            stock_payload = {"stock": 100}
            response = requests.put(
                f"{BASE_URL}/admin/products/{product_id}/stock",
                json=stock_payload,
                headers=headers
            )
            
            log_test(
                "Update Product Stock",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
        except Exception as e:
            log_test("Update Product Stock", False, str(e))
        
        # Delete Product
        try:
            response = requests.delete(
                f"{BASE_URL}/admin/products/{product_id}",
                headers=headers
            )
            
            log_test(
                "Delete Product",
                response.status_code in [200, 204],
                f"Status: {response.status_code}"
            )
        except Exception as e:
            log_test("Delete Product", False, str(e))
    
    # Get Low Stock
    try:
        response = requests.get(f"{BASE_URL}/admin/inventory/low-stock", headers=headers)
        data = response.json() if response.ok else []
        
        log_test(
            "Get Low Stock Products",
            response.status_code == 200,
            f"Status: {response.status_code} | Low Stock Items: {len(data)}"
        )
    except Exception as e:
        log_test("Get Low Stock Products", False, str(e))

def test_admin_orders(token: str):
    """Test admin order management"""
    log_section("📦 ADMIN ORDER MANAGEMENT TESTS")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get All Orders
    try:
        response = requests.get(f"{BASE_URL}/admin/orders", headers=headers)
        data = response.json() if response.ok else []
        
        log_test(
            "Get All Orders (Admin)",
            response.status_code == 200,
            f"Status: {response.status_code} | Orders: {len(data)}",
            data if response.status_code != 200 else None
        )
    except Exception as e:
        log_test("Get All Orders (Admin)", False, str(e))

def test_admin_users(token: str):
    """Test admin user management"""
    log_section("👥 ADMIN USER MANAGEMENT TESTS")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/admin/users", headers=headers)
        data = response.json() if response.ok else []
        
        log_test(
            "Get All Users",
            response.status_code == 200,
            f"Status: {response.status_code} | Users: {len(data)}",
            data if response.status_code != 200 else None
        )
    except Exception as e:
        log_test("Get All Users", False, str(e))

def test_admin_contacts(token: str):
    """Test admin contact management"""
    log_section("📧 ADMIN CONTACT MANAGEMENT TESTS")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/admin/contacts", headers=headers)
        data = response.json() if response.ok else []
        
        log_test(
            "Get All Contacts",
            response.status_code == 200,
            f"Status: {response.status_code} | Contacts: {len(data)}",
            data if response.status_code != 200 else None
        )
    except Exception as e:
        log_test("Get All Contacts", False, str(e))

def test_admin_custom_gifts(token: str):
    """Test admin custom gift management"""
    log_section("🎁 ADMIN CUSTOM GIFTS MANAGEMENT TESTS")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/admin/custom-gifts", headers=headers)
        data = response.json() if response.ok else []
        
        log_test(
            "Get All Custom Gift Requests",
            response.status_code == 200,
            f"Status: {response.status_code} | Requests: {len(data)}",
            data if response.status_code != 200 else None
        )
    except Exception as e:
        log_test("Get All Custom Gift Requests", False, str(e))

def test_admin_reviews(token: str):
    """Test admin review management"""
    log_section("⭐ ADMIN REVIEW MANAGEMENT TESTS")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/admin/reviews", headers=headers)
        data = response.json() if response.ok else []
        
        log_test(
            "Get All Reviews",
            response.status_code == 200,
            f"Status: {response.status_code} | Reviews: {len(data)}",
            data if response.status_code != 200 else None
        )
    except Exception as e:
        log_test("Get All Reviews", False, str(e))

def test_admin_coupons(token: str):
    """Test admin coupon management"""
    log_section("🎟️ ADMIN COUPON MANAGEMENT TESTS")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get All Coupons
    try:
        response = requests.get(f"{BASE_URL}/admin/coupons", headers=headers)
        data = response.json() if response.ok else []
        
        log_test(
            "Get All Coupons",
            response.status_code == 200,
            f"Status: {response.status_code} | Coupons: {len(data)}"
        )
    except Exception as e:
        log_test("Get All Coupons", False, str(e))
    
    # Create Coupon
    coupon_payload = {
        "code": "TEST50",
        "discount_type": "percentage",
        "discount_value": 50,
        "min_order_value": 500,
        "max_uses": 100,
        "expires_at": "2025-12-31T23:59:59Z"
    }
    
    coupon_id = None
    
    try:
        response = requests.post(
            f"{BASE_URL}/admin/coupons",
            json=coupon_payload,
            headers=headers
        )
        data = response.json() if response.ok else None
        coupon_id = data.get("id") if data else None
        
        log_test(
            "Create Coupon",
            response.status_code in [200, 201],
            f"Status: {response.status_code} | Coupon ID: {coupon_id}",
            data if response.status_code not in [200, 201] else None
        )
    except Exception as e:
        log_test("Create Coupon", False, str(e))
    
    # Update Coupon
    if coupon_id:
        try:
            update_payload = {"discount_value": 60}
            response = requests.put(
                f"{BASE_URL}/admin/coupons/{coupon_id}",
                json=update_payload,
                headers=headers
            )
            
            log_test(
                "Update Coupon",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
        except Exception as e:
            log_test("Update Coupon", False, str(e))
        
        # Delete Coupon
        try:
            response = requests.delete(
                f"{BASE_URL}/admin/coupons/{coupon_id}",
                headers=headers
            )
            
            log_test(
                "Delete Coupon",
                response.status_code in [200, 204],
                f"Status: {response.status_code}"
            )
        except Exception as e:
            log_test("Delete Coupon", False, str(e))

# =============================================================================
# AUTHORIZATION TESTS
# =============================================================================

def test_unauthorized_access():
    """Test that protected endpoints reject unauthenticated requests"""
    log_section("🚫 AUTHORIZATION TESTS")
    
    protected_endpoints = [
        ("GET", "/user/profile"),
        ("GET", "/wishlist"),
        ("GET", "/user/orders"),
        ("GET", "/admin/dashboard"),
        ("GET", "/admin/products"),
    ]
    
    for method, endpoint in protected_endpoints:
        try:
            if method == "GET":
                response = requests.get(f"{BASE_URL}{endpoint}")
            else:
                response = requests.post(f"{BASE_URL}{endpoint}")
            
            # Should return 401 or 403
            log_test(
                f"Unauthorized Access - {method} {endpoint}",
                response.status_code in [401, 403],
                f"Status: {response.status_code} (Expected 401/403)"
            )
        except Exception as e:
            log_test(f"Unauthorized Access - {method} {endpoint}", False, str(e))

def test_user_cannot_access_admin(user_token: str):
    """Test that regular users cannot access admin endpoints"""
    log_section("🚫 USER AUTHORIZATION TESTS")
    
    headers = {"Authorization": f"Bearer {user_token}"}
    
    admin_endpoints = [
        ("GET", "/admin/dashboard"),
        ("GET", "/admin/products"),
        ("GET", "/admin/orders"),
        ("GET", "/admin/users"),
    ]
    
    for method, endpoint in admin_endpoints:
        try:
            if method == "GET":
                response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
            
            # Should return 403 Forbidden
            log_test(
                f"User Cannot Access Admin - {method} {endpoint}",
                response.status_code == 403,
                f"Status: {response.status_code} (Expected 403)"
            )
        except Exception as e:
            log_test(f"User Cannot Access Admin - {method} {endpoint}", False, str(e))

# =============================================================================
# MAIN TEST RUNNER
# =============================================================================

def main():
    """Run all authenticated tests"""
    print(f"\n{Colors.BLUE}{'='*70}")
    print("🧪 COMPREHENSIVE AUTHENTICATED TESTING SUITE")
    print("   The Lil Gift Corner - Login, Admin & Integration Tests")
    print(f"{'='*70}{Colors.RESET}\n")
    
    # Get a product ID for testing
    products = requests.get(f"{BASE_URL}/products").json()
    product_id = products[0]["id"] if products else None
    
    if not product_id:
        print(f"{Colors.RED}❌ No products found in database. Please seed products first.{Colors.RESET}")
        return
    
    # =========================================================================
    # USER FLOW TESTS
    # =========================================================================
    
    user_email, user_password = test_user_registration()
    
    if user_email and user_password:
        user_token = test_user_login(user_email, user_password)
        
        if user_token:
            test_user_profile(user_token)
            test_user_wishlist(user_token, product_id)
            test_user_addresses(user_token)
            test_user_orders(user_token)
            test_user_cannot_access_admin(user_token)
    
    # =========================================================================
    # ADMIN FLOW TESTS
    # =========================================================================
    
    admin_token = test_admin_login()
    
    if admin_token:
        test_admin_dashboard(admin_token)
        test_admin_analytics(admin_token)
        test_admin_products(admin_token)
        test_admin_orders(admin_token)
        test_admin_users(admin_token)
        test_admin_contacts(admin_token)
        test_admin_custom_gifts(admin_token)
        test_admin_reviews(admin_token)
        test_admin_coupons(admin_token)
    
    # =========================================================================
    # AUTHORIZATION TESTS
    # =========================================================================
    
    test_unauthorized_access()
    
    # =========================================================================
    # SUMMARY
    # =========================================================================
    
    log_section("📊 TEST SUMMARY")
    
    passed = sum(1 for r in test_results if r["passed"])
    total = len(test_results)
    percentage = (passed / total * 100) if total > 0 else 0
    
    print(f"\n{Colors.BLUE}Total Tests:{Colors.RESET} {total}")
    print(f"{Colors.GREEN}Passed:{Colors.RESET} {passed} ✅")
    print(f"{Colors.RED}Failed:{Colors.RESET} {total - passed} ❌")
    print(f"{Colors.YELLOW}Success Rate:{Colors.RESET} {percentage:.1f}%\n")
    
    # Category breakdown
    categories = {
        "User Authentication": 0,
        "User Features": 0,
        "Admin Authentication": 0,
        "Admin Features": 0,
        "Authorization": 0
    }
    
    category_passed = {k: 0 for k in categories.keys()}
    
    for result in test_results:
        name = result["name"]
        if "User Registration" in name or "User Login" in name:
            categories["User Authentication"] += 1
            if result["passed"]:
                category_passed["User Authentication"] += 1
        elif "Admin Login" in name or "Admin Role" in name:
            categories["Admin Authentication"] += 1
            if result["passed"]:
                category_passed["Admin Authentication"] += 1
        elif "Admin" in name:
            categories["Admin Features"] += 1
            if result["passed"]:
                category_passed["Admin Features"] += 1
        elif "Unauthorized" in name or "Cannot Access" in name:
            categories["Authorization"] += 1
            if result["passed"]:
                category_passed["Authorization"] += 1
        else:
            categories["User Features"] += 1
            if result["passed"]:
                category_passed["User Features"] += 1
    
    print(f"{Colors.BLUE}Category Breakdown:{Colors.RESET}")
    for category, total_tests in categories.items():
        if total_tests > 0:
            cat_passed = category_passed[category]
            cat_percentage = (cat_passed / total_tests * 100)
            status = "✅" if cat_percentage == 100 else "⚠️" if cat_percentage >= 75 else "❌"
            print(f"  {status} {category}: {cat_passed}/{total_tests} ({cat_percentage:.0f}%)")
    
    print()
    
    if percentage < 100:
        print(f"{Colors.RED}❌ Some tests failed. Review the output above.{Colors.RESET}")
        sys.exit(1)
    else:
        print(f"{Colors.GREEN}✅ All tests passed successfully!{Colors.RESET}")
        sys.exit(0)

if __name__ == "__main__":
    main()
