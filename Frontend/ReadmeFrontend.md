# Udhaar Kaatha Frontend

## Overview
The frontend is developed using React.js and Tailwind CSS. It provides separate dashboards for Shopkeepers and Customers to manage Udhaar records, transactions, payments, and notifications through an intuitive user interface.

## Features

### Authentication
- User Registration
- User Login
- JWT Token Storage
- Role-Based Access

### Shopkeeper Module
- Dashboard Overview
- Add Customers
- View Customer List
- Add Transactions
- Manage Udhaar Records
- Record Payments
- View Customer Ledger
- Notification Management

### Customer Module
- Dashboard Overview
- View Pending Udhaar
- View Shop-wise Balances
- View Total Paid Amount
- View Fine Amount
- Online Payment via Razorpay
- Payment Status Tracking

### UI Features
- Responsive Design
- Modern Dashboard Layout
- Dynamic Cards
- Real-Time Data Fetching
- Loading Indicators
- Alert Messages

## Project Flow

Login/Register
↓
Dashboard
↓
Fetch Data from Backend APIs
↓
Display Customers / Transactions
↓
Perform Operations
↓
Update UI

## Packages Used

```bash
react
react-dom
react-router-dom
axios
react-icons
tailwindcss
@tailwindcss/vite
```

## API Integration

Axios Instance:
- Automatic Token Attachment
- Backend Communication
- Error Handling

## Environment Variables

```env
VITE_RAZORPAY_KEY_ID=your_key
```

## Deployment

Platform: Vercel

## Developer

Kandula Sravya
