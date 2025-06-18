import mongoose from "mongoose";

const Schema = mongoose.Schema;
const mySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    requiredPoints: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
});

const Award = mongoose.model('award', mySchema );

export default Award;