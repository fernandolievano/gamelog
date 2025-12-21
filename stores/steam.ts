import { defineStore } from "pinia";
import type { SteamPlayer, SteamGame } from "@/interfaces/steam";

export const useSteamStore = defineStore("steam", {
  state: () => ({
    player: null as SteamPlayer | null,
    playerLoading: true,
    games: [] as SteamGame[],
    gameLoading: true,
    game_count: 0,
    sortBy: "playtime_desc" as "name_asc" | "playtime_desc" | "recent_desc",
  }),
  actions: {
    setPlayerSummary(player: SteamPlayer) {
      this.player = player;
      this.playerLoading = false;
    },
    setOwnedGames(games: SteamGame[], game_count: number) {
      // Filter out test and benchmark games
      this.games = games.filter((game) => {
        const name = game.name.toLowerCase();
        if (name.includes("test") || name.includes("benchmark")) {
          return false;
        }
        return true;
      });

      this.game_count = this.games.length;
      this.gameLoading = false;
    },
    setSortBy(sort: "name_asc" | "playtime_desc" | "recent_desc") {
      this.sortBy = sort;
    },
    async logout() {
      try {
        await $fetch("/api/auth/logout", {
          method: "POST",
        });

        navigateTo("/login", { replace: true });
      } catch (err) {
        console.error("Logout failed:", err);
      }
    },
  },
  getters: {
    sortedGames: (state) => {
      const games = [...state.games];

      return games.sort((a, b) => {
        switch (state.sortBy) {
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "recent_desc":
            return b.rtime_last_played - a.rtime_last_played;
          case "playtime_desc":
          default:
            return b.playtime_forever - a.playtime_forever;
        }
      });
    },
    mostPlayedGame: (state) => {
      if (state.games.length > 0) {
        return state.games.reduce((prev, current) => {
          return prev.playtime_forever > current.playtime_forever
            ? prev
            : current;
        });
      }
      return null;
    },
    selectedGame: (state) => {
      if (state.games.length > 0) {
        return (appid: number) => {
          const game = state.games.find((game) => game.appid === appid);
          if (game) {
            return game;
          }
          return null;
        };
      }

      return null;
    },
  },
});
