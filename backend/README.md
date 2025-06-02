# CodeNest Backend Implementation Guide

![CodeNest Logo](../frontend/public/programmer.svg)

This guide provides detailed information about the backend implementation of the CodeNest platform, designed to help developers understand the architecture and features. The backend serves as the foundation for the CodeNest developer community platform, providing robust APIs for authentication, content management, and user interactions.

## 🏗️ Architecture Overview

The CodeNest backend is built with Node.js, Express, and MongoDB, using TypeScript for type safety. The architecture follows a modular design with clear separation of concerns:

- **Controllers**: Handle HTTP requests and responses
- **Models**: Define database schemas and business logic
- **Routes**: Define API endpoints
- **Middlewares**: Implement cross-cutting concerns
- **Utils**: Provide helper functions

## 🔐 Authentication System

The authentication system uses JWT (JSON Web Tokens) for secure, stateless authentication:

```typescript
// Sample auth controller method
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }
  
  // Verify password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError('Invalid email or password', 401);
  }
  
  // Generate JWT token
  const token = generateToken(user._id);
  
  // Send response
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});
```

Features implemented:
- User registration with email verification
- Secure password hashing using bcrypt
- JWT token generation and validation
- Social authentication integration
- Role-based access control (user, moderator, admin)
- Password reset functionality

## 📊 Database Models

### User Model

The User model stores user credentials and profile information:

```typescript
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['user', 'moderator', 'admin'], 
    default: 'user' 
  },
  avatar: { type: String },
  bio: { type: String },
  createdAt: { type: Date, default: Date.now },
  passwordResetToken: String,
  passwordResetExpires: Date,
  verified: { type: Boolean, default: false },
});
```

### Question Model

The Question model manages all question-related data:

```typescript
const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  codeBlocks: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{ type: String }], // Array of image URLs
  tags: [{ type: String }], // Array of tags
  votes: { type: Number, default: 0 },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  slug: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});
```

### Answer Model

The Answer model stores responses to questions:

```typescript
const AnswerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  codeBlocks: { type: String, default: "" },
  images: [{ type: String }],
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

Other implemented models include:
- Blog Model
- Comment Model
- Vote Model
- Report Model
- Contact Model

## 🌐 API Routes

The API follows RESTful principles with appropriate HTTP methods:

### Question Routes

```typescript
router.route('/')
  .get(questionController.getAllQuestions)
  .post(
    authMiddleware.protect,
    upload.array('images', 5),
    questionController.createQuestion
  );

router.route('/:id')
  .get(questionController.getQuestionById)
  .put(
    authMiddleware.protect,
    authMiddleware.restrictTo('user', 'admin'),
    upload.array('images', 5),
    questionController.updateQuestion
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('user', 'admin'),
    questionController.deleteQuestion
  );

router.get('/search', questionController.searchQuestions);
```

### Answer Routes

```typescript
router.route('/')
  .post(
    authMiddleware.protect,
    upload.array('images', 5),
    answerController.createAnswer
  );

router.route('/:id')
  .put(
    authMiddleware.protect,
    authMiddleware.restrictTo('user', 'admin'),
    upload.array('images', 5),
    answerController.updateAnswer
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('user', 'admin'),
    answerController.deleteAnswer
  );

router.get('/question/:questionId', answerController.getAnswersByQuestion);
```

Other implemented routes include:
- Authentication Routes
- Blog Routes
- Vote Routes
- Report Routes
- Contact Routes

## 📸 Image Handling

Images are processed using Multer middleware:

```typescript
// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/questionImages');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = file.originalname.split('.').pop();
    cb(null, `question-${uniqueSuffix}.${ext}`);
  },
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
```

Features implemented:
- Secure file upload validation
- Image storage with unique filenames
- Support for multiple image uploads per post
- Image deletion when content is removed
- Image URL tracking in database models

## ⚠️ Error Handling

A centralized error handling system:

```typescript
// Global error handling middleware
export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Handle specific error types
  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${(err as any).path}: ${(err as any).value}`, 400);
  }
  
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map(
      (el: any) => el.message
    );
    error = new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
  }
  
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again!', 401);
  }
  
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired! Please log in again.', 401);
  }

  // Send error response
  res.status((error as AppError).statusCode || 500).json({
    status: 'error',
    message: error.message || 'Something went wrong',
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};
```

