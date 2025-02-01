import express from "express"
import mongoose from "mongoose"
import multer from "multer"
import cors from "cors"
import dotenv from "dotenv"
import {User} from "./models/user.models.js"
import { uploadResult } from "./controllers/cloudinary.js"
import {Assignment} from "./models/assignment.models.js"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


dotenv.config({
    path:'./.env'
})

const app = express();
app.use(cors());
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"18kb"}))
app.use(express.static("public"))

const connectdb = async ()=>{
    try {
        const dbobj = await mongoose.connect(`${process.env.MONGOURL}`)
        console.log(`database connected with mongo db at ${dbobj.connection.host}`)
        
    } catch (error) {
        console.log("error ",error);
        console.log(error)
    }
}

connectdb();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './temp')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

app.get('/',(req,res)=>{
    res.json({
        message:"welcome to server",
        status:200
    })
})

// app.post('/user/register',async(req,res)=>{
//     try {
//         const {name} = req.body;
//         const user = await User.create({
//             name
//         })
//         res.status(200).json({
//             user,message:"user created successfully"
//         })
//     } catch (error) {
//         res.status(500).json({
//             message:"internal server error"
//         })
//         console.log(error)
//     }
    
// })

app.post('/user/upload',upload.single("contribute"),async(req,res)=>{
    try {
        const cloud = await uploadResult(req.file.path)
        const cldurl = cloud.url;
        console.log(req.body);
        const assignment = await Assignment.create({
            subject:req.body.subject,
            file:cldurl,
            name:req.body.name
        })
        console.log("Assignment to be stored in DB:", assignment);
        res.status(200).json({
            assignment,
            message:"file successfully submitted"
        })
        
    } catch (error) {
        res.status(500).json({
            errmessage:error
        })
    }
    
})

app.get('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const files = await Assignment.aggregate([
            {
                $match: {
                    subject: userId
                }
            }
        ]);
        console.log(files);
        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('An error occurred while fetching data.');
    }
});


app.listen(process.env.PORT || 5000,()=>{
    console.log(`server running on port ${process.env.PORT}`);
})

