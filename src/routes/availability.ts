import { Router, Request, Response } from 'express';
import { teamsData } from '../data/teams';

const router = Router();

// Helper function to generate random percentage
const getRandomPercentage = (): number => {
  return Math.round((Math.random() * 50 + 50 + Number.EPSILON) * 100) / 100;
};

// Helper function to generate random injury days
const getRandomInjuryDays = (): number => {
  return Math.floor(Math.random() * 36) + 15; // Random integer between 15 and 50
};

// Helper function to generate random unavailable days (0-50)
const getRandomUnavailableDays = (): number => {
  return Math.floor(Math.random() * 51); // Random integer between 0 and 50
};

// Helper function to generate random percentage for table (10-100)
const getRandomTablePercentage = (): number => {
  return Math.round((Math.random() * 90 + 10 + Number.EPSILON) * 100) / 100;
};

// Helper function to generate random days for table (10-50)
const getRandomTableDays = (): number => {
  return Math.floor(Math.random() * 41) + 10; // Random integer between 10 and 50
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper function to get last day of month
const getLastDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

// Helper function to get Monday of the week containing the date
const getMonday = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// Helper function to get Sunday of the week containing the date
const getSunday = (date: Date): Date => {
  const monday = getMonday(date);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return sunday;
};

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

router.get('/overall', (req: Request, res: Response) => {
  try {
    const startParam = req.query.start as string;
    const endParam = req.query.end as string;
    const interval = (req.query.interval as string) || 'month';

    // Default dates if not provided
    const startDate = startParam ? new Date(startParam) : new Date('2025-01-01');
    const endDate = endParam ? new Date(endParam) : new Date('2025-12-31');

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    if (startDate > endDate) {
      return res.status(400).json({ error: 'Start date must be before end date.' });
    }

    // Validate interval
    if (!['day', 'week', 'month'].includes(interval)) {
      return res.status(400).json({ error: 'Invalid interval. Use: day, week, or month.' });
    }

    let timeline: Array<{
      start: string;
      end: string;
      availability_percentage: number;
    }> = [];

    if (interval === 'month') {
      let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

      while (current <= endMonth) {
        const year = current.getFullYear();
        const month = current.getMonth();
        const lastDay = getLastDayOfMonth(year, month + 1);
        
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month, lastDay);
        
        // Adjust for actual range boundaries
        const actualStart = monthStart < startDate ? startDate : monthStart;
        const actualEnd = monthEnd > endDate ? endDate : monthEnd;
        
        if (actualStart <= actualEnd) {
          timeline.push({
            start: formatDate(actualStart),
            end: formatDate(actualEnd),
            availability_percentage: getRandomPercentage()
          });
        }
        
        current.setMonth(current.getMonth() + 1);
      }
    } else if (interval === 'week') {
      let current = getMonday(startDate);
      
      while (current <= endDate) {
        const weekEnd = getSunday(current);
        
        // Adjust for actual range boundaries
        const actualStart = current < startDate ? startDate : current;
        const actualEnd = weekEnd > endDate ? endDate : weekEnd;
        
        if (actualStart <= actualEnd) {
          timeline.push({
            start: formatDate(actualStart),
            end: formatDate(actualEnd),
            availability_percentage: getRandomPercentage()
          });
        }
        
        current.setDate(current.getDate() + 7);
      }
    } else if (interval === 'day') {
      let current = new Date(startDate);
      
      while (current <= endDate) {
        timeline.push({
          start: formatDate(current),
          end: formatDate(current),
          availability_percentage: getRandomPercentage()
        });
        
        current.setDate(current.getDate() + 1);
      }
    }

    // Calculate overall availability percentage (average)
    const overallPercentage = timeline.length > 0 
      ? Math.round((timeline.reduce((sum, item) => sum + item.availability_percentage, 0) / timeline.length + Number.EPSILON) * 100) / 100
      : 0;

    const response = {
      overall: {
        availability_percentage: overallPercentage
      },
      timeline: timeline
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/injury-days-lost/', (req: Request, res: Response) => {
  try {
    const startParam = req.query.start as string;
    const endParam = req.query.end as string;
    const interval = (req.query.interval as string) || 'month';

    // Default dates if not provided
    const startDate = startParam ? new Date(startParam) : new Date('2025-01-01');
    const endDate = endParam ? new Date(endParam) : new Date('2025-12-31');

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    if (startDate > endDate) {
      return res.status(400).json({ error: 'Start date must be before end date.' });
    }

    // Validate interval
    if (!['day', 'week', 'month'].includes(interval)) {
      return res.status(400).json({ error: 'Invalid interval. Use: day, week, or month.' });
    }

    let timeline: Array<{
      start: string;
      end: string;
      status_count: number;
    }> = [];

    if (interval === 'month') {
      let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

      while (current <= endMonth) {
        const year = current.getFullYear();
        const month = current.getMonth();
        const lastDay = getLastDayOfMonth(year, month + 1);
        
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month, lastDay);
        
        // Adjust for actual range boundaries
        const actualStart = monthStart < startDate ? startDate : monthStart;
        const actualEnd = monthEnd > endDate ? endDate : monthEnd;
        
        if (actualStart <= actualEnd) {
          timeline.push({
            start: formatDate(actualStart),
            end: formatDate(actualEnd),
            status_count: getRandomInjuryDays()
          });
        }
        
        current.setMonth(current.getMonth() + 1);
      }
    } else if (interval === 'week') {
      let current = getMonday(startDate);
      
      while (current <= endDate) {
        const weekEnd = getSunday(current);
        
        // Adjust for actual range boundaries
        const actualStart = current < startDate ? startDate : current;
        const actualEnd = weekEnd > endDate ? endDate : weekEnd;
        
        if (actualStart <= actualEnd) {
          timeline.push({
            start: formatDate(actualStart),
            end: formatDate(actualEnd),
            status_count: getRandomInjuryDays()
          });
        }
        
        current.setDate(current.getDate() + 7);
      }
    } else if (interval === 'day') {
      let current = new Date(startDate);
      
      while (current <= endDate) {
        timeline.push({
          start: formatDate(current),
          end: formatDate(current),
          status_count: getRandomInjuryDays()
        });
        
        current.setDate(current.getDate() + 1);
      }
    }

    // Calculate overall status count (average)
    const overallStatusCount = timeline.length > 0 
      ? Math.round((timeline.reduce((sum, item) => sum + item.status_count, 0) / timeline.length + Number.EPSILON) * 100) / 100
      : 0;

    const response = {
      overall: {
        status_count: overallStatusCount
      },
      timeline: timeline
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/unavailable-days', (req: Request, res: Response) => {
  try {
    const startParam = req.query.start_date as string;
    const endParam = req.query.end_date as string;
    const interval = (req.query.interval as string) || 'month';

    // Default dates if not provided
    const startDate = startParam ? new Date(startParam) : new Date('2025-01-01');
    const endDate = endParam ? new Date(endParam) : new Date('2025-12-31');

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    if (startDate > endDate) {
      return res.status(400).json({ error: 'Start date must be before end date.' });
    }

    // Validate interval
    if (!['week', 'month'].includes(interval)) {
      return res.status(400).json({ error: 'Invalid interval. Use: week or month.' });
    }

    let timeline: Array<{
      start: string;
      end: string;
      modified: number;
      injured: number;
      sick: number;
      status_count: number;
    }> = [];

    if (interval === 'month') {
      let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

      while (current <= endMonth) {
        const year = current.getFullYear();
        const month = current.getMonth();
        const lastDay = getLastDayOfMonth(year, month + 1);
        
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month, lastDay);
        
        // Adjust for actual range boundaries
        const actualStart = monthStart < startDate ? startDate : monthStart;
        const actualEnd = monthEnd > endDate ? endDate : monthEnd;
        
        if (actualStart <= actualEnd) {
          const modified = getRandomUnavailableDays();
          const injured = getRandomUnavailableDays();
          const sick = getRandomUnavailableDays();
          
          timeline.push({
            start: formatDate(actualStart),
            end: formatDate(actualEnd),
            modified: modified,
            injured: injured,
            sick: sick,
            status_count: modified + injured + sick
          });
        }
        
        current.setMonth(current.getMonth() + 1);
      }
    } else if (interval === 'week') {
      let current = getMonday(startDate);
      
      while (current <= endDate) {
        const weekEnd = getSunday(current);
        
        // Adjust for actual range boundaries
        const actualStart = current < startDate ? startDate : current;
        const actualEnd = weekEnd > endDate ? endDate : weekEnd;
        
        if (actualStart <= actualEnd) {
          const modified = getRandomUnavailableDays();
          const injured = getRandomUnavailableDays();
          const sick = getRandomUnavailableDays();
          
          timeline.push({
            start: formatDate(actualStart),
            end: formatDate(actualEnd),
            modified: modified,
            injured: injured,
            sick: sick,
            status_count: modified + injured + sick
          });
        }
        
        current.setDate(current.getDate() + 7);
      }
    }

    // Calculate totals for breakdown and overall
    const totals = timeline.reduce((acc, item) => {
      acc.modified += item.modified;
      acc.injured += item.injured;
      acc.sick += item.sick;
      acc.total += item.status_count;
      return acc;
    }, { modified: 0, injured: 0, sick: 0, total: 0 });

    const response = {
      overall: {
        status_count: totals.total,
        breakdown: {
          "2": totals.modified,
          "3": totals.injured,
          "4": totals.sick
        }
      },
      timeline: timeline
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/overview/table', (req: Request, res: Response) => {
  try {
    const startParam = req.query.start_date as string;
    const endParam = req.query.end_date as string;
    const interval = (req.query.interval as string) || 'month';
    const status = req.query.status as string;
    const metric = (req.query.metric as string) || 'percentage';
    const teamIdParam = req.query.team_id as string;
    const athleteIdParam = req.query.athlete_id as string;

    // Default dates if not provided
    const startDate = startParam ? new Date(startParam) : new Date('2025-01-01');
    const endDate = endParam ? new Date(endParam) : new Date('2025-12-31');

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    if (startDate > endDate) {
      return res.status(400).json({ error: 'Start date must be before end date.' });
    }

    // Validate interval
    if (!['day', 'week', 'month'].includes(interval)) {
      return res.status(400).json({ error: 'Invalid interval. Use: day, week, or month.' });
    }

    // Validate metric
    if (!['percentage', 'days'].includes(metric)) {
      return res.status(400).json({ error: 'Invalid metric. Use: percentage or days.' });
    }

    // Generate headers (time periods)
    let headers: Array<{ start: string; end: string }> = [];
    
    if (interval === 'month') {
      let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

      while (current <= endMonth) {
        const year = current.getFullYear();
        const month = current.getMonth();
        const lastDay = getLastDayOfMonth(year, month + 1);
        
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month, lastDay);
        
        const actualStart = monthStart < startDate ? startDate : monthStart;
        const actualEnd = monthEnd > endDate ? endDate : monthEnd;
        
        if (actualStart <= actualEnd) {
          headers.push({
            start: formatDate(actualStart),
            end: formatDate(actualEnd)
          });
        }
        
        current.setMonth(current.getMonth() + 1);
      }
    } else if (interval === 'week') {
      let current = getMonday(startDate);
      
      while (current <= endDate) {
        const weekEnd = getSunday(current);
        
        const actualStart = current < startDate ? startDate : current;
        const actualEnd = weekEnd > endDate ? endDate : weekEnd;
        
        if (actualStart <= actualEnd) {
          headers.push({
            start: formatDate(actualStart),
            end: formatDate(actualEnd)
          });
        }
        
        current.setDate(current.getDate() + 7);
      }
    } else if (interval === 'day') {
      let current = new Date(startDate);
      
      while (current <= endDate) {
        headers.push({
          start: formatDate(current),
          end: formatDate(current)
        });
        
        current.setDate(current.getDate() + 1);
      }
    }

    // Generate timeline rows with random values
    const generateTimelineRows = () => {
      return headers.map(header => ({
        start: header.start,
        end: header.end,
        value: metric === 'percentage' ? getRandomTablePercentage() : getRandomTableDays()
      }));
    };

    let body: any[] = [];

    if (status) {
      // When status is defined - show teams structure
      let teamsToShow = teamsData;
      
      // Filter by team_id if provided
      if (teamIdParam) {
        const teamId = parseInt(teamIdParam);
        teamsToShow = teamsData.filter(team => team.id === teamId);
      }
      
      body = teamsToShow.map(team => ({
        team: team,
        timeline_rows: generateTimelineRows()
      }));
      
    } else {
      // When status is not defined - show status structure
      const statuses = [1, 2, 3, 4];
      
      body = statuses.map(statusId => ({
        status: statusId,
        rows: teamsData.map(team => ({
          team: team,
          timeline_rows: generateTimelineRows()
        }))
      }));
    }

    const response = {
      headers: headers,
      body: body
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;