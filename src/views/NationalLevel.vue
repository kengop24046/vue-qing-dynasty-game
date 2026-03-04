<template>
  <div class="national-level">
    <BaseCard>
      <h2>📊 国力等级</h2>
      <div class="current-title">
        <h3>当前称号: {{ currentTitle.title }}</h3>
        <p>等级: Lv.{{ currentTitle.level }}</p>
      </div>
      <ProgressBar 
        :current="gameStore.totalPower" 
        :total="nextTitle?.maxPower || currentTitle.maxPower"
        color="linear-gradient(90deg, #FFD700, #FFA500)"
      />
      <p class="progress-text">
        国力: {{ formatNumber(gameStore.totalPower) }} / {{ nextTitle ? formatNumber(nextTitle.maxPower) : '已满级' }}
      </p>
    </BaseCard>

    <BaseCard>
      <h3>🔓 已解锁功能</h3>
      <div class="unlocked-features">
        <span v-for="(feature, index) in unlockedFeatures" :key="index" class="feature-tag">
          ✅ {{ feature }}
        </span>
      </div>
    </BaseCard>

    <BaseCard>
      <h3>🏆 称号一览</h3>
      <div class="title-list">
        <div 
          v-for="title in titleConfig" 
          :key="title.level" 
          class="title-item"
          :class="{ active: gameStore.totalPower >= title.minPower, current: currentTitle.level === title.level }"
        >
          <span class="title-level">Lv.{{ title.level }}</span>
          <span class="title-name">{{ title.title }}</span>
          <span class="title-power">{{ formatNumber(title.minPower) }} 国力</span>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { titleConfig, getTitleByPower, getUnlockedFeatures } from '@/data/titleConfig'
import { formatNumber } from '@/utils/gameUtils'
import BaseCard from '@/components/BaseCard.vue'
import ProgressBar from '@/components/ProgressBar.vue'

const gameStore = useGameStore()

const currentTitle = computed(() => getTitleByPower(gameStore.totalPower))
const nextTitle = computed(() => {
  const currentLevel = currentTitle.value.level
  return titleConfig.find(t => t.level === currentLevel + 1)
})
const unlockedFeatures = computed(() => getUnlockedFeatures(gameStore.totalPower))
</script>

<style scoped>
.national-level h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.current-title {
  text-align: center;
  margin-bottom: 1.5rem;
}

.current-title h3 {
  color: #FFD700;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.current-title p {
  color: #FFF8DC;
  margin: 0;
}

.progress-text {
  text-align: center;
  color: #FFF8DC;
  margin-top: 0.8rem;
}

.unlocked-features {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.feature-tag {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid #4CAF50;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
}

.title-list {
  display: grid;
  gap: 0.5rem;
}

.title-item {
  display: grid;
  grid-template-columns: 80px 1fr 150px;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 215, 0, 0.05);
  border-radius: 8px;
  opacity: 0.5;
}

.title-item.active {
  opacity: 1;
  background: rgba(255, 215, 0, 0.1);
}

.title-item.current {
  background: rgba(255, 215, 0, 0.2);
  border: 2px solid #FFD700;
}

.title-level {
  color: #FFF8DC;
  font-weight: bold;
}

.title-name {
  color: #FFD700;
  font-weight: bold;
  font-size: 1.1rem;
}

.title-power {
  text-align: right;
  color: #FFF8DC;
}
</style>