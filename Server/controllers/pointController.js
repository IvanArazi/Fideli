// Importar el modelo
import Point from '../models/pointModel.js';
import User from '../models/userModel.js';

const getAllPoints = async (req, res) => {
    try {
        const points = await Point.find()
        .populate('userId', 'name')
        .populate('brandId', 'name');
        res.send(points);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const getPointsByUser = async (req, res) => {
    try {
        const id = req.params.id;
        const points = await Point.find({userId: id})
        .populate('userId', 'name')
        .populate('brandId', 'name');
        if (points.length === 0) {
            return res.status(404).send('No se encontraron puntos para este usuario');
        }
        res.send(points);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const getPointsByBrand = async (req, res) => {
    try {
        const id = req.params.id;
        const points = await Point.find({brandId: id})
        .populate('userId', 'name')
        .populate('brandId', 'name');
        if (points.length === 0) {
            return res.status(404).send('No se encontraron puntos para esta marca');
        }
        res.send(points);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const getPointsByUserAndBrand = async (req, res) => {
    try {
        const {user, brand} = req.params;
        const points = await Point.find({userId: user, brandId: brand})
        .populate('userId', 'name')
        .populate('brandId', 'name');
        if (points.length === 0) {
            return res.status(404).send('No se encontraron puntos para este usuario y marca');
        }
        res.send(points);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const acumulatePoints = async (req, res) => {    
    try {
        const { uniqueNumber, price } = req.body;
        const brandId = req.brandId;

        if (!uniqueNumber || !brandId || typeof price !== 'number') {
            return res.status(400).json({ msg: 'Datos inválidos' });
        }
        // Buscar al usuario por su código único
        const user = await User.findOne({ uniqueNumber });

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado con ese código único' });
        }

        // Calcular puntos (100 pesos = 1 punto)
        const pointsToAdd = Math.floor(price / 100);

        // Actualizar o crear registro de puntos
        const updatedPoints = await Point.findOneAndUpdate(
            { userId: user._id, brandId },
            { $inc: { points: pointsToAdd } },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            msg: `Se acumularon ${pointsToAdd} puntos correctamente`,
            data: updatedPoints
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error del servidor' });
    }
};



export { getAllPoints, getPointsByUser, getPointsByUserAndBrand, getPointsByBrand, acumulatePoints };