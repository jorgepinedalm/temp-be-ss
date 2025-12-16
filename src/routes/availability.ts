import { Router, Request, Response } from 'express';

const router = Router();

router.get('/overview', (req: Request, res: Response) => {
  try {
    const response = {
      counts: {
        "1": 20,
        "2": 6,
        "3": 0,
        "4": 5,
        "5": 10
      },
      percentages: {
        "1": 48.78,
        "2": 14.63,
        "3": 0.0,
        "4": 12.2,
        "5": 24.39
      },
      status_percentage: 48.78,
      vs_last_year: 48.78
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;