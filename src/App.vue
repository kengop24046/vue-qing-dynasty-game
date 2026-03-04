<template>
  <div class="game-container">
    <!-- 全局消息提示 -->
    <MessageToast />
    <header class="game-header">
      <h1>🏯 穿越大清当皇帝</h1>
      <div class="header-stats">
        <span>📅 {{ gameDate }}</span>
        <span>👑 国力: {{ gameStore.totalPower.toLocaleString() }}</span>
        <span>💰 金票: {{ gameStore.goldTickets.toLocaleString() }}</span>
        <span>💎 {{ gameStore.isVipActive ? `VIP${gameStore.vipLevel}` : 'VIP已到期' }}</span>
        <span v-if="gameStore.isVipActive" class="vip-remaining">剩余{{ gameStore.vipRemainingDays }}天</span>
      </div>
    </header>
    <nav class="game-nav">
      <button 
        @click="currentView = 'home'" 
        :class="{ active: currentView === 'home' }"
      >🏠 金銮殿</button>
      <button 
        @click="currentView = 'harem'" 
        :class="{ active: currentView === 'harem' }"
      >🏮 后宫</button>
      <button 
        @click="currentView = 'bond'" 
        :class="{ active: currentView === 'bond' }"
      >🔗 羁绊</button>
      <button 
        @click="currentView = 'ministers'" 
        :class="{ active: currentView === 'ministers' }"
      >📜 大臣</button>
      <button 
        @click="currentView = 'court'" 
        :class="{ active: currentView === 'court' }"
      >⚖️ 上朝</button>
      <button 
        @click="currentView = 'taxes'" 
        :class="{ active: currentView === 'taxes' }"
      >🌾 征粮征兵</button>
      <button 
        @click="currentView = 'tribute'" 
        :class="{ active: currentView === 'tribute' }"
      >🎁 纳贡</button>
      <button 
        @click="currentView = 'battle'" 
        :class="{ active: currentView === 'battle' }"
      >⚔️ 副本</button>
      <button 
        @click="currentView = 'expedition'" 
        :class="{ active: currentView === 'expedition' }"
      >🏰 征战</button>
      <button 
        @click="currentView = 'search'" 
        :class="{ active: currentView === 'search' }"
      >🔍 寻访</button>
      <button 
        @click="currentView = 'children'" 
        :class="{ active: currentView === 'children' }"
      >👶 子嗣</button>
      <button 
        @click="currentView = 'matchmaker'" 
        :class="{ active: currentView === 'matchmaker' }"
      >💒 媒人</button>
      <button 
        @click="currentView = 'vip'" 
        :class="{ active: currentView === 'vip' }"
      >💎 VIP</button>
      <button 
        @click="currentView = 'giftShop'" 
        :class="{ active: currentView === 'giftShop' }"
      >🎁 礼包</button>
      <button 
        @click="currentView = 'treasure'" 
        :class="{ active: currentView === 'treasure' }"
      >🎁 珍宝阁</button>
      <button 
        @click="currentView = 'nationalLevel'" 
        :class="{ active: currentView === 'nationalLevel' }"
      >📊 等级</button>
      <button 
        @click="currentView = 'beast'" 
        :class="{ active: currentView === 'beast' }"
      >🐲 灵兽</button>
      <button 
        @click="currentView = 'school'" 
        :class="{ active: currentView === 'school' }"
      >🏟️ 校场</button>
      <button 
        @click="currentView = 'message'" 
        :class="{ active: currentView === 'message' }"
      >📩 消息</button>
      <button 
        @click="currentView = 'setting'" 
        :class="{ active: currentView === 'setting' }"
      >⚙️ 设置</button>
    </nav>
    <main class="game-main">
      <Home v-if="currentView === 'home'" />
      <Harem v-else-if="currentView === 'harem'" />
      <HaremBond v-else-if="currentView === 'bond'" />
      <Ministers v-else-if="currentView === 'ministers'" />
      <Court v-else-if="currentView === 'court'" />
      <Taxes v-else-if="currentView === 'taxes'" />
      <Tribute v-else-if="currentView === 'tribute'" />
      <Battle v-else-if="currentView === 'battle'" />
      <Expedition v-else-if="currentView === 'expedition'" />
      <Search v-else-if="currentView === 'search'" />
      <Vip v-else-if="currentView === 'vip'" />
      <Children v-else-if="currentView === 'children'" />
      <Matchmaker v-else-if="currentView === 'matchmaker'" />
      <GiftShop v-else-if="currentView === 'giftShop'" />
      <Treasure v-else-if="currentView === 'treasure'" />
      <NationalLevel v-else-if="currentView === 'nationalLevel'" />
      <Beast v-else-if="currentView === 'beast'" />
      <School v-else-if="currentView === 'school'" />
      <MessageCenter v-else-if="currentView === 'message'" />
      <Setting v-else-if="currentView === 'setting'" />
    </main>
    <footer class="game-footer">
      <button @click="saveGame">💾 保存</button>
      <button @click="exportSave">📤 导出存档</button>
      <label class="file-upload">
        📥 导入存档
        <input type="file" accept=".json" @change="importSave" />
      </label>
      <button @click="resetGame" class="danger">🔄 重置游戏</button>
    </footer>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { getGameDate } from '@/utils/gameUtils'
