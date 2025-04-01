import express from "express";
import { generateOtp, verifyOtp} from "../routes_controllers/verification.controller.js";

const verificationRouter = express.Router();

verificationRouter.post('/generate-otp', generateOtp);
verificationRouter.post('/verify-otp', verifyOtp);

export default verificationRouter; 