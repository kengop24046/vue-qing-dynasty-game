<template>
  <div class="beast">
    <div class="card">
      <h2>🐲 灵兽系统</h2>
      <p>培养神兽，助力征战</p>
    </div>

    <div class="beast-content">
      <div v-if="gameStore.vipLevel < 15 && !hasBeast" class="card locked-card">
        <div class="locked-icon">🔒</div>
        <h3>灵兽系统未解锁</h3>
        <p>VIP15或通过特殊活动解锁灵兽系统</p>
        <button class="btn-primary" @click="$parent.currentView = 'vip'">💎 前往VIP</button>
      </div>

      <div v-else class="beast-main">
        <div class="card my-beasts-card">
          <h3>🎯 我的灵兽</h3>
          <div v-if="myBeasts.length === 0" class="no-beasts">
            <p>暂无灵兽，快去召唤吧！</p>
            <button class="btn-primary" @click="summonBeast">✨ 召唤灵兽</button>
          </div>
          <div v-else class="beasts-grid">
            <div v-for="beast in myBeasts" :key="beast.id" class="beast-card" :class="{ active: activeBeast?.id === beast.id }">
              <div class="beast-avatar">{{ beast.icon }}</div>
              <h4>{{ beast.name }}</h4>
              <div class="beast-level">Lv.{{ beast.level }}</div>
              <div class="beast-stats">
                <p>战力: {{ beast.power }}</p>
                <p>经验: {{ beast.exp }}/{{ beast.level * 100 }}</p>
              </div>
              <div class="beast-actions">
                <button class="btn-primary" @click="setActiveBeast(beast)" :disabled="activeBeast?.id === beast.id">
                  {{ activeBeast?.id === beast.id ? '已出战' : '出战' }}
                </button>
                <button class="btn-secondary" @click="trainBeast(beast)">培养</button>
              </div>
            </div>
          </div>
        </div>

        <div class="card summon-card">
          <h3>✨ 召唤灵兽</h3>
          <div class="summon-options">
            <div class="summon-option">
              <h4>普通召唤</h4>
              <p>消耗 100 金票</p>
              <button class="btn-primary" @click="summonBeast('normal')" :disabled="gameStore.goldTickets < 100">召唤</button>
            </div>
            <div class="summon-option premium">
              <h4>高级召唤</h4>
              <p>消耗 500 金票</p>
              <p class="highlight">必得高品质灵兽</p>
              <button class="btn-primary" @click="summonBeast('premium')" :disabled="gameStore.goldTickets < 500">召唤</button>
            </div>
          </div>
        </div>

        <div class="card beast-list-card">
          <h3>📖 灵兽图鉴</h3>
          <div class="beast-list">
            <div v-for="beast in allBeasts" :key="beast.id" class="beast-list-item">
              <div class="beast-icon">{{ beast.icon }}</div>
              <div class="beast-info">
                <h4>{{ beast.name }}</h4>
                <p>{{ beast.desc }}</p>
                <p class="beast-power">基础战力: {{ beast.basePower }}</p>
              </div>
              <div class="beast-rarity">{{ '⭐'.repeat(beast.rarity) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const hasBeast = ref(false)
const activeBeast = ref(null)

const allBeasts = [
  { id: 1, name: '青龙', icon: '🐉', desc: '东方神兽，主春生', basePower: 500, rarity: 5 },
  { id: 2, name: '白虎', icon: '🐅', desc: '西方神兽，主杀伐', basePower: 480, rarity: 5 },
  { id: 3, name: '朱雀', icon: '🦅', desc: '南方神兽，主火德', basePower: 450, rarity: 4 },
  { id: 4, name: '玄武', icon: '🐢', desc: '北方神兽，主寿元', basePower: 420, rarity: 4 },
  { id: 5, name: '麒麟', icon: '🦄', desc: '祥瑞之兽，主太平', basePower: 550, rarity: 5 },
  { id: 6, name: '貔貅', icon: '🐲', desc: '招财之兽，主财富', basePower: 380, rarity: 3 },
  { id: 7, name: '白泽', icon: '🐐', desc: '知晓万鬼之名', basePower: 400, rarity: 4 },
  { id: 8, name: '毕方', icon: '🦜', desc: '火灾之兆', basePower: 350, rarity: 3 }
]

const myBeasts = ref([])

const summonBeast = (type = 'normal') => {
  const cost = type === 'premium' ? 500 : 100
  if (gameStore.goldTickets < cost) {
    alert('金票不足！')
    return
  }

  gameStore.goldTickets -= cost
  
  // 根据召唤类型选择灵兽
  let availableBeasts = type === 'premium' 
    ? allBeasts.filter(b => b.rarity >= 4)
    : allBeasts.filter(b => b.rarity <= 4)
  
  const selectedBeast = availableBeasts[Math.floor(Math.random() * availableBeasts.length)]
  
  const newBeast = {
    id: Date.now(),
    ...selectedBeast,
    level: 1,
    exp: 0,
    power: selectedBeast.basePower
  }
  
  myBeasts.value.push(newBeast)
  hasBeast.value = true
  
  alert(`召唤成功！获得 ${selectedBeast.icon} ${selectedBeast.name}！`)
}

const setActiveBeast = (beast) => {
  activeBeast.value = beast
  gameStore.addNationalPower(beast.power)
}

const trainBeast = (beast) => {
  if (gameStore.goldTickets < 50) {
    alert('金票不足！需要50金票')
    return
  }

  gameStore.goldTickets -= 50
  beast.exp += 50
  
  if (beast.exp >= beast.level * 100) {
    beast.level++
    beast.exp = 0
    beast.power += 50
    alert(`恭喜！${beast.name} 升级到 Lv.${beast.level}！`)
  } else {
    alert(`培养成功！${beast.name} 经验+50`)
  }
}
</script>

<style scoped>
.beast h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.beast > .card:first-of-type p {
  text-align: center;
  color: #FFF8DC;
}

.beast-content {
  display: grid;
  gap: 1rem;
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

.beast-main {
  display: grid;
  gap: 1rem;
}

.my-beasts-card h3,
.summon-card h3,
.beast-list-card h3 {
  margin-bottom: 1.5rem;
  color: #FFD700;
}

.no-beasts {
  text-align: center;
  padding: 3rem;
}

.no-beasts p {
  color: #FFF8DC;
  margin-bottom: 1.5rem;
}

.beasts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.beast-card {
  background: rgba(255, 215, 0, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  text-align: center;
  transition: all 0.3s;
}

.beast-card.active {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.2);
  transform: scale(1.02);
}

.beast-avatar {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}

.beast-card h4 {
  margin-bottom: 0.5rem;
  color: #FFD700;
}

.beast-level {
  color: #FFF8DC;
  margin-bottom: 1rem;
}

.beast-stats {
  margin-bottom: 1rem;
  color: #FFF8DC;
}

.beast-stats p {
  margin: 0.3rem 0;
}

.beast-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.beast-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.summon-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.summon-option {
  background: rgba(255, 215, 0, 0.1);
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  text-align: center;
}

.summon-option.premium {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.2);
}

.summon-option h4 {
  margin-bottom: 1rem;
  color: #FFD700;
  font-size: 1.3rem;
}

.summon-option p {
  color: #FFF8DC;
  margin-bottom: 0.5rem;
}

.highlight {
  color: #FFD700;
  font-weight: bold;
}

.summon-option button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.beast-list {
  display: grid;
  gap: 1rem;
}

.beast-list-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.beast-icon {
  font-size: 3rem;
}

.beast-info {
  flex: 1;
}

.beast-info h4 {
  margin-bottom: 0.5rem;
  color: #FFD700;
}

.beast-info p {
  color: #FFF8DC;
  margin: 0.3rem 0;
}

.beast-power {
  color: #FFD700;
}

.beast-rarity {
  font-size: 1.5rem;
}
</style>