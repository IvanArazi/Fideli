// Importar el modelo
import Redemption from '../models/redemptionModel.js';
import Award from '../models/awardModel.js';
import Point from '../models/pointModel.js';
import { customAlphabet } from 'nanoid';
import History from '../models/historyModel.js';

// Generar código único para el canje
const generateUniqueCode = async () => {
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);
    let code;
    let exists = true;
  
    while (exists) {
      code = nanoid();
      exists = await Redemption.findOne({ code });
    }
  
    return code;
  };

const getAllRedemptions = async (req, res) => {
    try {
      const redemptions = await Redemption.find()
      .populate('userId', 'name')
      .populate('brandId', 'name')
      .populate('awardId', 'name');
      if (redemptions.length === 0) {
          return res.status(404).json({ message: 'No se encontraron canjes' });
      }
      res.status(200).json(redemptions);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const getAllRedemptionPending = async (req, res) => {
    try {
      const redemptions = await Redemption.find({ status: 'pending' })
      .populate('userId', 'name')
      .populate('brandId', 'name')
      .populate('awardId', 'name');
      if (redemptions.length === 0) {
          return res.status(404).json({ message: 'No se encontraron canjes pendientes' });
      }
      res.status(200).json(redemptions);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const getAllRedemptionUsed = async (req, res) => {
    try {
      const redemptions = await Redemption.find({ status: 'used' })
      .populate('userId', 'name')
      .populate('brandId', 'name')
      .populate('awardId', 'name');
      if (redemptions.length === 0) {
        return res.status(404).json({ message: 'No se encontraron canjes usados' });
      }
      res.status(200).json(redemptions);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const getRedemptionByUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const redemptions = await Redemption.find({ userId })
      .populate('userId', 'name')
      .populate('brandId', 'name')
      .populate('awardId', 'name');
      if (redemptions.length === 0) {
        return res.status(404).json({ message: 'No se encontraron canjes para este usuario' });
      }
      res.status(200).json(redemptions);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const getRedemptionByBrand = async (req, res) => {
    try {
      const { brandId } = req.params;
      const redemptions = await Redemption.find({ brandId })
      .populate('userId', 'name')
      .populate('brandId', 'name')
      .populate('awardId', 'name');
      if (redemptions.length === 0) {
        return res.status(404).json({ message: 'No se encontraron canjes para esta marca' });
      }
      res.status(200).json(redemptions);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const createRedemption = async (req, res) => {
    try {
        const userId = req.userId;
        const { awardId } = req.body;

        if (!awardId) {
          return res.status(400).json({ msg: 'Falta el ID del premio' });
        }

        const award = await Award.findById(awardId);
        if (!award) {
            return res.status(404).json({ msg: 'Premio no encontrado' });
        }
        
        const brandId = award.brand;
        const requiredPoints = award.requiredPoints;

        const userPoints = await Point.findOne({ userId, brandId });
        if (!userPoints || userPoints.points < requiredPoints) {
            return res.status(400).json({ msg: 'No tenés puntos suficientes para canjear este premio' });
        }

        const code = await generateUniqueCode();

        // Crear el canje
        const newRedem = new Redemption({
            userId,
            awardId,
            brandId,
            code
        });

        await newRedem.save();

        // Descontar los puntos
        userPoints.points -= requiredPoints;
        await userPoints.save();

        return res.status(201).json({ msg: 'Premio canjeado con éxito', redem: newRedem });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error al realizar el canje' });
    }
}

const validateRedemption = async (req, res) => {
  try {
    const { code } = req.body;
    const brandId = req.brandId;

    if (!code) {
      return res.status(400).json({ msg: 'Se requiere el código para validar el canje' });
    }

    const redemption = await Redemption.findOne({ code, brandId });

    if (!redemption) {
      return res.status(404).json({ msg: 'Canje no encontrado o no pertenece a tu comercio' });
    }

    if (redemption.status !== 'pending') {
      return res.status(400).json({ msg: 'Este canje ya fue utilizado' });
    }

    // Obtener detalles del premio
    const award = await Award.findById(redemption.awardId);

    if (!award) {
      return res.status(404).json({ msg: 'Premio asociado no encontrado' });
    }

    // Crear registro de historial
    const newHistory = new History({
      userId: redemption.userId,
      awardId: redemption.awardId,
      brandId: redemption.brandId,
    });

    await newHistory.save();

    // Eliminar el canje
    await Redemption.deleteOne({ _id: redemption._id });

    return res.status(200).json({
      msg: 'Canje validado y registrado correctamente en el historial',
      award: {
        name: award.name,
        description: award.description,
        requiredPoints: award.requiredPoints,
      },
    });

  } catch (error) {
    return res.status(500).json({ msg: 'Error del servidor al validar el canje' });
  }
};


export { getAllRedemptions, getAllRedemptionPending, getAllRedemptionUsed, getRedemptionByUser, getRedemptionByBrand, createRedemption, validateRedemption };