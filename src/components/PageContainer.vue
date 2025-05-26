<template>
  <div 
    class="smorg-page-container"
    :class="{
      'full-bleed-background': fullBleedBackground,
      [`padding-${padding}`]: true
    }"
  >
    <div 
      class="smorg-content-wrapper"
      :class="{
        'with-background': background
      }"
      :style="{
        '--background-color': background
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmorgPageContainer',
  props: {
    /**
     * Whether the background color should extend full width
     * while content remains constrained
     */
    fullBleedBackground: {
      type: Boolean,
      default: false
    },
    /**
     * Background color for the content wrapper
     * Accepts any valid CSS color value
     */
    background: {
      type: String,
      default: ''
    },
    /**
     * Padding size variant
     */
    padding: {
      type: String,
      default: 'default',
      validator: (value) => ['none', 'small', 'default', 'large'].includes(value)
    }
  }
}
</script>

<style scoped>
.smorg-page-container {
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.smorg-page-container.full-bleed-background {
  background-color: var(--background-color);
}

.smorg-content-wrapper {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  box-sizing: border-box;
}

.smorg-content-wrapper.with-background {
  background-color: var(--background-color);
}

/* Padding variants */
.padding-none {
  padding: 0;
}

.padding-small {
  padding: 8px;
}

.padding-default {
  padding: 12px;
}

.padding-large {
  padding: 24px;
}

/* Responsive padding */
@media (min-width: 768px) {
  .padding-small {
    padding: 12px;
  }

  .padding-default {
    padding: 16px;
  }

  .padding-large {
    padding: 32px;
  }
}

/* High-contrast mode support */
@media (prefers-contrast: more) {
  .smorg-content-wrapper.with-background {
    outline: 2px solid currentColor;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .smorg-page-container,
  .smorg-content-wrapper {
    transition: none;
  }
}
</style> 