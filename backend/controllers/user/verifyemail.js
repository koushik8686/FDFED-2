const unverified_users = require('../../models/unverifiedusers_model');
const users = require('../../models/usermodel');

async function verifyEmail(req, res) {
    const userid = req.params.id;
    try {
        const unverifiedUser = await unverified_users.findOne({ _id: userid });
        if (!unverifiedUser) {
            return res.status(404).send({ message: "User not found or already verified" });
        }

        const verifiedUser = new users({
            username: unverifiedUser.username,
            email: unverifiedUser.email,
            password: unverifiedUser.password,
            items: unverifiedUser.items
        });

        await verifiedUser.save();
        await unverified_users.deleteOne({ _id: userid });
        res.status(200).send({ message: "Email verified successfully! Your account is now active." });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { verifyEmail };
