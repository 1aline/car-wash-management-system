# Car Washing Sales Management System (CWSMS)

This workspace contains:

- `backend-project`: Node.js + Express + MongoDB + session login
- `frontend-project`: React + Tailwind CSS + Axios

## Features implemented

- Session-based login (`username` + `password`)
- Forms/pages: Car, Packages, ServicePackage, Payment, Reports, Logout
- Insert on all forms
- Update/Delete/Retrieve on ServicePackage form
- Bill generation by service record
- Daily report with `PlateNumber`, `PackageName`, `PackageDescription`, `AmountPaid`, `PaymentDate`
- Responsive UI using Tailwind utility classes

## Authentication

- Register a new account from the login screen.
- Use the same credentials to log in.

## Backend setup

1. Open terminal in `backend-project`
2. Copy `.env.example` to `.env`
3. Ensure MongoDB is running
4. Run:

```bash
npm install
npm run start
```

Backend runs at `http://localhost:5000`.

## Frontend setup

1. Open terminal in `frontend-project`
2. Run:

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Exam folder naming

To match exam instruction, place/copy this project folder inside:

`FirstName_LastName_National_Practical_Exam_2025`
