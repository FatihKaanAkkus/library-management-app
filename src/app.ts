import express from 'express';
import bodyParser from 'body-parser';
import env from '@/config/env';
import userRoutes from './routes/user-routes';
import bookRoutes from './routes/book-routes';
import errorHandler from '@/middlewares/error-handler';

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Library Management API',
    version: '0.1.0~dev',
  });
});

app.use('/users', userRoutes);
app.use('/books', bookRoutes);

app.use(errorHandler);

app.listen(env.PORT, (error) => {
  if (error) {
    console.error('Error starting server:', error);
  } else {
    console.log(`Server is running at http://localhost:${env.PORT}`);
  }
});
