import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiError } from './utils/ApiError.js';
import { ApiResponse } from './utils/ApiResponse.js';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}));

app.use(express.json({
    limit: "50mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));

app.use(express.static("public"));

app.use(cookieParser());


// import routes
import userRouter from './routes/user.routes.js';
import productRouter from './routes/product.routes.js';
import reviewRouter from './routes/review.routes.js';
import couponRouter from './routes/coupon.routes.js';

// declare routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/coupons", couponRouter);


// Middleware to handle errors & responses
app.use((err, req, res, next) => {
    let response;
    if (err instanceof ApiError) {
        response = ApiResponse.error(err.message, err.statusCode, err.errors);
    } 
    else {
        response = ApiResponse.error("Internal Server Error", 500, {errorMessage: err.message});
    }
    res.status(response.statusCode).json(response.format());
});

export { app };