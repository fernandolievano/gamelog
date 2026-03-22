<template>
  <div class="flex flex-col mb-6">
    <div class="flex items-center justify-between gap-4">
      
      <!-- Search Input -->
      <div class="relative flex-1 max-w-sm ml-2 md:ml-0">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <!-- Manual SVG since lucide Search export acts tricky occasionally -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <input 
          type="text" 
          v-model="searchInput"
          placeholder="Search your library..." 
          class="block w-full pl-10 pr-10 py-3 border border-day dark:border-night rounded-xl bg-transparent placeholder-gray-500 focus:outline-none transition-all focus:border-blue-500"
        />
        <!-- Internal Clear Button (X) -->
        <button v-show="searchInput" @click="clearSearch" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 cursor-pointer transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <!-- Sort Button & Dropdown -->
      <div class="relative">
        <button @click="showSortDropdown = !showSortDropdown"
          class="border border-day dark:border-night py-3 px-4 text-center flex items-center justify-start gap-3 transition-all hover:bg-day dark:hover:bg-night rounded-xl cursor-pointer">
          Sort
          <ChevronDownIcon />
        </button>

        <transition name="slide-fade" mode="out-in">
          <div v-show="showSortDropdown"
            class="absolute z-20 mt-2 w-48 bg-gradient-to-b from-white to-day dark:from-black dark:to-night rounded-xl shadow-lg right-0 top-12 overflow-hidden border border-day dark:border-night">
            <ul class="p-0 m-0 list-none">
              <li v-for="option in sortOptions" :key="option.value" @click="handleSort(option.value)"
                class="px-4 py-3 text-sm hover:bg-day dark:hover:bg-night cursor-pointer border-b border-gray-800 last:border-0"
                :class="{ 'font-bold text-blue-400': steamStore.sortBy === option.value }">
                {{ option.label }}
              </li>
            </ul>
          </div>
        </transition>
      </div>
        
    </div>

    <!-- Active Search Info Message -->
    <div v-if="filters.q" class="mt-3 flex items-center gap-2 text-sm text-gray-400 ml-2 md:ml-0 fade-in">
      <span>Searching for <span class="text-gray-200 font-semibold italic">"{{ filters.q }}"</span></span>
      <span class="text-gray-600">|</span>
      <button @click="clearSearch" class="text-blue-400 hover:text-blue-300 underline cursor-pointer transition-colors">
        Clear search
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ChevronDownIcon } from "lucide-vue-next";
import { useSteamStore } from '@/stores/steam';
import { useGameFilters } from '@/composables/useGameFilters';

const steamStore = useSteamStore();
const { filters, setSearchQuery } = useGameFilters();

const showSortDropdown = ref(false);

const searchInput = ref(filters.value.q || '');
// Debounce search slightly to avoid spamming the URL and refiltering on every keystroke
let debounceTimer: ReturnType<typeof setTimeout>;
watch(searchInput, (newVal) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    setSearchQuery(newVal);
  }, 250);
});

const clearSearch = () => {
  searchInput.value = '';
  setSearchQuery('');
};

// Watch URL changes to sync back to local input
watch(() => filters.value.q, (newQ) => {
  if (searchInput.value !== (newQ || '')) {
    searchInput.value = newQ || '';
  }
});

const sortOptions = [
  { label: 'Most Played', value: 'playtime_desc' },
  { label: 'Recently Played', value: 'recent_desc' },
  { label: 'Name (A-Z)', value: 'name_asc' },
] as const;

const handleSort = (value: string) => {
  steamStore.setSortBy(value as 'playtime_desc' | 'recent_desc' | 'name_asc');
  showSortDropdown.value = false;
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
