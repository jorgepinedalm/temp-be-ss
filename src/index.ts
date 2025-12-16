import express from 'express';
import cors from 'cors';
import institutionsRoutes from './routes/institutions';
import availabilityRoutes from './routes/availability';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/institutions', institutionsRoutes);
app.use('/availability', availabilityRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Institutions API is running',
    version: '1.0.0',
    endpoints: [
      'GET /institutions/teams/',
      'GET /institutions/athletes/',
      'GET /availability/overview'
    ]
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`📊 Teams endpoint: http://localhost:${PORT}/institutions/teams/`);
  console.log(`🏃 Athletes endpoint: http://localhost:${PORT}/institutions/athletes/`);
  console.log(`📈 Availability endpoint: http://localhost:${PORT}/availability/overview`);
});

export default app;