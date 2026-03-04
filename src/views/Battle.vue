<template>
  <div class="battle">
    <div class="card">
      <h2>⚔️ 副本挑战</h2>
      <p>挑战关卡，解锁专属后宫和大臣</p>
    </div>
    <div class="battle-content">
      <div class="card progress-card">
        <h3>📊 当前进度</h3>
        <div class="progress-info">
          <div class="progress-item">
            <span class="progress-label">当前关卡</span>
            <span class="progress-value">第 {{ gameStore.battleLevel }} 关</span>
          </div>
          <div class="progress-item">
            <span class="progress-label">当前章节</span>
            <span class="progress-value">{{ currentChapter }}</span>
          </div>
        </div>
      </div>
      <div class="card current-level-card">
        <div class="level-header">
          <h3>第 {{ gameStore.battleLevel }} 关 - {{ currentLevel.name }} <span v-if="currentLevel.isBoss" class="boss-tag">【BOSS关】</span></h3>
          <div class="level-difficulty">难度: {{ '⭐'.repeat(currentLevel.difficulty) }}</div>
        </div>
        
        <div class="level-enemy">
          <div class="enemy-avatar">{{ currentLevel.isBoss ? '👺' : '👹' }}</div>
          <div class="enemy-info">
            <h4>{{ currentLevel.enemy }}</h4>
            <p>战力: {{ currentLevel.enemyPower.toLocaleString() }}</p>
          </div>
        </div>
        <div class="level-rewards">
          <h4>🎁 通关奖励</h4>
          <ul>
            <li v-for="(reward, index) in currentLevel.rewards" :key="index">{{ reward }}</li>
            <li v-if="currentSpecialReward" class="special-reward">
              🎁 特殊奖励: {{ currentSpecialReward.icon }} {{ currentSpecialReward.name }}
            </li>
            <li v-if="currentLevel.isBoss" class="boss-reward">
              🏆 BOSS关额外奖励: 解锁对应专属后宫/名臣
            </li>
          </ul>
        </div>
        <div class="battle-actions">
          <div class="power-comparison">
            <span class="your-power">你的战力: {{ gameStore.totalPower.toLocaleString() }}</span>
            <span class="vs">VS</span>
            <span class="enemy-power">敌人战力: {{ currentLevel.enemyPower.toLocaleString() }}</span>
          </div>
          <button class="btn-primary" @click="startBattle" :disabled="battleInProgress">
            {{ battleInProgress ? '战斗中...' : currentLevel.isBoss ? '⚔️ 挑战BOSS' : '⚔️ 开始战斗' }}
          </button>
        </div>
      </div>
      <div class="card rewards-preview-card">
        <h3>🏆 特殊奖励预览</h3>
        <div class="rewards-grid">
          <div v-for="reward in specialRewards" :key="reward.level + reward.type" class="reward-item">
            <div class="reward-level">第 {{ reward.level }} 关</div>
            <div class="reward-icon">{{ reward.icon }}</div>
            <div class="reward-name">{{ reward.name }}</div>
            <div class="reward-status" :class="gameStore.battleLevel > reward.level ? 'claimed' : gameStore.battleLevel === reward.level ? 'current' : 'locked'">
              {{ gameStore.battleLevel > reward.level ? '✅ 已获得' : gameStore.battleLevel === reward.level ? '🎯 当前目标' : '🔒 未解锁' }}
            </div>
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
            <div class="battle-hp">
              <div class="hp-bar" :style="{ width: yourHp + '%' }"></div>
            </div>
          </div>
          <div class="battle-vs">⚔️</div>
          <div class="battle-side enemy-side">
            <div class="battle-avatar">{{ currentLevel.isBoss ? '👺' : '👹' }}</div>
            <div class="battle-name">{{ currentLevel.enemy }}</div>
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
        <h2>{{ battleResult.win ? (currentLevel.isBoss ? 'BOSS战胜利！' : '战斗胜利！') : '战斗失败' }}</h2>
        <div v-if="battleResult.win" class="result-rewards">
          <h3>获得奖励:</h3>
          <ul>
            <li v-for="(reward, index) in battleResult.rewards" :key="index">{{ reward }}</li>
          </ul>
        </div>
        <div v-else class="result-tips">
          <p>提升国力后再来挑战吧！</p>
          <p>可以通过培养大臣、后宫、子嗣来提升国力</p>
        </div>
        <button class="btn-primary" @click="showBattleResult = false">确定</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { battleHarem, battleMinisters } from '@/data/initialData'
