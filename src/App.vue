<script lang="ts">
import IconGrid from './components/IconGrid.vue'
import ThemeColors from './components/ThemeColors.vue'
import { applyTheme } from './styles/theme'
import './styles/global.css'

export default {
  name: 'App',
  components: {
    IconGrid,
    ThemeColors
  },
  data() {
    return {
      searchQuery: '',
      selectedMeal: 'breakfast',
      meals: ['breakfast', 'lunch', 'supper', 'midnight snack']
    }
  },
  methods: {
    filterIcons() {
      // TODO: Implement icon filtering
      console.log('Filtering icons with query:', this.searchQuery)
    },
    selectMeal(meal: string) {
      this.selectedMeal = meal
      // Apply theme based on meal time
      const themeMap: Record<string, string> = {
        'midnight snack': 'midnight'
      }
      const themeName = themeMap[meal] || meal
      applyTheme(themeName)
    }
  },
  mounted() {
    // Apply default theme
    applyTheme(this.selectedMeal)
  }
}
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <h1>Smorgasbord Icon Library</h1>
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search icons..." 
            @input="filterIcons"
          >
        </div>
      </div>
    </header>
    <nav class="meal-nav">
      <div class="nav-content">
        <div class="meal-buttons">
          <button 
            v-for="meal in meals" 
            :key="meal"
            :class="['meal-button', { active: selectedMeal === meal }]"
            @click="selectMeal(meal)"
          >
            {{ meal }}
          </button>
        </div>
        <ThemeColors />
      </div>
    </nav>
    <main class="main-content">
      <div class="content-wrapper">
        <IconGrid />
      </div>
    </main>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100vw;
  overflow-x: hidden;
}

.app {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.header {
  background-color: var(--color-primary);
  color: var(--color-surface);
  padding: var(--spacing-md) 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.header-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px;
;
}

.header h1 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 1.5rem;
}

.search-bar {
  width: 100%;
}

.search-bar input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid transparent;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.15);
  color: var(--color-surface);
  transition: all var(--transition-fast);
  min-height: 44px;
  outline: none;
}

.search-bar input::placeholder {
  color: rgba(255, 255, 255, 0.8);
  opacity: 0.8;
}

.search-bar input:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.search-bar input:focus {
  background-color: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 0 0 4px rgba(255, 255, 255, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

.meal-nav {
  padding: var(--spacing-md) 0;
  display: flex;
  justify-content: center;
  background-color: var(--color-surface);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.nav-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meal-buttons {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.meal-button {
  position: relative;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-transform: capitalize;
  outline: none;
  min-width: 120px;
  min-height: 44px;
  user-select: none;
  -webkit-font-smoothing: antialiased;
}

.meal-button::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: calc(var(--radius-md) + 2px);
  background: transparent;
  transition: background var(--transition-fast);
  z-index: -1;
}

.meal-button:hover {
  background-color: var(--color-primary);
  color: var(--color-surface);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.2);
}

.meal-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(var(--color-primary-rgb), 0.1);
}

.meal-button:focus-visible {
  outline: none;
}

.meal-button:focus-visible::before {
  background: rgba(var(--color-primary-rgb), 0.1);
  box-shadow: 0 0 0 2px var(--color-surface), 0 0 0 4px var(--color-primary);
}

.meal-button.active {
  background-color: var(--color-primary);
  color: var(--color-surface);
  box-shadow: 0 2px 4px rgba(var(--color-primary-rgb), 0.2);
}

.main-content {
  flex: 1;
  width: 100%;
  background-color: var(--color-background);
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

@media (prefers-contrast: more) {
  .meal-button {
    border-width: 3px;
  }
  
  .meal-button:focus-visible::before {
    box-shadow: 0 0 0 3px var(--color-surface), 0 0 0 6px var(--color-primary);
  }
  
  .search-bar input {
    border-width: 3px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .meal-button,
  .search-bar input,
  .meal-button::before {
    transition: none;
  }
  
  .meal-button:hover {
    transform: none;
  }
}
</style>
