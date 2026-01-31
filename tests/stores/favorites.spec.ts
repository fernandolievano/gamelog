import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useFavoritesStore } from "@/stores/favorites";
import { useSteamStore } from "@/stores/steam";
import type { SteamGame } from "@/interfaces/steam";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string): string | null => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

const mockGames: SteamGame[] = [
  {
    appid: 100,
    name: "Game A",
    img_icon_url: "",
    playtime_forever: 500,
    rtime_last_played: 1000,
  },
  {
    appid: 200,
    name: "Game B",
    img_icon_url: "",
    playtime_forever: 300,
    rtime_last_played: 2000,
  },
  {
    appid: 300,
    name: "Game C",
    img_icon_url: "",
    playtime_forever: 100,
    rtime_last_played: 3000,
  },
];

describe("Favorites Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("addFavorite", () => {
    it("adds appid to favorites", () => {
      const store = useFavoritesStore();
      store.addFavorite(100);

      expect(store.favoriteIds).toContain(100);
    });

    it("persists to localStorage", () => {
      const store = useFavoritesStore();
      store.addFavorite(100);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "gamelog_favorites",
        JSON.stringify([100]),
      );
    });

    it("does not add duplicate appids", () => {
      const store = useFavoritesStore();
      store.addFavorite(100);
      store.addFavorite(100);

      expect(store.favoriteIds).toHaveLength(1);
    });
  });

  describe("removeFavorite", () => {
    it("removes appid from favorites", () => {
      const store = useFavoritesStore();
      store.addFavorite(100);
      store.addFavorite(200);
      store.removeFavorite(100);

      expect(store.favoriteIds).not.toContain(100);
      expect(store.favoriteIds).toContain(200);
    });

    it("persists removal to localStorage", () => {
      const store = useFavoritesStore();
      store.addFavorite(100);
      vi.clearAllMocks();
      store.removeFavorite(100);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "gamelog_favorites",
        JSON.stringify([]),
      );
    });
  });

  describe("toggleFavorite", () => {
    it("adds when not favorited", () => {
      const store = useFavoritesStore();
      store.toggleFavorite(100);

      expect(store.favoriteIds).toContain(100);
    });

    it("removes when already favorited", () => {
      const store = useFavoritesStore();
      store.addFavorite(100);
      store.toggleFavorite(100);

      expect(store.favoriteIds).not.toContain(100);
    });
  });

  describe("loadFromStorage", () => {
    it("loads favorites from localStorage", () => {
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([100, 200]));
      const store = useFavoritesStore();
      store.loadFromStorage();

      expect(store.favoriteIds).toEqual([100, 200]);
    });

    it("handles invalid JSON gracefully", () => {
      localStorageMock.getItem.mockReturnValueOnce("invalid-json");
      const store = useFavoritesStore();
      store.loadFromStorage();

      expect(store.favoriteIds).toEqual([]);
    });

    it("handles empty storage", () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      const store = useFavoritesStore();
      store.loadFromStorage();

      expect(store.favoriteIds).toEqual([]);
    });
  });

  describe("getters", () => {
    it("isFavorite returns true for favorited appid", () => {
      const store = useFavoritesStore();
      store.addFavorite(100);

      expect(store.isFavorite(100)).toBe(true);
      expect(store.isFavorite(200)).toBe(false);
    });

    it("favoritesCount returns correct count", () => {
      const store = useFavoritesStore();
      expect(store.favoritesCount).toBe(0);

      store.addFavorite(100);
      store.addFavorite(200);
      expect(store.favoritesCount).toBe(2);
    });

    it("favoriteGames filters from steamStore", () => {
      const steamStore = useSteamStore();
      steamStore.games = mockGames;

      const favoritesStore = useFavoritesStore();
      favoritesStore.addFavorite(100);
      favoritesStore.addFavorite(300);

      const favorites = favoritesStore.favoriteGames;
      expect(favorites).toHaveLength(2);
      expect(favorites.map((g) => g.appid)).toEqual([100, 300]);
    });
  });

  describe("clearAll", () => {
    it("removes all favorites", () => {
      const store = useFavoritesStore();
      store.addFavorite(100);
      store.addFavorite(200);
      store.clearAll();

      expect(store.favoriteIds).toHaveLength(0);
    });
  });
});
