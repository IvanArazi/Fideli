// Importar el modelo
import Category from '../models/categoryModel.js';

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        if (!categories) {
            return res.status(404).json({msg: "No hay categorías"});
        }
        res.send(categories);
    }catch (error) {
        res.status(500).json({msg: "Error interno del servidor"});
    }
}

const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        if (!category.name) {
            return res.status(403).json({msg: "Debe completar todos los campos"});
        }
        await category.save();
        res.send(category);
    }catch (error) {
        res.status(500).json({msg: "Error interno del servidor"});
    }
}

export { getAllCategories, createCategory };