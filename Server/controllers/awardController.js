// Importar el modelo
import Award from '../models/awardModel.js';

const getAllAwards = async (req, res) => {
    try {
        const awards = await Award.find().populate('brand', 'name');
        if (awards.length === 0) {
            return res.status(404).send('No se encontraron premios');
        }
        res.send(awards);
    }catch (error) {
        res.status(500).send('Error en el servidor');
    }
}

const getAwardsById = async (req, res) => {
    try {
        const id = req.params.id;
        const award = await Award.findById(id).populate('brand', 'name');
        if (!award) {
            return res.status(404).send('No se encontró el premio');
        }
        res.send(award);
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
}

const getAwardsByBrand = async (req, res) => {
    try {
        const brandId = req.params.brand;
        const award = await Award.find({ brand: brandId }).populate('brand', 'name');

        if (award.length === 0) {
            return res.status(404).send('No se encontraron premios para este comercio');
        }
        res.send(award);
    }catch (error) {
        res.status(500).send('Error en el servidor');
    }
}

const createAward = async (req, res) => {
    try {
        const { name, description, requiredPoints } = req.body;
        const brandId = req.brandId;

        if (!name || !description || requiredPoints == null) {
            return res.status(400).send('Todos los campos son obligatorios');
        }

        if (typeof requiredPoints !== 'number' || requiredPoints <= 0) {
            return res.status(400).send('Los puntos requeridos deben ser un número positivo');
        }

        const integerPoints = Math.floor(requiredPoints); // Asegura que sea entero

        const newAward = new Award({
            name,
            brand: brandId,
            description,
            requiredPoints: integerPoints,
        });

        await newAward.save();
        res.status(201).send(newAward);
    }catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
}

const updateAward = async (req, res) => {
    try {
        const awardId = req.params.id;
        const brandId = req.brandId;
        const { name, description, requiredPoints } = req.body;
        // Verificar que el premio pertenezca a la marca
        const award = await Award.findOne({ _id: awardId, brand: brandId });
        if (!award) {
            return res.status(403).json({ msg: 'No tienes permiso para editar este premio' });
        }

        // Actualizar campos si fueron enviados
        if (name){
            award.name = name;
        }
        if (description){
            award.description = description;
        }
        if (requiredPoints != null) {
            award.requiredPoints = Math.floor(requiredPoints);
        }

        await award.save();
        res.status(200).json({ msg: 'Premio actualizado', award });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el premio' });
    }
};

const deleteAward = async (req, res) => {
    try {
        const awardId = req.params.id;
        const brandId = req.brandId;

        const award = await Award.findOneAndDelete({ _id: awardId, brand: brandId });

        if (!award) {
            return res.status(403).json({ msg: 'No tienes permiso para eliminar este premio' });
        }

        res.status(200).json({ msg: 'Premio eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar el premio' });
    }
};

export { getAllAwards, getAwardsByBrand, createAward, getAwardsById, updateAward, deleteAward };