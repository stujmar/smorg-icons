<template>
  <div class="smorg-logo">
    <h1 class="smorg-logo-text">Smörgåsbord</h1>
  </div>
</template>

<script>
export default {
  name: 'SmorgasbordLogo',
}
</script>

<style scoped>
.smorg-logo {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-xs);
}

.smorg-logo-text {
  font-family: luminance, sans-serif;
  font-weight: 500;
  font-size: 1.75rem;
  line-height: 1.2;
  margin: 0;
  color: inherit;
  letter-spacing: -0.02em;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .smorg-logo-text {
    font-size: 2rem;
  }
}

</style> 