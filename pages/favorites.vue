<template>
    <main class="page-class">
        <section class="w-full container mx-auto pb-4 md:pb-8 px-4">
            <header class="w-full pb-8">
                <h1 class="text-2xl md:text-3xl font-bold font-poppins tracking-wider">
                    My Favorites
                </h1>
                <p class="text-gray-one dark:text-gray-two mt-2">
                    {{ favoritesCount }} {{ favoritesCount === 1 ? 'game' : 'games' }} in your collection
                </p>
            </header>

            <article v-if="favoriteGames.length > 0"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 items-start gap-4 md:gap-8">
                <DashboardGamesCard v-for="game in favoriteGames" :key="game.appid" :appid="game.appid"
                    :image="`https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`" :name="game.name"
                    :playtime="game.playtime_forever" />
            </article>

            <article v-else class="w-full py-16 text-center">
                <Heart class="w-16 h-16 mx-auto text-gray-three dark:text-gray-one mb-4" />
                <h2 class="text-xl font-semibold text-gray-one dark:text-gray-two mb-2">
                    No favorites yet
                </h2>
                <p class="text-gray-two dark:text-gray-three mb-6">
                    Start adding games to your favorites by clicking the heart icon on any game card.
                </p>
                <NuxtLink to="/">
                    <AppButton class="max-w-[200px] mx-auto">
                        Browse Games
                    </AppButton>
                </NuxtLink>
            </article>
        </section>
    </main>
</template>

<script lang="ts" setup>
import { Heart } from 'lucide-vue-next';
import { useFavoritesStore } from '@/stores/favorites';
import DashboardGamesCard from '@/components/dashboard/DashboardGamesCard.vue';

const favoritesStore = useFavoritesStore();

const favoriteGames = computed(() => favoritesStore.favoriteGames);
const favoritesCount = computed(() => favoritesStore.favoritesCount);

onMounted(() => {
    favoritesStore.loadFromStorage();
});
</script>
