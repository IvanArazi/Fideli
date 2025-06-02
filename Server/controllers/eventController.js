import Event from '../models/eventModel.js';

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('brandId', 'name');
        if (events.length === 0) {
            return res.status(404).json({msg: "No hay eventos"});
        }
        res.send(events);
    }catch (error) {
        res.status(500).json({msg: "Error interno del servidor"});
    }
}

const getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id).populate('brandId', 'name');
        if (!event) {
            return res.status(404).json({msg: "Evento no encontrado"});
        }
        res.send(event);
    }catch (error) {
        res.status(500).json({msg: "Error interno del servidor"});
    }
}

const getAllEventsByBrand = async (req, res) => {
    const { brandId } = req.params;
    try {
        const events = await Event.find({ brandId }).populate('brandId', 'name');
        if (events.length === 0) {
            return res.status(404).json({msg: "No hay eventos"});
        }
        res.send(events);
    }catch (error) {
        res.status(500).json({msg: "Error interno del servidor"});
    }
}

const createEvent = async (req, res) => {
    try {
        const { title, location, description, hours, startDate, endDate } = req.body;
        if (!title || !location || !description || !hours || !startDate || !endDate) {
            return res.status(403).json({msg: "Debe completar todos los campos"});
        }

        if (new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({ msg: "La fecha de fin no puede ser anterior a la de inicio" });
        }

        const event = new Event({
            brandId: req.brandId,
            title,
            location,
            description,
            hours,
            startDate,
            endDate
        });

        await event.save();
        res.status(201).json({msg: "Evento creado correctamente", event});
    }catch (error) {
        res.status(500).json({msg: "Error interno del servidor"});
    }
}

export { getAllEvents, getAllEventsByBrand, createEvent, getEventById };