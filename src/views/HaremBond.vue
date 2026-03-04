<template>
  <div class="bond-page">
    <BaseCard>
      <h2>🔗 红颜名臣羁绊</h2>
      <div class="bond-header">
        <StatItem icon="✅" label="已激活羁绊" :value="gameStore.activatedBonds.length" />
        <StatItem icon="📊" label="全局国力加成" :value="`${totalGlobalBonus * 100}%`" />
        <StatItem icon="👸" label="可激活红颜羁绊" :value="haremBondConfig.length" />
        <StatItem icon="👨‍💼" label="可激活君臣羁绊" :value="ministerBondConfig.length" />
      </div>
    </BaseCard>

    <!-- 羁绊类型切换 -->
    <div class="bond-tabs">
      <button 
        v-for="tab in bondTabs" 
        :key="tab.key"
        :class="['tab-btn', { active: currentTab === tab.key }]"
        @click="currentTab = tab.key"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- 筛选 -->
    <div class="filter-bar">
      <label class="filter-checkbox">
        <input type="checkbox" v-model="onlyShowActivated" />
        <span>仅显示已激活</span>
      </label>
    </div>

    <!-- 羁绊列表 -->
    <div class="bond-list">
      <div 
        v-for="bond in filteredBondList" 
        :key="bond.bondId"
        class="bond-card"
        :class="{ activated: isBondActivated(bond), locked: !isBondUnlocked(bond) }"
      >
        <div class="bond-header-card">
          <h3>{{ bond.bondName }}</h3>
          <div class="bond-level" v-if="isBondActivated(bond)">
            Lv.{{ getBondLevel(bond) }}
          </div>
          <div class="bond-locked" v-else>
            未解锁
          </div>
        </div>
        <p class="bond-desc">{{ bond.desc }}</p>

        <div class="bond-both">
          <div class="bond-item-info">
            <span class="item-type">{{ bond.aType === 'harem' ? '红颜' : '大臣' }}</span>
            <span class="item-name">{{ bond.aName }}</span>
            <span class="item-need">需{{ bond.aType === 'harem' ? bond.aNeedStar + '星' : bond.aNeedLevel + '级' }}</span>
          </div>
          <span class="bond-link">↔</span>
          <div class="bond-item-info">
            <span class="item-type">{{ bond.bType === 'harem' ? '红颜' : '大臣' }}</span>
            <span class="item-name">{{ bond.bName }}</span>
            <span class="item-need">需{{ bond.bType === 'harem' ? bond.bNeedStar + '星' : bond.bNeedLevel + '级' }}</span>
          </div>
        </div>

        <div class="bond-bonus" v-if="isBondActivated(bond)">
          <h4>当前加成</h4>
          <div class="bonus-list">
            <span v-for="(bonus, index) in getBondBonusDesc(bond)" :key="index" class="bonus-item">
              {{ bonus }}
            </span>
          </div>
        </div>

        <div class="bond-unlock-tip" v-else>
          <p>解锁条件：同时拥有 {{ bond.aName }} 和 {{ bond.bName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { ministerBondConfig, haremBondConfig } from '@/data/haremSystemConfig'
import BaseCard from '@/components/BaseCard.vue'
import StatItem from '@/components/StatItem.vue'

const gameStore = useGameStore()
const currentTab = ref('minister')
const onlyShowActivated = ref(false)

// 标签页
const bondTabs = [
  { key: 'minister', name: '君臣红颜羁绊' },
  { key: 'harem', name: '姐妹情深羁绊' }
]

// 全量羁绊列表
const allBondList = computed(() => {
  return currentTab.value === 'minister' ? ministerBondConfig : haremBondConfig
})

// 筛选后的羁绊列表
const filteredBondList = computed(() => {
  let list = allBondList.value
  if (onlyShowActivated.value) {
    list = list.filter(bond => isBondActivated(bond))
  }
  return list
})

// 全局加成
const totalGlobalBonus = computed(() => {
  const { totalGlobalPowerBonus } = gameStore.calculateBondBonus()
  return totalGlobalPowerBonus
})

// 检查羁绊是否解锁
const isBondUnlocked = (bond) => {
  const aUnlocked = bond.aType === 'harem' 
    ? !!gameStore.harem.find(h => h.name === bond.aName)
    : !!gameStore.ministers.find(m => m.name === bond.aName)
  
  const bUnlocked = bond.bType === 'harem' 
    ? !!gameStore.harem.find(h => h.name === bond.bName)
    : !!gameStore.ministers.find(m => m.name === bond.bName)
  
  return aUnlocked && bUnlocked
}

// 检查羁绊是否激活
const isBondActivated = (bond) => {
  if (!isBondUnlocked(bond)) return false

  const aItem = bond.aType === 'harem' 
    ? gameStore.harem.find(h => h.name === bond.aName)
    : gameStore.ministers.find(m => m.name === bond.aName)
  
  const bItem = bond.bType === 'harem' 
    ? gameStore.harem.find(h => h.name === bond.bName)
    : gameStore.ministers.find(m => m.name === bond.bName)

  const aMeet = bond.aType === 'harem' 
    ? (aItem.star || 0) >= bond.aNeedStar
    : aItem.level >= bond.aNeedLevel
  
  const bMeet = bond.bType === 'harem' 
    ? (bItem.star || 0) >= bond.bNeedStar
    : bItem.level >= bond.bNeedLevel

  return aMeet && bMeet
}

const getBondLevel = (bond) => {
  const activated = gameStore.activatedBonds.find(b => b.bondId === bond.bondId)
  return activated?.level || 1
}

const getBondBonusDesc = (bond) => {
  const activated = gameStore.activatedBonds.find(b => b.bondId === bond.bondId)
  if (!activated) return []
  const bonus = activated.currentBonus
  const desc = []

  if (bonus.aAttrBonus) {
    Object.keys(bonus.aAttrBonus).forEach(key => {
      const nameMap = { charm: '魅力', talent: '才艺', politics: '政治', military: '军事' }
      desc.push(`${bond.aName} ${nameMap[key]} +${bonus.aAttrBonus[key] * 100}%`)
    })
  }

  if (bonus.bAttrBonus) {
    Object.keys(bonus.bAttrBonus).forEach(key => {
      const nameMap = { charm: '魅力', talent: '才艺', politics: '政治', military: '军事' }
      desc.push(`${bond.bName} ${nameMap[key]} +${bonus.bAttrBonus[key] * 100}%`)
    })
  }

  if (bonus.bothAttrBonus) {
    Object.keys(bonus.bothAttrBonus).forEach(key => {
      const nameMap = { charm: '魅力', talent: '才艺' }
      desc.push(`双方 ${nameMap[key]} +${bonus.bothAttrBonus[key] * 100}%`)
    })
  }

  if (bonus.globalPowerBonus) {
    desc.push(`全局国力 +${bonus.globalPowerBonus * 100}%`)
  }

  return desc
}
</script>

<style scoped>
.bond-page h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.bond-header {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.bond-tabs {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 0;
}

.tab-btn {
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  border: 2px solid #FFD700;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.tab-btn:hover, .tab-btn.active {
  background: linear-gradient(180deg, #FFD700 0%, #FFA500 100%);
  color: #8B0000;
}

.filter-bar {
  margin-bottom: 1rem;
  text-align: right;
}

.filter-checkbox {
  color: #FFF8DC;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.bond-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1rem;
}

.bond-card {
  background: rgba(255, 215, 0, 0.05);
  border: 2px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.bond-card.activated {
  background: rgba(76, 175, 80, 0.1);
  border-color: #4CAF50;
}

.bond-card.locked {
  opacity: 0.6;
  filter: grayscale(0.5);
}

.bond-card:hover {
  transform: translateY(-3px);
  border-color: #FFD700;
}

.bond-header-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.bond-header-card h3 {
  margin: 0;
  color: #FFD700;
}

.bond-level {
  background: #4CAF50;
  color: white;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.bond-locked {
  color: rgba(255, 255, 255, 0.5);
  font-weight: bold;
}

.bond-desc {
  color: #FFF8DC;
  margin: 0 0 1rem 0;
  font-style: italic;
}

.bond-both {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.bond-item-info {
  flex: 1;
  text-align: center;
}

.item-type {
  display: block;
  color: rgba(255, 248, 220, 0.6);
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
}

.item-name {
  display: block;
  color: #FFD700;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.item-need {
  display: block;
  color: #FFF8DC;
  font-size: 0.85rem;
}

.bond-link {
  color: #FFD700;
  font-weight: bold;
  font-size: 1.5rem;
}

.bond-bonus h4 {
  color: #FFD700;
  margin-bottom: 0.5rem;
}

.bonus-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.bonus-item {
  color: #4CAF50;
  font-size: 0.9rem;
}

.bond-unlock-tip {
  text-align: center;
  padding: 0.5rem;
  color: rgba(255, 248, 220, 0.6);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .bond-header {
    grid-template-columns: repeat(2, 1fr);
  }
  .bond-list {
    grid-template-columns: 1fr;
  }
  .bond-both {
    flex-direction: column;
  }
}
</style>