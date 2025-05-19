# Vite Dashboard

A modern cryptocurrency dashboard built with React, Vite, and Chakra UI. This project demonstrates advanced frontend development practices, including data visualization, responsive design, and mock data handling for development.

## 🚀 Features

- **Real-time Price Charts**: Interactive price charts with multiple time ranges (24h, 7d, 30d, 90d, 1y)
- **Mock Data System**: Complete mock data system for development without API limits
- **Responsive Design**: Beautiful UI that works on all screen sizes
- **Dark/Light Mode**: Full theme support with Chakra UI
- **Performance Optimized**: Efficient rendering and data management

## 🛠️ Tech Stack

### Core Technologies

- **React 18**: Frontend framework
- **Vite**: Build tool and development server
- **React Router v6**: Client-side routing
- **Chakra UI**: UI component library
- **Recharts**: Charting library for data visualization

### Development Tools

- **ESLint**: Code linting
- **Mock Data System**: Local data generation for development

## Project Structure

```
src/
├── components/     # Reusable React components
├── context/        # React context providers
├── pages/         # Page components
├── services/      # API services and utilities
└── App.jsx        # Main application component
```

## Key Features

### Data Visualization

- Interactive line charts for price history
- Multiple time range support (24h, 7d, 30d, 90d, 1y)
- Responsive chart layouts
- Price change indicators with color coding
- Current price reference line

### Mock Data System

The project includes a sophisticated mock data system for development:

- **Realistic Price Generation**: Simulates realistic price movements with configurable volatility
- **Time-based Data**: Generates data points for any time range
- **Multiple Coins**: Support for Bitcoin and Ethereum with realistic market data
- **Automatic Fallback**: Falls back to mock data when API limits are reached

### Theme System

- **Chakra UI Theme**: Primary theme for all UI components
- **Dark/Light Mode**: Full theme support with automatic system preference detection
- **Custom Chart Styling**: Tailored styles for Recharts components

## Development

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint

## Future Improvements

### Feature Additions

- Add more detailed coin information
- Implement price alerts and notifications
- Add comparison charts between different coins
- Include trading volume data

### User Experience

- Add loading skeletons for better perceived performance
- Implement error boundaries for better error handling
- Add tooltips with more detailed information
- Improve mobile responsiveness

### Technical Improvements

- Implement TypeScript support
- Add comprehensive test coverage
- Set up CI/CD pipeline
- Add performance monitoring

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
