<template>
  <div v-if="messageState.show" class="toast-container" :class="messageState.type">
    <div class="toast-content">
      <span class="toast-icon">{{ iconMap[messageState.type] }}</span>
      <div class="toast-text">
        <h4 v-if="messageState.title" class="toast-title">{{ messageState.title }}</h4>
        <p class="toast-desc">{{ messageState.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { messageState } from '@/utils/eventBus'

const iconMap = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  min-width: 300px;
  max-width: 500px;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  animation: toastSlide 0.3s ease;
}

.toast-container.success {
  background: rgba(76, 175, 80, 0.9);
  border: 2px solid #4CAF50;
}

.toast-container.error {
  background: rgba(244, 67, 54, 0.9);
  border: 2px solid #f44336;
}

.toast-container.warning {
  background: rgba(255, 193, 7, 0.9);
  border: 2px solid #FFC107;
}

.toast-container.info {
  background: rgba(33, 150, 243, 0.9);
  border: 2px solid #2196F3;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
}

.toast-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.toast-text {
  flex: 1;
}

.toast-title {
  margin: 0 0 0.3rem 0;
  font-weight: bold;
}

.toast-desc {
  margin: 0;
}

@keyframes toastSlide {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>