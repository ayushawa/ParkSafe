# 🚗 ParkSafe

ParkSafe is a full-stack MERN application that enables users to reserve parking slots online through a secure and user-friendly interface. The system provides real-time parking availability by detecting overlapping bookings and automatically calculates parking charges based on the selected booking duration.

---

## Features

### User
- User Registration and Login
- Secure JWT-based Authentication
- Browse Available Parking Locations
- View Real-Time Parking Availability
- Book Parking Slots for a Specific Time Duration
- Automatic Parking Charge Calculation
- View Booking History
- Cancel Existing Bookings

### Admin
- View All Bookings
- Initialize Parking Data for Development

---

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt.js

---

## Project Structure

```
backend/
├── config/
├── middleware/
├── models/
├── routes/
└── server.js

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── assets/
```

---

## Database Design

### User
- Name
- Email
- Password (Encrypted)
- Role

### Parking
- Parking Name
- Total Slots
- Price per Hour

### Booking
- Parking Location
- Start Time
- End Time
- Vehicle Number
- Total Price
- User ID

---

## Booking Workflow

The booking process follows the steps below:

1. Authenticate the user using JWT.
2. Validate the selected parking location.
3. Calculate booking duration.
4. Calculate the total parking cost.
5. Check for overlapping bookings made by the same user.
6. Calculate occupied parking slots for the selected time interval.
7. Confirm the booking only if parking slots are available.

---

## Security

- Passwords are encrypted using **bcrypt**.
- JWT-based authentication is used for protected routes.
- Protected APIs are secured using authentication middleware.

---

## Screenshots

### Login

<img width="1143" height="617" alt="image" src="https://github.com/user-attachments/assets/4054300a-d772-4341-84bd-93f40fca8c72" />


### Parking Dashboard

<img width="1893" height="867" alt="image" src="https://github.com/user-attachments/assets/61a22dce-ed04-488d-842a-24cb7fedc794" />


### Booking Page

<img width="1864" height="907" alt="image" src="https://github.com/user-attachments/assets/d6e738bd-74a9-4227-9a67-01c3773de48e" />


### My Bookings

<img width="1566" height="894" alt="image" src="https://github.com/user-attachments/assets/4d68dd30-f499-4c92-a755-bdd2177898ad" />


---

## Future Scope

- Admin Dashboard
- Online Payment Integration
- Email Notifications
- QR Code Based Entry
- Google Maps Integration
