<template>
  <div class="harem">
    <!-- 顶部统计&操作区 -->
    <div class="card">
      <h2>🏮 后宫</h2>
      <div class="harem-stats">
        <p>当前妃嫔总数：{{ gameStore?.harem?.length || 0 }}</p>
        <p>今日剩余宠幸次数：{{ (gameStore?.dailyFavorLimit || 0) - (gameStore?.todayFavorCount || 0) }}/{{ gameStore?.dailyFavorLimit || 0 }}</p>
        <p>VIP等级：{{ gameStore?.vipLevel || 0 }}（VIP可提升每日宠幸次数）</p>
      </div>
      <div class="btn-group">
        <button 
          class="btn-primary btn-large" 
          @click="handleRandomFavorAll"
          :disabled="!canRandomFavor"
        >
          🎲 一键宠幸
        </button>
        <button 
          class="btn-primary btn-large" 
          @click="addDefaultConsort"
          v-if="(gameStore?.harem?.length || 0) === 0"
        >
          📥 添加初始妃嫔
        </button>
      </div>
      <p v-if="!canRandomFavor && (gameStore?.harem?.length || 0) > 0" class="disabled-tip">
        {{ disableFavorReason }}
      </p>
    </div>
    <!-- 分类筛选标签 -->
    <div class="tab-bar">
      <button 
        v-for="tab in tabList" 
        :key="tab.type"
        :class="{ active: currentTab === tab.type }"
        @click="currentTab = tab.type"
      >
        {{ tab.name }}
      </button>
    </div>
    <!-- 妃嫔列表 + 空状态提示 -->
    <div v-if="filteredHarem.length === 0" class="empty-harem">
      <p>暂无对应妃嫔 💔</p>
      <button class="btn-secondary" @click="addDefaultConsort" v-if="(gameStore?.harem?.length || 0) === 0">
        点击添加初始妃嫔
      </button>
      <button class="btn-secondary" @click="currentTab = 'all'" v-else>
        查看全部妃嫔
      </button>
    </div>
    <div class="consort-grid" v-else>
      <div 
        v-for="consort in filteredHarem" 
        :key="consort.id || `consort_${index}`" 
        class="consort-card"
        v-bind:index="index"
      >
        <div class="consort-header">
          <h3>{{ consort.name || '未知妃嫔' }}</h3>
          <span class="consort-rank">【{{ getRankName(consort.rank) }}】</span>
        </div>
        <div class="consort-stats">
          <p>等级：{{ consort.level || 1 }}</p>
          <p>亲密度：{{ consort.favor || 0 }}</p>
          <p>星级：{{ consort.star || 1 }}星</p>
          <p v-if="consort.isPregnant" class="pregnant-tag">🤰 怀有龙裔</p>
          <p v-if="!checkConsortCD(consort.id)" class="cd-tag">
            ⏳ 冷却中（剩余{{ getRemainCD(consort.id) }}分钟）
          </p>
        </div>
        <div class="consort-actions">
          <button 
            class="btn-secondary" 
            @click="handleFavor(consort.id)"
            :disabled="!canFavorConsort(consort.id)"
          >
            宠幸
          </button>
          <button class="btn-secondary" @click="handleUseIntimateDan(consort.id)">使用亲密丹</button>
          <button class="btn-secondary" @click="handleUpgradeStar(consort.id)">升星</button>
          <button class="btn-secondary" @click="handleUpgradeRank(consort.id)">晋升妃位</button>
          <button class="btn-secondary" @click="handleStudy(consort.id)">习礼</button>
        </div>
      </div>
    </div>
    <!-- 亲密丹使用弹窗 -->
    <div v-if="showIntimateModal" class="modal-overlay" @click="closeIntimateModal">
      <div class="modal" @click.stop>
        <h3>💖 使用亲密丹</h3>
        <p>当前亲密丹数量：{{ gameStore?.getItemCount?.('intimate_dan') || 0 }}</p>
        <div class="use-count">
          <button @click="intimateCount = Math.max(1, intimateCount - 1)" :disabled="intimateCount <= 1">-</button>
          <span>{{ intimateCount }} 个</span>
          <button 
            @click="intimateCount = Math.min(gameStore?.getItemCount?.('intimate_dan') || 0, intimateCount + 1)" 
            :disabled="intimateCount >= (gameStore?.getItemCount?.('intimate_dan') || 0)"
          >+</button>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" @click="confirmUseIntimateDan">确认使用</button>
          <button class="btn-secondary" @click="closeIntimateModal">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { emit, events } from '@/utils/eventBus'
