interface Rating {
  average: number | null;
}

interface Image {
  medium: string;
  original: string;
}

export interface Show {
  id: number;
  name: string;
  language: string;
  genres: string[];
  rating: Rating;
  image: Image | null;
  summary: string | null;
  year?: string;
}
