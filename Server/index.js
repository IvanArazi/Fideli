import express from 'express';
import dotenv from 'dotenv';
import routerAPI from './routes/index.js';
import mongoose from 'mongoose';
import path from "path";
import cors from 'cors';

dotenv.config();
const app = express();
const port = process.env.PORT;
const dburi = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.get('/', (req, res) => {
    console.log('Hello World!');
    res.send('Home');
});

routerAPI(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Conexion con la DB
mongoose.connect(dburi)
const db = mongoose.connection;

db.on('error', (err) => { console.error( {err} ) } );

db.once('open', () => { console.log('Conexion con la Db Correcta')} );