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
        if (!req.body.name || !req.file) {
        return res.status(400).json({ msg: "Debe completar todos los campos y adjuntar una imagen" });
        }

        const imageUrl = `/uploads/categories/${req.file.filename}`;
        const category = new Category({
        name: req.body.name,
        image: imageUrl,
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: "Categoría no encontrada" });
        }
        res.status(200).json({ msg: "Categoría eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
}

export { getAllCategories, createCategory, deleteCategory };