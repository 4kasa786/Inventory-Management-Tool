# 💾 Inventory Management Tool

A backend API for managing inventory data with user authentication, product management (CRUD), and optional analytics.

---

## 🚀 Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Zod (for request validation)
* Docker (for containerization)

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
Inventory-Management-Tool-main/
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
├── .env
├── .gitignore
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
└── app.js
```

---

## 🐳 Docker Support

### 📦 Dockerfile

Defines the Docker image for your Node.js app:

```Dockerfile
FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### 📦 docker-compose.yml

Defines a multi-container app (App + MongoDB):

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    env_file:
      - .env
    depends_on:
      - mongo
    restart: always

  mongo:
    image: mongo
    container_name: inventory-mongo
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db
    restart: always

volumes:
  mongo_data:
```

### 📁 .dockerignore

Prevents unnecessary files from being added to the Docker image:

```
node_modules
npm-debug.log
.env
.git
```

---

## 🥪 Environment Configuration

Edit the `.env` file with your configuration:

```env
PORT=3000
DB_URI=mongodb://mongo:27017/inventorydb
JWT_SECRET="The God and the Parents and the Teachers and Everyone should always be Respected"
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

> 💡 Note: You shouldn't commit `.env` to GitHub.

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

### 🔸 Login

* **POST** `/login`
* **Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

### 🔸 Logout

* **POST** `/logout`

---

## 📦 Product Endpoints (Protected)

> Requires Bearer Token in `Authorization` header:
>
> `Authorization: Bearer <your-token>`

### 🔹 Add Product

* **POST** `/products`

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

### 🔹 Update Quantity

* **PUT** `/products/:productId/quantity`

```json
{
  "quantity": integer
}
```

### 🔹 Get All Products

* **GET** `/products`

### 🔹 Get with Pagination & Filter

* **GET** `/products?type=electronics&page=1&sortBy=price`

---

## 🤪 API Testing (Postman)

Import `postman/postman_collection.json` and test:

* `/register`
* `/login`
* `/products` (POST)
* `/products/:id/quantity`
* `/products?type=...`

---

## 🛠️ Running the App

### Option 1: Local (Without Docker)

```bash
npm install
cp .env.example .env
npm start
```

### Option 2: Dockerized

```bash
docker-compose up --build
```

---

## 🔖 Schema Highlights

* Unique SKU
* Non-negative quantity/price
* User-product linkage
* Regex URL validation
* Zod-based schema validation

---

## 📩 Contact

For queries or contributions, feel free to open an issue or contact the maintainer.

---

🛠️ Built with love by **Sarvesh Kishor Bhoyar**
