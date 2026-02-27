import axios, { type AxiosResponse } from 'axios';
import type { ShowDto } from '../types/api/ShowDto';
import type { Show } from '../types/entities/Show';

const BASE_URL = 'https://api.tvmaze.com';

const showMapper = ({
  id,
  name,
  genres,
  image,
  rating,
  language,
  summary,
  premiered,
}: ShowDto): Show => ({
  id,
  name,
  language,
  genres,
  rating,
  image,
  summary,
  year: premiered?.split('-')[0],
});

export async function getShows(): Promise<Show[]> {
  const response = await axios.get<void, AxiosResponse<ShowDto[]>>(
    `${BASE_URL}/shows`,
  );
  return response.data.map(showMapper);
}

export async function getShowsById(id: string): Promise<Show> {
  const response = await axios.get<void, AxiosResponse<ShowDto>>(
    `${BASE_URL}/shows/${id}`,
  );
  return showMapper(response.data);
}

export async function getShowsByName(name: string): Promise<Show[]> {
  const response = await axios.get<
    void,
    AxiosResponse<Array<{ score: number; show: ShowDto[] }>>
  >(`${BASE_URL}/search/shows?q=${name.trim()}`);
  return response.data
    .sort((a, b) => b.score - a.score)
    .flatMap(({ show }) => show)
    .map(showMapper);
}
