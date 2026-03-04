<template>
  <div class="search">
    <div class="card">
      <h2>🔍 微服私访</h2>
      <p>游历民间，寻访佳人，招贤纳士</p>
    </div>

    <div class="search-content">
      <div class="card search-main-card">
        <div class="search-scene">
          <div class="scene-icon">🏞️</div>
          <div class="scene-info">
            <h3>{{ currentScene.name }}</h3>
            <p>{{ currentScene.desc }}</p>
          </div>
        </div>

        <div class="search-actions">
          <button class="btn-primary" @click="search" :disabled="searchCooldown > 0">
            {{ searchCooldown > 0 ? `冷却中 (${searchCooldown}s)` : '🔍 开始寻访' }}
          </button>
          <button class="btn-secondary" @click="changeScene">🗺️ 换个地方</button>
        </div>

        <div class="search-stats">
          <div class="stat">
            <span class="stat-label">今日寻访</span>
            <span class="stat-value">{{ todaySearches }} 次</span>
          </div>
          <div class="stat">
            <span class="stat-label">累计寻访</span>
            <span class="stat-value">{{ totalSearches }} 次</span>
          </div>
        </div>
      </div>

      <div class="card history-card">
        <h3>📜 寻访记录</h3>
        <div class="history-list">
          <div v-if="searchHistory.length === 0" class="empty-history">
            <p>暂无寻访记录</p>
          </div>
          <div v-for="(record, index) in searchHistory.slice(0, 10)" :key="index" class="history-item">
            <span class="history-icon">{{ record.icon }}</span>
            <span class="history-text">{{ record.text }}</span>
            <span class="history-time">{{ record.time }}</span>
          </div>
        </div>
      </div>

      <div class="card rewards-preview-card">
        <h3>🎁 可能获得</h3>
        <div class="rewards-grid">
          <div class="reward-item">
            <div class="reward-icon">👸</div>
            <div class="reward-name">佳人</div>
            <div class="reward-desc">寻访民间美女</div>
          </div>
          <div class="reward-item">
            <div class="reward-icon">👨‍💼</div>
            <div class="reward-name">贤才</div>
            <div class="reward-desc">招纳天下英才</div>
          </div>
          <div class="reward-item">
            <div class="reward-icon">💰</div>
            <div class="reward-name">金票</div>
            <div class="reward-desc">意外之财</div>
          </div>
          <div class="reward-item">
            <div class="reward-icon">📈</div>
            <div class="reward-name">国力</div>
            <div class="reward-desc">民心所向</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 寻访结果弹窗 -->
    <div v-if="showSearchResult" class="modal-overlay" @click="showSearchResult = false">
      <div class="modal" @click.stop>
        <div class="result-icon">{{ searchResult.icon }}</div>
        <h2>{{ searchResult.title }}</h2>
        <p class="result-desc">{{ searchResult.desc }}</p>
        <div v-if="searchResult.rewards && searchResult.rewards.length > 0" class="result-rewards">
          <h3>获得:</h3>
          <ul>
            <li v-for="(reward, index) in searchResult.rewards" :key="index">{{ reward }}</li>
          </ul>
        </div>
        <button class="btn-primary" @click="showSearchResult = false">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const searchCooldown = ref(0)
const todaySearches = ref(0)
const totalSearches = ref(0)
const showSearchResult = ref(false)
const searchHistory = ref([])
let searchTimer = null

const scenes = [
  { name: '江南水乡', desc: '烟雨蒙蒙，小桥流水，佳人辈出之地' },
  { name: '京城闹市', desc: '繁华都市，商贾云集，人才济济之所' },
  { name: '苏州园林', desc: '精致典雅，风景如画，文人雅士汇聚' },
  { name: '杭州西湖', desc: '水光潋滟，山色空蒙，流传千古佳话' },
  { name: '秦淮河畔', desc: '桨声灯影，歌舞升平，风流韵事不绝' },
  { name: '名山古刹', desc: '深山藏古寺，世外有高人' }
]

const currentScene = ref(scenes[0])

const searchResults = [
  {
    type: 'consort',
    icon: '👸',
    title: '巧遇佳人',
    desc: '在民间寻访时，偶遇一位绝色佳人，带入宫中！',
    consorts: [
      { name: '夏雨荷', charm: 92, talent: 85 },
      { name: '林黛玉', charm: 95, talent: 98 },
      { name: '薛宝钗', charm: 90, talent: 92 },
      { name: '西施', charm: 100, talent: 88 },
      { name: '王昭君', charm: 98, talent: 90 }
    ]
  },
  {
    type: 'minister',
    icon: '👨‍💼',
    title: '招纳贤才',
    desc: '发现一位治世能臣，收入朝中！',
    ministers: [
      { name: '刘墉', politics: 95, military: 70 },
      { name: '包拯', politics: 98, military: 60 },
      { name: '狄仁杰', politics: 96, military: 75 },
      { name: '张居正', politics: 94, military: 65 },
      { name: '诸葛亮', politics: 100, military: 90 }
    ]
  },
  {
    type: 'gold',
    icon: '💰',
    title: '意外之财',
    desc: '在民间发现了一批财宝！',
    minGold: 50,
    maxGold: 200
  },
  {
    type: 'power',
    icon: '📈',
    title: '民心所向',
    desc: '微服私访体察民情，百姓感恩戴德！',
    minPower: 30,
    maxPower: 100
  },
  {
    type: 'grain',
    icon: '🌾',
    title: '丰收之年',
    desc: '视察农情，发现今年粮食大丰收！',
    minGrain: 1000,
    maxGrain: 5000
  },
  {
    type: 'nothing',
    icon: '😔',
    title: '一无所获',
    desc: '这次寻访没有什么特别的发现...'
  }
]

