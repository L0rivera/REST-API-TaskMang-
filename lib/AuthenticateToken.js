import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;
  if (token == null) return res.sendStatus(401); // Si no hay token, no está autorizado

  jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Si hay un error al verificar el token, está prohibido
    req.user = user;
    next(); // Continua al siguiente middleware o ruta
  });
}

export default authenticateToken;
