import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getShows, getShowsById, getShowsByName } from '../shows';
import type { ShowDto } from '../../types/api/ShowDto';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

const mockShowDto: ShowDto = {
  id: 1,
  url: 'https://www.tvmaze.com/shows/4639/conspiracy-test',
  name: 'Conspiracy Test',
  type: 'Documentary',
  language: 'English',
  genres: [],
  status: 'Ended',
  runtime: 60,
  averageRuntime: 60,
  premiered: '2007-04-02',
  ended: '2007-08-13',
  officialSite: null,
  schedule: {
    time: '',
    days: [],
  },
  rating: {
    average: null,
  },
  weight: 69,
  network: {
    id: 53,
    name: 'History',
    country: {
      name: 'United States',
      code: 'US',
      timezone: 'America/New_York',
    },
    officialSite: 'https://www.history.com/',
  },
  webChannel: null,
  dvdCountry: null,
  externals: {
    tvrage: null,
    thetvdb: 249525,
    imdb: 'tt1112283',
  },
  image: {
    medium:
      'https://static.tvmaze.com/uploads/images/medium_portrait/302/755457.jpg',
    original:
      'https://static.tvmaze.com/uploads/images/original_untouched/302/755457.jpg',
  },
  summary:
    "<p>Delving into the theories behind some of the nation's biggest mysteries.</p>",
  updated: 1639087938,
  _links: {
    self: {
      href: 'https://api.tvmaze.com/shows/4639',
    },
    previousepisode: {
      href: 'https://api.tvmaze.com/episodes/297501',
      name: 'Alien Abductions',
    },
  },
};

const expectedShow = {
  genres: [],
  id: 1,
  image: {
    medium:
      'https://static.tvmaze.com/uploads/images/medium_portrait/302/755457.jpg',
    original:
      'https://static.tvmaze.com/uploads/images/original_untouched/302/755457.jpg',
  },
  language: 'English',
  name: 'Conspiracy Test',
  rating: {
    average: null,
  },
  summary:
    "<p>Delving into the theories behind some of the nation's biggest mysteries.</p>",
  year: '2007',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getShows', () => {
  it('fetches all shows and maps them correctly', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: [mockShowDto] });

    const result = await getShows();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.tvmaze.com/shows',
    );
    expect(result).toEqual([expectedShow]);
  });

  it('returns an empty array when no shows are returned', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: [] });

    const result = await getShows();

    expect(result).toEqual([]);
  });

  it('throws when the request fails', async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error('Network Error'));

    await expect(getShows()).rejects.toThrow('Network Error');
  });
});

describe('getShowsById', () => {
  it('fetches a show by id and maps it correctly', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: mockShowDto });

    const result = await getShowsById('1');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.tvmaze.com/shows/1',
    );
    expect(result).toEqual(expectedShow);
  });

  it('maps a show with no premiered date (year is undefined)', async () => {
    const dtoWithoutPremiered = { ...mockShowDto, premiered: undefined };
    mockedAxios.get = vi.fn().mockResolvedValue({ data: dtoWithoutPremiered });

    const result = await getShowsById('1');

    expect(result.year).toBeUndefined();
  });

  it('throws when the request fails', async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error('Not Found'));

    await expect(getShowsById('999')).rejects.toThrow('Not Found');
  });
});

describe('getShowsByName', () => {
  it('fetches shows by name, sorts by score, and maps correctly', async () => {
    const searchResults = [
      { score: 7.5, show: [{ ...mockShowDto, id: 2, name: 'Bad' }] },
      { score: 9.0, show: [mockShowDto] },
    ];
    mockedAxios.get = vi.fn().mockResolvedValue({ data: searchResults });

    const result = await getShowsByName('breaking bad');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.tvmaze.com/search/shows?q=breaking bad',
    );
    expect(result?.[0]?.id).toBe(1);
    expect(result?.[1]?.id).toBe(2);
  });

  it('trims whitespace from the name before querying', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: [] });

    await getShowsByName('  lost  ');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.tvmaze.com/search/shows?q=lost',
    );
  });

  it('returns an empty array when no results are found', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: [] });

    const result = await getShowsByName('xyznonexistent');

    expect(result).toEqual([]);
  });

  it('throws when the request fails', async () => {
    mockedAxios.get = vi
      .fn()
      .mockRejectedValue(new Error('Service Unavailable'));

    await expect(getShowsByName('test')).rejects.toThrow('Service Unavailable');
  });
});
