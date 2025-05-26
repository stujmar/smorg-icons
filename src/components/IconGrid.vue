<template>
  <div class="icon-grid">
    <div class="controls">
      <div class="variant-toggle">
        <label class="toggle">
          <span class="toggle-label">{{ showSolid ? 'Solid' : 'Outline' }}</span>
          <div class="toggle-switch">
            <input 
              type="checkbox" 
              v-model="showSolid"
              class="toggle-input"
            >
            <div class="toggle-slider">
              <div class="toggle-handle"></div>
            </div>
          </div>
        </label>
      </div>
      <div class="size-control">
        <label>
          Icon Size:
          <input 
            type="range" 
            v-model="iconSize" 
            min="24" 
            max="96" 
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
import icons from '../data/icons.json'

export default {
  name: 'IconGrid',
  data() {
    return {
      icons,
      showSolid: true,
      selectedMeal: '',
      selectedCuisine: '',
      iconSize: 48,
      copyFeedback: null,
      mealOrder: ['breakfast', 'lunch', 'supper', 'midnight']
    }
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
        const matchesSearch = !this.$root.searchQuery || 
          icon.name.toLowerCase().includes(this.$root.searchQuery.toLowerCase()) ||
          icon.meal.toLowerCase().includes(this.$root.searchQuery.toLowerCase()) ||
          icon.cuisines.some(cuisine => cuisine.toLowerCase().includes(this.$root.searchQuery.toLowerCase()))
        
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
  padding: var(--spacing-md);
  background-color: var(--color-background);
  min-height: 100vh;
}

.controls {
  margin-bottom: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-secondary);
  box-shadow: 0 4px 12px rgba(var(--color-secondary-rgb), 0.15);
}

.variant-toggle {
  display: flex;
  align-items: center;
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.toggle-label {
  font-size: 0.9em;
  min-width: 48px;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(var(--color-secondary-rgb), 0.3);
  transition: all var(--transition-fast);
  border-radius: 9999px;
}

.toggle-handle {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: var(--color-surface);
  transition: all var(--transition-fast);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-input:checked + .toggle-slider {
  background-color: var(--color-primary);
}

.toggle-input:checked + .toggle-slider .toggle-handle {
  transform: translateX(20px);
}

.toggle-input:focus-visible + .toggle-slider {
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
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
  background: rgba(var(--color-secondary-rgb), 0.3);
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
  border: 2px solid rgba(var(--color-secondary-rgb), 0.3);
  border-radius: var(--radius-lg);
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

.meal-filter select:hover,
.cuisine-filter select:hover {
  border-color: var(--color-secondary);
  background-color: rgba(var(--color-secondary-rgb), 0.05);
}

.meal-filter select:focus,
.cuisine-filter select:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 2px rgba(var(--color-secondary-rgb), 0.2);
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
  color: var(--color-secondary);
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