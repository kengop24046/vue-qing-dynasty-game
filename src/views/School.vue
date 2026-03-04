<template>
  <div class="school">
    <div class="card">
      <h2>🏟️ 校场PK</h2>
      <p>与其他玩家一较高下</p>
    </div>

    <div class="school-content">
      <div class="card my-info-card">
        <h3>🎯 我的信息</h3>
        <div class="my-info">
          <div class="my-avatar">👑</div>
          <div class="my-details">
            <h4>朕</h4>
            <p>战力: {{ gameStore.totalPower.toLocaleString() }}</p>
            <p>排名: #{{ myRank }}</p>
          </div>
          <div class="my-stats">
            <div class="stat">
              <span class="stat-label">胜利</span>
              <span class="stat-value wins">{{ wins }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">失败</span>
              <span class="stat-value losses">{{ losses }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">连胜</span>
              <span class="stat-value streak">{{ winStreak }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card opponents-card">
        <h3>⚔️ 挑战对手</h3>
        <div class="opponents-list">
          <div v-for="opponent in opponents" :key="opponent.id" class="opponent-card">
            <div class="opponent-avatar">{{ opponent.avatar }}</div>
            <div class="opponent-info">
              <h4>{{ opponent.name }}</h4>
              <p>战力: {{ opponent.power.toLocaleString() }}</p>
              <p>排名: #{{ opponent.rank }}</p>
            </div>
            <div class="opponent-actions">
              <button 
                class="btn-primary" 
                @click="startBattle(opponent)"
                :disabled="battleInProgress || challengeCount >= 5"
              >
                {{ challengeCount >= 5 ? '挑战次数用完' : '挑战' }}
              </button>
            </div>
          </div>
        </div>
        <div class="challenge-info">
          <p>今日挑战次数: {{ challengeCount }} / 5</p>
          <button class="btn-secondary" @click="refreshOpponents">🔄 刷新对手</button>
        </div>
      </div>

      <div class="card rewards-card">
        <h3>🎁 每日奖励</h3>
        <div class="rewards-list">
          <div class="reward-item">
            <span class="reward-condition">3场胜利</span>
            <span class="reward-text">金票 +50</span>
            <span class="reward-status" :class="wins >= 3 ? 'claimed' : ''">
              {{ wins >= 3 ? '✅' : '🔒' }}
            </span>
          </div>
          <div class="reward-item">
            <span class="reward-condition">5场胜利</span>
            <span class="reward-text">国力 +200</span>
            <span class="reward-status" :class="wins >= 5 ? 'claimed' : ''">
              {{ wins >= 5 ? '✅' : '🔒' }}
            </span>
          </div>
          <div class="reward-item">
            <span class="reward-condition">3连胜</span>
            <span class="reward-text">金票 +100</span>
            <span class="reward-status" :class="winStreak >= 3 ? 'claimed' : ''">
              {{ winStreak >= 3 ? '✅' : '🔒' }}
            </span>
          </div>
        </div>
      </div>

      <div class="card ranking-card">
        <h3>🏆 排行榜</h3>
        <div class="ranking-list">
          <div v-for="(player, index) in rankings" :key="player.id" class="ranking-item" :class="{ 'my-rank': player.isMe }">
            <span class="rank-number">#{{ index + 1 }}</span>
            <span class="player-avatar">{{ player.avatar }}</span>
            <span class="player-name">{{ player.name }}</span>
            <span class="player-power">{{ player.power.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 战斗动画弹窗 -->
    <div v-if="showBattleAnimation" class="modal-overlay">
      <div class="modal battle-modal" @click.stop>
        <div class="battle-animation">
          <div class="battle-side your-side">
            <div class="battle-avatar">👑</div>
            <div class="battle-name">朕</div>
            <div class="battle-power">{{ gameStore.totalPower.toLocaleString() }}</div>
            <div class="battle-hp">
              <div class="hp-bar" :style="{ width: yourHp + '%' }"></div>
            </div>
          </div>
          <div class="battle-vs">⚔️</div>
          <div class="battle-side enemy-side">
            <div class="battle-avatar">{{ currentOpponent?.avatar }}</div>
            <div class="battle-name">{{ currentOpponent?.name }}</div>
            <div class="battle-power">{{ currentOpponent?.power.toLocaleString() }}</div>
            <div class="battle-hp">
              <div class="hp-bar enemy" :style="{ width: enemyHp + '%' }"></div>
            </div>
          </div>
        </div>
        <div class="battle-log">
          <p v-for="(log, index) in battleLogs" :key="index">{{ log }}</p>
        </div>
      </div>
    </div>

    <!-- 战斗结果弹窗 -->
    <div v-if="showBattleResult" class="modal-overlay" @click="showBattleResult = false">
      <div class="modal" @click.stop>
        <div class="result-icon">{{ battleResult.win ? '🎉' : '😢' }}</div>
        <h2>{{ battleResult.win ? '战斗胜利！' : '战斗失败' }}</h2>
        <div v-if="battleResult.win" class="result-rewards">
          <h3>获得奖励:</h3>
          <ul>
            <li v-for="(reward, index) in battleResult.rewards" :key="index">{{ reward }}</li>
          </ul>
        </div>
        <div v-else class="result-tips">
          <p>提升国力后再来挑战吧！</p>
        </div>
        <button class="btn-primary" @click="showBattleResult = false">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const battleInProgress = ref(false)
const showBattleAnimation = ref(false)
const showBattleResult = ref(false)
const yourHp = ref(100)
const enemyHp = ref(100)
const battleLogs = ref([])
const currentOpponent = ref(null)
const battleResult = ref({ win: false, rewards: [] })
const challengeCount = ref(0)
const wins = ref(0)
const losses = ref(0)
const winStreak = ref(0)
const myRank = ref(15)

const generateOpponents = () => {
  const names = ['乾隆帝', '汉武帝', '唐太宗', '宋太祖', '秦始皇', '康熙帝', '雍正帝']
  const avatars = ['👨‍🦳', '👨‍💼', '🧔', '👨', '👴', '🧓', '👨‍🦰']
  
  return names.map((name, index) => ({
    id: index + 1,
    name,
    avatar: avatars[index],
    power: Math.floor(gameStore.totalPower * (0.8 + Math.random() * 0.4)),
    rank: myRank.value - 3 + index
  }))
}

const opponents = ref(generateOpponents())

const rankings = ref([
  { id: 1, name: '秦始皇', avatar: '👴', power: 999999, isMe: false },
  { id: 2, name: '汉武帝', avatar: '🧔', power: 888888, isMe: false },
  { id: 3, name: '唐太宗', avatar: '👨‍💼', power: 777777, isMe: false },
  { id: 4, name: '宋太祖', avatar: '👨', power: 666666, isMe: false },
  { id: 5, name: '明太祖', avatar: '👨‍🦳', power: 555555, isMe: false },
  { id: 15, name: '朕', avatar: '👑', power: gameStore.totalPower, isMe: true }
])

const refreshOpponents = () => {
  opponents.value = generateOpponents()
}

const startBattle = async (opponent) => {
  if (battleInProgress.value || challengeCount.value >= 5) return
  
  battleInProgress.value = true
  showBattleAnimation.value = true
  yourHp.value = 100
  enemyHp.value = 100
  battleLogs.value = []
  currentOpponent.value = opponent
  
  // 战斗动画
  const yourPower = gameStore.totalPower
  const enemyPower = opponent.power
  const winChance = Math.min(0.85, Math.max(0.15, yourPower / (yourPower + enemyPower)))
  
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const yourDamage = Math.floor(Math.random() * 30) + 10
    const enemyDamage = Math.floor(Math.random() * 25) + 8
    
    enemyHp.value = Math.max(0, enemyHp.value - yourDamage)
    yourHp.value = Math.max(0, yourHp.value - enemyDamage)
    
    battleLogs.value.push(`朕发起攻击，造成 ${yourDamage} 点伤害！`)
    battleLogs.value.push(`${opponent.name} 反击，造成 ${enemyDamage} 点伤害！`)
    
    if (enemyHp.value <= 0 || yourHp.value <= 0) break
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const win = Math.random() < winChance
  
  showBattleAnimation.value = false
  showBattleResult.value = true
  challengeCount.value++
  
  if (win) {
    wins.value++
    winStreak.value++
    const goldReward = 30 + winStreak.value * 10
    const powerReward = 50
    
    gameStore.goldTickets += goldReward
    gameStore.addNationalPower(powerReward)
    
    battleResult.value = {
      win: true,
      rewards: [
        `金票 +${goldReward}`,
        `国力 +${powerReward}`,
        winStreak.value >= 3 ? `🔥 ${winStreak.value}连胜！` : ''
      ].filter(Boolean)
    }
  } else {
    losses.value++
    winStreak.value = 0
    battleResult.value = {
      win: false,
      rewards: []
    }
  }
  
  battleInProgress.value = false
}
</script>

<style scoped>
.school h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.school > .card:first-of-type p {
  text-align: center;
  color: #FFF8DC;
}

.school-content {
  display: grid;
  gap: 1rem;
}

.my-info-card h3,
.opponents-card h3,
.rewards-card h3,
.ranking-card h3 {
  margin-bottom: 1.5rem;
  color: #FFD700;
}

.my-info {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.my-avatar {
  font-size: 5rem;
}

.my-details h4 {
  margin-bottom: 0.5rem;
  color: #FFD700;
  font-size: 1.5rem;
}

.my-details p {
  color: #FFF8DC;
  margin: 0.3rem 0;
}

.my-stats {
  display: flex;
  gap: 2rem;
  margin-left: auto;
}

.my-stats .stat {
  text-align: center;
}

.stat-label {
  display: block;
  color: #FFF8DC;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
}

.stat-value.wins {
  color: #4CAF50;
}

.stat-value.losses {
  color: #f44336;
}

.stat-value.streak {
  color: #FFD700;
}

.opponents-list {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.opponent-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  flex-wrap: wrap;
}

.opponent-avatar {
  font-size: 3rem;
}

.opponent-info {
  flex: 1;
  min-width: 150px;
}

.opponent-info h4 {
  margin-bottom: 0.5rem;
  color: #FFD700;
}

.opponent-info p {
  color: #FFF8DC;
  margin: 0.3rem 0;
}

.opponent-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.challenge-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFF8DC;
  flex-wrap: wrap;
  gap: 1rem;
}

.rewards-list {
  display: grid;
  gap: 1rem;
}

.reward-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.reward-condition {
  color: #FFD700;
  font-weight: bold;
}

.reward-text {
  color: #FFF8DC;
}

.reward-status {
  font-size: 1.5rem;
}

.reward-status.claimed {
  color: #4CAF50;
}

.ranking-list {
  display: grid;
  gap: 0.5rem;
}

.ranking-item {
  display: grid;
  grid-template-columns: 60px 50px 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 215, 0, 0.05);
  border-radius: 8px;
}

.ranking-item.my-rank {
  background: rgba(255, 215, 0, 0.2);
  border: 2px solid #FFD700;
}

.rank-number {
  color: #FFD700;
  font-weight: bold;
  font-size: 1.2rem;
}

.player-avatar {
  font-size: 2rem;
}

.player-name {
  color: #FFF8DC;
}

.player-power {
  color: #FFD700;
  font-weight: bold;
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
  max-width: 600px;
  width: 90%;
  text-align: center;
}

.battle-modal {
  max-width: 700px;
}

.battle-animation {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 2rem;
}

.battle-side {
  text-align: center;
}

.battle-avatar {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}

.battle-name {
  color: #FFD700;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.battle-power {
  color: #FFF8DC;
  margin-bottom: 0.5rem;
}

.battle-hp {
  width: 150px;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
}

.hp-bar {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 0.3s;
}

.hp-bar.enemy {
  background: linear-gradient(90deg, #f44336, #FF5722);
}

.battle-vs {
  font-size: 3rem;
  color: #FFD700;
}

.battle-log {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  max-height: 150px;
  overflow-y: auto;
  text-align: left;
}

.battle-log p {
  margin: 0.3rem 0;
  color: #FFF8DC;
}

.result-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.modal h2 {
  margin-bottom: 1.5rem;
  color: #FFD700;
}

.result-rewards h3,
.result-tips p {
  margin-bottom: 1rem;
  color: #FFF8DC;
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