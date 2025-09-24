import express, { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";
import routes from './routes/index.js';

import { errorHandler } from './utils/middleware.js';
dotenv.config();

// your Express app setup code
const app = express();
app.use(express.json()); // ✅ body parse karne ke liye
routes(app);
// other middleware and routesW
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Not Found - Invalid URL',
  });
});

app.use(errorHandler)
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
// E
export default app;