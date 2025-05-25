# Smorgasbord Icon Library

A Vue 3 application for browsing and managing icons for the Smorgasbord video game.

## Features

- Grid layout display of game icons
- Search functionality
- Responsive design
- Modern UI with hover effects
- TypeScript support
- ESLint and Prettier integration
- Pre-commit hooks with Husky

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Development

- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

- `src/components/` - Vue components
- `src/assets/` - Static assets (icons, images)
- `src/App.vue` - Main application component
- `src/components/IconGrid.vue` - Icon grid display component

## Contributing

1. All commits are linted and formatted automatically using Husky and lint-staged
2. Follow the Vue 3 Options API pattern
3. Maintain TypeScript types
4. Keep components focused and reusable

## License

MIT
