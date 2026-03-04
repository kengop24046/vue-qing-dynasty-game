<template>
  <div class="matchmaker">
    <div class="card">
      <h2>💒 媒人系统</h2>
      <div class="tabs">
        <button 
          :class="['tab', { active: currentTab === 'unmarried' }]"
          @click="currentTab = 'unmarried'"
        >
          待联姻子嗣 ({{ gameStore.children.filter(c => c.age >= 18).length }})
        </button>
        <button 
          :class="['tab', { active: currentTab === 'npc' }]"
          @click="currentTab = 'npc'"
        >
          NPC子嗣 ({{ gameStore.npcChildren.length }})
        </button>
        <button 
          :class="['tab', { active: currentTab === 'married' }]"
          @click="currentTab = 'married'"
        >
          已婚子嗣 ({{ gameStore.marriedChildren.length }})
        </button>
      </div>
    </div>

    <!-- 待联姻子嗣 -->
    <div v-if="currentTab === 'unmarried'" class="grid-3">
      <div v-if="gameStore.children.filter(c => c.age >= 18).length === 0" class="card" style="grid-column: 1 / -1;">
        <p style="text-align: center; color: #FFF8DC;">暂无可联姻的子嗣</p>
      </div>
      <div v-for="child in gameStore.children.filter(c => c.age >= 18)" :key="child.id" class="card child-card">
        <div class="child-avatar">{{ child.gender === 'male' ? '👦' : '👧' }}</div>
        <h3>{{ child.name }}</h3>
        <div class="child-stats">
          <p>能力: {{ child.power }}</p>
          <p>天赋: {{ child.talent }}</p>
          <p>魅力: {{ child.charm }}</p>
        </div>
        <button class="btn-primary" @click="selectChildForMarriage(child)">选择联姻</button>
      </div>
    </div>

    <!-- NPC子嗣 -->
    <div v-if="currentTab === 'npc'" class="matchmaker-content">
      <div class="card filter-card">
        <h3>筛选条件</h3>
        <div class="filters">
          <select v-model="filterGender">
            <option value="">全部性别</option>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
          <select v-model="filterQuality">
            <option value="">全部品质</option>
            <option value="5">极品 (5星)</option>
            <option value="4">上品 (4星)</option>
            <option value="3">中品 (3星)</option>
          </select>
          <button v-if="gameStore.vipLevel >= 3" class="btn-primary" @click="refreshVIP">💎 VIP刷新极品</button>
        </div>
      </div>

      <div class="grid-4">
        <div v-for="npc in filteredNPCChildren" :key="npc.id" class="card npc-card">
          <div class="npc-quality">{{ '⭐'.repeat(npc.quality) }}</div>
          <div class="npc-avatar">{{ npc.gender === 'male' ? '👨' : '👩' }}</div>
          <h4>{{ npc.name }}</h4>
          <div class="npc-stats">
            <p>能力: {{ npc.power }}</p>
            <p>天赋: {{ npc.talent }}</p>
            <p>家族: {{ npc.family }}</p>
          </div>
          <button v-if="selectedChild" class="btn-primary" @click="marry(selectedChild.id, npc.id)">联姻</button>
        </div>
      </div>
    </div>

    <!-- 已婚子嗣 -->
    <div v-if="currentTab === 'married'" class="grid-2">
      <div v-if="gameStore.marriedChildren.length === 0" class="card" style="grid-column: 1 / -1;">
        <p style="text-align: center; color: #FFF8DC;">暂无已婚子嗣</p>
      </div>
      <div v-for="child in gameStore.marriedChildren" :key="child.id" class="card married-card">
        <h3>{{ child.name }} & {{ child.spouse?.name }}</h3>
        <div class="couple">
          <div class="spouse">
            <div class="avatar">{{ child.gender === 'male' ? '👦' : '👧' }}</div>
            <h4>{{ child.name }}</h4>
            <p>能力: {{ child.power }}</p>
            <p>天赋: {{ child.talent }}</p>
          </div>
          <div class="heart">💕</div>
          <div class="spouse">
            <div class="avatar">{{ child.spouse?.gender === 'male' ? '👨' : '👩' }}</div>
            <h4>{{ child.spouse?.name }}</h4>
            <p>能力: {{ child.spouse?.power }}</p>
            <p>家族: {{ child.spouse?.family }}</p>
          </div>
        </div>
        <div class="marriage-bonus">
          <p><strong>联姻加成:</strong> 国力 +{{ (child.power + (child.spouse?.power || 0)) * 2 }}</p>
        </div>
      </div>
    </div>

    <!-- 联姻确认弹窗 -->
    <div v-if="showMarriageConfirm" class="modal-overlay" @click="showMarriageConfirm = false">
      <div class="modal" @click.stop>
        <h2>💒 确认联姻</h2>
        <div class="marriage-preview">
          <div class="spouse-preview">
            <div class="avatar">{{ selectedChild?.gender === 'male' ? '👦' : '👧' }}</div>
            <h4>{{ selectedChild?.name }}</h4>
            <p>能力: {{ selectedChild?.power }}</p>
          </div>
          <div class="heart">💕</div>
          <div class="spouse-preview">
            <div class="avatar">{{ selectedNPC?.gender === 'male' ? '👨' : '👩' }}</div>
            <h4>{{ selectedNPC?.name }}</h4>
            <p>能力: {{ selectedNPC?.power }}</p>
          </div>
        </div>
        <div class="marriage-bonus">
          <p><strong>联姻加成:</strong></p>
          <p>国力 +{{ (selectedChild?.power || 0) + (selectedNPC?.power || 0) }}</p>
          <p v-if="Math.random() < 0.2" style="color: #FFD700;">✨ 有几率诞生更优秀的下一代!</p>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" @click="confirmMarriage">确认联姻</button>
          <button class="btn-secondary" @click="showMarriageConfirm = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { generateNPCChildren } from '@/data/npcChildren'

