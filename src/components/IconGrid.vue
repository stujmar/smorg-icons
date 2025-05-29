<template>
  <div class="icon-grid">
    <div class="controls">
      <div class="search-control">
        <div class="search-input-wrapper">
          <svg 
            class="search-icon" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" 
              stroke="currentColor" 
              stroke-width="4" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            />
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search icons..." 
            @input="filterIcons"
            class="search-input"
          >
        </div>
      </div>
      <div class="variant-toggle">
        <Toggle 
          v-model="showSolid"
          on-label="Solid"
          off-label="Outline"
        />
      </div>
      <div class="size-control">
        <label>
          Icon Size:
          <input 
            type="range" 
            v-model="iconSize" 
            min="32" 
            max="80" 
            step="8"
            class="size-slider"
          >
          <span class="size-value">{{ iconSize }}px</span>
        </label>
      </div>
      <div class="filters">
        <div class="meal-filter">
          <select v-model="selectedMeal" aria-label="Filter by meal">
            <option value="">All Meals</option>
            <option v-for="meal in uniqueMeals" :key="meal" :value="meal">
              {{ formatCategory(meal) }}
            </option>
          </select>
        </div>
        <div class="cuisine-filter">
          <select v-model="selectedCuisine" aria-label="Filter by cuisine">
            <option value="">All Cuisines</option>
            <option v-for="cuisine in uniqueCuisines" :key="cuisine" :value="cuisine">
              {{ formatCategory(cuisine) }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="grid">
      <div 
        v-for="(icon, id) in filteredIcons" 
        :key="id"
        class="icon-item"
        @click="copyIconToClipboard(icon)"
      >
        <div 
          class="icon-preview" 
          v-html="showSolid ? icon.solid : icon.outline"
          :style="{ width: `${iconSize}px`, height: `${iconSize}px` }"
        ></div>
        <div class="icon-info">
          <div class="icon-name">{{ icon.name }}</div>
          <div class="icon-categories">
            <span class="category-tag meal-tag">{{ icon.meal }}</span>
            <span 
              v-for="cuisine in icon.cuisines" 
              :key="cuisine"
              class="category-tag cuisine-tag"
            >
              {{ cuisine }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadAllIcons } from '../services/iconService'
import Toggle from './ui/Toggle.vue'

export default {
  name: 'IconGrid',
  components: {
    Toggle
  },
  data() {
    return {
      icons: {},
      showSolid: false,
      selectedMeal: '',
      selectedCuisine: '',
      iconSize: 48,
      copyFeedback: null,
      mealOrder: ['breakfast', 'lunch', 'supper', 'midnight', 'appliance'],
      searchQuery: ''
    }
  },
  async created() {
    this.icons = await loadAllIcons()
  },
  computed: {
    uniqueMeals() {
      const meals = new Set(Object.values(this.icons).map(icon => icon.meal))
      return Array.from(meals).sort((a, b) => {
        return this.mealOrder.indexOf(a) - this.mealOrder.indexOf(b)
      })
    },
    uniqueCuisines() {
      const cuisines = new Set()
      Object.values(this.icons).forEach(icon => {
        icon.cuisines.forEach(cuisine => cuisines.add(cuisine))
      })
      return Array.from(cuisines).sort()
    },
    filteredIcons() {
      return Object.entries(this.icons).reduce((acc, [id, icon]) => {
        const matchesSearch = !this.searchQuery || 
          icon.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          icon.meal.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          icon.cuisines.some(cuisine => cuisine.toLowerCase().includes(this.searchQuery.toLowerCase()))
        
        const matchesMeal = !this.selectedMeal || icon.meal === this.selectedMeal
        const matchesCuisine = !this.selectedCuisine || icon.cuisines.includes(this.selectedCuisine)

        if (matchesSearch && matchesMeal && matchesCuisine) {
          acc[id] = icon
        }
        return acc
      }, {})
    }
  },
  methods: {
    formatCategory(category) {
      return category.charAt(0).toUpperCase() + category.slice(1)
    },
    filterIcons() {
      // The filtering is already handled in the computed property
      console.log('Filtering icons with query:', this.searchQuery)
    },
    async copyIconToClipboard(icon) {
      const svg = this.showSolid ? icon.solid : icon.outline
      try {
        await navigator.clipboard.writeText(svg)
        // You could add a toast notification here
        console.log('Icon copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy icon:', err)
      }
    }
  }
}
</script>

<style>
.icon-grid {
  background-color: var(--color-background);
  max-width: 1280px;
  padding: var(--spacing-md);
  margin-top: 15px;
  position: relative;
  z-index: 1;
}

.controls {
  margin-bottom: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px solid rgba(var(--color-secondary-rgb), 0.2);
  position: relative;
  z-index: 1;
}

.search-control {
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: var(--spacing-sm);
  color: var(--color-secondary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  padding-left: calc(var(--spacing-md) + 20px);
  /* border: 2px solid rgba(var(--color-secondary-rgb), 0.3); */
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.9em;
  transition: all var(--transition-fast);
}

.search-input:hover {
  border-color: var(--color-secondary);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.5);
}

.search-input:focus + .search-icon {
  color: var(--color-primary);
  opacity: 1;
}

.variant-toggle {
  display: flex;
  align-items: center;
}

.size-control {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.size-control label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.size-slider {
  width: 120px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(var(--color-secondary-rgb), 0.8);
  border-radius: var(--radius-pill);
  outline: none;
}

.size-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-secondary);
  cursor: pointer;
  border: none;
  transition: all var(--transition-fast);
}

.size-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.size-value {
  min-width: 48px;
  font-size: 0.9em;
  color: var(--color-text);
}

.filters {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.meal-filter select,
.cuisine-filter select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid rgba(var(--color-secondary-rgb), 0.8);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.9em;
  cursor: pointer;
  min-width: 140px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--spacing-sm) center;
  background-size: 14px;
  padding-right: calc(var(--spacing-md) + 20px);
  transition: all var(--transition-fast);
}

/* .meal-filter select:hover,
.cuisine-filter select:hover {
  border-color: var(--color-secondary);
  background-color: rgba(var(--color-secondary-rgb), 0.05);
} */

.meal-filter select:focus,
.cuisine-filter select:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 2px rgba(var(--color-secondary-rgb), 0.8);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.icon-item {
  padding: var(--spacing-md);
  border: 1px solid rgba(var(--color-secondary-rgb), 0.2);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.icon-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--color-secondary-rgb), 0.15);
  border-color: var(--color-secondary);
}

.icon-preview {
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.icon-preview svg {
  width: 100%;
  height: 100%;
}

.icon-info {
  text-align: center;
}

.icon-name {
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
}

.icon-categories {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  justify-content: center;
}

.category-tag {
  font-size: 0.8em;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.meal-tag {
  background: rgba(var(--color-primary-rgb), 0.2);
  color: var(--color-primary);
  font-weight: 500;
  border: 1px solid rgba(var(--color-primary-rgb), 0.2);
}

.cuisine-tag {
  background: rgba(var(--color-secondary-rgb), 0.2);
  color: var(--color-accent-alt);
  border: 1px solid rgba(var(--color-secondary-rgb), 0.2);
}

@media (prefers-reduced-motion: reduce) {
  .icon-item,
  .icon-preview,
  .size-slider::-webkit-slider-thumb,
  .toggle-slider,
  .toggle-handle {
    transition: none;
  }
}
</style> 