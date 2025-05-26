<template>
  <div class="theme-colors-wrapper">
    <button 
      class="theme-colors-button" 
      @click="isOpen = !isOpen"
      :aria-expanded="isOpen"
      :title="isOpen ? 'Hide theme colors' : 'Show theme colors'"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C12.83 21 13.5 20.33 13.5 19.5C13.5 19.11 13.35 18.76 13.11 18.49C12.88 18.23 12.73 17.88 12.73 17.5C12.73 16.67 13.4 16 14.23 16H16C18.76 16 21 13.76 21 11C21 6.58 16.97 3 12 3ZM6.5 12C5.67 12 5 11.33 5 10.5C5 9.67 5.67 9 6.5 9C7.33 9 8 9.67 8 10.5C8 11.33 7.33 12 6.5 12ZM9.5 8C8.67 8 8 7.33 8 6.5C8 5.67 8.67 5 9.5 5C10.33 5 11 5.67 11 6.5C11 7.33 10.33 8 9.5 8ZM14.5 8C13.67 8 13 7.33 13 6.5C13 5.67 13.67 5 14.5 5C15.33 5 16 5.67 16 6.5C16 7.33 15.33 8 14.5 8ZM17.5 12C16.67 12 16 11.33 16 10.5C16 9.67 16.67 9 17.5 9C18.33 9 19 9.67 19 10.5C19 11.33 18.33 12 17.5 12Z" fill="currentColor"/>
      </svg>
    </button>
    <div v-if="isOpen" class="color-panel">
      <div class="theme-selector">
        <label for="theme-select">Current Theme:</label>
        <select 
          id="theme-select" 
          v-model="selectedTheme"
          @change="onThemeChange"
        >
          <option v-for="theme in themeNames" :key="theme" :value="theme">
            {{ formatName(theme) }}
          </option>
        </select>
        <button 
          class="reset-button" 
          @click="resetCurrentTheme"
          :title="'Reset ' + selectedTheme + ' theme to defaults'"
        >
          Reset to Default
        </button>
        <button 
          class="save-button" 
          @click="saveChanges"
          :class="{ 'has-changes': hasUnsavedChanges }"
          :disabled="!hasUnsavedChanges"
          :title="hasUnsavedChanges ? 'Save theme changes to file' : 'No unsaved changes'"
        >
          Save Changes
        </button>
        <span v-if="saveError" class="save-error">
          {{ saveError }}
        </span>
      </div>
      <div class="color-grid">
        <div v-for="(value, name) in themeColors" :key="name" class="color-item">
          <div class="color-preview-wrapper">
            <div 
              class="color-preview" 
              :style="{ backgroundColor: value }"
              :aria-label="'Color preview for ' + name"
            ></div>
            <input 
              type="color" 
              :value="value"
              @input="updateColor(name, $event.target.value)"
              class="color-picker"
              :aria-label="'Color picker for ' + name"
            >
          </div>
          <div class="color-info">
            <span class="color-name">{{ formatName(name) }}</span>
            <div class="color-value-wrapper">
              <code class="color-value">{{ value }}</code>
              <button 
                class="copy-button" 
                @click="copyToClipboard(value)"
                :title="'Copy ' + value"
                :aria-label="'Copy ' + value + ' to clipboard'"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { themeService } from '../services/themeService'

