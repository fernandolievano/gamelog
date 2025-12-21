<template>
  <div class="flex items-center justify-end gap-2 mb-4 relative">
    <button @click="showDropdown = !showDropdown"
      class="border border-day dark:border-night py-3 px-4 text-center flex items-center justify-start gap-3 transition-all hover:bg-day dark:hover:bg-night rounded-xl cursor-pointer">
      Sort
      <ChevronDownIcon />
    </button>

    <transition name="slide-fade" mode="out-in">
      <div v-if="showDropdown"
        class="absolute z-10 mt-2 w-48 bg-gradient-to-b from-white to-day dark:from-black dark:to-night rounded-xl shadow-lg right-0 top-12 overflow-hidden border border-day dark:border-night">
        <ul class="p-0">
          <li v-for="option in sortOptions" :key="option.value" @click="handleSort(option.value)"
            class="px-4 py-3 text-sm hover:bg-day dark:hover:bg-night cursor-pointer">
            {{ option.label }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from "lucide-vue-next";
import { useSteamStore } from '@/stores/steam';

const steamStore = useSteamStore();

const showDropdown = ref(false);

const sortOptions = [
  { label: 'Most Played', value: 'playtime_desc' },
  { label: 'Recently Played', value: 'recent_desc' },
  { label: 'Name (A-Z)', value: 'name_asc' },
] as const;

const handleSort = (value: string) => {
  steamStore.setSortBy(value as 'playtime_desc' | 'recent_desc' | 'name_asc');
  showDropdown.value = false;
}
</script>
