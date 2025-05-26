<template>
  <div 
    class="icon-wrapper"
    :style="{
      width: `${size}px`,
      height: `${size}px`
    }"
  >
    <img 
      :src="iconPath" 
      :alt="name"
      :class="['icon', mode, colorTheme]"
      :style="{
        width: `${size * 0.8}px`,
        height: `${size * 0.8}px`
      }"
    />
    <div class="icon-tooltip" v-if="showTooltip">
      {{ name }}
      <div class="tooltip-details">
        <span>Mode: {{ mode }}</span>
        <span>Theme: {{ colorTheme }}</span>
        <span>Size: {{ size }}px</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      default: 'solid',
      validator: (value) => ['solid', 'outline'].includes(value)
    },
    colorTheme: {
      type: String,
      default: 'default',
      validator: (value) => [
        'default',
        'breakfast',
        'lunch',
        'supper',
        'midnight'
      ].includes(value)
    },
    size: {
      type: Number,
      default: 64
    }
  },
  data() {
    return {
      showTooltip: false
    }
  },
  computed: {
    iconPath() {
      // In the future, this could handle different paths based on mode
      return this.path
    }
  }
}
</script>

<style scoped>
.icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.icon-wrapper:hover {
  background-color: rgba(244, 92, 64, 0.1);
}

.icon {
  transition: all 0.2s ease;
  object-fit: contain;
}

.icon.outline {
  opacity: 0.8;
}

/* Color themes */
.icon.default {
  filter: none;
}

.icon.breakfast {
  filter: hue-rotate(30deg) saturate(1.2);
}

.icon.lunch {
  filter: hue-rotate(60deg) saturate(1.3);
}

.icon.supper {
  filter: hue-rotate(90deg) saturate(1.4);
}

.icon.midnight {
  filter: hue-rotate(180deg) saturate(0.8) brightness(0.9);
}

.icon-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 10;
}

.icon-wrapper:hover .icon-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-8px);
}

.tooltip-details {
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.25rem;
}

.tooltip-details span {
  margin-top: 0.125rem;
}
</style> 