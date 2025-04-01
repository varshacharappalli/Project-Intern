import gstin from "../models/gstin.model.js";

export const addGSTIN = async (req, res) => {
    try {
        const { gstUsername, gstin: gstinNumber } = req.body;

        const existingGSTIN = await gstin.findOne({ gstin: gstinNumber });
        if (existingGSTIN) {
            return res.status(400).json({ message: "GSTIN already exists." });
        }

        const newGSTIN = new gstin({
            gstUsername,
            gstin: gstinNumber,  
        });

        await newGSTIN.save();

        res.status(201).json({ message: "GSTIN added successfully", data: newGSTIN });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const viewAll = async (req, res) => {
    try {
        const gstinList = await gstin.find();

        if (gstinList.length === 0) {
            return res.status(404).json({ message: "No GSTIN records found." });
        }

        res.status(200).json({ message: "GSTIN records retrieved successfully", data: gstinList });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
};
