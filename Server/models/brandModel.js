import mongoose from "mongoose";

const Schema = mongoose.Schema;
const mySchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre del comercio es obligatorio"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "El email del comercio es obligatorio"],
        unique: true,
        trim: true,
        match: [/.+@.+\..+/, "Por favor ingrese un email válido"],
    },
    password: {
        type: String,
        required: [true, "La contraseña del comercio es obligatoria"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
        trim: true,
    },
    phone: {
        type: Number,
        required: [true, "El teléfono del comercio es obligatorio"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "La descripción del comercio es obligatoria"],
        trim: true,
    },
    address: {
        type: String,
        required: [true, "La dirección del comercio es obligatoria"],
        trim: true,
    },
    manager: {
        type: String,
        required: [true, "El nombre del encargado es obligatorio"],
        trim: true,
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true,
    }],
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    role: {
        type: String,
        default: "brand",
    },
});

const Brand = mongoose.model('brand', mySchema );

export default Brand;