const searchResult = ref({
  icon: '',
  title: '',
  desc: '',
  rewards: []
})

const changeScene = () => {
  const randomIndex = Math.floor(Math.random() * scenes.length)
  currentScene.value = scenes[randomIndex]
}

const search = () => {
  if (searchCooldown.value > 0) return
  
  todaySearches.value++
  totalSearches.value++
  
  // 随机结果
  const randomResult = searchResults[Math.floor(Math.random() * searchResults.length)]
  
  const rewards = []
  
  if (randomResult.type === 'consort') {
    const consort = randomResult.consorts[Math.floor(Math.random() * randomResult.consorts.length)]
    gameStore.harem.push({
      id: Date.now(),
      name: consort.name,
      level: 1,
      favor: 50,
      charm: consort.charm,
      talent: consort.talent
    })
    rewards.push(`👸 获得佳人: ${consort.name}`)
  } else if (randomResult.type === 'minister') {
    const minister = randomResult.ministers[Math.floor(Math.random() * randomResult.ministers.length)]
    gameStore.ministers.push({
      id: Date.now(),
      name: minister.name,
      level: 1,
      power: 80,
      politics: minister.politics,
      military: minister.military
    })
    rewards.push(`👨‍💼 获得贤才: ${minister.name}`)
  } else if (randomResult.type === 'gold') {
    const amount = Math.floor(Math.random() * (randomResult.maxGold - randomResult.minGold + 1)) + randomResult.minGold
    gameStore.goldTickets += amount
    rewards.push(`💰 金票 +${amount}`)
  } else if (randomResult.type === 'power') {
    const amount = Math.floor(Math.random() * (randomResult.maxPower - randomResult.minPower + 1)) + randomResult.minPower
    gameStore.addNationalPower(amount)
    rewards.push(`📈 国力 +${amount}`)
  } else if (randomResult.type === 'grain') {
    const amount = Math.floor(Math.random() * (randomResult.maxGrain - randomResult.minGrain + 1)) + randomResult.minGrain
    gameStore.grain += amount
    rewards.push(`🌾 粮食 +${amount}`)
  }
  
  searchResult.value = {
    icon: randomResult.icon,
    title: randomResult.title,
    desc: randomResult.desc,
    rewards: rewards
  }
  
  // 记录历史
  searchHistory.value.unshift({
    icon: randomResult.icon,
    text: randomResult.title,
    time: new Date().toLocaleTimeString()
  })
  
  showSearchResult.value = true
  
  // 设置冷却
  searchCooldown.value = 30
  searchTimer = setInterval(() => {
    searchCooldown.value--
    if (searchCooldown.value <= 0) {
      clearInterval(searchTimer)
    }
  }, 1000)
}

onUnmounted(() => {
  if (searchTimer) clearInterval(searchTimer)
})
</script>

<style scoped>
.search h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.search > .card:first-of-type p {
  text-align: center;
  color: #FFF8DC;
}

.search-content {
  display: grid;
  gap: 1rem;
}

.search-main-card {
  text-align: center;
}

.search-scene {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 12px;
}

.scene-icon {
  font-size: 4rem;
}

.scene-info {
  text-align: left;
}

.scene-info h3 {
  margin-bottom: 0.5rem;
  color: #FFD700;
}

.scene-info p {
  color: #FFF8DC;
  margin: 0;
}

.search-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.stat {
  text-align: center;
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

.history-card h3,
.rewards-preview-card h3 {
  margin-bottom: 1rem;
  color: #FFD700;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.empty-history {
  text-align: center;
  color: #FFF8DC;
  padding: 2rem;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.history-icon {
  font-size: 1.5rem;
}

.history-text {
  flex: 1;
  color: #FFF8DC;
}

.history-time {
  color: rgba(255, 215, 0, 0.6);
  font-size: 0.85rem;
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.reward-item {
  background: rgba(255, 215, 0, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #FFD700;
  text-align: center;
}

.reward-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.reward-name {
  color: #FFD700;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.reward-desc {
  color: #FFF8DC;
  font-size: 0.85rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%);
  border: 3px solid #FFD700;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
}

.result-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.modal h2 {
  margin-bottom: 1rem;
  color: #FFD700;
}

.result-desc {
  margin-bottom: 1.5rem;
  color: #FFF8DC;
  line-height: 1.6;
}

.result-rewards h3 {
  margin-bottom: 1rem;
  color: #FFD700;
}

.result-rewards ul {
  list-style: none;
  padding-left: 0;
  margin-bottom: 1.5rem;
}

.result-rewards li {
  margin: 0.5rem 0;
  color: #FFD700;
  font-weight: bold;
}
</style>