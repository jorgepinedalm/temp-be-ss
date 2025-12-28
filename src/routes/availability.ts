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

    // Helper function to generate random team names
    const generateRandomTeamName = (): string => {
      const teamNames = [
        'Lions FC', 'Eagles United', 'Panthers SC', 'Tigers Athletic', 'Wolves Club',
        'Hawks Team', 'Bears FC', 'Sharks United', 'Ravens SC', 'Falcons Athletic',
        'Dragons Club', 'Phoenix Team', 'Thunder FC', 'Lightning United', 'Storm SC'
      ];
      return teamNames[Math.floor(Math.random() * teamNames.length)];
    };

    // Helper function to generate random athlete names
    const generateRandomAthleteName = (): string => {
      const firstNames = [
        'Daniel', 'Maria', 'Carlos', 'Ana', 'Luis', 'Sofia', 'Miguel', 'Elena', 
        'Jorge', 'Carmen', 'David', 'Isabel', 'Pedro', 'Lucia', 'Antonio'
      ];
      const lastNames = [
        'Garcia', 'Rodriguez', 'Martinez', 'Lopez', 'Hernandez', 'Gonzalez', 
        'Perez', 'Sanchez', 'Ramirez', 'Cruz', 'Torres', 'Flores', 'Gomez', 'Diaz', 'Ruiz'
      ];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${firstName} ${lastName}`;
    };

    // Helper function to generate team initials
    const generateTeamInitials = (teamName: string): string => {
      return teamName.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 3);
    };

    // Helper function to generate random athlete IDs
    const generateAthleteIds = (count: number): number[] => {
      const ids: number[] = [];
      for (let i = 0; i < count; i++) {
        ids.push(Math.floor(Math.random() * 9000) + 1000); // Random 4-digit IDs
      }
      return ids;
    };

    // Helper function to parse athlete IDs from parameter
    const parseAthleteIds = (athleteIdParam: string): number[] => {
      return athleteIdParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    };

    // Statuses object (always included)
    const statuses = {
      "1": { id: 1, name: "Available" },
      "2": { id: 2, name: "Modified" },
      "3": { id: 3, name: "Injured" },
      "4": { id: 4, name: "Sick" },
      "5": { id: 5, name: "Away" }
    };

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
    let profiles: any = {};

    if (teamIdParam) {
      // When team_id is defined - show athletes from the team
      const teamId = parseInt(teamIdParam);
      const team = teamsData.find(t => t.id === teamId);
      
      if (!team) {
        return res.status(404).json({ error: 'Team not found.' });
      }

      let athleteIds: number[] = [];
      
      if (athleteIdParam) {
        // If athlete_id is also defined, use those specific athletes
        athleteIds = parseAthleteIds(athleteIdParam);
      } else {
        // Generate random athletes for the team (between 5-15 athletes)
        const athleteCount = Math.floor(Math.random() * 11) + 5;
        athleteIds = generateAthleteIds(athleteCount);
      }

      body = athleteIds.map(athleteId => {
        const athleteName = generateRandomAthleteName();
        
        profiles[athleteId.toString()] = {
          id: athleteId,
          full_name: athleteName,
          photo: null
        };

        return {
          id: athleteId,
          timeline_rows: generateTimelineRows()
        };
      });

    } else if (athleteIdParam) {
      // When athlete_id is defined but team_id is not - show specific athletes
      const athleteIds = parseAthleteIds(athleteIdParam);

      body = athleteIds.map(athleteId => {
        const athleteName = generateRandomAthleteName();
        
        profiles[athleteId.toString()] = {
          id: athleteId,
          full_name: athleteName,
          photo: null
        };

        return {
          id: athleteId,
          timeline_rows: generateTimelineRows()
        };
      });

    } else if (status) {
      // When status is defined but no team_id or athlete_id - show teams structure
      body = teamsData.map(team => {
        const teamName = generateRandomTeamName();
        const initials = generateTeamInitials(teamName);
        
        profiles[team.id.toString()] = {
          id: team.id,
          name: teamName,
          image: "",
          initials: initials,
          color: "#E6193C"
        };

        return {
          id: team.id,
          timeline_rows: generateTimelineRows()
        };
      });
      
    } else {
      // When status is not defined - show status structure with teams
      const statusIds = [1, 2, 3, 4];
      
      body = statusIds.map(statusId => ({
        status: statusId,
        rows: teamsData.map(team => {
          const teamName = generateRandomTeamName();
          const initials = generateTeamInitials(teamName);
          
          return {
            id: team.id,
            timeline_rows: generateTimelineRows()
          };
        })
      }));
      
      // profiles remains empty when status is not defined
    }

    const response = {
      statuses: statuses,
      profiles: profiles,
      headers: headers,
      body: body
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/overview/calendar', (req: Request, res: Response) => {
  try {
    const startParam = req.query.start_date as string;
    const endParam = req.query.end_date as string;
    const interval = (req.query.interval as string) || 'month';
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
    if (!['day', 'month', 'year'].includes(interval)) {
      return res.status(400).json({ error: 'Invalid interval. Use: day, month, or year.' });
    }

    // Helper function to generate random percentage (5-100)
    const getRandomCalendarPercentage = (): number => {
      return Math.round((Math.random() * 95 + 5 + Number.EPSILON) * 100) / 100;
    };

    // Helper function to get color based on percentage
    const getColorByPercentage = (percentage: number): string => {
      if (percentage < 25) return '#FF6680';
      if (percentage >= 25 && percentage < 45) return '#FF8E6B';
      if (percentage >= 45 && percentage <= 70) return '#E9B567';
      return '#57DCBE'; // > 70
    };

    // Helper function to generate random team names
    const generateRandomTeamName = (): string => {
      const teamNames = [
        'Lions FC', 'Eagles United', 'Panthers SC', 'Tigers Athletic', 'Wolves Club',
        'Hawks Team', 'Bears FC', 'Sharks United', 'Ravens SC', 'Falcons Athletic',
        'Dragons Club', 'Phoenix Team', 'Thunder FC', 'Lightning United', 'Storm SC'
      ];
      return teamNames[Math.floor(Math.random() * teamNames.length)];
    };

    // Helper function to generate random athlete names
    const generateRandomAthleteName = (): string => {
      const firstNames = [
        'Daniel', 'Maria', 'Carlos', 'Ana', 'Luis', 'Sofia', 'Miguel', 'Elena', 
        'Jorge', 'Carmen', 'David', 'Isabel', 'Pedro', 'Lucia', 'Antonio'
      ];
      const lastNames = [
        'Garcia', 'Rodriguez', 'Martinez', 'Lopez', 'Hernandez', 'Gonzalez', 
        'Perez', 'Sanchez', 'Ramirez', 'Cruz', 'Torres', 'Flores', 'Gomez', 'Diaz', 'Ruiz'
      ];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${firstName} ${lastName}`;
    };

    // Helper function to generate team initials
    const generateTeamInitials = (teamName: string): string => {
      return teamName.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 3);
    };

    // Helper function to generate random athlete IDs
    const generateAthleteIds = (count: number): number[] => {
      const ids: number[] = [];
      for (let i = 0; i < count; i++) {
        ids.push(Math.floor(Math.random() * 9000) + 1000); // Random 4-digit IDs
      }
      return ids;
    };

    // Helper function to parse multiple IDs from parameter
    const parseIds = (idParam: string): number[] => {
      return idParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    };

    // Generate headers (time periods)
    let headers: Array<{ start: string; end: string }> = [];
    
    if (interval === 'day') {
      let current = new Date(startDate);
      
      while (current <= endDate) {
        headers.push({
          start: formatDate(current),
          end: formatDate(current)
        });
        
        current.setDate(current.getDate() + 1);
      }
    } else if (interval === 'year') {
      let currentYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();

      while (currentYear <= endYear) {
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31);
        
        // Adjust for actual range boundaries
        const actualStart = yearStart < startDate ? startDate : yearStart;
        const actualEnd = yearEnd > endDate ? endDate : yearEnd;
        
        if (actualStart <= actualEnd) {
          headers.push({
            start: formatDate(actualStart),
            end: formatDate(actualEnd)
          });
        }
        
        currentYear++;
      }
    } else if (interval === 'month') {
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
          headers.push({
            start: formatDate(actualStart),
            end: formatDate(actualEnd)
          });
        }
        
        current.setMonth(current.getMonth() + 1);
      }
    }

    // Generate timeline rows with random values
    const generateTimelineRows = () => {
      return headers.map(header => {
        const percentage = getRandomCalendarPercentage();
        return {
          start: header.start,
          end: header.end,
          percentages: percentage,
          color: getColorByPercentage(percentage)
        };
      });
    };

    let body: any[] = [];
    let profiles: any = {};

    // Parse team_id if provided
    const teamIds = teamIdParam ? parseIds(teamIdParam) : [];
    const athleteIds = athleteIdParam ? parseIds(athleteIdParam) : [];

    if (teamIds.length === 1 && !athleteIds.length) {
      // Single team_id without athlete_id - show athletes from the team
      const teamId = teamIds[0];
      const team = teamsData.find(t => t.id === teamId);
      
      if (!team) {
        return res.status(404).json({ error: 'Team not found.' });
      }

      // Generate random athletes for the team (between 5-15 athletes)
      const athleteCount = Math.floor(Math.random() * 11) + 5;
      const generatedAthleteIds = generateAthleteIds(athleteCount);

      body = generatedAthleteIds.map(athleteId => {
        const athleteName = generateRandomAthleteName();
        
        profiles[athleteId.toString()] = {
          id: athleteId,
          full_name: athleteName,
          photo: null
        };

        return {
          id: athleteId,
          timeline_rows: generateTimelineRows()
        };
      });

    } else if (teamIds.length === 1 && athleteIds.length > 0) {
      // Single team_id with athlete_id(s) - show specific athletes from the team
      const teamId = teamIds[0];
      const team = teamsData.find(t => t.id === teamId);
      
      if (!team) {
        return res.status(404).json({ error: 'Team not found.' });
      }

      body = athleteIds.map(athleteId => {
        const athleteName = generateRandomAthleteName();
        
        profiles[athleteId.toString()] = {
          id: athleteId,
          full_name: athleteName,
          photo: null
        };

        return {
          id: athleteId,
          timeline_rows: generateTimelineRows()
        };
      });

    } else if (teamIds.length > 1) {
      // Multiple team_id - show specific teams
      body = teamIds.map(teamId => {
        const team = teamsData.find(t => t.id === teamId);
        if (!team) return null; // Skip non-existent teams
        
        const teamName = generateRandomTeamName();
        const initials = generateTeamInitials(teamName);
        
        profiles[teamId.toString()] = {
          id: teamId,
          name: teamName,
          image: "",
          initials: initials,
          color: "#E6193C"
        };

        return {
          id: teamId,
          timeline_rows: generateTimelineRows()
        };
      }).filter(item => item !== null); // Remove null entries

    } else if (athleteIds.length > 0) {
      // Only athlete_id(s) defined - show specific athletes
      body = athleteIds.map(athleteId => {
        const athleteName = generateRandomAthleteName();
        
        profiles[athleteId.toString()] = {
          id: athleteId,
          full_name: athleteName,
          photo: null
        };

        return {
          id: athleteId,
          timeline_rows: generateTimelineRows()
        };
      });

    } else {
      // No team_id or athlete_id - show all teams
      body = teamsData.map(team => {
        const teamName = generateRandomTeamName();
        const initials = generateTeamInitials(teamName);
        
        profiles[team.id.toString()] = {
          id: team.id,
          name: teamName,
          image: "",
          initials: initials,
          color: "#E6193C"
        };

        return {
          id: team.id,
          timeline_rows: generateTimelineRows()
        };
      });
    }

    const response = {
      profiles: profiles,
      headers: headers,
      body: body
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;