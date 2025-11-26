// Importar el modelo
import Brand from '../models/brandModel.js';
import bcrypt from 'bcrypt';
import jsonwebtoken from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
const secret_key = process.env.SECRET_KEY;
const salt = 10;

const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find().populate('category');
        res.send(brands);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
};

const getBrandById = async (req, res) => {
    try {
        const brandId = req.params.id;
        const brand = await Brand.findById(brandId).populate('category');
        if (!brand) {
            return res.status(404).json({msg: "Comercio no encontrado"});
        }
        res.send(brand);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
};

const getBrandsByCategoryId = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const brands = await Brand.find({category: categoryId, status: "approved"});
        if (brands.length === 0) {
            return res.status(404).json({msg: "No hay comercios para esta categoria"});
        }
        res.send(brands);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
};

const getBrandsPending = async (req, res) => {
    try {
        const brands = await Brand.find({status: "pending"}).populate('category');
        res.status(200).json(brands);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
};

const getBrandsApproved = async (req, res) => {
    try {
        const brands = await Brand.find({status: "approved"}).populate('category');
        res.status(200).json(brands);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const getBrandsRejected = async (req, res) => {
    try {
        const brands = await Brand.find({status: "rejected"}).populate('category');
        res.status(200).json(brands);
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const createBrand = async (req, res) => {
    try {
         if (req.file) {
            req.body.profileImage = `/uploads/brands/${req.file.filename}`;
        }

        // Enfoque validado: requerir `locations` seleccionadas del autocomplete
        let locations = req.body.locations;
        if (typeof locations === 'string') {
            try {
                const parsed = JSON.parse(locations);
                if (Array.isArray(parsed)) locations = parsed;
            } catch (_) {
                return res.status(400).json({ msg: 'Formato de locations inválido' });
            }
        }
        if (!Array.isArray(locations) || locations.length === 0) {
            return res.status(403).json({ msg: 'Debe seleccionar al menos una dirección válida' });
        }
        // Validar shape mínima
        const sanitizedLocations = locations
            .map(l => ({
                formattedAddress: (l.formattedAddress || l.text || '').toString().trim(),
                lat: Number(l.lat),
                lng: Number(l.lng),
                provider: (l.provider || 'geoapify').toString().trim(),
                placeId: (l.placeId || '').toString().trim(),
            }))
            .filter(l => l.formattedAddress && Number.isFinite(l.lat) && Number.isFinite(l.lng));
        if (sanitizedLocations.length === 0) {
            return res.status(403).json({ msg: 'Las direcciones seleccionadas no son válidas' });
        }
        const addresses = sanitizedLocations.map(l => l.formattedAddress);

        // Validaciones mínimas de campos requeridos
        const requiredOk = req.body.name && req.body.email && req.body.password && req.body.phone && req.body.description && req.body.manager && req.body.category && req.file;
        if (!requiredOk) {
            return res.status(403).json({msg: "Debe completar todos los campos"});
        }

        // Construir documento normalizado
        const payload = { ...req.body, addresses, locations: sanitizedLocations };
        delete payload.address; // legacy
        delete payload.locations; // prevenimos inyección de campos no saneados

        const brand = new Brand(payload);

        const passwordHash = await bcrypt.hash(brand.password, salt);
        brand.password = passwordHash;
    
        await brand.save();
        res.send(brand);
    }catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({msg: "El correo ya está registrado"});
        }
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

const auth = async (req, res) => {
    try {
        const {email, password} = req.body;
        const brand = await Brand.findOne({email: email});

        if (!brand) {
            return res.status(404).json({msg: "El comercio es inválido"});
        }

        const passwordValid = await bcrypt.compare(password, brand.password);
        if (!passwordValid) {
            return res.status(404).json({msg: "La constraseña es inválida"});
        }

        //Crear Token
        const data = {
            id: brand._id,
            email: brand.email,
            role: brand.role,
        }

        const jwt = jsonwebtoken.sign(data, secret_key, {expiresIn: '1h'});

        res.json({msg: "Credenciales correctas", token: jwt});
    }catch (error) {
        return res.status(500).json({msg:"Error en el servidor"});
    }
}

export { getAllBrands, getBrandById, getBrandsByCategoryId, createBrand, auth, getBrandsPending, getBrandsApproved, getBrandsRejected };

// Perfil propio de comercio
const getMe = async (req, res) => {
    try {
        const brand = await Brand.findById(req.brandId).populate('category');
        if (!brand) return res.status(404).json({ msg: 'Comercio no encontrado' });
        res.json(brand);
    } catch (error) {
        return res.status(500).json({ msg: 'Error en el servidor' });
    }
};

const updateMe = async (req, res) => {
    try {
        // Enforce that brand exists and check current locations state
        const current = await Brand.findById(req.brandId).select('locations');
        if (!current) return res.status(404).json({ msg: 'Comercio no encontrado' });
        const updates = {};
        const allowed = ['name','email','phone','description','manager','category','status'];
        for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];
        if (req.file) {
            updates.profileImage = `/uploads/brands/${req.file.filename}`;
        }
        // No permitir actualizar 'addresses' sin 'locations' válidas
        if (req.body.addresses !== undefined && req.body.locations === undefined) {
            return res.status(403).json({ msg: 'Debe seleccionar direcciones válidas desde el buscador' });
        }
        // Normalizar locations validadas del autocomplete (obligatorio si se envía)
        let locations = req.body.locations;
        if (locations !== undefined) {
            if (typeof locations === 'string') {
                try {
                    const parsed = JSON.parse(locations);
                    locations = parsed;
                } catch (_) {
                    return res.status(400).json({ msg: 'Formato de locations inválido' });
                }
            }
            if (!Array.isArray(locations) || locations.length === 0) {
                return res.status(403).json({ msg: 'Debe enviar al menos una dirección válida' });
            }
            const sanitized = locations
                .map(l => ({
                    formattedAddress: (l.formattedAddress || l.text || '').toString().trim(),
                    lat: Number(l.lat),
                    lng: Number(l.lng),
                    provider: (l.provider || 'geoapify').toString().trim(),
                    placeId: (l.placeId || '').toString().trim(),
                }))
                .filter(l => l.formattedAddress && Number.isFinite(l.lat) && Number.isFinite(l.lng));
            if (sanitized.length === 0) {
                return res.status(403).json({ msg: 'Las direcciones seleccionadas no son válidas' });
            }
            updates.locations = sanitized;
            updates.addresses = sanitized.map(l => l.formattedAddress);
        }
        // Si no envía nuevas locations y actualmente no tiene ninguna, exigir al menos una
        if (updates.locations === undefined) {
            const hasCurrent = Array.isArray(current.locations) && current.locations.length > 0;
            if (!hasCurrent) {
                return res.status(403).json({ msg: 'Debe mantener al menos una dirección válida en el perfil' });
            }
        }
        if (req.body.password) {
            const hash = await bcrypt.hash(req.body.password, salt);
            updates.password = hash;
        }
        const brand = await Brand.findByIdAndUpdate(req.brandId, updates, { new: true, runValidators: true }).populate('category');
        if (!brand) return res.status(404).json({ msg: 'Comercio no encontrado' });
        res.json(brand);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ msg: 'El correo ya está registrado' });
        }
        return res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export { getMe as getMeBrand, updateMe as updateMeBrand };
