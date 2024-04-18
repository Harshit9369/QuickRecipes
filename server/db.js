import mysql from 'mysql'
import fs from 'fs'

export const db = mysql.createConnection({
    host: "harry-202251053.mysql.database.azure.com",
    user: "Harshit",
    password: "Touche@9369",
    database: "recipes",
    port: 3306,
    ssl: {
        ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")
    }
});
