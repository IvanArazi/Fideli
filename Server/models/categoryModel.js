import mongoose from "mongoose";

const Schema = mongoose.Schema;
const mySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

const Category = mongoose.model('category', mySchema );

export default Category;