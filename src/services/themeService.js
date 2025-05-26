import defaultThemes from '../styles/default-themes.json'

const API_URL = 'http://localhost:3005/api'
let cachedThemes = null
let hasChanges = false
let isServerAvailable = null

export const themeService = {
  // Check if the theme server is available
  async checkServer() {
    if (isServerAvailable === null) {
      try {
        const response = await fetch(`${API_URL}/themes`)
        isServerAvailable = response.ok
      } catch (error) {
        console.error('Theme server is not available:', error)
        isServerAvailable = false
      }
    }
    return isServerAvailable
  },

  // Load user theme overrides from file
  async loadUserThemes() {
    try {
      if (cachedThemes === null) {
        if (await this.checkServer()) {
          const response = await fetch(`${API_URL}/themes`)
          if (!response.ok) throw new Error('Failed to load themes')
          const data = await response.json()
          cachedThemes = data
          hasChanges = false
        } else {
          console.warn('Theme server not available, using default themes only')
          cachedThemes = {}
          hasChanges = false
        }
      }
      return cachedThemes
    } catch (error) {
      console.error('Error loading user themes:', error)
      cachedThemes = {}
      hasChanges = false
      return {}
    }
  },

  // Save user theme overrides to file
  async saveUserThemes(themes) {
    try {
      if (!await this.checkServer()) {
        throw new Error('Theme server is not available')
      }

      const response = await fetch(`${API_URL}/themes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(themes)
      })

      if (!response.ok) {
        throw new Error(`Failed to save themes: ${response.statusText}`)
      }

      cachedThemes = themes
      hasChanges = false
      return true
    } catch (error) {
      console.error('Error saving user themes:', error)
      // Keep the changes flag true since save failed
      return false
    }
  },

  // Get the merged theme (default + user overrides)
  async getTheme(themeName) {
    const userThemes = await this.loadUserThemes()
    const defaultTheme = defaultThemes[themeName] || defaultThemes.default
    const userTheme = userThemes[themeName] || {}
    
    return {
      ...defaultTheme,
      ...userTheme
    }
  },

  // Save a single color override for a theme
  async saveColorOverride(themeName, colorKey, colorValue, saveToFile = false) {
    if (!cachedThemes) {
      await this.loadUserThemes()
    }
    
    if (!cachedThemes[themeName]) {
      cachedThemes[themeName] = {}
    }
    
    cachedThemes[themeName][colorKey] = colorValue
    
    // If it's a primary color, also update the RGB value
    if (colorKey === 'primary') {
      const rgb = this.hexToRgb(colorValue)
      if (rgb) {
        cachedThemes[themeName]['primary-rgb'] = `${rgb.r}, ${rgb.g}, ${rgb.b}`
      }
    }
    
    hasChanges = true
    
    if (saveToFile) {
      return await this.saveUserThemes(cachedThemes)
    }
    return true
  },

  // Reset a theme to its default values
  async resetTheme(themeName, saveToFile = false) {
    if (!cachedThemes) {
      await this.loadUserThemes()
    }
    
    if (cachedThemes[themeName]) {
      delete cachedThemes[themeName]
      hasChanges = true
      
      if (saveToFile) {
        return await this.saveUserThemes(cachedThemes)
      }
    }
    return true
  },

  // Helper function to convert hex to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  },

  // Get all available theme names
  getThemeNames() {
    return Object.keys(defaultThemes)
  },

  // Apply a theme to the document
  async applyTheme(themeName) {
    const theme = await this.getTheme(themeName)
    const root = document.documentElement
    
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
  },

  // Check if there are unsaved changes
  async hasUnsavedChanges() {
    if (cachedThemes === null) {
      await this.loadUserThemes()
    }
    return hasChanges
  }
} 