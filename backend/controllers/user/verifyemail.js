const unverified_users = require('../../models/unverifiedusers_model');
const users = require('../../models/usermodel');

class UserVerificationService {
    async verifyEmail(userid) {
        try {
            // Search for the user in unverified users
            console.log(userid);
            const unverifiedUser = await unverified_users.findOne({ _id: userid });
            if (!unverifiedUser) {
                return { success: false, message: "User not found or already verified" };
            }
            // Create a new verified user with the data from the unverified user
            const verifiedUser = new users({
                username: unverifiedUser.username,
                email: unverifiedUser.email,
                password: unverifiedUser.password, // Password already hashed
                items: unverifiedUser.items
            });

            // Save the new verified user in the 'users' and delete in unverifed collection
            await verifiedUser.save();
            await unverified_users.deleteOne({ _id: userid });
            return { success: true, message: "Email verified successfully! Your account is now active." };
        } catch (error) {
            console.error("Error verifying email:", error);
            throw new Error("Internal Server Error");
        }
    }
}

class UserVerificationController {
    constructor() {
        this.userVerificationService = new UserVerificationService();
    }

    // Controller method for email verification
    async verifyEmail(req, res) {
        console.log(req.params);
        const userid = req.params.id;

        try {
            // Call the service to verify the email
            const result = await this.userVerificationService.verifyEmail(userid);
            if (result.success) {
                res.status(200).send({ message: result.message });
            } else {
                res.status(404).send({ message: result.message });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
}

module.exports = UserVerificationController;
