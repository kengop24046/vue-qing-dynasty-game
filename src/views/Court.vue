<template>
  <div class="court">
    <div class="card">
      <h2>⚖️ 上朝理政</h2>
      <p>处理国家大事，提升国力</p>
    </div>

    <div class="court-content">
      <div class="card event-card" v-if="!currentEvent">
        <h3>今日无要事</h3>
        <p>吾皇万岁，今日暂无紧急政务需要处理</p>
        <button class="btn-primary" @click="generateEvent">📋 查看奏折</button>
      </div>

      <div class="card event-card" v-else>
        <h3>{{ currentEvent.title }}</h3>
        <p class="event-desc">{{ currentEvent.desc }}</p>
        
        <div class="event-choices">
          <button 
            v-for="(choice, index) in currentEvent.choices" 
            :key="index"
            class="btn-primary"
            @click="handleChoice(choice)"
          >
            {{ choice.text }}
          </button>
        </div>
      </div>

      <div class="card stats-card">
        <h3>📊 朝政统计</h3>
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">今日已处理</span>
            <span class="stat-value">{{ todayEvents }} 件</span>
          </div>
          <div class="stat">
            <span class="stat-label">累计获得国力</span>
            <span class="stat-value">+{{ totalPowerGained }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const currentEvent = ref(null)
const todayEvents = ref(0)
const totalPowerGained = ref(0)

const events = [
  {
    title: '🌊 南方水灾',
    desc: '江南地区连降暴雨，洪水泛滥，百姓流离失所，请求朝廷赈灾。',
    choices: [
      { text: '拨银十万两赈灾 (国力+80, 金票-20)', power: 80, gold: -20 },
      { text: '派大臣前往视察 (国力+50)', power: 50, gold: 0 },
      { text: '暂缓处理 (国力-20)', power: -20, gold: 0 }
    ]
  },
  {
    title: '📚 科举考试',
    desc: '三年一度的科举考试开始，各地才子齐聚京城，请求圣上钦点主考官。',
    choices: [
      { text: '亲自主持殿试 (国力+120, 金票-30)', power: 120, gold: -30 },
      { text: '任命大学士为主考 (国力+80)', power: 80, gold: 0 },
      { text: '按往年惯例 (国力+40)', power: 40, gold: 0 }
    ]
  },
  {
    title: '⚔️ 边境告急',
    desc: '北方蛮族蠢蠢欲动，频频骚扰边境，守将请求增派援军。',
    choices: [
      { text: '御驾亲征 (国力+150, 士兵-1000)', power: 150, gold: 0, soldiers: -1000 },
      { text: '派大将军前往 (国力+100, 金票-50)', power: 100, gold: -50 },
      { text: '和亲求和 (国力-50)', power: -50, gold: 0 }
    ]
  },
  {
    title: '🌾 粮食丰收',
    desc: '今年风调雨顺，各地粮食大丰收，户部请求是否开仓放粮。',
    choices: [
      { text: '开仓放粮，体恤百姓 (国力+100, 粮食-5000)', power: 100, gold: 0, grain: -5000 },
      { text: '充实国库 (粮食+10000)', power: 30, gold: 0, grain: 10000 },
      { text: '部分放粮部分入库 (国力+60, 粮食+3000)', power: 60, gold: 0, grain: 3000 }
    ]
  },
  {
    title: '🎁 万国来朝',
    desc: '西域诸国派遣使者前来朝贡，带来诸多奇珍异宝。',
    choices: [
      { text: '盛情款待，厚赏使者 (国力+100, 金票+50)', power: 100, gold: 50 },
      { text: '按惯例接待 (国力+50, 金票+20)', power: 50, gold: 20 },
      { text: '简约接待 (国力+20)', power: 20, gold: 0 }
    ]
  }
]

const generateEvent = () => {
  const randomEvent = events[Math.floor(Math.random() * events.length)]
  currentEvent.value = { ...randomEvent }
}

const handleChoice = (choice) => {
  if (choice.gold && gameStore.goldTickets + choice.gold < 0) {
    alert('金票不足！')
    return
  }
  if (choice.soldiers && gameStore.soldiers + choice.soldiers < 0) {
    alert('士兵不足！')
    return
  }
  if (choice.grain && gameStore.grain + choice.grain < 0) {
    alert('粮食不足！')
    return
  }

  if (choice.power) {
    gameStore.addNationalPower(choice.power)
    totalPowerGained.value += Math.max(0, choice.power)
  }
  if (choice.gold) {
    gameStore.goldTickets += choice.gold
  }
  if (choice.soldiers) {
    gameStore.soldiers += choice.soldiers
  }
  if (choice.grain) {
    gameStore.grain += choice.grain
  }

  todayEvents.value++
  currentEvent.value = null
}
</script>

<style scoped>
.court h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.court > .card:first-of-type p {
  text-align: center;
  color: #FFF8DC;
}

.court-content {
  display: grid;
  gap: 1rem;
}

.event-card {
  text-align: center;
}

.event-card h3 {
  margin-bottom: 1rem;
  color: #FFD700;
  font-size: 1.5rem;
}

.event-desc {
  margin-bottom: 1.5rem;
  color: #FFF8DC;
  font-size: 1.1rem;
  line-height: 1.6;
}

.event-choices {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.event-choices button {
  width: 100%;
}

.stats-card h3 {
  margin-bottom: 1rem;
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