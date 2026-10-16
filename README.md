# goRoute - Premium Bus Journeys

A responsive bus-booking demo built with React and Vite. Search routes, compare sample operators and fares, select seats, enter passenger details, and view a demo ticket.

## Features

- Search by departure city, destination, and journey date.
- Browse sample operators including Zingbus and AbhiBus.
- Filter by bus type, price, and rating; sort by price, departure, duration, or rating.
- Select seats and review the fare before entering passenger details.
- View a demo ticket after completing the booking flow.
- Copy sample coupon codes from the offers section.
- Responsive layout for desktop and mobile.
- Site footer with Contact, About us, and Travel help links.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Vite prints the local URL in the terminal.

## Available Commands

```bash
npm run dev      # Start the development server
npm run lint     # Run ESLint
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
```

## Project Structure

- `src/App.jsx` - Search, results, seat selection, passenger details, and confirmation flow.
- `src/App.css` - Application layout and responsive styles.
- `src/index.css` - Global styles and typography.
- `public/favicon.svg` - goRoute bus favicon.

## Demo Data

This project is a front-end demo. Bus operators, schedules, seat availability, fares, and ticket confirmations are local sample data; there is no booking API or payment processing. Coupon codes can be copied, but discounts are not applied to fares. The login form is also a UI demo and does not create an account.