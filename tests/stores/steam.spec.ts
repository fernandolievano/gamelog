import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSteamStore } from '@/stores/steam';
import type { SteamGame } from '@/interfaces/steam';

describe('Steam Store Sorting', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mockGames: SteamGame[] = [
    {
      appid: 1,
      name: 'B Game',
      img_icon_url: '',
      playtime_forever: 100, // 100 minutes
      rtime_last_played: 1000,
    },
    {
      appid: 2,
      name: 'A Game',
      img_icon_url: '',
      playtime_forever: 200, // 200 minutes (Most played)
      rtime_last_played: 500,
    },
    {
      appid: 3,
      name: 'C Game',
      img_icon_url: '',
      playtime_forever: 50,
      rtime_last_played: 2000, // Most recent
    },
  ];

  it('sorts by playtime_desc (default)', () => {
    const store = useSteamStore();
    store.games = mockGames;
    store.setSortBy('playtime_desc');

    const sorted = store.sortedGames;
    expect(sorted[0].appid).toBe(2); // 200 mins
    expect(sorted[1].appid).toBe(1); // 100 mins
    expect(sorted[2].appid).toBe(3); // 50 mins
  });

  it('sorts by name_asc', () => {
    const store = useSteamStore();
    store.games = mockGames;
    store.setSortBy('name_asc');

    const sorted = store.sortedGames;
    expect(sorted[0].name).toBe('A Game');
    expect(sorted[1].name).toBe('B Game');
    expect(sorted[2].name).toBe('C Game');
  });

  it('sorts by recent_desc', () => {
    const store = useSteamStore();
    store.games = mockGames;
    store.setSortBy('recent_desc');

    const sorted = store.sortedGames;
    expect(sorted[0].appid).toBe(3); // 2000
    expect(sorted[1].appid).toBe(1); // 1000
    expect(sorted[2].appid).toBe(2); // 500
  });
});
