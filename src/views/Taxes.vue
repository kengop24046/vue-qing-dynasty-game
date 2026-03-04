<template>
  <div class="taxes">
    <div class="card">
      <h2>🌾 征粮征兵</h2>
      <p>充实国库，强兵富国</p>
    </div>

    <div class="grid-2">
      <div class="card action-card">
        <div class="action-icon">🌾</div>
        <h3>征收粮食</h3>
        <p class="action-desc">向全国百姓征收粮食，充实国库储备</p>
        <div class="action-info">
          <p>当前粮食: {{ gameStore.grain.toLocaleString() }}</p>
          <p>预计收获: +{{ estimatedGrain.toLocaleString() }}</p>
        </div>
        <button class="btn-primary" @click="collectGrain" :disabled="grainCooldown > 0">
          {{ grainCooldown > 0 ? `冷却中 (${grainCooldown}s)` : '📦 征粮' }}
        </button>
      </div>

      <div class="card action-card">
        <div class="action-icon">⚔️</div>
        <h3>招募士兵</h3>
        <p class="action-desc">在全国范围内招募新兵，增强军事力量</p>
        <div class="action-info">
          <p>当前士兵: {{ gameStore.soldiers.toLocaleString() }}</p>
          <p>预计招募: +{{ estimatedSoldiers.toLocaleString() }}</p>
        </div>
        <button class="btn-primary" @click="recruitSoldiers" :disabled="soldierCooldown > 0">
          {{ soldierCooldown > 0 ? `冷却中 (${soldierCooldown}s)` : '🎖️ 征兵' }}
        </button>
      </div>
    </div>

    <div class="card stats-card">
      <h3>📊 国库统计</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-icon">🌾</span>
          <div class="stat-content">
            <span class="stat-label">粮食储备</span>
            <span class="stat-value">{{ gameStore.grain.toLocaleString() }}</span>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">⚔️</span>
          <div class="stat-content">
            <span class="stat-label">士兵数量</span>
            <span class="stat-value">{{ gameStore.soldiers.toLocaleString() }}</span>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">📈</span>
          <div class="stat-content">
            <span class="stat-label">今日征粮</span>
            <span class="stat-value">+{{ todayGrain.toLocaleString() }}</span>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">📈</span>
          <div class="stat-content">
            <span class="stat-label">今日征兵</span>
            <span class="stat-value">+{{ todaySoldiers.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const grainCooldown = ref(0)
const soldierCooldown = ref(0)
const todayGrain = ref(0)
const todaySoldiers = ref(0)
let grainTimer = null
let soldierTimer = null

const estimatedGrain = computed(() => Math.floor(gameStore.totalPower * 0.5))
const estimatedSoldiers = computed(() => Math.floor(gameStore.totalPower * 0.2))

const collectGrain = () => {
  if (grainCooldown.value > 0) return
  
  const amount = estimatedGrain.value
  gameStore.grain += amount
  todayGrain.value += amount
  gameStore.addNationalPower(10)
  
  grainCooldown.value = 60
  grainTimer = setInterval(() => {
    grainCooldown.value--
    if (grainCooldown.value <= 0) {
      clearInterval(grainTimer)
    }
  }, 1000)
}

const recruitSoldiers = () => {
  if (soldierCooldown.value > 0) return
  if (gameStore.grain < 1000) {
    alert('粮食不足！需要1000粮食来征兵')
    return
  }
  
  const amount = estimatedSoldiers.value
  gameStore.soldiers += amount
  gameStore.grain -= 1000
  todaySoldiers.value += amount
  gameStore.addNationalPower(15)
  
  soldierCooldown.value = 90
  soldierTimer = setInterval(() => {
    soldierCooldown.value--
    if (soldierCooldown.value <= 0) {
      clearInterval(soldierTimer)
    }
  }, 1000)
}

onUnmounted(() => {
  if (grainTimer) clearInterval(grainTimer)
  if (soldierTimer) clearInterval(soldierTimer)
})
</script>

<style scoped>
.taxes h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.taxes > .card:first-of-type p {
  text-align: center;
  color: #FFF8DC;
}

.action-card {
  text-align: center;
  transition: all 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(255, 215, 0, 0.3);
}

.action-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  margin-bottom: 1rem;
  color: #FFD700;
  font-size: 1.5rem;
}

.action-desc {
  margin-bottom: 1.5rem;
  color: #FFF8DC;
  line-height: 1.6;
}

.action-info {
  margin-bottom: 1.5rem;
  color: #FFF8DC;
}

.action-info p {
  margin: 0.5rem 0;
}

.action-card button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.stats-card h3 {
  margin-bottom: 1.5rem;
  color: #FFD700;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.stat-item {
  background: rgba(255, 215, 0, 0.2);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #FFD700;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content {
  flex: 1;
}

.stat-label {
  display: block;
  margin-bottom: 0.3rem;
  color: #FFF8DC;
  font-size: 0.9rem;
}

.stat-value {
  display: block;
  font-size: 1.4rem;
  font-weight: bold;
  color: #FFD700;
}
</style>