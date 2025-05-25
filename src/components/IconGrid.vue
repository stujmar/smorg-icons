<template>
  <div class="icon-grid">
    <div v-for="icon in icons" :key="icon.name" class="icon-item">
      <Icon 
        :name="icon.name"
        :path="icon.path"
        :mode="icon.mode"
        :color-theme="icon.colorTheme"
        :size="64"
      />
      <div class="icon-name">{{ icon.name }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Icon from './Icon.vue'

interface IconData {
  name: string;
  path: string;
  mode: 'solid' | 'outline';
  colorTheme: 'default' | 'breakfast' | 'lunch' | 'supper' | 'midnight';
}

export default {
  name: 'IconGrid',
  components: {
    Icon
  },
  data() {
    return {
      icons: [] as IconData[]
    }
  },
  mounted() {
    // TODO: Load icons from your assets
    this.icons = [
      {
        name: 'Example Icon',
        path: '/path/to/icon.png',
        mode: 'solid',
        colorTheme: 'default'
      },
      {
        name: 'Breakfast Icon',
        path: '/path/to/breakfast.png',
        mode: 'outline',
        colorTheme: 'breakfast'
      }
    ]
  }
}
</script>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
  width: 100%;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  border: 2px solid transparent;
}

.icon-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 92, 64, 0.15);
  border-color: var(--primary-color);
}

.icon-name {
  font-size: 0.875rem;
  text-align: center;
  color: #333;
  width: 100%;
  word-break: break-word;
  margin-top: 0.5rem;
}
</style> 