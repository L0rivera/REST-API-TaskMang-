import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function getCookie (req, res) {
    if (!req.headers.cookie) return console.log("There are no cookies");

     const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    const decode = jsonwebtoken.verify(cookieJWT,process.env.JWT_SECRET);

    return decode;
}

export default getCookie