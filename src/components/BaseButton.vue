<template>
  <button 
    class="base-btn" 
    :class="btnClass"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const btnClass = computed(() => {
  return {
    [`btn-${props.type}`]: true,
    'btn-block': props.block
  }
})
</script>

<style scoped>
.base-btn {
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  font-family: inherit;
}
.base-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}
.base-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-primary {
  background: linear-gradient(180deg, #FFD700 0%, #FFA500 100%);
  color: #8B0000;
  border: 2px solid #FFD700;
}
.btn-primary:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}
.btn-secondary {
  background: linear-gradient(180deg, #8B4513 0%, #A0522D 100%);
  color: #FFD700;
  border: 2px solid #8B4513;
}
.btn-secondary:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.4);
}
.btn-danger {
  background: linear-gradient(180deg, #f44336 0%, #d32f2f 100%);
  color: white;
  border: 2px solid #f44336;
}
.btn-danger:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
}
.btn-block {
  width: 100%;
}
</style>