# FarmBnB Frontend

This is the frontend application for FarmBnB, an AirBnB-like property booking platform.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Configure your environment variables:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Build

Build for production:
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   ├── Navbar.tsx    # Navigation bar
│   └── PropertyCard.tsx
├── contexts/         # React contexts
│   └── AuthContext.tsx
├── hooks/           # Custom React hooks
├── lib/             # Utilities
│   ├── api.ts       # API client
│   └── utils.ts
├── pages/           # Page components
│   ├── admin/       # Admin pages
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Properties.tsx
│   └── PropertyDetails.tsx
└── integrations/    # Third-party integrations
```

## 🔧 Features

- ✅ User authentication (Login/Register)
- ✅ Property browsing with filters
- ✅ Property details and booking
- ✅ Admin dashboard
- ✅ Property management (CRUD)
- ✅ Booking management
- ✅ Responsive design
- ✅ Modern UI with animations

## 🔌 API Integration

The frontend uses a REST API client (`src/lib/api.ts`) that communicates with the backend Express server.

### Authentication

- Login: `POST /api/auth/login`
- Register: `POST /api/auth/register`
- Get current user: `GET /api/auth/me`

### Properties

- List: `GET /api/properties`
- Get one: `GET /api/properties/:id`
- Create: `POST /api/properties` (Admin)
- Update: `PUT /api/properties/:id` (Admin)
- Delete: `DELETE /api/properties/:id` (Admin)

### Bookings

- List: `GET /api/bookings`
- Create: `POST /api/bookings`
- Confirm: `PUT /api/bookings/:id/confirm` (Admin)
- Cancel: `PUT /api/bookings/:id/cancel`

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for component library
- Custom CSS animations and transitions
- Responsive design with mobile-first approach

## 📝 Environment Variables

- `VITE_API_URL` - Backend API URL
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key for payments

## 🛠️ Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Sonner (Toasts)

## 📄 License

ISC
