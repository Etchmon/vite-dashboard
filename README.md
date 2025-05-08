# Vite Dashboard

A modern cryptocurrency dashboard built with React, Vite, and Chakra UI.

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
- **Recharts**: Charting library for data visualization
- **Framer Motion**: Animation library

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

- Interactive area charts for price history
- Weekly price data visualization
- Responsive chart layouts for mobile and desktop
- Price change indicators with color coding

### Security

- API key management through environment variables
- Secure data fetching with Axios
- Error handling and user feedback

### Performance

- Data caching with localStorage
- Responsive design for all screen sizes
- Efficient data fetching and state management

## Data Flow

1. **API Integration**

   - CoinGecko API for cryptocurrency data
   - Environment variables for API keys
   - Axios for HTTP requests with proper headers

2. **State Management**

   - React hooks for local state
   - Memoization for performance optimization
   - Custom hooks for data fetching

3. **Component Architecture**
   - Presentational components for UI
   - Container components for data handling
   - Reusable chart components

## Theme System

The application uses Chakra UI for theming and styling:

- **Chakra UI Theme**: Primary theme for all UI components
- **Custom Chart Styling**: Tailored styles for Recharts components

## Development

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your CoinGecko API key:
   ```
   VITE_API_KEY=your_api_key_here
   ```
4. Start the development server: `npm run dev`

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run test`: Run tests

## Future Improvements

### Performance Enhancements

- Implement virtual scrolling for long lists
- Add service worker for offline support
- Optimize bundle size with better code splitting

### Feature Additions

- Add multiple time range charts (24h, weekly, monthly)
- Implement price alerts and notifications
- Add more detailed coin information
- Include trading volume data
- Add comparison charts between different coins

### User Experience

- Add loading skeletons for better perceived performance
- Implement error boundaries for better error handling
- Add tooltips with more detailed information
- Improve mobile responsiveness

### Technical Improvements

- Implement proper TypeScript support
- Add comprehensive test coverage
- Set up CI/CD pipeline
- Add performance monitoring
- Implement proper state management solution (e.g., Redux or Zustand)

### Security Enhancements

- Implement proper rate limiting
- Add request retry logic
- Improve error handling and user feedback
- Add proper input validation

### Data Management

- Implement proper data caching strategy
- Add data persistence
- Implement proper data synchronization
- Add data backup and recovery

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Smart Caching System

The dashboard implements an advanced caching system to optimize API usage and provide a smooth user experience:

### Cache Features

- **Memory & Storage Caching**: Two-layer caching system using both memory and localStorage
- **Stale-While-Revalidate**: Serves stale data while refreshing in the background
- **Background Refresh**: Automatically updates data every minute without blocking the UI
- **Rate Limit Protection**: Prevents API rate limit issues with smart request management

### Cache Configuration

```javascript
{
  duration: 60000, // 1 minute cache duration
  staleWhileRevalidate: true, // Serve stale data while refreshing
  backgroundRefresh: true // Enable background updates
}
```

### Rate Limiting

- Maximum 10 requests per minute
- Automatic request queuing
- Smart retry mechanism with exponential backoff

## API Integration

The dashboard uses the CoinGecko API with the following features:

- Smart caching to minimize API calls
- Rate limit protection
- Error handling and retries
- Background data refresh

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data
- [Chakra UI](https://chakra-ui.com/) for the component library
- [Recharts](https://recharts.org/) for the charting library
