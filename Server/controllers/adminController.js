// Importar el modelo
import Brand from '../models/brandModel.js';
import User from '../models/userModel.js';
import jsonwebtoken from "jsonwebtoken";
import dotenv from 'dotenv';

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userDeleted = await User.findByIdAndDelete(id);

        if (!userDeleted){
            return res.status(404).json({msg:"User not found"});
        }

        res.status(200).json({msg:"User deleted"});
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const deleteBrand = async (req, res) => {
    try {
        const id = req.params.id;
        const brandDeleted = await Brand.findByIdAndDelete(id);

        if (!brandDeleted){
        return res.status(404).json({msg:"Comercio no encontrado"});
        }

        res.status(200).json({msg:"Comercio eliminado"});
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const approvedBrand = async (req, res) => {
    try {
        const id = req.params.id;
        const brand = await Brand.findByIdAndUpdate(id, {status: "approved"}, {new: true});

        if (!brand){
            return res.status(404).json({msg:"Comercio no encontrado"});
        }

        res.status(200).json({msg:"Comercio aprobado"});
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const rejectedBrand = async (req, res) => {
    try {
        const id = req.params.id;
        const brand = await Brand.findByIdAndUpdate(id, {status: "rejected"}, {new: true});

        if (!brand){
            return res.status(404).json({msg:"Comercio no encontrado"});
        }

        res.status(200).json({msg:"Comercio rechazado"});
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

export {deleteUser, approvedBrand, rejectedBrand, deleteBrand};