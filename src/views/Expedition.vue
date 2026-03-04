<template>
  <div class="expedition">
    <BaseCard>
      <h2>🏰 征战天下</h2>
      <div class="expedition-header">
        <StatItem icon="⚔️" label="当前军衔" :value="currentRank.rankName" />
        <StatItem icon="📈" label="全局国力加成" :value="`${currentRank.powerBonus * 100}%`" />
        <StatItem icon="🎖️" label="累计战功" :value="formatNumber(totalWarExp)" />
        <StatItem icon="🛡️" label="当前士兵" :value="formatNumber(gameStore.soldiers)" />
      </div>
    </BaseCard>

    <!-- 地图选择器 -->
    <div class="map-select">
      <div class="map-tabs">
        <button 
          v-for="map in expeditionStageConfig" 
          :key="map.mapId"
          :class="['map-tab', { active: currentMapId === map.mapId, locked: map.unlockPower > gameStore.totalPower }]"
          @click="switchMap(map.mapId)"
          :disabled="map.unlockPower > gameStore.totalPower"
        >
          {{ map.mapName }}
        </button>
      </div>
    </div>

    <!-- 当前地图信息 -->
    <BaseCard v-if="currentMap">
      <div class="map-info">
        <h3>{{ currentMap.mapName }}</h3>
        <p>解锁要求：国力 ≥ {{ formatNumber(currentMap.unlockPower) }} | 单关士兵消耗：{{ formatNumber(currentMap.soldierCostPerStage) }}</p>
        <p>通关解锁：{{ currentMap.tributaryUnlock }} 藩属国，每日可领取纳贡奖励</p>
      </div>
    </BaseCard>

    <!-- 关卡列表 -->
    <div class="expedition-stage-list">
      <div 
        v-for="stage in currentMap.stageList" 
        :key="stage.stageId"
        class="expedition-stage-item"
        :class="{
          locked: stage.stageId > maxUnlockExpeditionStage,
          passed: stage.stageId < maxUnlockExpeditionStage,
          current: stage.stageId === maxUnlockExpeditionStage,
          elite: stage.isElite,
          boss: stage.isBoss
        }"
      >
        <div class="stage-info">
          <div class="stage-no">
            {{ stage.isBoss ? 'BOSS' : stage.isElite ? '精英' : `第${stage.stageId}关` }}
          </div>
          <div class="stage-detail">
            <h4>{{ stage.stageName }}</h4>
            <p>敌方战力：{{ formatNumber(stage.enemyPower) }} | 士兵消耗：{{ formatNumber(stage.soldierCost) }}</p>
            <p>战功掉落：{{ formatNumber(stage.warExpDrop) }}</p>
          </div>
        </div>
        <div class="stage-action">
          <BaseButton 
            type="primary" 
            :disabled="stage.stageId > maxUnlockExpeditionStage || gameStore.soldiers < stage.soldierCost"
            @click="expeditionStage(stage)"
          >
            {{ stage.stageId < maxUnlockExpeditionStage ? '扫荡' : '出征' }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- 出征弹窗 -->
    <BaseModal v-model:modelValue="showExpeditionModal" :closeOnClickOverlay="false">
      <div class="expedition-modal">
        <h3>出征 {{ currentExpeditionStage?.stageName }}</h3>
        <div class="expedition-warning">
          ⚠️ 本次出征将消耗 {{ formatNumber(currentExpeditionStage?.soldierCost) }} 士兵，是否确认出征？
        </div>
        <div class="expedition-stats">
          <div class="stat-item">
            <span>我方国力</span>
            <span class="my-power">{{ formatNumber(gameStore.totalPower) }}</span>
          </div>
          <div class="stat-item">
            <span>敌方战力</span>
            <span class="enemy-power">{{ formatNumber(currentExpeditionStage?.enemyPower) }}</span>
          </div>
          <div class="stat-item">
            <span>胜率预测</span>
            <span class="win-rate">{{ Math.floor(expeditionWinRate * 100) }}%</span>
          </div>
        </div>
        <div class="expedition-actions">
          <BaseButton type="primary" @click="confirmExpedition" :disabled="isExpeditioning">
            {{ isExpeditioning ? '出征中...' : '确认出征' }}
          </BaseButton>
          <BaseButton type="secondary" @click="showExpeditionModal = false" :disabled="isExpeditioning">取消</BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- 出征结果弹窗 -->
    <BaseModal v-model:modelValue="showExpeditionResultModal" :closeOnClickOverlay="false">
      <div class="result-modal">
        <h2 v-if="expeditionResult.win" class="win-title">🎉 出征大捷！</h2>
        <h2 v-else class="lose-title">❌ 出征失败</h2>
        <div class="result-content">
          <h4>获得奖励</h4>
          <div class="reward-list">
            <span v-for="(item, index) in expeditionResult.reward" :key="index" class="reward-item">{{ item }}</span>
          </div>
        </div>
        <BaseButton type="primary" @click="closeExpeditionResult">确认</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { expeditionStageConfig, getMilitaryRank } from '@/data/stageConfig'
import { formatNumber, calculateWinRate } from '@/utils/gameUtils'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import StatItem from '@/components/StatItem.vue'

const gameStore = useGameStore()

// 地图&关卡状态
const currentMapId = ref(1)
const maxUnlockExpeditionStage = ref(1)
const totalWarExp = ref(0)
const showExpeditionModal = ref(false)
const showExpeditionResultModal = ref(false)
const currentExpeditionStage = ref(null)
const isExpeditioning = ref(false)
const expeditionResult = ref({ win: false, reward: [] })

// 当前地图信息
const currentMap = computed(() => {
  return expeditionStageConfig.find(map => map.mapId === currentMapId.value) || expeditionStageConfig[0]
})

// 当前军衔
const currentRank = computed(() => getMilitaryRank(totalWarExp.value))

// 出征胜率
const expeditionWinRate = computed(() => {
  if (!currentExpeditionStage.value) return 0
  return calculateWinRate(gameStore.totalPower, currentExpeditionStage.value.enemyPower, gameStore.vipExp)
})

// 切换地图
const switchMap = (mapId) => {
  const map = expeditionStageConfig.find(m => m.mapId === mapId)
  if (map && map.unlockPower <= gameStore.totalPower) {
    currentMapId.value = mapId
    // 重置关卡进度
    const savedProgress = localStorage.getItem(`expedition_progress_${mapId}`)
    if (savedProgress) {
      maxUnlockExpeditionStage.value = JSON.parse(savedProgress)
    } else {
      maxUnlockExpeditionStage.value = 1
    }
  }
}

// 出征关卡
const expeditionStage = (stage) => {
  currentExpeditionStage.value = stage
  showExpeditionModal.value = true
}

// 确认出征
const confirmExpedition = async () => {
  isExpeditioning.value = true
  // 扣除士兵
  gameStore.soldiers = Math.max(0, gameStore.soldiers - currentExpeditionStage.value.soldierCost)
  // 模拟战斗
  await new Promise(resolve => setTimeout(resolve, 1500))

  const random = Math.random()
  const win = random < expeditionWinRate.value

  // 奖励计算
  const reward = [...currentExpeditionStage.value.drop]
  if (win) {
    // 增加战功
    totalWarExp.value += currentExpeditionStage.value.warExpDrop
    // 解锁下一关
    if (currentExpeditionStage.value.stageId === maxUnlockExpeditionStage.value) {
      maxUnlockExpeditionStage.value++
      // 地图通关
      if (maxUnlockExpeditionStage.value > currentMap.value.totalStage) {
        maxUnlockExpeditionStage.value = currentMap.value.totalStage
        reward.push(`🏆 恭喜通关${currentMap.value.mapName}，解锁${currentMap.value.tributaryUnlock}藩属国！`)
      }
    }
  } else {
    reward.push('士兵损失惨重，未获得额外奖励')
  }

  expeditionResult.value = { win, reward }
  isExpeditioning.value = false
  showExpeditionModal.value = false
  showExpeditionResultModal.value = true
}

// 关闭结果弹窗
const closeExpeditionResult = () => {
  showExpeditionResultModal.value = false
  currentExpeditionStage.value = null
  expeditionResult.value = { win: false, reward: [] }
}

// 初始化
onMounted(() => {
  // 加载战功
  const savedWarExp = localStorage.getItem('total_war_exp')
  if (savedWarExp) {
    totalWarExp.value = parseInt(savedWarExp)
  }
  // 加载当前地图进度
  switchMap(1)
})

// 保存进度
watch(totalWarExp, (val) => {
  localStorage.setItem('total_war_exp', val.toString())
})

watch([currentMapId, maxUnlockExpeditionStage], () => {
  localStorage.setItem(`expedition_progress_${currentMapId.value}`, JSON.stringify(maxUnlockExpeditionStage.value))
})
</script>

<style scoped>
.expedition h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.expedition-header {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.map-select {
  margin: 1rem 0;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.map-tabs {
  display: flex;
  gap: 0.5rem;
  min-width: max-content;
}

.map-tab {
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  border: 2px solid rgba(255, 215, 0, 0.3);
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  white-space: nowrap;
}

.map-tab:hover:not(.locked) {
  border-color: #FFD700;
}

.map-tab.active {
  background: linear-gradient(180deg, #FFD700 0%, #FFA500 100%);
  color: #8B0000;
  border-color: #FFD700;
}

.map-tab.locked {
  opacity: 0.5;
  filter: grayscale(1);
  cursor: not-allowed;
}

.map-info {
  text-align: center;
}

.map-info h3 {
  margin-bottom: 0.5rem;
  color: #FFD700;
}

.map-info p {
  margin: 0.3rem 0;
  color: #FFF8DC;
}

.expedition-stage-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 1rem 0;
}

.expedition-stage-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 1rem 1.2rem;
  transition: all 0.3s;
}

.expedition-stage-item:hover:not(.locked) {
  transform: translateX(5px);
  border-color: #FFD700;
}

.expedition-stage-item.locked {
  opacity: 0.5;
  filter: grayscale(1);
  cursor: not-allowed;
}

.expedition-stage-item.passed {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
}

.expedition-stage-item.current {
  border-color: #FFD700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.expedition-stage-item.elite {
  border-color: #FFC107;
  background: rgba(255, 193, 7, 0.1);
}

.expedition-stage-item.boss {
  border-color: #f44336;
  background: rgba(244, 67, 54, 0.1);
}

.stage-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.stage-no {
  width: 80px;
  height: 50px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFD700;
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.expedition-stage-item.boss .stage-no {
  background: rgba(244, 67, 54, 0.3);
  color: white;
}

.expedition-stage-item.elite .stage-no {
  background: rgba(255, 193, 7, 0.3);
  color: white;
}

.stage-detail h4 {
  margin: 0 0 0.3rem 0;
  color: #FFD700;
}

.stage-detail p {
  margin: 0.2rem 0;
  color: rgba(255, 248, 220, 0.8);
  font-size: 0.85rem;
}

.expedition-warning {
  background: rgba(255, 193, 7, 0.2);
  border: 1px solid #FFC107;
  border-radius: 8px;
  padding: 1rem;
  color: #FFC107;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: bold;
}

.expedition-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.expedition-stats .stat-item {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.my-power {
  color: #4CAF50;
  font-weight: bold;
}

.enemy-power {
  color: #f44336;
  font-weight: bold;
}

.win-rate {
  color: #FFD700;
  font-weight: bold;
}

.expedition-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.win-title {
  color: #4CAF50;
  margin-bottom: 1rem;
}

.lose-title {
  color: #f44336;
  margin-bottom: 1rem;
}

.result-content h4 {
  margin-bottom: 0.8rem;
  color: #FFD700;
}

.reward-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.reward-item {
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .expedition-header {
    grid-template-columns: repeat(2, 1fr);
  }
  .expedition-stage-item {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  .stage-action {
    display: flex;
    justify-content: center;
  }
  .expedition-stats {
    grid-template-columns: 1fr;
  }
}
</style>