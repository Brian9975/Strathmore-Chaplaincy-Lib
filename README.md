
# Strathmore Chaplaincy Library Management System

A web-based library management system built for Strathmore University Chaplaincy to simplify book management, borrowing, returns, and availability tracking.

**[View Live Application](https://strathmore-chaplaincy-library-system.vercel.app/)**

> Access is restricted to authorized administrators. Public registration is not available.

## Overview

The Strathmore Chaplaincy Library Management System helps administrators manage library books and track borrowing activity through a centralized dashboard. It provides a structured way to maintain book records, monitor availability, and manage library operations.

The system supports over 166 books across three administrator accounts, with permissions designed around different administrative responsibilities.

## Features

- **Book Management:** Add, view, and update book records.
- **Borrowing and Returns:** Record borrowing activity and manage book returns.
- **Availability Tracking:** Monitor which books are available and which are borrowed.
- **Search:** Find books quickly using the search functionality.
- **Role-Based Access:** Different permissions for main administrators and ordinary administrators.
- **Administrator Management:** The main administrator can create and manage administrator accounts.
- **Protected Routes:** Restrict access to authorized administrators.
- **Firebase Authentication:** Authenticate administrators.
- **Cloud Database:** Store and retrieve library data using Cloud Firestore.

## Screenshots

### 1. Login Page


![Login Page](https://github.com/user-attachments/assets/782eb0ed-84b7-4b85-ab52-ba9ba26ab86c)

### 2. Dashboard

![Dashboard](https://github.com/user-attachments/assets/157fce72-d0c8-4182-9472-7e1977c43dab)

### 3. Book Details

![Library records](https://github.com/user-attachments/assets/a18dc3f4-3553-494d-a7f5-859635e0a6d7)

### 4. Library Records

![Book details](https://github.com/user-attachments/assets/95f4987b-1428-463e-a72e-28975fc37f79)

###5. Return Management

![Return management](https://github.com/user-attachments/assets/be9caf88-8255-46eb-ac52-55b660fd133f)

### 6. Transaction History

![Transaction History](https://github.com/user-attachments/assets/d8ac6464-6ae0-4f36-8563-dd0a678ef6eb)

### 7. Administrator Interface

![Administrator interface](https://github.com/user-attachments/assets/1fe11f4c-d8e0-4c9d-9e3a-558d55c93aef)

### 8. Additional library view
![Additional library view](https://github.com/user-attachments/assets/34a11003-d891-4af5-92cd-9ebf02dca52d)

### 10. Light Mode

![Application interface](https://github.com/user-attachments/assets/dc63b52d-c19e-4a92-a458-72223108b0bb)

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js and npm
- A Firebase project
- Basic knowledge of React and TypeScript

### 1. Clone the Repository

```bash
git clone https://github.com/Brian9975/Strathmore-Chaplaincy-Lib.git
cd Strathmore-Chaplaincy-Lib
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

Create or use a Firebase project that you control. Enable **Email/Password Authentication** and **Cloud Firestore** in the Firebase Console.

Create a `.env.local` file in the root directory and add your Firebase web app configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the placeholder values with the configuration from your own Firebase project. Do not commit your local environment file.

The application uses Firebase configuration files for its primary and secondary Firebase instances. Configure both instances according to the project's existing setup, using your own Firebase project configuration.

### 4. Create the Main Administrator

The application does not provide public administrator registration. To configure your own test environment:

1. Open Firebase Console and navigate to **Authentication**.
2. Create an administrator account using the Email/Password provider.
3. Copy the new user's UID.
4. Open **Firestore Database** and create a collection named `users`.
5. Create a document whose document ID exactly matches the administrator's UID.
6. Add the following fields:

| Field | Type | Value |
|---|---|---|
| `createdAt` | Timestamp | Current timestamp |
| `email` | String | Administrator's email |
| `name` | String | Administrator's name |
| `role` | String | `main_admin` |

The application uses the corresponding user document to identify the administrator's role.

### 5. Run the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

## Project Structure

```text
Strathmore-Chaplaincy-Lib/
├── public/
├── src/
│   ├── lib/
│   │   ├── firebase-config.ts
│   │   └── sec-firebase-config.ts
│   └── ...
├── .env.local
├── package.json
├── vite.config.ts
└── README.md
```

*The structure above highlights selected files and directories.*

## Purpose

This project was developed to support the day-to-day library operations of Strathmore University Chaplaincy by bringing book records, borrowing activity, and administrator workflows into one application.

## Author

**Brian Kariuki**

- GitHub: [Brian9975](https://github.com/Brian9975)
- Live Application: [Strathmore Chaplaincy Library Management System](https://strathmore-chaplaincy-library-system.vercel.app/)
