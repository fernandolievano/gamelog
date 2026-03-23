<template>
  <button type="button" class="favorite-btn" :class="{ 'is-active': isFavorited }"
    :aria-label="isFavorited ? 'Remove from favorites' : 'Add to favorites'" @click.stop.prevent="handleClick">
    <Heart class="favorite-icon" :class="{ 'fill-current': isFavorited }" />
  </button>
</template>

<script lang="ts" setup>
import { Heart } from "lucide-vue-next";
import { useFavoritesStore } from "@/stores/favorites";

const props = defineProps<{
  appid: number;
}>();

const emit = defineEmits<{
  toggle: [isFavorited: boolean];
}>();

const favoritesStore = useFavoritesStore();
const isFavorited = computed(() => favoritesStore.isFavorite(props.appid));

const handleClick = () => {
  favoritesStore.toggleFavorite(props.appid);
  emit("toggle", isFavorited.value);
};
</script>

<style scoped>
.favorite-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  /* Glassmorphism effect */
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.favorite-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.favorite-btn:active {
  transform: scale(0.95);
}

.favorite-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  /* gray-400 */
  transition: all 0.2s ease-in-out;
}

.favorite-btn:hover .favorite-icon {
  color: #fb7185;
  /* rose-400 */
}

.favorite-btn.is-active .favorite-icon {
  color: #f43f5e;
  /* rose-500 */
}

/* Dark mode adjustments */
:where(.dark, .dark *) .favorite-btn {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:where(.dark, .dark *) .favorite-btn:hover {
  background: rgba(0, 0, 0, 0.4);
}
</style>
