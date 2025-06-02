// Importar el modelo
import Brand from '../models/brandModel.js';
import bcrypt from 'bcrypt';
import jsonwebtoken from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
const secret_key = process.env.SECRET_KEY;
const salt = 10;

const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.send(brands);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
};

const getBrandsByCategoryId = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const brands = await Brand.find({category: categoryId});
        if (brands.length === 0) {
            return res.status(404).json({msg: "No hay comercios para esta categoria"});
        }
        res.send(brands);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
};

const getBrandsPending = async (req, res) => {
    try {
        const brands = await Brand.find({status: "pending"});
        if (brands.length === 0) {
            return res.status(404).json({msg: "No hay comercios pendientes"});
        }
        res.send(brands);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
};

const getBrandsApproved = async (req, res) => {
    try {
        const brands = await Brand.find({status: "approved"});
        if (brands.length === 0) {
            return res.status(404).json({msg: "No hay comercios aprobados"});
        }
        res.send(brands);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const getBrandsRejected = async (req, res) => {
    try {
        const brands = await Brand.find({status: "rejected"});
        if (brands.length === 0) {
            return res.status(404).json({msg: "No hay comercios rechazados"});
        }
        res.send(brands);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const createBrand = async (req, res) => {
    try {
        const brand = new Brand(req.body);
        if (!brand.name || !brand.email || !brand.password || !brand.phone || !brand.description || !brand.address || !brand.manager || !brand.category) {
            return res.status(403).json({msg: "Debe completar todos los campos"});
        }

        const passwordHash = await bcrypt.hash(brand.password, salt);
        brand.password = passwordHash;
    
        await brand.save();
        res.send(brand);
    }catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({msg: "El correo ya está registrado"});
        }
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const auth = async (req, res) => {
    try {
        const {email, password} = req.body;
        const brand = await Brand.findOne({email: email});

        if (!brand) {
            return res.status(404).json({msg: "El comercio es inválido"});
        }

        const passwordValid = await bcrypt.compare(password, brand.password);
        if (!passwordValid) {
            return res.status(404).json({msg: "La constraseña es inválida"});
        }

        //Crear Token
        const data = {
            id: brand._id,
            email: brand.email,
            role: brand.role,
        }

        const jwt = jsonwebtoken.sign(data, secret_key, {expiresIn: '1h'});

        res.json({msg: "Credenciales correctas", token: jwt});
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

export { getAllBrands, getBrandsByCategoryId, createBrand, auth, getBrandsPending, getBrandsApproved, getBrandsRejected };