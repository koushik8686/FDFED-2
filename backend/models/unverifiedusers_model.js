const mongoose = require('mongoose');
const { itemschema } = require("./itemmodel");

const userschema = mongoose.Schema({
    username: String,
    email: { type: String, index: true, unique: true },
    password: String,
    items: [itemschema]
}, {
    timestamps: true // This will add createdAt and updatedAt fields automatically
});

// Ensure indexes are created
userschema.index({ email: 1 }, { unique: true });

const usermodel = mongoose.model("unverified_users", userschema);
module.exports = usermodel;