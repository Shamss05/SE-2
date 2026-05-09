# Eventify Frontend

Eventify is a React frontend for a Spring Boot microservices event management and booking platform. It supports event discovery, authentication, user bookings, notifications, profile pages, and admin management screens.

## Tech Stack

- React
- React Router
- Axios
- Vite
- Lucide React icons

## Run Locally

```bash
npm install
npm run dev
```

The app runs on the Vite dev server, usually at `http://localhost:5173`.

## Backend URL

Set the API base URL with an environment variable:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

If no backend is available yet, the frontend still renders useful mock-backed states for unfinished endpoints. API functions are already separated by domain so they can connect cleanly to the real Spring Boot services.

## Main Modules

- Authentication: register, login, profile, protected routes
- Event Management: catalog, event details, admin create/update/delete
- Booking Management: book events, view/cancel own bookings, admin booking monitor
- User Management: admin user list, role update, delete integration points
- Notifications: user notification page with read/unread states
