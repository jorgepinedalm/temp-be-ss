import { Athlete } from '../types';
import { teamsData } from './teams';

const getRandomTeams = (count: number) => {
  const shuffled = [...teamsData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const calculateAge = (birthday: string) => {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const athletesData: Athlete[] = [
  {
    id: 1,
    full_name: "Carlos Alberto Rodríguez",
    photo: "https://via.placeholder.com/200x200/FF6B35/FFFFFF?text=CAR",
    birthday: "1995-03-15",
    age: calculateAge("1995-03-15"),
    institution_image: "https://via.placeholder.com/100x100/000080/FFFFFF?text=INST",
    latest_status: {
      id: 101,
      date: "2024-12-10",
      status: 1
    },
    teams: getRandomTeams(2)
  },
  {
    id: 2,
    full_name: "María Elena González",
    photo: "https://via.placeholder.com/200x200/FFD700/000000?text=MAR",
    birthday: "1998-07-22",
    age: calculateAge("1998-07-22"),
    institution_image: "https://via.placeholder.com/100x100/000080/FFFFFF?text=INST",
    latest_status: {
      id: 102,
      date: "2024-12-12",
      status: 2
    },
    teams: getRandomTeams(1)
  },
  {
    id: 3,
    full_name: "José Manuel Hernández",
    photo: "https://via.placeholder.com/200x200/1E90FF/FFFFFF?text=JOS",
    birthday: "1997-01-10",
    age: calculateAge("1997-01-10"),
    institution_image: "https://via.placeholder.com/100x100/000080/FFFFFF?text=INST",
    latest_status: {
      id: 103,
      date: "2024-12-11",
      status: 1
    },
    teams: getRandomTeams(3)
  },
  {
    id: 4,
    full_name: "Ana Patricia López",
    photo: "https://via.placeholder.com/200x200/32CD32/FFFFFF?text=ANA",
    birthday: "1999-11-05",
    age: calculateAge("1999-11-05"),
    institution_image: "https://via.placeholder.com/100x100/000080/FFFFFF?text=INST",
    latest_status: {
      id: 104,
      date: "2024-12-09",
      status: 3
    },
    teams: getRandomTeams(1)
  },
  {
    id: 5,
    full_name: "Roberto Carlos Martínez",
    photo: "https://via.placeholder.com/200x200/DC143C/FFFFFF?text=ROB",
    birthday: "1996-05-30",
    age: calculateAge("1996-05-30"),
    institution_image: "https://via.placeholder.com/100x100/000080/FFFFFF?text=INST",
    latest_status: {
      id: 105,
      date: "2024-12-13",
      status: 1
    },
    teams: getRandomTeams(2)
  },
  {
    id: 6,
    full_name: "Laura Sofía Ramírez",
    photo: null,
    birthday: "2000-02-14",
    age: calculateAge("2000-02-14"),
    institution_image: "https://via.placeholder.com/100x100/000080/FFFFFF?text=INST",
    latest_status: {
      id: 106,
      date: "2024-12-08",
      status: 2
    },
    teams: getRandomTeams(1)
  },
  {
    id: 7,
    full_name: "Miguel Ángel Torres",
    photo: "https://via.placeholder.com/200x200/696969/FFFFFF?text=MIG",
    birthday: "1994-09-18",
    age: calculateAge("1994-09-18"),
    institution_image: "https://via.placeholder.com/100x100/000080/FFFFFF?text=INST",
    latest_status: {
      id: 107,
      date: "2024-12-14",
      status: 1
    },
    teams: getRandomTeams(2)
  },
  {
    id: 8,
    full_name: "Gabriela Victoria Sánchez",
    photo: "https://via.placeholder.com/200x200/000000/FFFFFF?text=GAB",
    birthday: "1998-12-03",
    age: calculateAge("1998-12-03"),
    institution_image: "https://via.placeholder.com/100x100/000080/FFFFFF?text=INST",
    latest_status: {
      id: 108,
      date: "2024-12-07",
      status: 3
    },
    teams: getRandomTeams(1)
  },
  {
    id: 9,
    full_name: "Diego Alejandro Morales",
    photo: "https://via.placeholder.com/200x200/87CEEB/000000?text=DIE",
    birthday: "1997-06-25",
    age: calculateAge("1997-06-25"),
    institution_image: "https://via.placeholder.com/100x100/000080/FFFFFF?text=INST",
    latest_status: {
      id: 109,
      date: "2024-12-15",
      status: 1
    },
    teams: getRandomTeams(2)
  },
  {
    id: 10,
    full_name: "Valentina Isabel Cruz",
    photo: "https://via.placeholder.com/200x200/8A2BE2/FFFFFF?text=VAL",
    birthday: null,
    age: null,
    institution_image: "https://via.placeholder.com/100x100/000080/FFFFFF?text=INST",
    latest_status: {
      id: 110,
      date: "2024-12-06",
      status: 2
    },
    teams: getRandomTeams(3)
  },
  {
    id: 11,
    full_name: "Fernando Javier Ruiz",
    photo: "https://via.placeholder.com/200x200/8B4513/FFFFFF?text=FER",
    birthday: "1995-08-12",
    age: calculateAge("1995-08-12"),
    institution_image: "https://via.placeholder.com/100x100/000080/FFFFFF?text=INST",
    latest_status: {
      id: 111,
      date: "2024-12-05",
      status: 1
    },
    teams: getRandomTeams(1)
  },
  {
    id: 12,
    full_name: "Camila Andrea Vargas",
    photo: "https://via.placeholder.com/200x200/FF1493/FFFFFF?text=CAM",
    birthday: "1999-04-08",
    age: calculateAge("1999-04-08"),
    institution_image: "https://via.placeholder.com/100x100/000080/FFFFFF?text=INST",
    latest_status: {
      id: 112,
      date: "2024-12-04",
      status: 2
    },
    teams: getRandomTeams(2)
  }
];