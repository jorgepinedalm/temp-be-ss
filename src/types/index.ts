export interface Team {
  id: number;
  name: string;
  color: string;
  initials: string;
  image: string | null;
  athletes_count: number;
}

export interface Athlete {
  id: number;
  full_name: string;
  photo: string | null;
  birthday: string | null;
  age: number | null;
  institution_image: string | null;
  latest_status: {
    id: number;
    date: string;
    status: number;
  };
  teams: Team[];
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    total_rows: number;
    per_page: number;
    page: number;
  };
}