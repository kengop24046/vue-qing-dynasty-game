<template>
  <div class="treasure">
    <!-- 页面标题 -->
    <div class="card title-card">
      <h2>🎁 珍宝阁</h2>
      <p>陛下可在此查看、使用所有珍宝道具</p>
    </div>

    <!-- 道具分类标签 -->
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

    <!-- 道具列表 -->
    <div class="card">
      <div v-if="filteredItemList.length === 0" class="empty-tip">
        <p>该分类暂无道具，快去获取吧~</p>
      </div>
      <div v-else class="item-grid">
        <div v-for="item in filteredItemList" :key="item.id" class="item-card">
          <div class="item-icon">{{ item.icon }}</div>
          <div class="item-info">
            <h4>{{ item.name }}</h4>
            <p class="item-desc">{{ item.desc }}</p>
            <p class="item-source">获取途径：{{ item.source }}</p>
            <p class="item-count">剩余：{{ item.count }}</p>
          </div>
          <div class="item-action">
            <button 
              class="btn-primary" 
              @click="openUseModal(item)"
              :disabled="!canUseItem(item)"
            >
              {{ canUseItem(item) ? '使用' : '不可使用' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 亲密丹使用弹窗 -->
    <div v-if="useModal.type === 'intimate'" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>💖 使用亲密丹</h3>
        <p>当前数量：{{ currentItem.count }}</p>
        <p class="modal-desc">选择要使用的妃嫔，增加亲密度</p>

        <div v-if="gameStore.harem.length === 0" class="empty-tip">
          <p>暂无妃嫔，先去寻访获取吧</p>
        </div>
        <div v-else class="consort-list">
          <div 
            v-for="consort in gameStore.harem" 
            :key="consort.id"
            class="consort-item"
            @click="selectConsort = consort"
            :class="{ active: selectConsort?.id === consort.id }"
          >
            <span>{{ consort.name }}</span>
            <span>亲密度：{{ consort.favor }}</span>
          </div>
        </div>

        <div class="use-count">
          <button @click="useCount = Math.max(1, useCount - 1)" :disabled="useCount <= 1">-</button>
          <span>{{ useCount }} 个</span>
          <button 
            @click="useCount = Math.min(currentItem.count, useCount + 1)" 
            :disabled="useCount >= currentItem.count"
          >+</button>
        </div>

        <div class="modal-actions">
          <button class="btn-primary" @click="confirmUseIntimateDan" :disabled="!selectConsort || useCount <= 0">确认使用</button>
          <button class="btn-secondary" @click="closeModal">取消</button>
        </div>
      </div>
    </div>

    <!-- 大臣道具使用弹窗 -->
    <div v-if="useModal.type === 'minister'" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>{{ currentItem.icon }} 使用{{ currentItem.name }}</h3>
        <p>当前数量：{{ currentItem.count }}</p>
        <p class="modal-desc">{{ currentItem.desc }}</p>

        <div v-if="gameStore.ministers.length === 0" class="empty-tip">
          <p>暂无大臣，先去寻访获取吧</p>
        </div>
        <div v-else class="minister-list">
          <div 
            v-for="minister in gameStore.ministers" 
            :key="minister.id"
            class="minister-item"
            @click="selectMinister = minister"
            :class="{ active: selectMinister?.id === minister.id }"
          >
            <span>{{ minister.name }}</span>
            <span>等级：{{ minister.level }}</span>
          </div>
        </div>

        <div class="use-count">
          <button @click="useCount = Math.max(1, useCount - 1)" :disabled="useCount <= 1">-</button>
          <span>{{ useCount }} 个</span>
          <button 
            @click="useCount = Math.min(currentItem.count, useCount + 1)" 
            :disabled="useCount >= currentItem.count"
          >+</button>
        </div>

        <div class="modal-actions">
          <button class="btn-primary" @click="confirmUseMinisterItem" :disabled="!selectMinister || useCount <= 0">确认使用</button>
          <button class="btn-secondary" @click="closeModal">取消</button>
        </div>
      </div>
    </div>

    <!-- 其他道具提示弹窗 -->
    <div v-if="useModal.type === 'other'" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>{{ currentItem.icon }} {{ currentItem.name }}</h3>
        <p class="modal-desc">{{ currentItem.desc }}</p>
        <p class="modal-tip">该道具可在对应功能页面使用</p>
        <div class="modal-actions">
          <button class="btn-primary" @click="goToUseScene">前往使用</button>
          <button class="btn-secondary" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { emit, events } from '@/utils/eventBus'
import { itemConfig, itemTypeEnum } from '@/data/itemConfig'

const gameStore = useGameStore()

// 分类标签
const tabList = [
  { type: 'all', name: '全部' },
  { type: 'consort', name: '妃嫔道具' },
  { type: 'minister', name: '大臣道具' },
  { type: 'other', name: '其他道具' }
]
const currentTab = ref('all')

// 弹窗状态
const useModal = ref({ type: '', show: false })
const currentItem = ref(null)
const selectConsort = ref(null)
const selectMinister = ref(null)
const useCount = ref(1)

const filteredItemList = computed(() => {
  const allItems = gameStore.bagItemList
  if (currentTab.value === 'all') return allItems

  const typeMap = {
    consort: [itemTypeEnum.CONSORT_FAVOR, itemTypeEnum.CONSORT_STAR],
    minister: [itemTypeEnum.MINISTER_BREAK, itemTypeEnum.MINISTER_ABILITY, itemTypeEnum.MINISTER_REWARD],
    other: [itemTypeEnum.CURRENCY, itemTypeEnum.OTHER]
  }
  const targetTypes = typeMap[currentTab.value] || []
  return allItems.filter(item => targetTypes.includes(item.type))
})

// 判断道具是否可直接使用
const canUseItem = (item) => {
  const usableTypes = [
    itemTypeEnum.CONSORT_FAVOR,
    itemTypeEnum.MINISTER_ABILITY,
    itemTypeEnum.MINISTER_REWARD
  ]
  return usableTypes.includes(item.type)
}

// 打开使用弹窗
const openUseModal = (item) => {
  currentItem.value = item
  useCount.value = 1
  selectConsort.value = null
  selectMinister.value = null

  // 按道具类型打开对应弹窗
  if (item.type === itemTypeEnum.CONSORT_FAVOR) {
    useModal.value = { type: 'intimate', show: true }
  } else if ([itemTypeEnum.MINISTER_ABILITY, itemTypeEnum.MINISTER_REWARD].includes(item.type)) {
    useModal.value = { type: 'minister', show: true }
  } else {
    useModal.value = { type: 'other', show: true }
  }
}

// 关闭弹窗
const closeModal = () => {
  useModal.value = { type: '', show: false }
  currentItem.value = null
  selectConsort.value = null
  selectMinister.value = null
  useCount.value = 1
}

// 确认使用亲密丹
const confirmUseIntimateDan = () => {
  if (!selectConsort.value || useCount.value <= 0 || !currentItem.value) return
  const result = gameStore.useIntimateDan(selectConsort.value.id, useCount.value)
  if (result) {
    emit(events.SHOW_MESSAGE, { 
      type: 'success', 
      content: `使用成功！${selectConsort.value.name} 亲密度+${10 * useCount.value}！` 
    })
    closeModal()
  }
}

// 确认使用大臣道具
const confirmUseMinisterItem = () => {
  if (!selectMinister.value || useCount.value <= 0 || !currentItem.value) return
  let result = false

  // 资质道具
  if (currentItem.value.type === itemTypeEnum.MINISTER_ABILITY) {
    result = gameStore.upgradeMinisterAbility(
      selectMinister.value.id,
      currentItem.value.effect.abilityType,
      currentItem.value.id
    )
  }
  // 赏赐道具
  if (currentItem.value.type === itemTypeEnum.MINISTER_REWARD) {
    result = gameStore.rewardMinister(
      selectMinister.value.id,
      currentItem.value.id,
      useCount.value
    )
  }

  if (result) {
    closeModal()
  }
}

// 前往道具使用场景
const goToUseScene = () => {
  if (!currentItem.value) return
  const sceneMap = {
    harem: 'harem',
    minister: 'ministers',
    battle: 'battle'
  }
  const targetView = sceneMap[currentItem.value.useScene]
  if (targetView) {
    emit(events.NAVIGATE, targetView)
  }
  closeModal()
}
</script>

<style scoped>
.treasure {
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
}
.title-card {
  text-align: center;
}
.title-card h2 {
  margin: 0 0 0.5rem 0;
  color: #FFD700;
  font-size: 1.8rem;
}
.title-card p {
  margin: 0;
  color: #FFF8DC;
  opacity: 0.8;
}

.tab-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  flex-wrap: nowrap;
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

.empty-tip {
  text-align: center;
  padding: 3rem 0;
  color: #FFF8DC;
  opacity: 0.7;
}
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1rem;
}
.item-card {
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
  display: flex;
  gap: 1rem;
  align-items: center;
  transition: all 0.3s;
}
.item-card:hover {
  border-color: #FFD700;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}
.item-icon {
  font-size: 3rem;
  flex-shrink: 0;
}
.item-info {
  flex: 1;
}
.item-info h4 {
  margin: 0 0 0.3rem 0;
  color: #FFD700;
}
.item-desc {
  margin: 0 0 0.2rem 0;
  color: #FFF8DC;
  font-size: 0.9rem;
}
.item-source {
  margin: 0 0 0.2rem 0;
  color: #FFF8DC;
  font-size: 0.8rem;
  opacity: 0.7;
}
.item-count {
  margin: 0;
  color: #FFD700;
  font-weight: bold;
  font-size: 1rem;
}
.item-action {
  flex-shrink: 0;
}

.btn-primary {
  background: linear-gradient(90deg, #FFD700, #FFA500);
  color: #8B0000;
  border: none;
  padding: 0.8rem 1.2rem;
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
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-secondary:hover {
  background: rgba(255, 215, 0, 0.3);
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
  max-height: 80vh;
  overflow-y: auto;
}
.modal h3 {
  text-align: center;
  color: #FFD700;
  margin-bottom: 1rem;
}
.modal p {
  text-align: center;
  color: #fff8dc;
  margin: 0 0 0.5rem 0;
}
.modal-desc {
  opacity: 0.8;
}
.modal-tip {
  background: rgba(255, 215, 0, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}
.consort-list, .minister-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.consort-item, .minister-item {
  padding: 0.8rem 1rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  border: 2px solid transparent;
}
.consort-item.active, .minister-item.active {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.2);
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
  flex-wrap: wrap;
}
</style>