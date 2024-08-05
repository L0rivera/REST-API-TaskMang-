import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
import { getSession } from '../config.js';


dotenv.config();

async function onlylogged(req, res, next) {
    try {
        const logged = await checkCookie(req, res);
        if (logged) {
           console.log('Acceso permitido: usuario logueado.');
            return next();
        } else {
            console.log('Acceso denegado: redirigiendo al login.');
            return res.redirect("/login");
        }
    } catch (err) {
        console.log(`Error en onlylogged: ${err.message}`);
        return res.redirect("/login");
    }
}

async function onlyNotlog(req, res, next) {
    try {
        const logged = await checkCookie(req, res);
        if (!logged) {
            console.log('Acceso permitido: usuario no logueado.');
            return next();
        } else {
            console.log('Acceso denegado: redirigiendo a home.');
            return res.redirect("/");
        }
    } catch (err) {
        console.log(`Error en onlyNotlog: ${err.message}`);
        return res.redirect("/");
    }
}

async function checkCookie(req, res) {
    const session = getSession();
    try {
        if (!req.headers.cookie) {
            console.log('No hay cookies presentes.');
            return false;
        }

        const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
        if (!cookieJWT) {
            console.log('No se encontró el JWT en las cookies.');
            return false;
        }

        const decodification = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
        console.log('JWT decodificado:', decodification);

        const { email } = decodification;
        const result = await session.run(
            'MATCH (u:User {email: $email}) RETURN u',
            { email: email }
        );

        if (result.records.length === 0) {
            console.log('No se encontró el usuario en la base de datos.');
            return false;
        } else {
            console.log('Usuario encontrado en la base de datos.');
            return true;
        }
    } catch (err) {
        console.log(`Error en la verificación de la cookie: ${err.message}`);
        return false;
    } finally {
        await session.close();
    }
}

function authCookie (req, res, next) {
      if (!req.headers.cookie) {
            console.log('No hay cookies presentes.');
            return false;
        }

        const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
        if (!cookieJWT) {
            console.log('No se encontró el JWT en las cookies.');
            return false;
        }

        if (cookieJWT) {
        const decodification = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                 return res.sendStatus(403);
            }
            req.username = user;
            return next();
        });
            
        } else {
            res.sendStatus(401);
        }
    }

export const methods = {
    onlylogged,
    onlyNotlog,
    authCookie
}