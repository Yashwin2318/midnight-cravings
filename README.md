# Midnight Cravings 🌙

A student snack marketplace for late-night cravings. Built with React, Express, and Firebase.

## Features
- **Auth**: Firebase Email/Password login.
- **Listings**: Post snacks with price, quantity, and photo.
- **Browse**: Real-time feed of active snack listings.
- **Buy**: One-click buy with quantity selection and optional notes.
- **Pickup**: Real-time chat thread and buyer room info for coordination.
- **Dashboard**: Manage your listings and track incoming/outgoing orders.

## Tech Stack
- **Frontend**: React (Vite), Vanilla CSS (Glassmorphism), Lucide React.
- **Backend**: Node.js, Express, Firebase Admin SDK.
- **Database/Auth**: Firebase Firestore & Auth.

## Setup Instructions

### 1. Firebase Setup
- Create a new project in the [Firebase Console](https://console.firebase.google.com/).
- Enable **Authentication** (Email/Password).
- Enable **Cloud Firestore** and set up security rules.
- Create a Web App and copy the config.

### 2. Frontend Configuration
- Go to `client/`.
- Copy `.env.example` to `.env`.
- Fill in your Firebase Web App credentials.
- Run `npm install` and `npm run dev`.

### 3. Backend Configuration
- Go to `server/`.
- Create a service account in Firebase (Project Settings -> Service accounts).
- Generate a new private key and copy the JSON content.
- Copy `.env.example` to `.env`.
- Set `FIREBASE_SERVICE_ACCOUNT` to the stringified JSON of your service account key.
- Run `npm install` and `node index.js`.

## Deployment
- **Frontend**: Deploy `client/` to Vercel.
- **Backend**: Deploy `server/` to Railway.
