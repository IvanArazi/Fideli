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

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = {};
        const allowed = ['title','location','description','hours','startDate','endDate'];
        for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];
        const ev = await Event.findById(id);
        if (!ev) return res.status(404).json({ msg: 'Evento no encontrado' });
        if (String(ev.brandId) !== String(req.brandId)) return res.status(403).json({ msg: 'No autorizado' });
        if (updates.startDate && updates.endDate && new Date(updates.endDate) < new Date(updates.startDate)) {
            return res.status(400).json({ msg: 'La fecha de fin no puede ser anterior a la de inicio' });
        }
        const updated = await Event.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const ev = await Event.findById(id);
        if (!ev) return res.status(404).json({ msg: 'Evento no encontrado' });
        if (String(ev.brandId) !== String(req.brandId)) return res.status(403).json({ msg: 'No autorizado' });
        await Event.findByIdAndDelete(id);
        res.json({ msg: 'Evento eliminado' });
    } catch (error) {
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

export { updateEvent, deleteEvent };
