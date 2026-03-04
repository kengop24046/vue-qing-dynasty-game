<template>
  <div class="progress-container" :class="containerClass">
    <div class="progress-bar-wrap">
      <div 
        class="progress-bar-fill" 
        :style="{ width: `${Math.min(100, Math.max(0, percentage))}%`, backgroundColor: color }"
      ></div>
    </div>
    <span v-if="showText" class="progress-text">{{ `${Math.floor(percentage)}%` }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    default: 'linear-gradient(90deg, #FFD700, #FFA500)'
  },
  showText: {
    type: Boolean,
    default: true
  },
  height: {
    type: String,
    default: '20px'
  },
  containerClass: {
    type: String,
    default: ''
  }
})

const percentage = computed(() => {
  if (props.total <= 0) return 0
  return (props.current / props.total) * 100
})
</script>

<style scoped>
.progress-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
}

.progress-bar-wrap {
  flex: 1;
  height: v-bind(height);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  color: #FFD700;
  font-weight: bold;
  font-size: 0.9rem;
  min-width: 40px;
}
</style>