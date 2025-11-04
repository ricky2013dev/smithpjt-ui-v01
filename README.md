# Members Management UI

A modern React + TypeScript application for managing members with a clean, responsive interface.

## Features

- 🎨 Dark mode support with Tailwind CSS
- 📱 Responsive split-view layout
- 🔍 Search and filter functionality
- 👤 Member list with detailed profiles
- ⚡ Built with Vite for fast development

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Google Fonts (Inter & Material Symbols)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
uimock-v1/
├── src/
│   ├── components/
│   │   └── MembersManagement.tsx  # Main component
│   ├── App.tsx                     # App wrapper
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── index.html                      # HTML template
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite configuration
```

## Customization

### Tailwind Theme

The custom color palette and theme settings are defined in `tailwind.config.js`:

- Primary color: `#135bec`
- Status colors: green, orange, red
- Light/dark mode variants for all components

### Adding Members

Edit the `members` array in `src/components/MembersManagement.tsx` to add or modify member data.

## License

Private project
