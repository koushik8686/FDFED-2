# Auction Project

## Overview
This project is a real-time auction platform with the following key features:

### Features
- **Users**
  - Browse auction items.
  - Place bids in real-time.

- **Sellers**
  - List items for auction.
  - View and manage listed items.

- **Admin**
  - Manage users and sellers.
  - Monitor ongoing auctions.

- **Real-Time Bidding**
  - Bids are updated in real-time using WebSocket technology.

- **Email Verification**
  - Secure registration process with email verification.

## Technology Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-Time Communication**: Socket.IO

## Setup and Run Instructions

### Prerequisites
- Node.js installed
- MongoDB server running

### Steps to Run

#### 1. Clone the Repository
```bash
git clone <repository_url>
cd <repository_folder>
```

#### 2. Setup Frontend
```bash
cd frontend
npm install
npm start
```
Frontend will be available at `http://localhost:3000`.

#### 3. Setup Backend
```bash
cd backend
npm install
node index.js
```
Backend will be available at `http://localhost:4000`.

### Note
Ensure MongoDB is running locally or update the connection string in the backend configuration to point to your MongoDB instance.
