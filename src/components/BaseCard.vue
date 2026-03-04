<template>
  <div class="base-card" :class="cardClass">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  cardClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.base-card {
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid #FFD700;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.base-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 215, 0, 0.25);
}
</style>