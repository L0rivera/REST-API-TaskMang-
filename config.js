//Configuracion de la base de datos
import dotenv from 'dotenv';
import neo4j from "neo4j-driver";

dotenv.config();

const neo4jUri = process.env.NEO4J_URI;
const neo4jUser = process.env.NEO4J_USER;
const neo4jPass = process.env.NEO4J_PASS; 

const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPass));


export const getSession = () => {
    return driver.session();
};
