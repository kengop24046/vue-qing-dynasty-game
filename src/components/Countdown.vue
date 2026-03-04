<template>
  <span v-if="remaining > 0" class="countdown">{{ formatTime }}</span>
  <span v-else class="countdown-finished">{{ finishedText }}</span>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  // 总秒数
  total: {
    type: Number,
    required: true
  },
  // 是否自动开始
  autoStart: {
    type: Boolean,
    default: true
  },
  // 结束文本
  finishedText: {
    type: String,
    default: '可使用'
  }
})

const emit = defineEmits(['finish', 'update:modelValue'])

const remaining = ref(0)
let timer = null

const formatTime = computed(() => {
  const mins = Math.floor(remaining.value / 60)
  const secs = remaining.value % 60
  return mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`
})

const start = () => {
  if (timer) clearInterval(timer)
  remaining.value = props.total
  timer = setInterval(() => {
    remaining.value--
    emit('update:modelValue', remaining.value)
    if (remaining.value <= 0) {
      clearInterval(timer)
      emit('finish')
    }
  }, 1000)
}

const stop = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch(() => props.total, (val) => {
  if (val > 0 && props.autoStart) {
    start()
  }
})

onMounted(() => {
  if (props.autoStart && props.total > 0) {
    start()
  }
})

onUnmounted(() => {
  stop()
})

defineExpose({ start, stop })
</script>

<style scoped>
.countdown {
  color: #FFC107;
  font-weight: bold;
}

.countdown-finished {
  color: #4CAF50;
  font-weight: bold;
}
</style>