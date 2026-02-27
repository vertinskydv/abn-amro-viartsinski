type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

interface Schedule {
  time: string;
  days: Day[];
}

interface Rating {
  average: number | null;
}

interface Country {
  name: string;
  code: string;
  timezone: string;
}

interface Network {
  id: number;
  name: string;
  country: Country;
  officialSite: string | null;
}

interface WebChannel {
  id: number;
  name: string;
  country: Country | null;
  officialSite: string | null;
}

interface Image {
  medium: string;
  original: string;
}

interface Externals {
  tvrage: number | null;
  thetvdb: number | null;
  imdb: string | null;
}

interface Link {
  href: string;
  name?: string;
}

interface Links {
  self: Link;
  previousepisode?: Link;
  nextepisode?: Link;
}

export interface ShowDto {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  schedule: Schedule;
  rating: Rating;
  weight: number;
  network: Network | null;
  webChannel: WebChannel | null;
  dvdCountry: Country | null;
  externals: Externals;
  image: Image | null;
  summary: string | null;
  updated: number;
  _links: Links;
}
