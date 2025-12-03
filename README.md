# Leap Ticketing System

A modern, full-stack ticketing system built with Spring Boot and Next.js.

## 🚀 Tech Stack

- **Backend**: Java 17, Spring Boot 3.4, Spring Security, Spring Data JPA
- **Database**: PostgreSQL
- **Frontend**: Next.js 14 (App Router), TypeScript, CSS Modules
- **Containerization**: Docker, Docker Compose

## ✨ Features

### Phase 1: Core Functionality
- **User Authentication**: Role-based access control (Admin, Support Agent, User).
- **Ticket Management**: Create, view, update, and close tickets.
- **Comments**: Add comments to tickets for collaboration.
- **Dashboard**: View all tickets with status indicators.
- **Admin Panel**: User management (view and delete users).

### Phase 2: Advanced Features
- **Search & Filter**: Filter tickets by status, priority, and search by subject.
- **Ticket Prioritization**: Support for LOW, MEDIUM, HIGH, and URGENT priorities.
- **File Attachments**: Upload and download files for tickets.
- **Email Notifications**: Automated email logs for ticket creation, status updates, and assignment.
- **Ticket Resolution Rating**: Users can rate the resolution of their tickets (1-5 stars).

## 🛠️ Setup & Installation

### Prerequisites
- Docker & Docker Compose
- Java 17+ (for local backend dev)
- Node.js 18+ (for local frontend dev)

### Quick Start (Docker)

The easiest way to run the application is using Docker Compose.

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leap
   ```

2. **Start the services**
   ```bash
   docker-compose up --build
   ```
   This will start:
   - **PostgreSQL** on port `5432`
   - **Backend Server** on port `8080`

3. **Start the Frontend**
   Open a new terminal and run:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

### Manual Setup

#### Backend
1. Navigate to the `server` directory.
2. Update `application.properties` if not using Docker (e.g., localhost DB).
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

#### Frontend
1. Navigate to the `client` directory.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## 🔑 Default Credentials

The system is initialized with the following demo accounts:

| Role          | Username | Password |
|---------------|----------|----------|
| **Admin**     | admin    | admin    |
| **User**      | user     | user     |
| **Agent**     | agent    | agent    |

## 📝 API Documentation

The backend exposes a RESTful API at `http://localhost:8080/api`.
- `GET /api/tickets`: List tickets
- `POST /api/tickets`: Create ticket
- `GET /api/tickets/{id}`: Get ticket details
- `POST /api/tickets/{id}/attachments`: Upload attachment
- `POST /api/tickets/{id}/rate`: Rate resolution

## 🧪 Running Tests

To run backend tests:
```bash
cd server
./mvnw test
```
