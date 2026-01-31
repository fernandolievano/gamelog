import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import FavoriteButton from "@/components/global/FavoriteButton.vue";
import { useFavoritesStore } from "@/stores/favorites";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn((): string | null => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(global, "localStorage", { value: localStorageMock });

describe("FavoriteButton.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("renders heart icon", () => {
    const wrapper = mount(FavoriteButton, {
      props: { appid: 100 },
    });

    expect(wrapper.find("svg").exists()).toBe(true);
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("emits toggle event on click", async () => {
    const wrapper = mount(FavoriteButton, {
      props: { appid: 100 },
    });

    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("toggle")).toBeTruthy();
    expect(wrapper.emitted("toggle")![0]).toEqual([true]);
  });

  it("shows active state when favorited", async () => {
    const favoritesStore = useFavoritesStore();
    favoritesStore.addFavorite(100);

    const wrapper = mount(FavoriteButton, {
      props: { appid: 100 },
    });

    expect(wrapper.find("button").classes()).toContain("is-active");
  });

  it("does not show active state when not favorited", () => {
    const wrapper = mount(FavoriteButton, {
      props: { appid: 100 },
    });

    expect(wrapper.find("button").classes()).not.toContain("is-active");
  });

  it("toggles favorite state on click", async () => {
    const favoritesStore = useFavoritesStore();
    const wrapper = mount(FavoriteButton, {
      props: { appid: 100 },
    });

    expect(favoritesStore.isFavorite(100)).toBe(false);

    await wrapper.find("button").trigger("click");
    expect(favoritesStore.isFavorite(100)).toBe(true);

    await wrapper.find("button").trigger("click");
    expect(favoritesStore.isFavorite(100)).toBe(false);
  });

  it("has correct aria-label when not favorited", () => {
    const wrapper = mount(FavoriteButton, {
      props: { appid: 100 },
    });

    expect(wrapper.find("button").attributes("aria-label")).toBe(
      "Add to favorites",
    );
  });

  it("has correct aria-label when favorited", () => {
    const favoritesStore = useFavoritesStore();
    favoritesStore.addFavorite(100);

    const wrapper = mount(FavoriteButton, {
      props: { appid: 100 },
    });

    expect(wrapper.find("button").attributes("aria-label")).toBe(
      "Remove from favorites",
    );
  });
});