import { emit, events, on } from '@/utils/eventBus'

const gameStore = useGameStore()
const battleInProgress = ref(false)
const showBattleAnimation = ref(false)
const showBattleResult = ref(false)
const yourHp = ref(100)
const enemyHp = ref(100)
const battleLogs = ref([])
const battleResult = ref({ win: false, rewards: [] })

// 生成关卡数据
const generateLevels = () => {
  const levels = []
  const normalEnemies = ['山贼头目', '叛军将领', '蛮族首领', '倭寇头子', '反贼先锋', '乱臣贼子', '妖道术士', '敌国大将']
  const bossEnemies = ['山寨寨主', '叛军元帅', '蛮族大王', '倭寇天皇', '反贼首领', '乱臣贼首', '妖道宗主', '敌国皇帝']
  const levelNames = ['初出茅庐', '小试牛刀', '崭露头角', '声名鹊起', '威震一方', '名动天下', '横扫千军', '独步天下']
  
  for (let i = 1; i <= 100; i++) {
    const chapterIndex = Math.floor((i - 1) / 10)
    const levelIndex = (i - 1) % normalEnemies.length
    const isBoss = i % 10 === 0 // 每10关最后一关为BOSS关
    const currentChapterId = chapterIndex + 1

    levels.push({
      level: i,
      chapter: currentChapterId, // 章节ID，和解锁等级完全匹配
      chapterName: ['第一章 风云初起', '第二章 龙腾四海', '第三章 威震八方', '第四章 一统天下', '第五章 万古流芳', '第六章 四海臣服', '第七章 千秋霸业', '第八章 万朝来贺', '第九章 千古一帝', '第十章 星辰大海'][chapterIndex] || '终章',
      name: isBoss ? `${levelNames[levelIndex] || '终极挑战'}·终局` : levelNames[levelIndex] || '常规挑战',
      enemy: isBoss ? bossEnemies[levelIndex] || '天命霸主' : normalEnemies[levelIndex] || '天命之敌',
      difficulty: Math.min(5, Math.ceil(i / 20)),
      isBoss: isBoss, // BOSS关标记
      enemyPower: isBoss ? 800 + i * 300 : 500 + i * 200,
      rewards: isBoss 
        ? [
            `国力 +${100 + i * 20}`,
            `金票 +${50 + i * 10}`
          ]
        : [
            `国力 +${50 + i * 10}`,
            `金票 +${20 + i * 5}`
          ]
    })
  }
  return levels
}

const levels = generateLevels()

const currentLevel = computed(() => {
  return levels[Math.min(gameStore.battleLevel - 1, levels.length - 1)] || levels[levels.length - 1]
})

const currentChapter = computed(() => currentLevel.value.chapterName)

// ========== 【本次核心修改 完全匹配你的要求】 ==========
const specialRewards = computed(() => {
  return battleHarem.map((harem, index) => ({
    level: harem.unlockLevel,
    icon: '👸',
    name: harem.name,
    type: 'harem'
  })).concat(battleMinisters.map((minister, index) => ({
    level: minister.unlockLevel,
    icon: '👨‍💼',
    name: minister.name,
    type: 'minister'
  }))).sort((a, b) => a.level - b.level)
})
// ======================================================

// 当前关卡的特殊奖励
const currentSpecialReward = computed(() => {
  return specialRewards.value.find(r => r.level === gameStore.battleLevel)
})

let battleWinListener = null
onMounted(() => {
  battleWinListener = on(events.BATTLE_WIN, (data) => {
    if (!battleInProgress.value) return
    
    const rewards = [data.reward]
    if (data.unlockHarem) {
      rewards.push(`🎉 获得特殊奖励: 👸 ${data.unlockHarem}`)
    }
    if (data.unlockMinister) {
      rewards.push(`🎉 获得特殊奖励: 👨‍💼 ${data.unlockMinister}`)
    }
    rewards.push('解锁下一关')
    
    battleResult.value = {
      win: true,
      rewards
    }
  })
})

