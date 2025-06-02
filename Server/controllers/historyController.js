import History from '../models/historyModel.js';

const getAllHistory = async (req, res) => {
    try {
        const history = await History.find()
        .populate("userId", "name")
        .populate("brandId", "name")
        .populate("awardId", "name");

        if (history.length === 0) {
        return res.status(404).json({ message: "No se encontraron canjes" });
        }
        res.status(200).json(history);

    } catch (error) {
        return res.status(500).json({ msg: "Error en el servidor" });
    }
}

const getHistoriesByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const histories = await History.find({ userId })
        .populate("userId", "name")
        .populate("brandId", "name")
        .populate("awardId", "name");

        if (histories.length === 0) {
            return res.status(404).json({ message: "No se encontraron canjes" });
        }
        res.status(200).json(histories);

    } catch (error) {
        return res.status(500).json({ msg: "Error en el servidor" });
    }
}

const getHistoriesByBrandId = async (req, res) => {
    const { brandId } = req.params;
    try {
        const histories = await History.find({ brandId })
        .populate("userId", "name")
        .populate("brandId", "name")
        .populate("awardId", "name");

        if (histories.length === 0) {
            return res.status(404).json({ message: "No se encontraron canjes" });
        }
        res.status(200).json(histories);

    } catch (error) {
        return res.status(500).json({ msg: "Error en el servidor" });
    }
}

export { getAllHistory, getHistoriesByUserId, getHistoriesByBrandId };