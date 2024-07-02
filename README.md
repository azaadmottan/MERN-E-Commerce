## Installation

### Prerequisites
- Node.js
- npm (Node Package Manager)
- MongoDB

### Backend
1. Clone the repository:
    ```bash
    git clone https://github.com/azaadmottan/MERN-E-Commerce.git
    cd mern-ecommerce/backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and add your environment variables:
    ```env
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    STRIPE_SECRET_KEY=your_stripe_secret_key
    ```

4. Start the server:
    ```bash
    npm start
    ```

### Frontend
1. Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and add your environment variables:
    ```env
    REACT_APP_API_URL=http://localhost:3000
    REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
    ```

4. Start the development server:
    ```bash
    npm start
    ```

## Usage
1. Register as a new user or login with an existing account.
2. Browse products and add them to your cart.
3. Proceed to checkout and complete the payment process.
4. Admin users can access the admin dashboard to manage products, categories, and orders.

## API Endpoints (Example)
### User
- `POST /api/users/login` - Login a user
- `POST /api/users/register` - Register a new user
- `GET /api/users/profile` - Get user profile

### Product
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product by ID
- `POST /api/products` - Create a new product (Admin only)
- `PUT /api/products/:id` - Update a product (Admin only)
- `DELETE /api/products/:id` - Delete a product (Admin only)

### Order
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/myorders` - Get logged-in user's orders

## Future Improvements
- Add product reviews and ratings
- Implement real-time notifications for order status updates
- Enhance the admin dashboard with more analytics
- Add user profile editing features

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License
This project is licensed under the MIT License.