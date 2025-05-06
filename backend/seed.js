const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://koushik:koushik@cluster0.h2lzgvs.mongodb.net/fdfed").then(() => {
    console.log("MongoDB Connected");
});

const SellerModel = require("./models/sellermodel");

async function updateSellers() {
    try {
        await SellerModel.updateMany({}, { $set: { subscription: "free" } });
        console.log("Updated all sellers with subscription: free");
    } catch (error) {
        console.error("Error updating sellers:", error);
    } finally {
        mongoose.connection.close();
    }
}

updateSellers();
