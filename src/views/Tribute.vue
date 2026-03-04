<template>
  <div class="tribute">
    <div class="card">
      <h2>🎁 万国纳贡</h2>
      <p>征服诸国，接受四方朝贡</p>
    </div>

    <div v-if="gameStore.expeditionLevel < 5" class="card locked-card">
      <div class="locked-icon">🔒</div>
      <h3>纳贡系统未解锁</h3>
      <p>征战达到第5关即可解锁纳贡系统</p>
      <button class="btn-primary" @click="$parent.currentView = 'expedition'">⚔️ 前往征战</button>
    </div>

    <div v-else class="tribute-content">
      <div class="grid-3">
        <div v-for="nation in availableNations" :key="nation.id" class="card nation-card">
          <div class="nation-flag">{{ nation.flag }}</div>
          <h3>{{ nation.name }}</h3>
          <div class="nation-status" :class="nation.status">
            {{ nation.status === 'available' ? '✅ 可纳贡' : nation.status === 'cooldown' ? `⏳ 冷却中 (${nation.cooldown}s)` : '❌ 未征服' }}
          </div>
          <div class="nation-rewards">
            <p>🎁 贡品:</p>
            <ul>
              <li v-for="(reward, index) in nation.rewards" :key="index">
                {{ reward }}
              </li>
            </ul>
          </div>
          <button 
            class="btn-primary" 
            @click="collectTribute(nation)"
            :disabled="nation.status !== 'available'"
          >
            接受纳贡
          </button>
        </div>
      </div>

      <div class="card stats-card">
        <h3>📊 纳贡统计</h3>
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">已征服国家</span>
            <span class="stat-value">{{ conqueredCount }} / {{ nations.length }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">今日收取贡品</span>
            <span class="stat-value">{{ todayTributes }} 次</span>
          </div>
          <div class="stat">
            <span class="stat-label">累计获得金票</span>
            <span class="stat-value">+{{ totalGold }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">累计获得国力</span>
            <span class="stat-value">+{{ totalPower }}</span>
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
const todayTributes = ref(0)
const totalGold = ref(0)
const totalPower = ref(0)
const timers = {}

const nations = ref([
  { id: 1, name: '高丽国', flag: '🇰🇷', unlockLevel: 5, status: 'locked', cooldown: 0, rewards: ['金票 +50', '国力 +30', '粮食 +2000'] },
  { id: 2, name: '东瀛国', flag: '🇯🇵', unlockLevel: 10, status: 'locked', cooldown: 0, rewards: ['金票 +80', '国力 +50', '士兵 +500'] },
  { id: 3, name: '琉球国', flag: '🏝️', unlockLevel: 15, status: 'locked', cooldown: 0, rewards: ['金票 +100', '国力 +70', '粮食 +3000'] },
  { id: 4, name: '安南國', flag: '🇻🇳', unlockLevel: 20, status: 'locked', cooldown: 0, rewards: ['金票 +120', '国力 +90', '士兵 +800'] },
  { id: 5, name: '暹罗国', flag: '🇹🇭', unlockLevel: 25, status: 'locked', cooldown: 0, rewards: ['金票 +150', '国力 +120', '粮食 +5000'] },
  { id: 6, name: '波斯国', flag: '🇮🇷', unlockLevel: 30, status: 'locked', cooldown: 0, rewards: ['金票 +200', '国力 +150', '士兵 +1000'] }
])

const availableNations = computed(() => {
  return nations.value.map(nation => {
    if (gameStore.expeditionLevel >= nation.unlockLevel) {
      return { ...nation, status: nation.cooldown > 0 ? 'cooldown' : 'available' }
    }
    return { ...nation, status: 'locked' }
  })
})

const conqueredCount = computed(() => {
  return nations.value.filter(n => gameStore.expeditionLevel >= n.unlockLevel).length
})

const collectTribute = (nation) => {
  if (nation.status !== 'available') return

  // 解析奖励
  nation.rewards.forEach(reward => {
    if (reward.includes('金票')) {
      const amount = parseInt(reward.match(/\d+/)[0])
      gameStore.goldTickets += amount
      totalGold.value += amount
    }
    if (reward.includes('国力')) {
      const amount = parseInt(reward.match(/\d+/)[0])
      gameStore.addNationalPower(amount)
      totalPower.value += amount
    }
    if (reward.includes('粮食')) {
      const amount = parseInt(reward.match(/\d+/)[0])
      gameStore.grain += amount
    }
    if (reward.includes('士兵')) {
      const amount = parseInt(reward.match(/\d+/)[0])
      gameStore.soldiers += amount
    }
  })

  todayTributes.value++
  
  // 设置冷却
  const nationIndex = nations.value.findIndex(n => n.id === nation.id)
  if (nationIndex > -1) {
    nations.value[nationIndex].cooldown = 300 // 5分钟冷却
    timers[nation.id] = setInterval(() => {
      nations.value[nationIndex].cooldown--
      if (nations.value[nationIndex].cooldown <= 0) {
        clearInterval(timers[nation.id])
      }
    }, 1000)
  }
}

onUnmounted(() => {
  Object.values(timers).forEach(timer => clearInterval(timer))
})
</script>

<style scoped>
.tribute h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.tribute > .card:first-of-type p {
  text-align: center;
  color: #FFF8DC;
}

.locked-card {
  text-align: center;
  padding: 3rem;
}

.locked-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.locked-card h3 {
  margin-bottom: 1rem;
  color: #FFD700;
}

.locked-card p {
  margin-bottom: 1.5rem;
  color: #FFF8DC;
}

.nation-card {
  text-align: center;
  transition: all 0.3s;
}

.nation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(255, 215, 0, 0.3);
}

.nation-flag {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.nation-card h3 {
  margin-bottom: 0.5rem;
  color: #FFD700;
}

.nation-status {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  font-weight: bold;
}

.nation-status.available {
  background: rgba(76, 175, 80, 0.3);
  color: #4CAF50;
}

.nation-status.cooldown {
  background: rgba(255, 193, 7, 0.3);
  color: #FFC107;
}

.nation-rewards {
  margin-bottom: 1.5rem;
  text-align: left;
  color: #FFF8DC;
}

.nation-rewards ul {
  list-style: none;
  padding-left: 1rem;
}

.nation-rewards li {
  margin: 0.3rem 0;
}

.nation-card button:disabled {
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat {
  background: rgba(255, 215, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #FFD700;
}

.stat-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #FFF8DC;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #FFD700;
}
</style>