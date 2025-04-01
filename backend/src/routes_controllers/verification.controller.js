import axios from 'axios';
import GSTIN from '../../models/gstin.model'; 

export const generateOtp = async (req, res) => {
    try {
        const { gstin } = req.body;

        if (!gstin) {
            return res.status(400).json({ error: 'GSTIN is required.' });
        }

        const gstUser = await GSTIN.findOne({ gstin: gstin });

        if (!gstUser) {
            return res.status(404).json({ error: 'GSTIN not found.' });
        }

        const email = process.env.email;
        const clientId = process.env.clientId;
        const clientSecret = process.env.clientSecret;
        const gstUsername = gstUser.gstUsername; 

        const headers = {
            "gst_username": gstUsername,
            "state_cd": gstUser.state_code,  
            "ip_address": req.ip,           
            "client_id": clientId,
            "client_secret": clientSecret,
            "Content-Type": "application/json",
        };

        const params = new URLSearchParams();
        params.append('email', email);

        const response = await axios.get(
            `https://apisandbox.whitebooks.in/authentication/otprequest?${params}`,
            { headers }
        );

        if (response.status === 200 && response.data.status === 'success') {
            return res.status(200).json({ message: 'OTP sent to the registered email.' });
        } else {
            return res.status(500).json({ error: 'Failed to request OTP. Please try again later.' });
        }
    } catch (error) {
        console.error('Error while requesting OTP:', error);
        return res.status(500).json({ error: 'Error while requesting OTP. Please try again later.' });
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
