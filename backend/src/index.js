import { mongo_db } from "./lib/db.js";
import dotenv from 'dotenv';
import addGST from "./routes/user_add.js";
import express from "express";
import cors from "cors";
import verificationRouter from "./routes/verification.js";


const app=express();

dotenv.config({ path: "./src/.env" }); 

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true 
  }));


app.use('/api',addGST);

app.use('/api/filling',verificationRouter);

app.listen(process.env.PORT, () => {
    console.log("Server is running in port:"+process.env.PORT);
});

mongo_db();