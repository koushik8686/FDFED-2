const unverified_sellers = require('../../models/unverifiedsellers');
const sellers = require('../../models/sellermodel');

async function verifyEmail(req, res) {
    const sellerid = req.params.id;
    try {
        const unverifiedUser = await unverified_sellers.findOne({ _id: sellerid });
        if (!unverifiedUser) {
            return res.status(404).send({ message: "User not found or already verified" });
        }

        const verifiedUser = new sellers({
            name: unverifiedUser.name,
            email: unverifiedUser.email,
            password: unverifiedUser.password,
            phone: unverifiedUser.phone,
            items: unverifiedUser.items
        });

        await verifiedUser.save();
        await unverified_sellers.deleteOne({ _id: sellerid });

        res.status(200).send({ message: "Email verified successfully! Your account is now active." });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { verifyEmail };
