import Favorite from "../models/favoriteModel.js";

const getAllFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find()
            .populate("userId", "name")
            .populate("brandId", "name");

        if (favorites.length === 0) {
            return res.status(404).json({ message: "No se encontraron favoritos" });
        }
        res.status(200).json(favorites);

    } catch (error) {
        return res.status(500).json({ msg: "Error en el servidor" });
    }
}

const getFavoritesByUserId = async (req, res) => {
    const userId = req.userId;

    try {
        const favorites = await Favorite.find({ userId })
            .populate("userId", "name")
            .populate("brandId", "name");

        if (favorites.length === 0) {
            return res.status(404).json({ message: "No se encontraron favoritos para este usuario" });
        }
        res.status(200).json(favorites);

    } catch (error) {
        return res.status(500).json({ msg: "Error en el servidor" });
    }
}

const getFavoritesByBrandId = async (req, res) => {
    const { brandId } = req.brandId;

    try {
        const favorites = await Favorite.find({ brandId })
            .populate("userId", "name")
            .populate("brandId", "name");

        if (favorites.length === 0) {
            return res.status(404).json({ message: "No se encontraron favoritos para esta marca" });
        }
        res.status(200).json(favorites);

    } catch (error) {
        return res.status(500).json({ msg: "Error en el servidor" });
    }
}

const createFavorite = async (req, res) => {
    const userId = req.userId;
    const { brandId } = req.body;

    if (!brandId) {
        return res.status(400).json({ msg: "Comercio no encontrado" });
    }

    try {
        const newFavorite = new Favorite({ userId, brandId });
        await newFavorite.save();
        res.status(201).json(newFavorite);

    } catch (error) {
        return res.status(500).json({ msg: "Error en el servidor" });
    }
}

const deleteFavorite = async (req, res) => {
    const id = req.params.id;
    try {
        const favorite = await Favorite.findOneAndDelete({ _id: id });

        if (!favorite) {
            return res.status(404).json({ message: "No se encontró el favorito" });
        }
        res.status(200).json({ message: "Favorito eliminado" });

    } catch (error) {
        return res.status(500).json({ msg: "Error en el servidor" });
    }
}

export { getAllFavorites, getFavoritesByUserId, getFavoritesByBrandId, createFavorite, deleteFavorite };