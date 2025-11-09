#!/usr/bin/env python3
"""
Comprehensive API Testing Script for The Lil Gift Corner
Tests all major endpoints and functionality
"""
import requests
import json
import sys
from typing import Dict, Any

BASE_URL = "http://localhost:8001/api"
session = requests.Session()
test_results = []

def log_test(name: str, passed: bool, message: str = ""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    test_results.append({"name": name, "passed": passed, "message": message})
    print(f"{status} - {name}")
    if message:
        print(f"    {message}")

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        log_test("Health Check", response.status_code == 200, f"Status: {response.json()}")
    except Exception as e:
        log_test("Health Check", False, str(e))

def test_auth_register():
    """Test user registration"""
    try:
        payload = {
            "name": "Test User",
            "email": f"testuser{requests.get(f'{BASE_URL}/health').elapsed.microseconds}@test.com",
            "password": "Test@123",
            "phone": "1234567890"
        }
        response = requests.post(f"{BASE_URL}/auth/register", json=payload)
        success = response.status_code in [200, 201]
        log_test("User Registration", success, f"Status: {response.status_code}")
        return payload["email"], payload["password"] if success else (None, None)
    except Exception as e:
        log_test("User Registration", False, str(e))
        return None, None

def test_auth_login(email: str, password: str):
    """Test user login"""
    try:
        payload = {"email": email, "password": password}
        response = requests.post(f"{BASE_URL}/auth/login", json=payload)
        success = response.status_code == 200
        token = response.json().get("access_token") if success else None
        log_test("User Login", success, f"Token received: {bool(token)}")
        return token
    except Exception as e:
        log_test("User Login", False, str(e))
        return None

def test_admin_login():
    """Test admin login"""
    try:
        payload = {"email": "admin@thelilgiftcorner.com", "password": "Admin@123"}
        response = requests.post(f"{BASE_URL}/auth/login", json=payload)
        success = response.status_code == 200
        token = response.json().get("access_token") if success else None
        log_test("Admin Login", success, f"Token received: {bool(token)}")
        return token
    except Exception as e:
        log_test("Admin Login", False, str(e))
        return None

def test_products_list():
    """Test product listing"""
    try:
        response = requests.get(f"{BASE_URL}/products")
        success = response.status_code == 200
        products = response.json() if success else []
        log_test("Product List", success, f"Products found: {len(products)}")
        return products
    except Exception as e:
        log_test("Product List", False, str(e))
        return []

def test_products_search():
    """Test product search"""
    try:
        response = requests.get(f"{BASE_URL}/products/search?query=gift")
        success = response.status_code == 200
        log_test("Product Search", success, f"Search results: {len(response.json()) if success else 0}")
    except Exception as e:
        log_test("Product Search", False, str(e))

def test_products_filter():
    """Test product filtering"""
    try:
        response = requests.get(f"{BASE_URL}/products?category=Gift%20Boxes")
        success = response.status_code == 200
        log_test("Product Filter", success)
    except Exception as e:
        log_test("Product Filter", False, str(e))

def test_product_details(product_id: str):
    """Test product details"""
    try:
        response = requests.get(f"{BASE_URL}/products/{product_id}")
        success = response.status_code == 200
        log_test("Product Details", success)
        return response.json() if success else None
    except Exception as e:
        log_test("Product Details", False, str(e))
        return None

def test_cart_operations(product_id: str):
    """Test cart operations"""
    session_id = "test-session-123"
    
    # Add to cart
    try:
        payload = {
            "product_id": product_id,
            "quantity": 2,
            "session_id": session_id
        }
        response = requests.post(f"{BASE_URL}/cart", json=payload)
        success = response.status_code in [200, 201]
        log_test("Add to Cart", success)
    except Exception as e:
        log_test("Add to Cart", False, str(e))
    
    # Get cart
    try:
        response = requests.get(f"{BASE_URL}/cart/{session_id}")
        success = response.status_code == 200
        log_test("Get Cart", success, f"Items: {len(response.json()) if success else 0}")
    except Exception as e:
        log_test("Get Cart", False, str(e))
    
    # Clear cart
    try:
        response = requests.delete(f"{BASE_URL}/cart/session/{session_id}")
        success = response.status_code in [200, 204]
        log_test("Clear Cart", success)
    except Exception as e:
        log_test("Clear Cart", False, str(e))

def test_wishlist_operations(product_id: str, token: str):
    """Test wishlist operations"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # Add to wishlist
    try:
        response = requests.post(f"{BASE_URL}/wishlist", 
                                json={"product_id": product_id}, 
                                headers=headers)
        success = response.status_code in [200, 201]
        log_test("Add to Wishlist", success)
    except Exception as e:
        log_test("Add to Wishlist", False, str(e))
    
    # Get wishlist
    try:
        response = requests.get(f"{BASE_URL}/wishlist", headers=headers)
        success = response.status_code == 200
        log_test("Get Wishlist", success)
    except Exception as e:
        log_test("Get Wishlist", False, str(e))
    
    # Remove from wishlist
    try:
        response = requests.delete(f"{BASE_URL}/wishlist/{product_id}", headers=headers)
        success = response.status_code in [200, 204]
        log_test("Remove from Wishlist", success)
    except Exception as e:
        log_test("Remove from Wishlist", False, str(e))

def test_contact_form():
    """Test contact form"""
    try:
        payload = {
            "name": "Test Contact",
            "email": "contact@test.com",
            "subject": "Test Subject",
            "message": "This is a test message"
        }
        response = requests.post(f"{BASE_URL}/contact", json=payload)
        success = response.status_code in [200, 201]
        log_test("Contact Form", success)
    except Exception as e:
        log_test("Contact Form", False, str(e))

def test_custom_gift_request():
    """Test custom gift request"""
    try:
        payload = {
            "name": "Test Customer",
            "email": "custom@test.com",
            "phone": "1234567890",
            "gift_type": "Wedding",
            "budget": 5000,
            "description": "Custom wedding gift box"
        }
        response = requests.post(f"{BASE_URL}/custom-gifts", json=payload)
        success = response.status_code in [200, 201]
        log_test("Custom Gift Request", success)
    except Exception as e:
        log_test("Custom Gift Request", False, str(e))

def test_admin_endpoints(token: str):
    """Test admin endpoints"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # Dashboard
    try:
        response = requests.get(f"{BASE_URL}/admin/dashboard", headers=headers)
        success = response.status_code == 200
        log_test("Admin Dashboard", success)
    except Exception as e:
        log_test("Admin Dashboard", False, str(e))
    
    # Analytics
    try:
        response = requests.get(f"{BASE_URL}/admin/analytics/sales", headers=headers)
        success = response.status_code == 200
        log_test("Admin Analytics", success)
    except Exception as e:
        log_test("Admin Analytics", False, str(e))
    
    # Products
    try:
        response = requests.get(f"{BASE_URL}/admin/products", headers=headers)
        success = response.status_code == 200
        log_test("Admin Products List", success)
    except Exception as e:
        log_test("Admin Products List", False, str(e))
    
    # Orders
    try:
        response = requests.get(f"{BASE_URL}/admin/orders", headers=headers)
        success = response.status_code == 200
        log_test("Admin Orders List", success)
    except Exception as e:
        log_test("Admin Orders List", False, str(e))
    
    # Custom Gifts
    try:
        response = requests.get(f"{BASE_URL}/admin/custom-gifts", headers=headers)
        success = response.status_code == 200
        log_test("Admin Custom Gifts List", success)
    except Exception as e:
        log_test("Admin Custom Gifts List", False, str(e))
    
    # Contacts
    try:
        response = requests.get(f"{BASE_URL}/admin/contacts", headers=headers)
        success = response.status_code == 200
        log_test("Admin Contacts List", success)
    except Exception as e:
        log_test("Admin Contacts List", False, str(e))

def test_coupons():
    """Test coupon endpoints"""
    try:
        response = requests.get(f"{BASE_URL}/coupons/active")
        success = response.status_code == 200
        log_test("Active Coupons", success)
    except Exception as e:
        log_test("Active Coupons", False, str(e))

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("🧪 The Lil Gift Corner - Comprehensive API Test Suite")
    print("="*60 + "\n")
    
    # Phase 1: Health & Products
    print("\n📍 Phase 1: Health & Products")
    print("-" * 40)
    test_health()
    products = test_products_list()
    test_products_search()
    test_products_filter()
    
    if products:
        product_id = products[0].get("id")
        test_product_details(product_id)
        test_cart_operations(product_id)
    
    # Phase 2: Authentication
    print("\n📍 Phase 2: Authentication")
    print("-" * 40)
    email, password = test_auth_register()
    
    user_token = None
    if email and password:
        user_token = test_auth_login(email, password)
    
    admin_token = test_admin_login()
    
    # Phase 3: User Features
    if user_token and products:
        print("\n📍 Phase 3: User Features")
        print("-" * 40)
        product_id = products[0].get("id")
        test_wishlist_operations(product_id, user_token)
    
    # Phase 4: Forms
    print("\n📍 Phase 4: Forms & Requests")
    print("-" * 40)
    test_contact_form()
    test_custom_gift_request()
    test_coupons()
    
    # Phase 5: Admin Features
    if admin_token:
        print("\n📍 Phase 5: Admin Features")
        print("-" * 40)
        test_admin_endpoints(admin_token)
    
    # Summary
    print("\n" + "="*60)
    print("📊 Test Summary")
    print("="*60)
    passed = sum(1 for r in test_results if r["passed"])
    total = len(test_results)
    percentage = (passed / total * 100) if total > 0 else 0
    
    print(f"\nTotal Tests: {total}")
    print(f"Passed: {passed} ✅")
    print(f"Failed: {total - passed} ❌")
    print(f"Success Rate: {percentage:.1f}%\n")
    
    if percentage < 100:
        print("❌ Some tests failed. Review the output above.")
        sys.exit(1)
    else:
        print("✅ All tests passed successfully!")
        sys.exit(0)

if __name__ == "__main__":
    main()