Features implemented:
- Custom error classes for different types of errors
- Global error middleware for consistent error responses
- Async error handling wrapper to reduce try-catch blocks
- Development vs production error formats

## 🔄 Advanced Features

### Search Implementation

Advanced search functionality for questions:

```typescript
export const searchQuestions = catchAsync(async (req: Request, res: Response) => {
  const { q, tags, page = 1, limit = 10, sort = '-createdAt' } = req.query;
  
  const query: any = {};
  
  // Text search
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
      { codeBlocks: { $regex: q, $options: 'i' } },
    ];
  }
  
  // Tag filtering
  if (tags) {
    const tagArray = (tags as string).split(',');
    query.tags = { $in: tagArray };
  }
  
  // Execute query with pagination
  const questions = await Question.find(query)
    .sort(sort as string)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .populate('user', 'name avatar')
    .populate({
      path: 'answers',
      select: 'user createdAt',
    });
  
  // Get total count
  const total = await Question.countDocuments(query);
  
  // Send response
  res.status(200).json({
    status: 'success',
    results: questions.length,
    total,
    data: {
      questions,
    },
  });
});
```

### Report System

Content moderation through user reports:

```typescript
export const createReport = catchAsync(async (req: Request, res: Response) => {
  const { contentType, contentId, reason } = req.body;
  const userId = req.user._id;
  
  // Check if already reported
  const existingReport = await Report.findOne({
    contentType,
    contentId,
    'reports.user': userId,
  });
  
  if (existingReport) {
    throw new AppError('You have already reported this content', 400);
  }
  
  // Create report
  const report = await Report.findOneAndUpdate(
    { contentType, contentId },
    {
      $push: {
        reports: {
          user: userId,
          reason,
          createdAt: new Date(),
        },
      },
      $inc: { reportCount: 1 },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true, new: true }
  );
  
  // Send response
  res.status(201).json({
    status: 'success',
    data: {
      report,
    },
  });
});
```

## 🚀 Performance Optimization

- Database indexes for faster queries
- Caching strategies for frequently accessed data
- Query optimization with proper population strategies
- Pagination to limit response size
- File size and type validation
- Compression for API responses
- Rate limiting for API endpoints

## 🔄 Development Workflow

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/MZeeshanMalik/CodeNest.git
```

2. Navigate to the backend directory:
```bash
cd CodeNest/backend
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables by creating a `.env` file:
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
CLIENT_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run a specific test suite
npm test -- --testPathPattern=auth

# Generate test coverage report
npm test -- --coverage
```

### Building for Production

```bash
# Build TypeScript code
npm run build

# Start production server
npm start
```

## 📝 API Documentation

### API URL Structure

All API endpoints follow this structure:
```
/api/v1/{resource}/{action}
```

For example:
- `/api/v1/auth/login` - Authentication endpoint for user login
- `/api/v1/question` - Question resource endpoint
- `/api/v1/answer/question/:questionId` - Get answers for a specific question

### Authentication

All protected routes require a valid JWT token sent in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

### Rate Limiting

To prevent abuse, the API implements rate limiting:
- 100 requests per IP address per 15 minute window for public endpoints
- 300 requests per IP address per 15 minute window for authenticated users

### API Response Format

All API responses follow a consistent format:

#### Success Response
```json
{
  "status": "success",
  "data": {
    // Response data
  }
}
```

#### Error Response
```json
{
  "status": "error",
  "message": "Error message"
}
```

## 📚 Deployment Guide

### Prerequisites
- Node.js runtime environment (v16+)
- MongoDB instance (Atlas or self-hosted)
- PM2 or similar process manager for production

### Deployment Steps

1. Clone the repository on your server
2. Install dependencies with `npm ci`
3. Create production `.env` file
4. Build the project with `npm run build`
5. Start the server with PM2:
   ```bash
   pm2 start dist/server.js --name codenest-api
   ```

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t codenest-api .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 --env-file .env codenest-api
   ```
