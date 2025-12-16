import { Router, Request, Response } from 'express';
import { teamsData } from '../data/teams';
import { athletesData } from '../data/athletes';
import { PaginationResponse, Team, Athlete } from '../types';

const router = Router();

router.get('/teams/', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perpage as string) || 10;
    
    // Calcular paginación
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedTeams = teamsData.slice(startIndex, endIndex);
    
    const response: PaginationResponse<Team> = {
      data: paginatedTeams,
      pagination: {
        total_rows: teamsData.length,
        per_page: perPage,
        page: page
      }
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/athletes/', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perpage as string) || 10;
    
    // Calcular paginación
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedAthletes = athletesData.slice(startIndex, endIndex);
    
    const response: PaginationResponse<Athlete> = {
      data: paginatedAthletes,
      pagination: {
        total_rows: athletesData.length,
        per_page: perPage,
        page: page
      }
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;