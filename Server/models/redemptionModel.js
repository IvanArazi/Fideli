import mongoose from 'mongoose';

const redemptionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    awardId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'award', 
        required: true 
    },
    brandId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'brand', 
        required: true 
    },
    status: {
        type: String,
        enum: ['pending', 'used'],
        default: 'pending'
    },
    code: { 
        type: String, 
        unique: true, 
        required: true,
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Redemption = mongoose.model('redemption', redemptionSchema);
export default Redemption;