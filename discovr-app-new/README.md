# Discovr Frontend - Influencer Marketing Platform

A modern, monochromatic glassy-themed frontend application for the Discovr influencer marketing platform. Built with React, TypeScript, and Vite.

## 🎨 Design Philosophy

- **Monochromatic Glassy Theme**: Premium dark theme with glassmorphism effects
- **Smooth Animations**: Framer Motion-powered transitions and micro-interactions
- **User-Friendly**: Intuitive navigation and clear information hierarchy
- **Responsive**: Mobile-first design that works on all devices
- **Accessible**: WCAG compliant with proper semantic HTML

## 🚀 Features

### Landing Page
- Hero section with floating animated elements
- Brand waitlist form with validation
- Feature showcase with glassy cards
- Responsive navigation header

### Authentication Pages
- **Admin Login**: Email/password authentication for platform administrators
- **Brand Login**: Email/password authentication for brand accounts
- **Creator Login**: Instagram OAuth integration for content creators

### Dashboards (Coming Soon)
- Admin Dashboard: Manage brands, campaigns, and platform operations
- Brand Dashboard: Create and manage influencer campaigns
- Creator Dashboard: View campaigns, submit bids, upload content

## 📁 Project Structure

```
discovr-app-new/
├── public/
│   └── logo.png              # Discovr logo (white)
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Button.css
│   │   ├── Input.tsx
│   │   ├── Input.css
│   │   ├── Card.tsx
│   │   ├── Card.css
│   │   ├── Header.tsx
│   │   ├── Header.css
│   │   └── index.ts
│   ├── pages/                # Page components
│   │   ├── LandingPage.tsx
│   │   ├── LandingPage.css
│   │   ├── AdminLogin.tsx
│   │   ├── AdminLogin.css
│   │   ├── BrandLogin.tsx
│   │   ├── CreatorLogin.tsx
│   │   ├── CreatorLogin.css
│   │   └── index.ts
│   ├── App.tsx               # Main app with routing
│   ├── main.tsx              # Entry point
│   └── index.css             # Design system & global styles
├── index.html
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Framer Motion** - Animations (ready to integrate)
- **Firebase** - Authentication (ready to integrate)

## 🎯 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to the project directory
cd discovr-app-new

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🎨 Design System

### Color Palette
- **Background**: `#0a0a0a` (Primary), `#121212` (Secondary)
- **Glass Surface**: `rgba(255, 255, 255, 0.03)` with backdrop blur
- **Text**: White with varying opacity (100%, 70%, 50%, 30%)
- **Accent**: `#ffffff` (White)
- **Status Colors**: Success (`#4ade80`), Warning (`#fbbf24`), Error (`#f87171`)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Sizes**: 0.75rem to 4.5rem (responsive)
- **Weights**: 300 (Light) to 700 (Bold)

### Spacing System
- Based on 0.25rem increments
- Consistent padding and margins throughout

### Components

#### Button
- **Variants**: Primary, Secondary, Outline, Ghost
- **Sizes**: Small, Medium, Large
- **Features**: Loading states, icons, full-width option

#### Input
- **Features**: Labels, error states, helper text, icons
- **Types**: Text, Email, Password, TextArea

#### Card
- **Features**: Glassmorphism, hover effects, modular sections
- **Sections**: Header, Body, Footer

#### Header
- **Features**: Transparent/solid modes, scroll-based effects
- **Navigation**: Logo, navigation links

## 🔗 Backend Integration

The frontend is designed to integrate with the Discovr backend API. Key integration points:

### Authentication
- **Admin/Brand**: `POST /auth/login` with email/password
- **Creator**: OAuth redirect to `/integrations/instagram/connect`

### Brand Waitlist
- **Endpoint**: `POST /api/waitlist` (to be implemented)
- **Payload**: `{ brandName, contactName, email, website }`

### Future Integrations
- Campaign management endpoints
- Creator bidding workflow
- Content review system
- Payment processing

## 📱 Routes

- `/` - Landing page
- `/admin/login` - Admin authentication
- `/brand/login` - Brand authentication  
- `/creator/login` - Creator authentication (Instagram OAuth)
- `/admin/dashboard` - Admin dashboard (coming soon)
- `/brand/dashboard` - Brand dashboard (coming soon)
- `/creator/dashboard` - Creator dashboard (coming soon)

## 🎭 Animations

The application uses CSS animations for smooth transitions:

- **fadeIn**: Entrance animation for content
- **slideInLeft/Right**: Directional slide animations
- **scaleIn**: Scale-based entrance
- **float**: Continuous floating motion
- **shimmer**: Hover shimmer effect
- **pulse**: Pulsing animation

## 🔒 Security Features

- Input validation on all forms
- HTTPS-only in production
- Secure token storage (localStorage/sessionStorage)
- CORS configuration for API calls
- XSS protection through React

## 📊 Performance

- Code splitting with React Router
- Lazy loading for routes
- Optimized images
- Minimal bundle size
- Fast initial load time

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔑 Demo Credentials

For testing purposes, demo credentials are displayed on each login page. See [DEMO_CREDENTIALS.md](./DEMO_CREDENTIALS.md) for a complete list.

**Quick Reference:**
- **Admin:** `admin@discovr.com` / `admin123`
- **Brand:** `brand@discovr.com` / `brand123`
- **Creator:** `creator@discovr.com` / `creator123`

> ⚠️ **Note:** These accounts need to be created in Firebase and the backend before use.

## 📝 TODO

- [x] Implement Firebase authentication
- [x] Create Admin Dashboard
- [x] Create Brand Dashboard  
- [x] Create Creator Dashboard
- [ ] Add form validation library (React Hook Form)
- [x] Integrate with backend API
- [ ] Add error boundary
- [ ] Implement toast notifications
- [x] Add loading states
- [x] Create protected routes
- [ ] Add analytics tracking

## 🤝 Contributing

This is a private project for Discovr. For questions or issues, contact the development team.

## 📄 License

Proprietary - All rights reserved by Discovr

---

**Built with ❤️ by the Discovr Team**
