# TODO Something

A simple, intuitive task management app to help you stay organized and productive.

## Features

- 📝 Create, edit, and delete tasks
- ✅ Mark tasks as completed
- 🔄 Filter tasks by status
- 💾 Local storage persistence

## Quick Start

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file with the required variables (see example below)
4. Start the app with `npm start`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# API Configuration
REACT_APP_BASE_URL=https://your-api-url.com
REACT_APP_USERNAME=your_username
REACT_APP_PASSWORD=your_password
REACT_APP_TOKEN=your_api_token
REACT_APP_TABLE_NAME=todo

# Environment
NODE_ENV=development
```

## Tech Stack

### Frontend
- **React 18** - UI library
- **Ant Design** - Component library with icons
- **React Query** - Data fetching and state management
- **CSS** - Styling

### Backend
- **Directus** - Headless CMS for API and content management
- **Node.js** - Runtime environment

### Database
- **Directus Database** - Content storage
- **Local Storage** - Client-side data persistence

## License

MIT © 2025