const gameStore = useGameStore()
const currentTab = ref('unmarried')
const filterGender = ref('')
const filterQuality = ref('')
const selectedChild = ref(null)
const selectedNPC = ref(null)
const showMarriageConfirm = ref(false)

const filteredNPCChildren = computed(() => {
  let filtered = [...gameStore.npcChildren]
  
  if (filterGender.value) {
    filtered = filtered.filter(n => n.gender === filterGender.value)
  }
  
  if (filterQuality.value) {
    filtered = filtered.filter(n => n.quality >= parseInt(filterQuality.value))
  }
  
  // 按品质排序
  filtered.sort((a, b) => b.quality - a.quality)
  
  return filtered.slice(0, 50) // 只显示前50个
})

const selectChildForMarriage = (child) => {
  selectedChild.value = child
  currentTab.value = 'npc'
  // 筛选匹配性别
  filterGender.value = child.gender === 'male' ? 'female' : 'male'
}

const marry = (childId, npcId) => {
  const npc = gameStore.npcChildren.find(n => n.id === npcId)
  selectedNPC.value = npc
  showMarriageConfirm.value = true
}

const confirmMarriage = () => {
  if (selectedChild.value && selectedNPC.value) {
    gameStore.marryChild(selectedChild.value.id, selectedNPC.value.id)
    gameStore.addNationalPower((selectedChild.value.power + selectedNPC.value.power) * 2)
    showMarriageConfirm.value = false
    selectedChild.value = null
    selectedNPC.value = null
    currentTab.value = 'married'
  }
}

const refreshVIP = () => {
  if (gameStore.goldTickets >= 100) {
    gameStore.goldTickets -= 100
    // 生成10个极品NPC
    const newNPCs = generateNPCChildren(10, 5)
    gameStore.npcChildren.unshift(...newNPCs)
    alert('VIP刷新成功！获得10个极品NPC子嗣！')
  } else {
    alert('金票不足！需要100金票')
  }
}
</script>

<style scoped>
.matchmaker h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.tab {
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  border: 2px solid #FFD700;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.tab:hover, .tab.active {
  background: linear-gradient(180deg, #FFD700 0%, #FFA500 100%);
  color: #8B0000;
}

.filter-card {
  margin-bottom: 1rem;
}

.filter-card h3 {
  margin-bottom: 1rem;
  color: #FFD700;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.filters select {
  padding: 0.5rem;
  border-radius: 8px;
  border: 2px solid #FFD700;
  background: #8B0000;
  color: #FFD700;
}

.child-card, .npc-card {
  text-align: center;
  transition: all 0.3s;
}

.child-card:hover, .npc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(255, 215, 0, 0.3);
}

.npc-quality {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.child-avatar, .npc-avatar {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.child-card h3, .npc-card h4 {
  margin-bottom: 0.5rem;
  color: #FFD700;
}

.child-stats, .npc-stats {
  text-align: left;
  margin-bottom: 1rem;
  color: #FFF8DC;
  font-size: 0.9rem;
}

.child-stats p, .npc-stats p {
  margin: 0.2rem 0;
}

.married-card {
  text-align: center;
}

.married-card h3 {
  margin-bottom: 1.5rem;
  color: #FFD700;
}

.couple {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.spouse {
  background: rgba(255, 215, 0, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #FFD700;
}

.spouse .avatar {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.spouse h4 {
  margin-bottom: 0.5rem;
  color: #FFD700;
}

.spouse p {
  margin: 0.3rem 0;
  color: #FFF8DC;
}

.heart {
  font-size: 2rem;
  color: #FF69B4;
}

.marriage-bonus {
  background: rgba(255, 215, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #FFD700;
}

.marriage-bonus p {
  margin: 0.5rem 0;
  color: #FFF8DC;
}

.marriage-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.spouse-preview {
  background: rgba(255, 215, 0, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #FFD700;
}

.spouse-preview .avatar {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.spouse-preview h4 {
  margin-bottom: 0.5rem;
  color: #FFD700;
}

.spouse-preview p {
  margin: 0.3rem 0;
  color: #FFF8DC;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
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
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #FFD700;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1.5rem;
}
</style>