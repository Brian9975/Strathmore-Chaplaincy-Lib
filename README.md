
# Strathmore Chaplaincy Library Management System

A library management web application developed for **Strathmore University Chaplaincy** to replace manual Excel-based book tracking with a centralized digital system.

The application simplifies book cataloguing, borrowing, returns, and availability tracking while providing different levels of access for library administrators.

**[Live Application](https://strathmore-chaplaincy-library-system.vercel.app/)** · **Admin Access Only**

> **Note:** This is a live internal application. Access is restricted to authorized administrators. Developers who wish to explore the system can follow the local setup instructions below using their own Firebase project and test data.

## Features

- **Book Management:** Add, edit, search, and manage library books.
- **Borrowing & Returns:** Record book checkouts, borrower information, and returns.
- **Availability Tracking:** Monitor which books are available or borrowed.
- **Role-Based Access:** Separate `main_admin` and `admin` roles with different permissions.
- **Admin Management:** Main administrators can create additional administrator accounts and delete books.
- **Authentication:** Firebase Authentication with protected application routes.

## Technologies Used

- **React & TypeScript** — Frontend application development
- **Vite** — Development server and build tooling
- **Tailwind CSS & shadcn/ui** — Styling and UI components
- **Lucide React** — Icons
- **React Router DOM** — Client-side navigation
- **Firebase Authentication** — Administrator authentication
- **Cloud Firestore** — Book, borrowing, and administrator data

## Screenshots

### 1. Login Page


![Login Page](https://github.com/user-attachments/assets/782eb0ed-84b7-4b85-ab52-ba9ba26ab86c)

### 2. Dashboard

![Dashboard](https://github.com/user-attachments/assets/157fce72-d0c8-4182-9472-7e1977c43dab)

### 3. Book Details

![Library records](https://github.com/user-attachments/assets/a18dc3f4-3553-494d-a7f5-859635e0a6d7)

### 4. Library Records

![Book details](https://github.com/user-attachments/assets/95f4987b-1428-463e-a72e-28975fc37f79)

### 5. Return Management

![Return management](https://github.com/user-attachments/assets/be9caf88-8255-46eb-ac52-55b660fd133f)

### 6. Transaction History

![Transaction History](https://github.com/user-attachments/assets/d8ac6464-6ae0-4f36-8563-dd0a678ef6eb)

### 7. Administrator Interface

![Administrator interface](https://github.com/user-attachments/assets/1fe11f4c-d8e0-4c9d-9e3a-558d55c93aef)

### 8. Additional library view
![Additional library view](https://github.com/user-attachments/assets/34a11003-d891-4af5-92cd-9ebf02dca52d)

### 10. Light Mode

![Application interface](https://github.com/user-attachments/assets/dc63b52d-c19e-4a92-a458-72223108b0bb)


## Getting Started

To run the application locally, you'll need Node.js, npm, and a Firebase project.

### 1. Clone the repository

```bash
git clone https://github.com/Brian9975/Strathmore-Chaplaincy-Lib.git
cd Strathmore-Chaplaincy-Lib
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a new project in the [Firebase Console](https://console.firebase.google.com/).

- Register a web application.
- Enable **Authentication** with the Email/Password sign-in provider.
- Create a **Cloud Firestore** database.
- Configure appropriate Firestore security rules for your test project.

Create a `.env.local` file in the project's root directory and add your own Firebase configuration:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

The application initializes Firebase through:

- `src/lib/firebase-config.ts` — Primary Firebase instance
- `src/lib/sec-firebase-config.ts` — Secondary Firebase instance used for creating administrator accounts without interrupting the current session

Both configurations use the environment variables above.

### 4. Create the first administrator

The initial main administrator must be created manually before accessing the dashboard.

**In Firebase Authentication:**

1. Open **Authentication → Users**.
2. Add a user with an email address and password.
3. Copy the newly created user's UID.

**In Cloud Firestore:**

1. Create a collection named `users`.
2. Add a document using the copied UID as its document ID.
3. Add the following fields:

| Field | Type | Example |
|-------|------|---------|
| `name` | string | Demo Admin |
| `email` | string | admin@example.com |
| `role` | string | main_admin |
| `createdAt` | timestamp | Current date and time |

The application uses the authenticated user's UID to retrieve their Firestore document and determine their assigned role.

After signing in as `main_admin`, additional administrator accounts can be created through the application's interface.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal, typically:

`http://localhost:5173`

Sign in using the main administrator credentials created during setup.

Never commit `.env.local`, administrator passwords, or real institutional records to the repository.

---

**Developed by [Brian Kariuki](https://brian-kariuki.vercel.app/).**

