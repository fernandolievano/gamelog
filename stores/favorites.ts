import { defineStore } from "pinia";
import { useSteamStore } from "./steam";
import type { SteamGame } from "@/interfaces/steam";

const STORAGE_KEY = "gamelog_favorites";

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    favoriteIds: [] as number[],
  }),

  actions: {
    loadFromStorage() {
      if (typeof window === "undefined") return;

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          this.favoriteIds = JSON.parse(stored);
        } catch {
          this.favoriteIds = [];
        }
      }
    },

    saveToStorage() {
      if (typeof window === "undefined") return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.favoriteIds));
    },

    addFavorite(appid: number) {
      if (!this.favoriteIds.includes(appid)) {
        this.favoriteIds.push(appid);
        this.saveToStorage();
      }
    },

    removeFavorite(appid: number) {
      const index = this.favoriteIds.indexOf(appid);
      if (index > -1) {
        this.favoriteIds.splice(index, 1);
        this.saveToStorage();
      }
    },

    toggleFavorite(appid: number) {
      if (this.favoriteIds.includes(appid)) {
        this.removeFavorite(appid);
      } else {
        this.addFavorite(appid);
      }
    },

    clearAll() {
      this.favoriteIds = [];
      this.saveToStorage();
    },
  },

  getters: {
    isFavorite: (state) => {
      return (appid: number) => state.favoriteIds.includes(appid);
    },

    favoritesCount: (state) => state.favoriteIds.length,

    favoriteGames(): SteamGame[] {
      const steamStore = useSteamStore();
      return steamStore.games.filter((game) =>
        this.favoriteIds.includes(game.appid),
      );
    },
  },
});
