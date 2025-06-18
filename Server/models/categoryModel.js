import mongoose from "mongoose";

const Schema = mongoose.Schema;
const mySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
        trim: true,
    },
});

const Category = mongoose.model('category', mySchema );

export default Category;