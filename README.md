# Vite Dashboard

A modern cryptocurrency dashboard built with React, Vite, and Material-UI.

## Project Overview

This project is a cryptocurrency dashboard that provides real-time data visualization and market analysis. It's built using modern web technologies and follows best practices for React development.

## Tech Stack

### Core Technologies

- **React 18**: Frontend framework
- **Vite**: Build tool and development server
- **React Router v6**: Client-side routing
- **Axios**: HTTP client for API requests

### UI Libraries

- **Chakra UI**: Primary UI component library
- **Material-UI**: Secondary UI components and charts
- **Framer Motion**: Animation library
- **@mui/x-charts**: Advanced charting components

### Development Tools

- **ESLint**: Code linting
- **Vitest**: Testing framework
- **Testing Library**: React component testing

## Project Structure

```
src/
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable React components
│   ├── charts/     # Chart components
│   ├── cryptocurrency/ # Crypto-specific components
│   ├── layout/     # Layout components
│   └── sections/   # Page sections
├── config/         # Configuration files
├── middleware/     # Custom middleware
├── services/       # API services and utilities
├── theme/          # Theme configuration
├── App.jsx         # Main application component
└── main.jsx        # Application entry point
```

## Key Features

### Data Visualization

- Interactive line charts for price history
- Real-time market data updates
- Responsive chart layouts for mobile and desktop

### Security

- API key management through environment variables
- Secure data fetching with Axios
- Error handling and rate limiting

### Performance

- Code splitting for optimized loading
- Responsive design for all screen sizes
- Efficient data caching

## Data Flow

1. **API Integration**

   - CoinGecko API for cryptocurrency data
   - Environment variables for API keys
   - Axios for HTTP requests

2. **State Management**

   - React hooks for local state
   - Context API for global state
   - Custom hooks for data fetching

3. **Component Architecture**
   - Presentational components for UI
   - Container components for data handling
   - Reusable chart components

## Theme System

The application uses a dual theme system:

- **Chakra UI Theme**: Primary theme for UI components
- **Material-UI Theme**: Secondary theme for charts and specific components

Theme configuration is located in `src/theme/`:

- `colors.js`: Color palette definitions
- `muiTheme.js`: Material-UI theme configuration

## Development

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your API keys
4. Start the development server:
   ```bash
   npm run dev
   ```

### Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm test`: Run tests
- `npm run test:coverage`: Run tests with coverage
- `npm run test:ui`: Run tests with UI

## Testing

The project uses Vitest and Testing Library for testing:

- Component testing
- API integration testing
- UI interaction testing

## Best Practices

1. **Code Organization**

   - Component-based architecture
   - Separation of concerns
   - Reusable components

2. **Performance**

   - Lazy loading
   - Code splitting
   - Efficient data fetching

3. **Security**

   - Environment variables for sensitive data
   - API rate limiting
   - Error handling

4. **Accessibility**
   - ARIA attributes
   - Keyboard navigation
   - Screen reader support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
