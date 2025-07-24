import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 6,
        select: false
    },


}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;