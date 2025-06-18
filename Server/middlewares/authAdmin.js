import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret_key = process.env.SECRET_KEY;

const validationAdminToken = (req, res, next) => {
    const auth = req.headers.authorization;

    if(!auth){
        return res.status(401).json({ msg: 'Token no enviado' });
    } 
  
    const token = auth.split(' ')[1];
  
    jsonwebtoken.verify(token, secret_key, (err, decoded) => {
      if(err) {
        return res.status(403).json({ msg: 'Token inválido' });
      } 
  
      if (decoded.role !== 'admin') {
        return res.status(403).json({ msg: 'No autorizado: solo admins' });
      }
  
      req.userId = decoded.id;
      next();
    });


};
  
  export { validationAdminToken };