import { consortRankConfig } from '@/data/consortConfig'

// 立即初始化store，避免挂载后才获取导致数据延迟
const gameStore = useGameStore()

// 分类标签
const tabList = [
  { type: 'all', name: '全部' },
  { type: 'available', name: '可宠幸' },
  { type: 'pregnant', name: '怀孕中' }
]
const currentTab = ref('all')

// 弹窗状态
const showIntimateModal = ref(false)
const currentConsortId = ref(null)
const intimateCount = ref(1)

// 校验妃嫔冷却（简化兜底，避免误判）
const checkConsortCD = (consortId) => {
  if (!consortId || !gameStore?.checkFavorCD) return true
  try {
    return gameStore.checkFavorCD(consortId)
  } catch (e) {
    return true
  }
}

// 获取妃位名称
const getRankName = (rank) => {
  if (!rank || !consortRankConfig || !Array.isArray(consortRankConfig)) return '答应'
  const rankConfig = consortRankConfig.find(r => r.rank === rank)
  return rankConfig?.name || '答应'
}

// 获取妃嫔冷却剩余分钟数
const getRemainCD = (consortId) => {
  if (!consortId || !gameStore?.harem) return 0
  try {
    const consort = gameStore.harem.find(c => c?.id === consortId)
    if (!consort || !consort.lastFavorTime) return 0
    const remainMs = (gameStore.favorCD || 300000) - (Date.now() - consort.lastFavorTime)
    return Math.max(0, Math.ceil(remainMs / 1000 / 60))
  } catch (err) {
    return 0
  }
}

// 一键宠幸可用状态
const canRandomFavor = computed(() => {
  if (!gameStore || gameStore.harem?.length === 0) return false
  if ((gameStore.todayFavorCount || 0) >= (gameStore.dailyFavorLimit || 5)) return false
  const availableConsorts = gameStore.harem.filter(c => {
    return c && !c.isPregnant && checkConsortCD(c?.id)
  })
  return availableConsorts.length > 0
})

// 一键宠幸禁用原因
const disableFavorReason = computed(() => {
  if (!gameStore) return '数据加载中'
  if ((gameStore.todayFavorCount || 0) >= (gameStore.dailyFavorLimit || 5)) return '今日宠幸次数已达上限'
  return '所有妃嫔均在冷却中或怀孕，暂无可用妃嫔'
})

// 筛选后的妃嫔列表【核心修复】：移除过度过滤，兼容非标准字段的妃嫔数据
const filteredHarem = computed(() => {
  // 直接返回空数组，避免store未初始化报错
  if (!gameStore || !Array.isArray(gameStore.harem)) return []
  // 仅过滤完全空的对象，保留所有有数据的妃嫔（不再强制要求id/name必传）
  const validHarem = gameStore.harem.filter(c => c && Object.keys(c).length > 0)
  // 无有效数据直接返回
  if (validHarem.length === 0) return []
  // 按标签筛选，兼容无id的妃嫔
  switch (currentTab.value) {
    case 'available':
      return validHarem.filter(c => !c.isPregnant && checkConsortCD(c?.id))
    case 'pregnant':
      return validHarem.filter(c => c.isPregnant)
    default:
      return validHarem
  }
})

// 校验单个妃嫔是否可宠幸
const canFavorConsort = (consortId) => {
  if (!consortId || (gameStore.todayFavorCount || 0) >= (gameStore.dailyFavorLimit || 5)) return false
  const consort = gameStore.harem?.find(c => c?.id === consortId)
  if (!consort || consort.isPregnant) return false
  return checkConsortCD(consortId)
}

// 一键宠幸
const handleRandomFavorAll = () => {
  if (!canRandomFavor.value) return
  const result = gameStore.randomFavorAll?.()
  if (result) {
    emit(events.SHOW_MESSAGE, { 
      type: 'success', 
      content: '已随机宠幸一位妃嫔！' 
    })
  }
}

// 单个妃嫔宠幸
const handleFavor = (consortId) => {
  if (!consortId || !canFavorConsort(consortId)) return
  const result = gameStore.favorConsort?.(consortId)
  if (result) {
    const consort = gameStore.harem?.find(c => c?.id === consortId)
    emit(events.SHOW_MESSAGE, { 
      type: 'success', 
      content: `已宠幸${consort?.name || '妃嫔'}，亲密度提升！` 
    })
  }
}

