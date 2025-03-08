const mongoose = require('mongoose');
const {itemmodel} = require('./models/itemmodel'); // Load your model (update the path as necessary)

mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to the database.");

    // Perform the update operation
    updateItemsWithRandomDates();
  })
  //hi
  .catch(err => {
    console.error("Database connection error:", err);
  });

async function updateItemsWithRandomDates() {
  try {
    // Get all items
    const items = await itemmodel.find();

    // Loop through each item and update the `date` field
    for (const item of items) {
      const randomDays = Math.random() < 0.5 ? 4 : 2; // Randomly select 4 or 2 days
      const newDate = new Date(new Date().getTime() + randomDays * 24 * 60 * 60 * 1000);

      // Update the item in the database
      await itemmodel.updateOne(
        { _id: item._id }, // Find the item by its _id
        { $set: { date: newDate } } // Set the random date
      );
    }

    console.log("Items updated successfully.");
  } catch (err) {
    console.error("Error updating items:", err);
  } finally {
    mongoose.disconnect(); // Disconnect after the operation is complete
  }
}
