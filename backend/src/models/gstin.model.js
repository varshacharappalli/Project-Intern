import mongoose from "mongoose";

const user_gstin = new mongoose.Schema({
  gstUsername: {
    type: String,
    required: true,
    trim: true,   
  },
  gstin: {
    type: String,
    required: true, 
    unique: true,   
    match: [/^[A-Z0-9]{15}$/, "Please enter a valid GSTIN"], 
  },
  stateCode: {
    type: String,
    required: true,
    match: [/^\d{2}$/, "State Code should be two digits"], 
    default: function() {
      return this.gstin.slice(0, 2);
    },
  },
});

const gstin = mongoose.model('GSTIN', user_gstin);

export default gstin;
