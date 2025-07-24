import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    type: {
        type: String,
        required: [true, 'Product type is required'],
        enum: ['electronics', 'apparel', 'grocery', 'beauty', 'books', 'other'],
        lowercase: true,
        trim: true,
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    image_url: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg|gif)$/i.test(v);
            },
            message: 'Please enter a valid image URL',
        },
    },
    description: {
        type: String,
        trim: true,
        maxLength: 500,
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Product must be associated with a user'],
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