// 打开亲密丹使用弹窗
const handleUseIntimateDan = (consortId) => {
  if (!consortId) return
  currentConsortId.value = consortId
  intimateCount.value = 1
  showIntimateModal.value = true
}

// 关闭亲密丹弹窗
const closeIntimateModal = () => {
  showIntimateModal.value = false
  currentConsortId.value = null
  intimateCount.value = 1
}

// 确认使用亲密丹
const confirmUseIntimateDan = () => {
  if (!currentConsortId.value || intimateCount.value <= 0) return
  const result = gameStore.useIntimateDan?.(currentConsortId.value, intimateCount.value)
  if (result) {
    closeIntimateModal()
  }
}

// 妃嫔升星
const handleUpgradeStar = (consortId) => {
  if (!consortId) return
  gameStore.upgradeHaremStar?.(consortId)
}

// 妃位升级
const handleUpgradeRank = (consortId) => {
  if (!consortId) return
  gameStore.upgradeConsortRank?.(consortId)
}

// 妃嫔习礼
const handleStudy = (consortId) => {
  if (!consortId) return
  gameStore.consortStudy?.(consortId)
}

// 监听harem数据变化，确保数据更新后页面实时渲染
watch(() => gameStore.harem, () => {}, { deep: true, immediate: true })
</script>
<style scoped>
.harem {
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}
.card {
  background: rgba(139, 0, 0, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid #FFD700;
  margin-bottom: 1rem;
  text-align: center;
}
h2 {
  text-align: center;
  color: #FFD700;
  margin-bottom: 1rem;
}
.harem-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}
.harem-stats p {
  background: rgba(255, 215, 0, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin: 0;
  color: #FFF8DC;
}
.btn-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.btn-large {
  display: inline-block;
  width: 200px;
  padding: 1rem;
  font-size: 1.2rem;
}
.disabled-tip {
  text-align: center;
  color: #ff6b6b;
  margin: 0;
  font-size: 0.9rem;
}
.empty-harem {
  text-align: center;
  padding: 5rem 1rem;
  background: rgba(139, 0, 0, 0.5);
  border-radius: 12px;
  border: 2px dashed #FFD700;
  color: #FFF8DC;
}
.empty-harem p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}
.tab-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  flex-wrap: nowrap;
  justify-content: center;
}
.tab-bar button {
  background: rgba(255, 215, 0, 0.1);
  color: #FFF8DC;
  border: 2px solid transparent;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}
.tab-bar button.active {
  background: linear-gradient(90deg, #FFD700, #FFA500);
  color: #8B0000;
  border-color: #FFD700;
}
.tab-bar button:hover {
  border-color: #FFD700;
}
.consort-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.consort-card {
  background: rgba(139, 0, 0, 0.7);
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid #FFD700;
  color: #FFF8DC;
}
.consort-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed #FFD700;
}
.consort-header h3 {
  margin: 0;
  color: #FFD700;
  font-size: 1.2rem;
}
.consort-rank {
  font-size: 0.8rem;
  color: #fff8dc;
  background: rgba(255, 215, 0, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}
.consort-stats {
  margin-bottom: 1rem;
  line-height: 1.6;
}
.consort-stats p {
  margin: 0.3rem 0;
  color: #fff8dc;
}
.pregnant-tag {
  color: #ff69b4;
  font-weight: bold;
}
.cd-tag {
  color: #ffa500;
  font-weight: bold;
}
.consort-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
}
.btn-primary {
  background: linear-gradient(90deg, #FFD700, #FFA500);
  color: #8B0000;
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: #FFD700;
  border: 2px solid #FFD700;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.85rem;
}
.btn-secondary:hover {
  background: rgba(255, 215, 0, 0.3);
}
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  max-width: 400px;
  width: 90%;
}
.modal h3 {
  text-align: center;
  color: #FFD700;
  margin-bottom: 1rem;
}
.modal p {
  text-align: center;
  color: #fff8dc;
  margin-bottom: 1rem;
}
.use-count {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.use-count button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #FFD700;
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  font-weight: bold;
  cursor: pointer;
}
.use-count button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.use-count span {
  font-size: 1.2rem;
  font-weight: bold;
  color: #FFD700;
  min-width: 60px;
  text-align: center;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>