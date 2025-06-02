import mongoose from "mongoose";

const Schema = mongoose.Schema;
const mySchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "El apellido es obligatorio"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: true,
        trim: true,
        match: [/.+@.+\..+/, "Por favor ingrese un email válido"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
        trim: true
    },
    uniqueNumber: {
        type: Number,
        required: [true, "El número único es obligatorio"],
        unique: true
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

const User = mongoose.model('user', mySchema );

export default User;