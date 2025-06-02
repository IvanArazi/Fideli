import express from 'express';
import dotenv from 'dotenv';
import routerAPI from './routes/index.js';
import mongoose from 'mongoose';
import cors from 'cors';
// ...existing code...

// ...existing code...

dotenv.config();
const app = express();
const port = process.env.PORT;
const dburi = process.env.MONGODB_URI;

app.use(cors());
// middleware
app.use(express.json());
// Middleware para servir archivos estáticos
app.use(express.static('public'));


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