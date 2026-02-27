import axios, { type AxiosResponse } from 'axios';
import type { ShowDto } from '../types/api/ShowDto';
import type { Show } from '../types/entities/Show';

const mapShow = ({
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
    'https://api.tvmaze.com/shows',
  );
  return response.data.map(mapShow);
}

export async function getShowsById(id: string): Promise<Show> {
  const response = await axios.get<void, AxiosResponse<ShowDto>>(
    `https://api.tvmaze.com/shows/${id}`,
  );
  return mapShow(response.data);
}

export async function getShowsByName(name: string): Promise<Show[]> {
  const response = await axios.get<
    void,
    AxiosResponse<Array<{ score: number; show: ShowDto[] }>>
  >(`https://api.tvmaze.com/search/shows?q=${name.trim()}`);
  return response.data
    .sort((a, b) => b.score - a.score)
    .flatMap(({ show }) => show)
    .map(mapShow);
}
