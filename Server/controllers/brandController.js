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
        const brands = await Brand.find().populate('category');
        res.send(brands);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
};

const getBrandById = async (req, res) => {
    try {
        const brandId = req.params.id;
        const brand = await Brand.findById(brandId).populate('category');
        if (!brand) {
            return res.status(404).json({msg: "Comercio no encontrado"});
        }
        res.send(brand);
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
        const brands = await Brand.find({status: "pending"}).populate('category');
        res.status(200).json(brands);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
};

const getBrandsApproved = async (req, res) => {
    try {
        const brands = await Brand.find({status: "approved"}).populate('category');
        res.status(200).json(brands);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const getBrandsRejected = async (req, res) => {
    try {
        const brands = await Brand.find({status: "rejected"}).populate('category');
        res.status(200).json(brands);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const createBrand = async (req, res) => {
    try {
         if (req.file) {
            req.body.profileImage = `/uploads/brands/${req.file.filename}`;
        }

        const brand = new Brand(req.body);
        if (!brand.name || !brand.email || !brand.password || !brand.phone || !brand.description || !brand.address || !brand.manager || !brand.category || !req.file) {
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

export { getAllBrands, getBrandById, getBrandsByCategoryId, createBrand, auth, getBrandsPending, getBrandsApproved, getBrandsRejected };