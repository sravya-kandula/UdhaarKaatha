# Udhaar Kaatha Backend

## Overview

The backend is developed using Node.js, Express.js, and MongoDB. It handles authentication, customer management, transaction processing, notifications, and Razorpay payment integration.

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcryptjs

### Customer Management
- Add Customer
- Update Customer
- Manage Customer Balance
- Manage Udhaar Limits

### Transaction Management
- Add Transaction
- Record Payment
- Customer Ledger
- Transaction History
- Fine Calculation

### Payment Integration
- Create Razorpay Order
- Verify Razorpay Payment
- Update Customer Balance
- Create Payment Transaction

### Notification System
- Udhaar Notifications
- Payment Notifications
- Customer Alerts

### Dashboard APIs
- Customer Dashboard Data
- Shopkeeper Dashboard Data
- Transaction Summary
- Payment Summary

## Project Flow

Request
↓
Routes
↓
Controllers
↓
MongoDB Database
↓
Response

## Database Collections

### Users
Stores:
- Name
- Email
- Phone
- Password
- Role

### Customers
Stores:
- Customer Details
- Current Balance
- Udhaar Limit
- Fine Amount
- Due Date

### Transactions
Stores:
- Purchases
- Payments
- Remaining Balance
- Status

### Notifications
Stores:
- Alerts
- Payment Updates
- Udhaar Updates

## Packages Used

```bash
express
mongoose
dotenv
cors
bcryptjs
jsonwebtoken
razorpay
nodemon
```

## Security Features

- JWT Authentication
- Password Encryption
- Protected Routes
- Role-Based Authorization

## APIs

### Auth APIs
- Register User
- Login User

### Customer APIs
- Add Customer
- Get Customers
- Update Customer

### Transaction APIs
- Add Transaction
- Record Payment
- Get Ledger
- Get Customer Transactions

### Payment APIs
- Create Order
- Verify Payment

### Notification APIs
- Create Notification
- Get Notifications

## Environment Variables

```env
PORT=
MONGO_URI=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

## Deployment

Platform: Render

Database: MongoDB Atlas

## Developer

Kandula Sravya
