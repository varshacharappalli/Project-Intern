import express from "express";
import { addGSTIN,viewAll} from "../routes_controllers/user.controller.js";

const addGST=express.Router();

addGST.post('/addGSTIN',addGSTIN);
addGST.get('/viewAll',viewAll);

export default addGST;