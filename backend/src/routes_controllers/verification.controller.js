import axios from 'axios';
import gstin from "../models/gstin.model.js";


export const generateOtp = async (req, res) => {
    try {
        const { gstin: gstinNumber } = req.body;

        if (!gstinNumber) {
            return res.status(400).json({ error: 'GSTIN is required.' });
        }

        const gstUser = await gstin.findOne({ gstin: gstinNumber });

        if (!gstUser) {
            return res.status(404).json({ error: 'GSTIN not found.' });
        }

        const email = process.env.EMAIL;
        const clientId = process.env.Client_ID;
        const clientSecret = process.env.Client_Secret_ID;
        const gstUsername = gstUser.gstUsername;

        if (!email || !clientId || !clientSecret) {
            console.error('Missing environment variables:', { email, clientId, clientSecret });
            return res.status(500).json({ error: 'Server configuration error. Please contact support.' });
        }

        const clientIp = req.ip || req.headers['x-forwarded-for'] || 'Unknown IP';

        const headers = {
            "gst_username": gstUsername,
            "state_cd": gstUser.stateCode,
            "ip_address": clientIp,
            "client_id": clientId,
            "client_secret": clientSecret,
            "Content-Type": "application/json",
        };

        // Log the request details (excluding sensitive data)
        console.log('Making OTP request with:', {
            gstUsername,
            stateCode: gstUser.stateCode,
            clientIp,
            email
        });

        const params = new URLSearchParams();
        params.append('email', email);

        const response = await axios.get(
            `https://apisandbox.whitebooks.in/authentication/otprequest?${params}`,
            { headers }
        );

        // Log the response
        console.log('Whitebooks API Response:', response.data);

        if (response.data.status_cd === "1") {
            return res.status(200).json({ 
                message: 'OTP sent to the registered email.',
                data: response.data
            });
        } else {
            return res.status(500).json({ 
                error: 'Failed to request OTP. Please try again later.',
                details: response.data 
            });
        }
    } catch (error) {
        console.error('Error while requesting OTP:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        return res.status(500).json({ 
            error: 'Error while requesting OTP. Please try again later.',
            details: error.response?.data || error.message
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { otp, email } = req.body;

        if (!otp || !email) {
            return res.status(400).json({ error: 'OTP and email are required.' });
        }

        const body = {
            email: email,
            otp: otp,
        };

        const response = await axios.post(
            'https://apisandbox.whitebooks.in/authentication/verifyotp',
            body,
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.status === 200 && response.data.status === 'verified') {
            return res.status(200).json({ message: 'OTP verified successfully!' });
        } else {
            return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
        }
    } catch (error) {
        console.error('Error while verifying OTP:', error);
        return res.status(500).json({ error: 'Error while verifying OTP. Please try again.' });
    }
};
