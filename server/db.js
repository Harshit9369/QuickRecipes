import mysql from 'mysql'
import fs from 'fs'

export const db = mysql.createConnection({
    host: "harry-202251053.mysql.database.azure.com",
    user: "Harshit",
    // contact me for password below:
    password: "",
    database: "recipes",
    port: 3306,
    ssl: {
        ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")
    }
});
