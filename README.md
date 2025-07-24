🏭 Inventory Management System API

📌Assignment Submission
A comprehensive inventory management system built with Node.js, Express, and MongoDB featuring JWT authentication, product management, and automated testing.

🌐 GitHub Repository
[https://github.com/4kasa786/Inventory-Management-Tool](https://github.com/4kasa786/Inventory-Management-Tool)

🛠️ Technology Stack

| Component         | Technology             |
| ----------------- | ---------------------- |
| Backend Framework | Express.js             |
| Database          | MongoDB (Atlas/Local)  |
| ODM               | Mongoose               |
| Authentication    | JWT (JSON Web Tokens)  |
| Validation        | Zod + Mongoose         |
| Testing           | Python requests        |
| API Docs          | OpenAPI 3.0 + Markdown |

🚀 Setup Instructions

### Prerequisites

* Node.js 18.x or higher
* MongoDB 6.0+ (Local installation or MongoDB Atlas)
* Python 3.8+ (for running test script)
* Git

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/4kasa786/Inventory-Management-Tool.git
cd inventory-management-api

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
```

### Environment Configuration

Edit the `.env` file with your configuration:

```
PORT=
DB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
NODE_ENV=development
```

### 4. Initialize the database

The database will be initialized automatically when the server starts.

### Start the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will start on [http://localhost:3000](http://localhost:3000)

📚 API Documentation

### 🔐 Authentication Endpoints

#### Register User

**Endpoint:** `POST /register`

```json
{
  "username": "testuser",
  "password": "securePassword123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user_id": "64a7b8c9d1e2f3a4b5c6d7e8"
  }
}
```

#### Login User

**Endpoint:** `POST /login`

```json
{
  "username": "testuser",
  "password": "securePassword123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64a7b8c9d1e2f3a4b5c6d7e8",
      "username": "testuser"
    }
  }
}
```

### 📦 Product Management Endpoints

#### Add New Product

**Endpoint:** `POST /products`

* **Authentication:** Required

```json
{
  "name": "Wireless Gaming Mouse",
  "type": "electronics",
  "sku": "WGM-2024-001",
  "quantity": 50,
  "price": 79.99,
  "description": "High-precision wireless gaming mouse with RGB lighting",
  "image_url": "https://example.com/images/gaming-mouse.jpg"
}
```

#### Update Product Quantity

**Endpoint:** `PUT /products/:id/quantity`

* **Authentication:** Required

```json
{
  "quantity": 25
}
```

#### Get All Products

**Endpoint:** `GET /products`

* **Authentication:** Required

#### Get Product by ID *(Optional)*

**Endpoint:** `GET /products/:productId`

* **Authentication:** Required

📋 OpenAPI Specification

* **File:** `docs/openapi.yaml`
* **Interactive Docs:** Accessible at `/api-docs` when server is running

🗃️ Database Schema

### User Collection

```js
{
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minLength: 3,
    maxLength: 30
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  timestamps: true
}
```

### Product Collection

```js
{
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minLength: 2,
    maxLength: 100
  },
  type: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['electronics', 'apparel', 'grocery', 'beauty', 'books', 'other'],
    lowercase: true,
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  image_url: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg|gif)$/i.test(v);
      },
      message: 'Please enter a valid image URL'
    }
  },
  description: {
    type: String,
    trim: true,
    maxLength: 500
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Product must be associated with a user']
  },
  timestamps: true
}
```

### Schema Features

* Validation Rules
* Data Normalization
* URL Validation (Regex)
* User-Product Relationship
* Unique SKU & Non-negative values

📥 Database Initialization Script

```bash
npm run init-db
```

This will:

* Create collections
* Apply schema validation rules
* Set up indexes
* Create default admin user (if configured)

🧪 Testing

```bash
python3 test_api.py
```

**Expected Output:**
✔ User Registration
✔ User Login
✔ Add Product
✔ Update Product Quantity
✔ Get All Products
✔ Get Product by ID
✔ Authentication Required

📫 Manual Testing
Use Postman or CURL. Postman collection is available at `docs/postman_collection.json`

📂 Project Structure

```
inventory-management-api/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── product.controller.js
│   ├── database/
│   │   └── mongodb.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.js
│   ├── models/
│   │   ├── user.model.js
│   │   └── product.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── product.routes.js
│   ├── validators/
│   │   ├── auth.validation.js
│   │   └── product.validation.js
│   └── app.js
├── test_api.py
├── .env
├── .gitignore
├── package.json
└── README.md
```

🔧 Available Scripts

```bash
# Development
npm run dev

# Testing
npm test
python3 test_api.py
```

✅ Assignment Requirements Checklist

### Core Functionality ✔️

* ✅ Express.js REST API
* ✅ MongoDB with validation
* ✅ JWT Auth
* ✅ Product CRUD
* ✅ Error Handling
* ✅ Request Validation

### Documentation ✔️

* ✅ GitHub Repo
* ✅ Setup Instructions
* ✅ API Docs (Markdown + Swagger)
* ✅ Database Schema

### Testing & Quality ✔️

* ✅ DB Init Script
* ✅ Python Test Suite
* ✅ Clean Codebase
* ✅ .env Support

### Bonus Features ✨

* ✅ Advanced Validation
* ✅ User-Product Links
* ✅ Swagger Spec
* ✅ Full README

🔒 Security Features

* JWT Auth + Cookies
* bcrypt Password Hashing
* Input Sanitization
* Hidden Errors
* CORS Config
* Optional Rate Limiting

🤝 Contributing

1. Fork the repo
2. `git checkout -b feature/my-feature`
3. `git commit -m 'Add feature'`
4. `git push origin feature/my-feature`
5. Open PR

📝 License: MIT

👨‍💻 Assignment Information

* Developed by: **Sarvesh Kishor Bhoyar**
* Submission Date: **24th July 2025**
* Assignment: **Inventory Management System API**

🎯 Quick Start Commands

```bash
git clone https://github.com/4kasa786/Inventory-Management-Tool.git
cd inventory-management-api
npm install
# Make a .env file and configure variables
npm run dev
python3 test_api.py
```
    