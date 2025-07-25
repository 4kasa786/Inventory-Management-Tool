# 💾 Inventory Management Tool

A backend API for managing inventory data with user authentication, product management (CRUD), and optional analytics.

## 🚀 Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Zod (for request validation)

---

## 🧩 Features

### ✅ Authentication

* Register new users
* Login with JWT
* Logout

### 📦 Product Management

* Add a new product
* Update product quantity
* Get all products (basic and paginated/filtered)

---

## 📁 Folder Structure

```
inventory-management-api/
├── config/
│   ├── database.js
│   └── env.js
├── controllers/
│   ├── auth.controller.js
│   └── product.controller.js
├── database/
│   └── mongodb.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validate.js
├── models/
│   ├── user.model.js
│   └── product.model.js
├── routes/
│   ├── auth.routes.js
│   └── product.routes.js
├── validators/
│   ├── auth.validation.js
│   └── product.validation.js
├── postman/
│   └── postman_collection.json
├── .env.example
├── test_api.py
├── .env
├── .gitignore
├── package.json
├── README.md
└── app.js

```

---

## 🔐 Authentication Endpoints

### 🔸 Register

* **POST** `/register`
* **Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

* **Response:** Confirmation of user creation

### 🔸 Login

* **POST** `/login`
* **Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

* **Response:** JWT token

### 🔸 Logout

* **POST** `/logout`
* **Response:** Logout confirmation

---

## 📦 Product Endpoints (Protected)

🔐 **Requires Bearer Token** in `Authorization` header:

```
Authorization: Bearer <your-token>
```

### 🔹 Add Product

* **POST** `/products`
* **Body:**

```json
{
  "name": "string",
  "type": "string",
  "sku": "string",
  "image_url": "string",
  "description": "string",
  "quantity": integer,
  "price": number
}
```

* **Response:** Product ID and confirmation

### 🔹 Update Product Quantity

* **PUT** `/products/:productId/quantity`
* **Body:**

```json
{
  "quantity": integer
}
```

* **Response:** Updated product details

### 🔹 Get All Products

* **GET** `/products`
* **Response:**

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "_id": "64c8...",
      "name": "Product A",
      "type": "electronics",
      "sku": "SKU-001",
      "quantity": 20,
      "price": 99.99
    },
    {
      "_id": "64c8...",
      "name": "Product B",
      "type": "grocery",
      "sku": "SKU-002",
      "quantity": 40,
      "price": 9.99
    }
  ]
}
```

### 🔹 Get Products with Pagination & Filter

* **GET** `/products?type=electronics&page=1&sortBy=price`
* **Response:**

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": {
    "products": [
      {
        "_id": "64c8...",
        "name": "Product A",
        "type": "electronics",
        "price": 99.99
      }
    ],
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalCount": 50
  }
}
```

---

## 🥪 Environment Configuration

Edit the `.env` file with your configuration:

```env
PORT=
DB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
NODE_ENV=development
```

---

## 🪪 API Testing with Postman

Import the following collection into Postman:
📁 [`postman/postman_collection.json`](./postman/postman_collection.json)

You can test:

* ✅ `/register`
* ✅ `/login`
* ✅ `/products` (Add product)
* ✅ `/products/:productId/quantity`
* ✅ `/products`
* ✅ `/products?type=...&page=...`

Make sure to include the Bearer token (from login) in all protected requests.

---

## 🏁 Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create `.env` file based on `.env.example`
4. Run MongoDB and start the server:

```bash
npm start
```

---

## 📩 Contact

For queries or contributions, feel free to open an issue or contact the maintainer.

---

## 🔖 Schema Features

* Validation Rules
* Data Normalization
* URL Validation (Regex)
* User-Product Relationship
* Unique SKU & Non-negative values

---

🛠️ Built with love by Sarvesh Kishor Bhoyar
