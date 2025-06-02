# CodeNest Frontend

![CodeNest Homepage](frontend/public/homepage.png)

CodeNest is a comprehensive platform designed to connect developers, facilitate knowledge sharing, and build a supportive coding community. This frontend implementation enables users to ask programming questions, share code snippets, write technical blogs, and engage with content through voting, commenting, and more.

## 🏗️ Architecture Overview

The frontend is built using Next.js 13+ with App Router, React, TypeScript, and TailwindCSS. It follows a modern, component-based architecture with a focus on performance, SEO, and user experience:

- **App Router**: Leverages Next.js 13+ app directory structure
- **Components**: Reusable UI components organized by feature
- **Hooks**: Custom React hooks for shared functionality
- **Services**: API integration and data fetching
- **Utils**: Helper functions and utilities

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/MZeeshanMalik/CodeNest.git
```

2. Navigate to the project directory:

```bash
cd CodeNest
```

3. Install dependencies for both frontend and backend:

```bash
# For frontend
cd frontend
npm install
# or
yarn install

# For backend
cd ../backend
npm install
# or
yarn install
```

### Running the Development Server

#### Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#### Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. The backend server will start on [http://localhost:5000](http://localhost:5000).

### Building for Production

#### Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Build the project:

```bash
npm run build
# or
yarn build
```

3. Start the production server:

```bash
npm start
# or
yarn start
```

#### Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Start the production server:

```bash
npm start
# or
yarn start
```

## 🚀 Key Features

### 🔒 Authentication & User Management

The authentication system uses JWT with secure httpOnly cookies and includes features like:

- User login and registration forms with validation
- JWT token management through React context
- Protected routes with authentication
- User profile management with avatar uploads
- Social login options

### ❓ Question & Answer System

The Q&A system enables users to ask and answer technical questions with features like:

- Question submission with rich text editing
- Code snippet integration with syntax highlighting
- Image upload and management
- Answer submission and selection
- Voting system for questions and answers
- Tagging system for categorization

### 📝 Rich Text Editing

The platform uses a customized Slate.js implementation for rich text editing that includes:

- Text formatting (bold, italic, underline)
- Bullet and numbered lists
- Headings and quotes
- Code blocks with syntax highlighting
- Image embedding
- Markdown support

### 🔍 Search and Filtering

The platform includes advanced search and filtering capabilities:

- Text-based search with debounced queries
- Tag filtering
- Sort by recency, popularity, and activity
- Pagination for search results
- Real-time search suggestions

### 🎨 UI Components

The UI is built with a combination of custom components and shadcn/ui, featuring:

- Responsive design using Tailwind CSS
- Custom reusable components
- Form components with validation
- Toast notifications
- Modal dialogs
- Loaders and skeleton screens

## 🌐 API Integration

The frontend integrates with the backend API using TanStack Query (React Query) for efficient data fetching and caching:

Features implemented:

- Automatic caching and refetching
- Pagination
- Optimistic UI updates
- Error handling
- Loading states

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [React Documentation](https://reactjs.org/) - learn about React.
- [TailwindCSS Documentation](https://tailwindcss.com/docs) - learn about TailwindCSS.
- [TanStack Query Documentation](https://tanstack.com/query/latest) - learn about React Query.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

We welcome contributions from the community! If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Open a pull request.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please open an issue on the [GitHub repository](https://github.com/MZeeshanMalik/CodeNest/issues).
