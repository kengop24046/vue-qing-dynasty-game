<template>
  <div class="ministers">
    <BaseCard>
      <h2>📜 大清大臣</h2>
      <p>当前共有 {{ gameStore.ministers.length }} 位大臣，总战力 {{ totalMinisterPower.toLocaleString() }}</p>
    </BaseCard>

    <div class="filter-tabs">
      <button 
        v-for="tab in filterTabs" 
        :key="tab.key"
        :class="['tab-btn', { active: currentFilter === tab.key }]"
        @click="currentFilter = tab.key"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="grid-3">
      <div v-for="minister in filteredMinisters" :key="minister.id" class="minister-card">
        <div class="minister-avatar">👨‍💼</div>
        <h3>{{ minister.name }}</h3>
        <p class="minister-position">{{ getPosition(minister) }}</p>
        <div class="minister-stats">
          <div class="stat-item">
            <span class="stat-label">等级</span>
            <span class="stat-value">Lv.{{ minister.level }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">综合战力</span>
            <span class="stat-value">{{ minister.power }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">政治</span>
            <span class="stat-value politics">{{ minister.politics }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">军事</span>
            <span class="stat-value military">{{ minister.military }}</span>
          </div>
        </div>
        <p class="minister-desc">{{ minister.desc }}</p>
        <div class="minister-actions">
          <BaseButton type="primary" @click="trainMinister(minister)">📚 培养</BaseButton>
          <BaseButton type="secondary" @click="showDetail(minister)">📋 详情</BaseButton>
        </div>
      </div>
    </div>

    <!-- 大臣详情弹窗 -->
    <BaseModal v-model:modelValue="showModal" :closeOnClickOverlay="true">
      <div class="minister-detail">
        <h2>{{ currentMinister?.name }}</h2>
        <p class="detail-desc">{{ currentMinister?.desc }}</p>
        <div class="detail-stats">
          <StatItem icon="📊" label="等级" :value="`Lv.${currentMinister?.level}`" />
          <StatItem icon="⚔️" label="综合战力" :value="currentMinister?.power" />
          <StatItem icon="📋" label="政治" :value="currentMinister?.politics" />
          <StatItem icon="🛡️" label="军事" :value="currentMinister?.military" />
          <StatItem icon="🏅" label="职位" :value="getPosition(currentMinister)" />
          <StatItem icon="🔓" label="解锁途径" :value="getUnlockType(currentMinister)" />
        </div>
        <div class="detail-actions">
          <BaseButton type="primary" @click="trainMinister(currentMinister); showModal = false">📚 培养升级</BaseButton>
          <BaseButton type="secondary" @click="showModal = false">关闭</BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import StatItem from '@/components/StatItem.vue'

const gameStore = useGameStore()
const currentFilter = ref('all')
const showModal = ref(false)
const currentMinister = ref(null)

// 筛选标签
const filterTabs = [
  { key: 'all', name: '全部' },
  { key: 'civil', name: '文官' },
  { key: 'military', name: '武将' },
  { key: 'initial', name: '初始' },
  { key: 'search', name: '寻访' },
  { key: 'battle', name: '副本' },
  { key: 'vip', name: 'VIP专属' }
]

// 总大臣战力
const totalMinisterPower = computed(() => {
  return gameStore.ministers.reduce((sum, m) => sum + m.power, 0)
})

// 筛选大臣列表
const filteredMinisters = computed(() => {
  const list = gameStore.ministers
  switch (currentFilter.value) {
    case 'civil':
      return list.filter(m => m.politics >= m.military)
    case 'military':
      return list.filter(m => m.military > m.politics)
    case 'initial':
      return list.filter(m => m.unlockType === 'initial')
    case 'search':
      return list.filter(m => m.unlockType === 'search')
    case 'battle':
      return list.filter(m => m.unlockType === 'battle')
    case 'vip':
      return list.filter(m => m.unlockType === 'vip')
    default:
      return list
  }
})

// 获取职位
const getPosition = (minister) => {
  if (!minister) return ''
  if (minister.power >= 500) return '摄政王'
  if (minister.power >= 400) return '大学士'
  if (minister.power >= 300) return '军机大臣'
  if (minister.power >= 200) return '尚书'
  if (minister.power >= 150) return '侍郎'
  if (minister.power >= 100) return '郎中'
  return '主事'
}

// 获取解锁途径
const getUnlockType = (minister) => {
  if (!minister) return ''
  const typeMap = {
    initial: '初始自带',
    search: '寻访解锁',
    battle: '副本通关',
    vip: 'VIP专属',
    tribute: '纳贡解锁'
  }
  return typeMap[minister.unlockType] || '未知'
}

// 培养大臣
const trainMinister = (minister) => {
  if (!minister) return
  if (gameStore.goldTickets < 20) {
    alert('金票不足！需要20金票')
    return
  }
  gameStore.goldTickets -= 20
  minister.level++
  minister.power += 15
  minister.politics += 10
  minister.military += 8
  gameStore.addNationalPower(50)
}

// 显示详情
const showDetail = (minister) => {
  currentMinister.value = minister
  showModal.value = true
}
</script>

<style scoped>
.ministers h2 {
  text-align: center;
  margin-bottom: 0.5rem;
}

.ministers > div:first-of-type p {
  text-align: center;
  color: #FFF8DC;
  margin: 0;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.tab-btn {
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  border: 2px solid #FFD700;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.tab-btn:hover, .tab-btn.active {
  background: linear-gradient(180deg, #FFD700 0%, #FFA500 100%);
  color: #8B0000;
}

.minister-card {
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s;
}

.minister-card:hover {
  transform: translateY(-5px);
  border-color: #FFD700;
  box-shadow: 0 8px 16px rgba(255, 215, 0, 0.3);
}

.minister-avatar {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.minister-card h3 {
  margin-bottom: 0.3rem;
  color: #FFD700;
  font-size: 1.3rem;
}

.minister-position {
  color: #FFF8DC;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.minister-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.stat-item {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 6px;
}

.stat-label {
  display: block;
  color: rgba(255, 248, 220, 0.7);
  font-size: 0.8rem;
  margin-bottom: 0.2rem;
}

.stat-value {
  display: block;
  color: #FFD700;
  font-weight: bold;
  font-size: 1.1rem;
}

.stat-value.politics {
  color: #2196F3;
}

.stat-value.military {
  color: #f44336;
}

.minister-desc {
  color: rgba(255, 248, 220, 0.8);
  font-size: 0.85rem;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.minister-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.minister-detail {
  text-align: center;
}

.minister-detail h2 {
  margin-bottom: 0.5rem;
  color: #FFD700;
}

.detail-desc {
  color: #FFF8DC;
  margin-bottom: 1.5rem;
}

.detail-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>