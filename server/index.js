import express from 'express'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import cors from 'cors'

const app = express()

const corsOrigin = {
    origin:'http://localhost:5173', 
    credentials:true,            
    optionSuccessStatus:200
}
app.use(cors(corsOrigin));
app.use(express.json())
app.use(cookieParser())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+file.originalname)
    }
})

const upload = multer({ storage: storage})

app.post('/api/upload', upload.single('file'), function (req, res) {
    const file = req.file;
    console.log(req.file); // Log uploaded file information
    if (!req.file) {
        console.error("No file received");
        return res.status(400).json({ error: "No file received" });
    }
    res.status(200).json(file.filename)
});

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

app.listen(8800, ()=>{
    console.log("Connected!")   
})