export default {
  name: 'ThemeColors',
  props: {
    currentTheme: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      isOpen: false,
      themeColors: {},
      selectedTheme: this.currentTheme,
      themeNames: themeService.getThemeNames(),
      hasUnsavedChanges: false,
      saveError: ''
    }
  },
  watch: {
    currentTheme: {
      handler(newTheme) {
        this.selectedTheme = newTheme;
        this.updateThemeColors();
      },
      immediate: true
    }
  },
  methods: {
    async updateThemeColors() {
      this.saveError = ''
      const theme = await themeService.getTheme(this.selectedTheme)
      // Filter out the RGB values as they're derived
      this.themeColors = Object.fromEntries(
        Object.entries(theme).filter(([key]) => !key.endsWith('-rgb'))
      )
      await this.checkUnsavedChanges()
    },
    formatName(name) {
      return name.charAt(0).toUpperCase() + name.slice(1)
    },
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text)
        // You could add a toast notification here if desired
      } catch (err) {
        console.error('Failed to copy text: ', err)
      }
    },
    async updateColor(colorKey, value) {
      this.saveError = ''
      await themeService.saveColorOverride(this.selectedTheme, colorKey, value)
      await this.updateThemeColors()
      await themeService.applyTheme(this.selectedTheme)
      this.$emit('theme-changed', this.selectedTheme)
      await this.checkUnsavedChanges()
    },
    async onThemeChange() {
      this.saveError = ''
      await this.updateThemeColors()
      await themeService.applyTheme(this.selectedTheme)
      this.$emit('theme-changed', this.selectedTheme)
      await this.checkUnsavedChanges()
    },
    async resetCurrentTheme() {
      this.saveError = ''
      await themeService.resetTheme(this.selectedTheme)
      await this.updateThemeColors()
      await themeService.applyTheme(this.selectedTheme)
      this.$emit('theme-changed', this.selectedTheme)
      await this.checkUnsavedChanges()
    },
    async saveChanges() {
      this.saveError = ''
      const success = await themeService.saveUserThemes(await themeService.loadUserThemes())
      if (!success) {
        this.saveError = 'Failed to save changes. Is the theme server running?'
      }
      await this.checkUnsavedChanges()
    },
    async checkUnsavedChanges() {
      this.hasUnsavedChanges = await themeService.hasUnsavedChanges()
    }
  },
  async mounted() {
    await this.updateThemeColors()
    await this.checkUnsavedChanges()
  }
}
</script>

<style>
.theme-colors-wrapper {
  position: relative;
  margin-left: var(--spacing-md);
}

.theme-colors-button {
  width: 44px;
  height: 44px;
  padding: var(--spacing-sm);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-colors-button:hover {
  background-color: var(--color-secondary);
  border-color: var(--color-secondary);
  color: var(--color-surface);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.2);
}

.theme-colors-button:active {
  transform: translateY(0);
}

.color-panel {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  right: 0;
  background: var(--color-background);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 300px;
  max-width: 400px;
}

.theme-selector {
  padding: var(--spacing-md);
  border-bottom: 1px solid rgba(var(--color-primary-rgb), 0.1);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.theme-selector select {
  padding: 8px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(var(--color-primary-rgb), 0.2);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.9em;
  cursor: pointer;
}

.reset-button {
  padding: 8px 12px;
  border: 1px solid rgba(var(--color-primary-rgb), 0.2);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-primary);
  font-size: 0.9em;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.reset-button:hover {
  background: rgba(var(--color-primary-rgb), 0.1);
}

.save-button {
  padding: 8px 12px;
  border: 1px solid rgba(var(--color-primary-rgb), 0.2);
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: var(--color-surface);
  font-size: 0.9em;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.save-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(var(--color-primary-rgb), 0.2);
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(var(--color-primary-rgb), 0.5);
}

.color-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
}

.color-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(var(--color-primary-rgb), 0.1);
}

.color-preview-wrapper {
  position: relative;
  width: 32px;
  height: 32px;
}

.color-preview {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-sm);
  border: 2px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.color-picker {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.color-name {
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9em;
}

.color-value-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.color-value {
  font-family: monospace;
  font-size: 0.85em;
  color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.1);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.copy-button {
  padding: 4px;
  border: none;
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  opacity: 0.7;
}

.copy-button:hover {
  opacity: 1;
  background: rgba(var(--color-primary-rgb), 0.1);
}

.copy-button:active {
  transform: scale(0.95);
}

@media (prefers-reduced-motion: reduce) {
  .theme-colors-button,
  .copy-button {
    transition: none;
  }
}

.save-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-left: 0.5rem;
}
</style> 