import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { gameFiltersSchema, type GameFiltersParams } from '@/utils/filters';
import { useSteamStore } from '@/stores/steam';

export const useGameFilters = () => {
  const route = useRoute();
  const router = useRouter();
  const steamStore = useSteamStore();

  const filters = computed<GameFiltersParams>(() => {
    const parsed = gameFiltersSchema.safeParse(route.query);
    if (parsed.success) {
      return parsed.data;
    }
    return gameFiltersSchema.parse({});
  });

  // Sync URL state to Pinia store automatically
  watch(
    () => filters.value.q,
    (q) => {
      steamStore.setSearchQuery(q || '');
    },
    { immediate: true }
  );

  const setSearchQuery = (q: string) => {
    updateQuery({
      ...route.query,
      q: q || undefined,
    });
  };

  const updateQuery = (newQuery: Record<string, any>) => {
    const query = Object.fromEntries(
      Object.entries(newQuery).filter(([_, v]) => v != null && v !== '')
    );
    router.push({ query });
  };

  return {
    filters,
    setSearchQuery,
  };
};
