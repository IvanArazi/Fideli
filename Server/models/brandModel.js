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
    addresses: {
        type: [{ type: String, trim: true }],
        validate: {
            validator: function (v) {
                if (v == null) return true; // permitir nulo en documentos antiguos
                return Array.isArray(v) && v.filter(s => typeof s === 'string' && s.trim().length > 0).length > 0;
            },
            message: 'Debe ingresar al menos una dirección'
        }
    },
    // Campo legacy para compatibilidad de lectura de documentos antiguos
    address: { type: String, trim: true },
    locations: [{
        formattedAddress: { type: String, trim: true, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        provider: { type: String, trim: true, default: 'geoapify' },
        placeId: { type: String, trim: true },
        verifiedAt: { type: Date, default: Date.now }
    }],
    manager: {
        type: String,
        required: [true, "El nombre del encargado es obligatorio"],
        trim: true,
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
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
     profileImage: {
        type: String,
        default: "",
        trim: true,
    },
});

const Brand = mongoose.model('brand', mySchema );

export default Brand;
