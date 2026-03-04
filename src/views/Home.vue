<template>
  <div class="home">
    <div class="card">
      <h2>🏯 金銮殿</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">👑 国力</span>
          <span class="stat-value">{{ gameStore.totalPower.toLocaleString() }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">💰 金票</span>
          <span class="stat-value">{{ gameStore.goldTickets.toLocaleString() }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">🌾 粮食</span>
          <span class="stat-value">{{ gameStore.grain.toLocaleString() }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">⚔️ 士兵</span>
          <span class="stat-value">{{ gameStore.soldiers.toLocaleString() }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">📅 年份</span>
          <span class="stat-value">乾隆{{ gameStore.currentYear }}年</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">💎 VIP状态</span>
          <span class="stat-value">
            {{ gameStore.isVipActive ? `VIP${gameStore.vipLevel}` : 'VIP已到期' }}
          </span>
        </div>
      </div>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3>🏮 后宫</h3>
        <p>当前共有 {{ gameStore.harem.length }} 位妃嫔</p>
        <button class="btn-primary" @click="navigateTo('harem')">前往后宫</button>
      </div>
      <div class="card">
        <h3>📜 大臣</h3>
        <p>当前共有 {{ gameStore.ministers.length }} 位大臣</p>
        <button class="btn-primary" @click="navigateTo('ministers')">查看大臣</button>
      </div>
      <div class="card">
        <h3>👶 子嗣</h3>
        <p>当前共有 {{ gameStore.children.length }} 位子嗣</p>
        <button class="btn-primary" @click="navigateTo('children')">培养子嗣</button>
      </div>
      <div class="card">
        <h3>⚔️ 征战</h3>
        <p>当前征战关卡: {{ gameStore.expeditionLevel }}</p>
        <button class="btn-primary" @click="navigateTo('expedition')">开始征战</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore'
import { emit, events } from '@/utils/eventBus'

const gameStore = useGameStore()

const navigateTo = (viewName) => {
  emit(events.NAVIGATE, viewName)
}
</script>

<style scoped>
.home h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.stat-item {
  background: rgba(255, 215, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #FFD700;
}
.stat-label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}
.stat-value {
  display: block;
  font-size: 1.3rem;
  font-weight: bold;
}
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.card h3 {
  margin-bottom: 1rem;
  color: #FFD700;
}
.card p {
  margin-bottom: 1rem;
  color: #FFF8DC;
}
</style>