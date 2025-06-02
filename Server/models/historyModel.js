import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
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
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const History = mongoose.model('history', historySchema);
export default History;