onUnmounted(() => {
  if (battleWinListener) {
    battleWinListener()
  }
})

const startBattle = async () => {
  if (battleInProgress.value) return
  
  battleInProgress.value = true
  showBattleAnimation.value = true
  yourHp.value = 100
  enemyHp.value = 100
  battleLogs.value = []
  battleResult.value = { win: false, rewards: [] } // 重置战斗结果
  
  // 战斗动画
  const yourPower = gameStore.totalPower
  const enemyPower = currentLevel.value.enemyPower
  const winChance = Math.min(0.9, Math.max(0.1, yourPower / (yourPower + enemyPower)))
  
  // 战斗回合逻辑
  let battleRound = 0
  const maxRound = currentLevel.value.isBoss ? 15 : 10
  while (battleRound < maxRound && yourHp.value > 0 && enemyHp.value > 0) {
    await new Promise(resolve => setTimeout(resolve, 500))
    battleRound++
    
    // 根据战力计算伤害
    const yourDamageRatio = Math.min(2, Math.max(0.5, yourPower / enemyPower))
    const enemyDamageRatio = Math.min(2, Math.max(0.5, enemyPower / yourPower))
    
    const yourDamage = Math.floor(Math.random() * 20 * yourDamageRatio) + 10
    const enemyDamage = Math.floor(Math.random() * 20 * enemyDamageRatio) + 8
    
    enemyHp.value = Math.max(0, enemyHp.value - yourDamage)
    yourHp.value = Math.max(0, yourHp.value - enemyDamage)
    
    battleLogs.value.push(`朕发动攻击，造成 ${yourDamage} 点伤害！`)
    battleLogs.value.push(`${currentLevel.value.enemy} 反击，造成 ${enemyDamage} 点伤害！`)
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 最终胜负判定
  let win = false
  if (enemyHp.value <= 0 && yourHp.value > 0) {
    win = true
  } else if (yourHp.value <= 0 && enemyHp.value > 0) {
    win = false
  } else {
    win = Math.random() < winChance
  }

  showBattleAnimation.value = false
  showBattleResult.value = true

  if (win) {
    // 基础奖励计算
    const currentBattleLevel = gameStore.battleLevel
    const powerReward = currentLevel.value.isBoss ? 100 + currentBattleLevel * 20 : 50 + currentBattleLevel * 10
    const goldReward = currentLevel.value.isBoss ? 50 + currentBattleLevel * 10 : 20 + currentBattleLevel * 5
    
    // 同步更新store数据
    gameStore.addNationalPower(powerReward)
    gameStore.goldTickets += goldReward
    gameStore.battleLevel++

    // 初始化奖励列表
    const finalRewards = [
      `国力 +${powerReward}`,
      `金票 +${goldReward}`,
      '解锁下一关'
    ]

    // ========== BOSS关解锁逻辑 ==========
    if (currentLevel.value.isBoss) {
      const currentUnlockLevel = currentLevel.value.chapter * 10
      // 解锁后宫
      const haremInfo = battleHarem.find(h => h.unlockLevel === currentUnlockLevel)
      if (haremInfo) {
        const exists = gameStore.harem.find(h => h.name === haremInfo.name)
        if (!exists) {
          gameStore.harem.push({
            id: Date.now() + Math.random(),
            name: haremInfo.name,
            level: 1,
            favor: 50,
            charm: haremInfo.charm,
            talent: haremInfo.talent,
            desc: haremInfo.desc,
            unlockType: 'battle'
          })
          finalRewards.push(`👸 解锁后宫: ${haremInfo.name}`)
        }
      }
      // 解锁大臣
      const ministerInfo = battleMinisters.find(m => m.unlockLevel === currentUnlockLevel)
      if (ministerInfo) {
        const exists = gameStore.ministers.find(m => m.name === ministerInfo.name)
        if (!exists) {
          gameStore.ministers.push({
            id: Date.now() + Math.random(),
            name: ministerInfo.name,
            level: 1,
            power: ministerInfo.power,
            politics: ministerInfo.politics,
            military: ministerInfo.military,
            desc: ministerInfo.desc,
            unlockType: 'battle'
          })
          finalRewards.push(`👨‍💼 解锁名臣: ${ministerInfo.name}`)
        }
      }
    }
    // =====================================

    // 更新战斗结果
    battleResult.value = {
      win: true,
      rewards: finalRewards
    }

    // 同步触发store的战斗胜利事件
    emit(events.BATTLE_WIN, {
      scene: currentLevel.value.isBoss ? 'BOSS副本' : '副本',
      reward: `+${powerReward}国力 +${goldReward}金票`,
      unlockHarem: finalRewards.find(r => r.includes('解锁后宫'))?.replace('👸 解锁后宫: ', ''),
      unlockMinister: finalRewards.find(r => r.includes('解锁名臣'))?.replace('👨‍💼 解锁名臣: ', '')
    })
  } else {
    // 失败逻辑
    battleResult.value = {
      win: false,
      rewards: []
    }
  }
  
  battleInProgress.value = false
}
</script>
<style scoped>
.battle h2 {
  text-align: center;
  margin-bottom: 1rem;
}
.battle > .card:first-of-type p {
  text-align: center;
  color: #FFF8DC;
}
.battle-content {
  display: grid;
  gap: 1rem;
}
.progress-card h3,
.current-level-card h3,
.rewards-preview-card h3 {
  margin-bottom: 1rem;
  color: #FFD700;
}
.progress-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.progress-item {
  background: rgba(255, 215, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #FFD700;
}
.progress-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #FFF8DC;
}
.progress-value {
  display: block;
  font-size: 1.3rem;
  font-weight: bold;
  color: #FFD700;
}
.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.level-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.level-header .boss-tag {
  font-size: 0.9rem;
  color: #ff4444;
  background: rgba(255, 68, 68, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #ff4444;
}
.level-difficulty {
  color: #FFD700;
  font-size: 1.2rem;
}
.level-enemy {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 12px;
}
.enemy-avatar {
  font-size: 4rem;
}
.enemy-info h4 {
  margin-bottom: 0.5rem;
  color: #FFD700;
}
.enemy-info p {
  color: #FFF8DC;
}
.level-rewards {
  margin-bottom: 1.5rem;
}
.level-rewards h4 {
  margin-bottom: 0.5rem;
  color: #FFD700;
}
.level-rewards ul {
  list-style: none;
  padding-left: 1rem;
  color: #FFF8DC;
}
.level-rewards li {
  margin: 0.3rem 0;
}
.level-rewards .special-reward {
  color: #FFD700;
  font-weight: bold;
}
.level-rewards .boss-reward {
  color: #ff4444;
  font-weight: bold;
}
.battle-actions {
  text-align: center;
}
.power-comparison {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.your-power {
  color: #4CAF50;
  font-weight: bold;
}
.vs {
  color: #FFD700;
  font-size: 1.5rem;
  font-weight: bold;
}
.enemy-power {
  color: #f44336;
  font-weight: bold;
}
.battle-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.reward-item {
  background: rgba(255, 215, 0, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #FFD700;
  text-align: center;
}
.reward-level {
  color: #FFF8DC;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}
.reward-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}
.reward-name {
  color: #FFD700;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.reward-status {
  font-size: 0.8rem;
  padding: 0.3rem;
  border-radius: 4px;
}
.reward-status.claimed {
  background: rgba(76, 175, 80, 0.3);
  color: #4CAF50;
}
.reward-status.current {
  background: rgba(255, 193, 7, 0.3);
  color: #FFC107;
}
.reward-status.locked {
  background: rgba(158, 158, 158, 0.3);
  color: #9E9E9E;
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
.btn-primary {
  background: linear-gradient(90deg, #FFD700, #FFA500);
  color: #8B0000;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}
.card {
  background: rgba(139, 0, 0, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid #FFD700;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}
</style>