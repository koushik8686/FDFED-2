const User = require('./models/sellermodel')
const mongoose = require('mongoose')

async function addSoldItem() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://koushik:koushik@cluster0.h2lzgvs.mongodb.net/fdfed").then(()=>{
      console.log("MongoDB Connected ")
    });

    // New sold item object
    const soldItems = [
      {
        "name": "Vintage Clock",
        "person": "Ravi",
        "pid": "681772a3da9887306200462d",
        "url": "https://res.cloudinary.com/desncpevo/image/upload/v1746445420/FDFED/nv…",
        "base_price": 1500,
        "current_bidder": "Ravi",
        "current_bidder_id": "6818c2e3728ad3b9337a3ab9",
        "current_price": "5000",
        "type": "Antique",
        "auction_active": false,
        "date": "2025-01-15",
        "StartTime": "2025-01-15T10:00:00",
        "EndTime": "2025-01-15T16:00:00",
        "visited_users": [],
        "auction_history": []
      },
      {
        "name": "Canvas Painting",
        "person": "Sneha",
        "pid": "681772a3da9887306200462d",
        "url": "https://res.cloudinary.com/desncpevo/image/upload/v1746445420/FDFED/nv…",
        "base_price": 3000,
        "current_bidder": "Sneha",
        "current_bidder_id": "6818d5c3721cd3b9337c4ca1",
        "current_price": "9000",
        "type": "Art",
        "auction_active": false,
        "date": "2025-03-10",
        "StartTime": "2025-03-10T14:30:00",
        "EndTime": "2025-03-10T20:30:00",
        "visited_users": [],
        "auction_history": []
      },
      {
        "name": "Abstract Art Piece",
        "person": "Ananya",
        "pid": "681772a3da9887306200462d",
        "url": "https://res.cloudinary.com/desncpevo/image/upload/v1746445420/FDFED/nv…",
        "base_price": 2000,
        "current_bidder": "Ananya",
        "current_bidder_id": "6818e6a3729dd3b9337d6de2",
        "current_price": "6500",
        "type": "Art",
        "auction_active": false,
        "date": "2025-02-20",
        "StartTime": "2025-02-20T11:00:00",
        "EndTime": "2025-02-20T17:00:00",
        "visited_users": [],
        "auction_history": []
      },
      {
        "name": "Antique Pocket Watch",
        "person": "Vikram",
        "pid": "681772a3da9887306200462d",
        "url": "https://res.cloudinary.com/desncpevo/image/upload/v1746445420/FDFED/nv…",
        "base_price": 2500,
        "current_bidder": "Vikram",
        "current_bidder_id": "6818f7b372aed3b9337e7ef3",
        "current_price": "7800",
        "type": "Antique",
        "auction_active": false,
        "date": "2025-04-05",
        "StartTime": "2025-04-05T13:00:00",
        "EndTime": "2025-04-05T19:00:00",
        "visited_users": [],
        "auction_history": []
      },
      {
        "name": "Vintage Typewriter",
        "person": "Meera",
        "pid": "681772a3da9887306200462d",
        "url": "https://res.cloudinary.com/desncpevo/image/upload/v1746445420/FDFED/nv…",
        "base_price": 3500,
        "current_bidder": "Meera",
        "current_bidder_id": "681908c372bfd3b9337f8f04",
        "current_price": "10000",
        "type": "Antique",
        "auction_active": false,
        "date": "2025-05-12",
        "StartTime": "2025-05-12T15:00:00",
        "EndTime": "2025-05-12T21:00:00",
        "visited_users": [],
        "auction_history": []
      },
      {
        "name": "Antique Camera",
        "person": "Arjun",
        "pid": "681772a3da9887306200462d",
        "url": "https://res.cloudinary.com/desncpevo/image/upload/v1746445420/FDFED/nv…",
        "base_price": 4000,
        "current_bidder": "Arjun",
        "current_bidder_id": "681919d372c0d3b933800015",
        "current_price": "11500",
        "type": "Antique",
        "auction_active": false,
        "date": "2025-01-25",
        "StartTime": "2025-01-25T12:00:00",
        "EndTime": "2025-01-25T18:00:00",
        "visited_users": [],
        "auction_history": []
      },
      {
        "name": "Gaming Console (Used)",
        "person": "Tarun",
        "pid": "681772a3da9887306200462d",
        "url": "https://res.cloudinary.com/desncpevo/image/upload/v1746445420/FDFED/nv…",
        "base_price": 2000,
        "current_bidder": "Tarun",
        "current_bidder_id": "68192ae372d1d3b933811126",
        "current_price": "3500",
        "type": "Used",
        "auction_active": false,
        "date": "2025-04-22",
        "StartTime": "2025-04-22T12:00:00",
        "EndTime": "2025-04-22T18:00:00",
        "visited_users": [],
        "auction_history": []
      },
    ]
    
    // Update user document and push the sold item
    const user = await User.findById("681772a3da9887306200462d");

    // If the user does not exist, log and return
    if (!user) {
      console.log("User not found.");
      return;
    }

    // Step 2: Push the new sold item into the solditems array
    user.solditems.push(...soldItems);
    // Step 3: Save the updated user back to the database
    const result = await user.save();

  } catch (err) {
    console.error("Error adding sold item:", err);
  } finally {
    mongoose.disconnect();
  }
}

addSoldItem();