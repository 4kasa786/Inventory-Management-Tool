import { ZodError } from 'zod';

const errorMiddleware = (err, req, res, next) => {
    try {
        console.error('Error caught by middleware:', err);

        let statusCode = err.statusCode || 500;
        let message = err.message || 'Internal Server Error';

        // Mongoose CastError (invalid ObjectId)
        if (err.name === 'CastError') {
            statusCode = 404;
            message = 'Resource not found';
        }
        // Mongoose duplicate key error
        else if (err.code === 11000) {
            statusCode = 409;
            const field = Object.keys(err.keyPattern)[0];
            message = `${field} already exists`;
        }
        // Mongoose validation error
        else if (err.name === 'ValidationError') {
            statusCode = 400;
            const errors = Object.values(err.errors).map(val => val.message);
            message = errors.join(', ');
        }
        // JWT errors
        else if (err.name === 'JsonWebTokenError') {
            statusCode = 401;
            message = 'Invalid token';
        }
        else if (err.name === 'TokenExpiredError') {
            statusCode = 401;
            message = 'Token expired';
        }
        // Zod errors (fallback - shouldn't reach here if validation middleware works)
        else if (err instanceof ZodError) {
            statusCode = 400;
            const errors = (err.errors || err.issues || []).map(error => {
                const path = error.path && error.path.length > 0 ? error.path.join('.') : 'field';
                return `${path}: ${error.message}`;
            });
            message = errors.length > 0 ? errors.join(', ') : 'Validation error';
        }

        // Send response in format compatible with test script
        res.status(statusCode).json({
            error: message
        });

    } catch (catchError) {
        console.error('Error in error middleware:', catchError);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

export default errorMiddleware;