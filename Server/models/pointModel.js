import mongoose from "mongoose";

const Schema = mongoose.Schema;
const mySchema = new Schema({
    points: {
        type: Number,
        required: true,
        min: [0, 'Los puntos no pueden ser negativos'],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand',
        required: true,
    }
});

const Point = mongoose.model('point', mySchema);

export default Point;