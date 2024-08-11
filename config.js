//Configuracion de la base de datos
import dotenv from 'dotenv';
import neo4j from "neo4j-driver";

dotenv.config();

const neo4jUri = process.env.NEO4J_URI || 'neo4j://localhost';
const neo4jUser = process.env.NEO4J_USER || 'neo4j';
const neo4jPass = process.env.NEO4J_PASS || 'neo_23cont0d'; 

const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPass));


export const getSession = () => {
    return driver.session();
};
