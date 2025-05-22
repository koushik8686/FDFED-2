🛒 Real-Time Auction Platform
📌 Overview
This is a real-time auction web application that allows users to bid on items dynamically, with role-based access for users, sellers, and administrators. It features real-time updates using WebSocket technology, a secure email verification process, and a clean architecture with separate front-end and back-end services.

🚀 Features
👥 Users
Browse available auction items.

Place live bids with real-time updates.

🛍️ Sellers
List new items for auction.

Manage and monitor their listed items.

🔧 Admin
Manage users and sellers.

Monitor ongoing auctions and system activity.

⚡ Real-Time Bidding
Live bid updates powered by Socket.IO for instant feedback and interaction.

🔐 Email Verification
Secure sign-up process with OTP-based email verification to ensure authenticity.

🛠️ Technology Stack
Frontend: React.js

Backend: Node.js, Express.js

Database: MongoDB

Real-Time Communication: Socket.IO

🧰 Getting Started
📋 Prerequisites
Ensure the following are installed and configured:

Node.js (v14 or above)

MongoDB (local instance or MongoDB Atlas)

### Steps to Run:

#### 1. Clone the Repository:-
```bash
git clone <repository_url>
cd <repository_folder>
```

#### 2. Setup Frontend:-
```bash
cd frontend
npm install
npm start
```
Frontend will be available at `http://localhost:3000`.

#### 3. Setup Backend:
```bash
cd backend
npm install
node index.js
```

Backend will be available at `http://localhost:4000`.

To run it using docker run the following command:-
```bash
docker-compose down -v && docker-compose up --build
```

### Note:
Ensure MongoDB is running locally or update the connection string in the backend configuration to point to your MongoDB instance.

## License:
This project is licensed under the MIT License.
