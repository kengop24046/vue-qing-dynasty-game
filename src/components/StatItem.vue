<template>
  <div class="stat-item">
    <span v-if="icon" class="stat-icon">{{ icon }}</span>
    <div class="stat-content">
      <span class="stat-label">{{ label }}</span>
      <span class="stat-value">{{ value }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  }
})
</script>

<style scoped>
.stat-item {
  background: rgba(255, 215, 0, 0.2);
  padding: 1rem 1.2rem;
  border-radius: 8px;
  border: 1px solid #FFD700;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.stat-label {
  color: #FFF8DC;
  font-size: 0.9rem;
}

.stat-value {
  color: #FFD700;
  font-size: 1.4rem;
  font-weight: bold;
}
</style>