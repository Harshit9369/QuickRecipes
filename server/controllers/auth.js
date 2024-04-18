import {db} from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = (req, res) => {
    // CHECK EXISTING USER:
    console.error("Error checking user:");
    const q = "SELECT * FROM users WHERE email = ? OR username = ?"
    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if(err) return res.status(500).json(err)
        if(data.length > 0) return res.status(409).json("User already exists!")

        // the password that is taken from the user isn't stored in the database but the hash is stored using bcrypt.js
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        
        const q = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)"
        const values = [
            req.body.username,
            req.body.email,
            hash,
        ]
        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json("User has been created.")
        })
    })
}
export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?"
    db.query(q, [req.body.username], (err, data) => {
        if(err) return res.json(err)
        if(data.length === 0) return res.status(404).json("User not found!")

        const user = data[0]
        const valid = bcrypt.compareSync(req.body.password, user.password)
        if(!valid) return res.status(400).json("Password is incorrect!")

        const token = jwt.sign({id: user.id}, "jwtkey");
        const {password, ...other} = data[0]

        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(other)
    })
}
export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out.")
}