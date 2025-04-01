import { mongo_db } from "./lib/db.js";
import dotenv from 'dotenv';
import addGST from "./routes/user_add.js";
import express from "express";


const app=express();

dotenv.config({ path: "./src/.env" }); 

app.use(express.json());


app.use('/api',addGST);

app.listen(process.env.PORT, () => {
    console.log("Server is running in port:"+process.env.PORT);
});

mongo_db();