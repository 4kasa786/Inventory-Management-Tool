import requests
import time  # Added to generate unique SKU

BASE_URL = "http://localhost:3000"  # Change to your running server port if needed


def print_result(test_name, passed, expected=None, got=None, request_data=None, response_body=None):
    if passed:
        print(f"{test_name}: PASSED")
    else:
        print(f"{test_name}: FAILED")
        if request_data:
            print(f" Request: {request_data}")
        if expected is not None and got is not None:
            print(f" Expected: {expected}, Got: {got}")
        if response_body:
            print(f" Response Body: {response_body}")


def test_register_user():
    payload = {"username": "puja", "email": "puja@example.com", "password": "mypassword"}
    res = requests.post(f"{BASE_URL}/register", json=payload)
    passed = res.status_code in [201, 409]
    print_result("User Registration", passed, "201 or 409", res.status_code, payload, res.text)


def test_login():
    payload = {"username": "puja", "password": "mypassword"}
    res = requests.post(f"{BASE_URL}/login", json=payload)
    token = None
    passed = False
    if res.status_code == 200:
        try:
            token = res.json().get("access_token")
            passed = token is not None
        except Exception:
            passed = False
    print_result("Login Test", passed, {"username": payload["username"], "password": payload["password"]}, res.text, payload, res.text)
    return token


def test_add_product(token):
    unique_sku = f"PHN-{int(time.time())}"  # ✅ Generate a unique SKU
    payload = {
        "name": "Phone",
        "type": "electronics",
        "sku": unique_sku,
        "image_url": "https://example.com/phone.jpg",
        "description": "Latest Phone",
        "quantity": 5,
        "price": 999.99
    }
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.post(f"{BASE_URL}/products", json=payload, headers=headers)
    passed = res.status_code == 201
    product_id = None
    if passed:
        try:
            product_id = res.json().get("product_id")
        except Exception:
            pass
    print_result("Add Product", passed, 201, res.status_code, payload, res.text)
    return product_id


def test_update_quantity(token, product_id, new_quantity):
    payload = {"quantity": new_quantity}
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.put(f"{BASE_URL}/products/{product_id}/quantity", json=payload, headers=headers)
    passed = res.status_code == 200
    print_result("Update Quantity", passed, 200, res.status_code, payload, res.text)


def test_get_products(token, expected_quantity):
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(f"{BASE_URL}/products", headers=headers)
    if res.status_code != 200:
        print_result("Get Products", False, 200, res.status_code, None, res.text)
        return

    try:
        products = res.json()
    except Exception:
        print_result("Get Products", False, "valid JSON list", "Invalid JSON", None, res.text)
        return

    phone_products = [p for p in products if p.get("name") == "Phone"]
    if not phone_products:
        print("Get Products: FAILED - Could not find product named 'Phone'")
        return

    phone_quantity = phone_products[0].get("quantity")
    if phone_quantity == expected_quantity:
        print(f"Get Products: PASSED (Quantity = {phone_quantity})")
    else:
        print("Get Products: FAILED")
        print(f" Expected Quantity: {expected_quantity}, Got: {phone_quantity}")
        print(f" Response Body: {products}")


def run_all_tests():
    test_register_user()
    token = test_login()
    if not token:
        print("Login failed. Skipping further tests.")
        return
    product_id = test_add_product(token)
    if not product_id:
        print("Product creation failed. Skipping further tests.")
        return
    test_update_quantity(token, product_id, new_quantity=15)
    test_get_products(token, expected_quantity=15)


if __name__ == "__main__":
    run_all_tests()
