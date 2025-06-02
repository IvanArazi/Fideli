import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    brandId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'brand', 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Favorite = mongoose.model('favorite', favoriteSchema);
export default Favorite;