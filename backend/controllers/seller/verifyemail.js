const unverified_sellers = require('../../models/unverifiedsellers');
const sellers = require('../../models/sellermodel');

class UserVerificationService {
    async verifyEmail(sellerid) {
        try {
            // Search for the user in unverified sellers
            const unverifiedUser = await unverified_sellers.findOne({ _id:sellerid});
            if (!unverifiedUser) {
                return { success: false, message: "User not found or already verified" };
            }
            // Create a new verified user with the data from the unverified user
            const verifiedUser = new sellers({
                name: unverifiedUser.name,
                email: unverifiedUser.email,
                password: unverifiedUser.password,
                phone: unverifiedUser.phone, // Password already hashed
                items: unverifiedUser.items
            });
            console.log(unverifiedUser , verifiedUser);
            // Save the new verified user in the 'sellers' and delete in unverifed collection
            await verifiedUser.save();
            await unverified_sellers.deleteOne({ _id:sellerid});
            return { success: true, message: "Email verified successfully! Your account is now active." };
        } catch (error) {
            console.error("Error verifying email:", error);
            throw new Error("Internal Server Error");
        }
    }
}

class SellerVerificationController {
    constructor() {
        this.SellerVerificationClass = new UserVerificationService();
    }

    // Controller method for email verification
    async verifyEmail(req, res) {
        console.log(req.params);
        const sellerid = req.params.id;
        try {
            // Call the service to verify the email
            const result = await this.SellerVerificationClass.verifyEmail(sellerid);
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

module.exports = SellerVerificationController;