import { on, events } from '@/utils/eventBus'
import Home from '@/views/Home.vue'
import Harem from '@/views/Harem.vue'
import HaremBond from '@/views/HaremBond.vue'
import Ministers from '@/views/Ministers.vue'
import Court from '@/views/Court.vue'
import Taxes from '@/views/Taxes.vue'
import Tribute from '@/views/Tribute.vue'
import Battle from '@/views/Battle.vue'
import Expedition from '@/views/Expedition.vue'
import Search from '@/views/Search.vue'
import Vip from '@/views/Vip.vue'
import Children from '@/views/Children.vue'
import Matchmaker from '@/views/Matchmaker.vue'
import GiftShop from '@/views/GiftShop.vue'
import Treasure from '@/views/Treasure.vue'
import NationalLevel from '@/views/NationalLevel.vue'
import Beast from '@/views/Beast.vue'
import School from '@/views/School.vue'
import MessageCenter from '@/views/MessageCenter.vue'
import Setting from '@/views/Setting.vue'
import MessageToast from '@/components/MessageToast.vue'

const gameStore = useGameStore()
const currentView = ref('home')
let autoSaveInterval = null
let dateTimer = null

// 游戏日期
const gameDate = computed(() => getGameDate(gameStore.currentYear, gameStore.currentMonth))

// 存档操作
const saveGame = () => gameStore.saveGame()
const exportSave = () => gameStore.exportSave()
const importSave = (e) => gameStore.importSave(e)
const resetGame = () => {
  if (confirm('确定要重置游戏吗？所有进度将永久丢失，无法恢复！')) {
    gameStore.resetGame()
    currentView.value = 'home'
  }
}

const handleVisibilityChange = () => {
  if (document.hidden) {
    if (autoSaveInterval) clearInterval(autoSaveInterval)
    if (dateTimer) clearInterval(dateTimer)
  } else {
    autoSaveInterval = setInterval(() => {
      gameStore.saveGame()
    }, 30000)
    dateTimer = setInterval(() => {
      gameStore.currentMonth++
      if (gameStore.currentMonth > 12) {
        gameStore.currentMonth = 1
        gameStore.currentYear++
      }
    }, 60000)
  }
}

// 生命周期
onMounted(() => {
  // 加载存档
  gameStore.loadGame()
  
  // 30秒自动保存
  autoSaveInterval = setInterval(() => {
    gameStore.saveGame()
  }, 30000)
  // 游戏日期推进
  dateTimer = setInterval(() => {
    gameStore.currentMonth++
    if (gameStore.currentMonth > 12) {
      gameStore.currentMonth = 1
      gameStore.currentYear++
    }
  }, 60000)
  // 监听导航事件
  on(events.NAVIGATE, (view) => {
    currentView.value = view
  })
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
    autoSaveInterval = null
  }
  if (dateTimer) {
    clearInterval(dateTimer)
    dateTimer = null
  }
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>
<style scoped>
.game-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #B22222 100%);
  color: #FFD700;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  display: flex;
  flex-direction: column;
}
.game-header {
  background: rgba(0,0,0,0.3);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #FFD700;
  flex-wrap: wrap;
  gap: 1rem;
}
.game-header h1 {
  margin: 0;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}
.header-stats {
  display: flex;
  gap: 1.5rem;
  font-size: 1.1rem;
  flex-wrap: wrap;
  align-items: center;
}
.header-stats .vip-remaining {
  font-size: 0.9rem;
  background: rgba(255, 215, 0, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}
.game-nav {
  background: rgba(139, 0, 0, 0.8);
  padding: 1rem;
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 2px solid #FFD700;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.game-nav::-webkit-scrollbar {
  display: none;
}
.game-nav button {
  background: linear-gradient(180deg, #FFD700 0%, #FFA500 100%);
  color: #8B0000;
  border: 2px solid #FFD700;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  flex-shrink: 0;
  white-space: nowrap;
}
.game-nav button.active {
  background: linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%);
  border-color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.3);
}
.game-nav button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}
.game-main {
  padding: 2rem;
  flex: 1;
  max-width: 1920px;
  width: 100%;
  margin: 0 auto;
}
.game-footer {
  background: rgba(0,0,0,0.3);
  padding: 1rem 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  border-top: 2px solid #FFD700;
  flex-wrap: wrap;
}
.game-footer button, .file-upload {
  background: linear-gradient(180deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  white-space: nowrap;
}
.game-footer button:hover, .file-upload:hover {
  transform: translateY(-2px);
}
.game-footer .danger {
  background: linear-gradient(180deg, #f44336 0%, #d32f2f 100%);
}
.file-upload input {
  display: none;
}
@media (max-width: 768px) {
  .game-header {
    padding: 1rem;
    justify-content: center;
    text-align: center;
  }
  .header-stats {
    gap: 1rem;
    justify-content: center;
    font-size: 0.95rem;
  }
  .game-main {
    padding: 1rem;
  }
  .game-footer {
    padding: 1rem;
  }
}
</style>