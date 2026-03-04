<template>
  <div class="vip">
    <div class="card">
      <h2>💎 VIP系统</h2>
      <p>尊享特权，独步天下</p>
    </div>
    <div class="vip-content">
      <div class="card vip-status-card">
        <div class="vip-header">
          <div class="vip-badge-wrap">
            <div class="vip-badge">VIP{{ gameStore.vipLevel }}</div>
            <div v-if="gameStore.isVipActive" class="vip-status valid">
              ✅ VIP有效，剩余 {{ gameStore.vipRemainingDays }} 天
            </div>
            <div v-else class="vip-status expired">
              ❌ VIP已到期
            </div>
          </div>
          
          <div class="vip-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: vipProgress + '%' }"></div>
            </div>
            <p class="progress-text">{{ gameStore.vipExp }} / {{ gameStore.nextVipExp }} 经验</p>
          </div>
        </div>
        <div class="vip-stats">
          <div class="stat">
            <span class="stat-icon">💰</span>
            <div class="stat-content">
              <span class="stat-label">金票</span>
              <span class="stat-value">{{ gameStore.goldTickets.toLocaleString() }}</span>
            </div>
          </div>
          <div class="stat">
            <span class="stat-icon">📈</span>
            <div class="stat-content">
              <span class="stat-label">累计VIP经验</span>
              <span class="stat-value">{{ gameStore.vipExp }}</span>
            </div>
          </div>
        </div>
        <div class="vip-actions">
          <button class="btn-primary" @click="showRedeemModal = true">🎁 兑换码充值</button>
          <button 
            class="btn-secondary" 
            @click="claimDailyReward" 
            :disabled="dailyClaimed || !gameStore.isVipActive"
          >
            {{ dailyClaimed ? '✅ 已领取' : '📦 领取每日礼包' }}
          </button>
        </div>
      </div>

      <div class="card vip-privileges-card">
        <h3>🎯 {{ gameStore.isVipActive ? `VIP${gameStore.vipLevel} 特权` : 'VIP特权' }}</h3>
        <div v-if="!gameStore.isVipActive" class="no-privilege-tip">
          <p>❌ 您的VIP已到期或未激活，兑换VIP即可解锁全部特权</p>
        </div>
        <div v-else class="privileges-list">
          <div v-for="(privilege, index) in currentPrivileges" :key="index" class="privilege-item">
            <span class="privilege-icon">✅</span>
            <span class="privilege-text">{{ privilege }}</span>
          </div>
        </div>
      </div>

      <div class="card vip-shop-card">
        <h3>🛒 VIP商城</h3>
        <div class="shop-items">
          <div v-for="item in shopItems" :key="item.id" class="shop-item">
            <div class="item-icon">{{ item.icon }}</div>
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p>{{ item.desc }}</p>
            </div>
            <div class="item-price">
              <span>💰 {{ item.price }}</span>
              <button 
                class="btn-primary" 
                @click="buyItem(item)" 
                :disabled="item.sold || gameStore.goldTickets < item.price || !gameStore.isVipActive"
              >
                {{ item.sold ? '已售罄' : '购买' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card vip-levels-card">
        <h3>📊 VIP等级一览</h3>
        <div class="levels-grid">
          <div 
            v-for="level in 20" 
            :key="level" 
            class="level-item" 
            :class="{ 
              active: gameStore.vipLevel === level && gameStore.isVipActive, 
              unlocked: gameStore.vipLevel >= level 
            }"
          >
            <div class="level-badge">VIP{{ level }}</div>
            <div class="level-requirement">需要 {{ level * 100 }} 经验</div>
            <div class="level-rewards">
              <span v-if="level === 5">👸 专属贵妃</span>
              <span v-if="level === 10">👨‍💼 专属大臣</span>
              <span v-if="level === 15">🐲 专属灵兽</span>
              <span v-if="level === 20">👑 终极特权</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 兑换码弹窗 -->
    <div v-if="showRedeemModal" class="modal-overlay" @click="showRedeemModal = false">
      <div class="modal" @click.stop>
        <h2>🎁 兑换码充值</h2>
        <p class="modal-desc">输入兑换码获取VIP时长、经验和金票</p>
        <input 
          v-model="redeemCode" 
          type="text" 
          placeholder="请输入兑换码"
          class="redeem-input"
          @keyup.enter="redeem"
        />
        <div class="modal-actions">
          <button class="btn-primary" @click="redeem">兑换</button>
          <button class="btn-secondary" @click="closeRedeemModal">取消</button>
        </div>
        <p v-if="redeemMessage" :class="['redeem-message', redeemSuccess ? 'success' : 'error']">
          {{ redeemMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { emit, events } from '@/utils/eventBus'

const gameStore = useGameStore()
const showRedeemModal = ref(false)
const redeemCode = ref('')
const redeemMessage = ref('')
const redeemSuccess = ref(false)
const dailyClaimed = ref(false)

const vipProgress = computed(() => {
  if (gameStore.vipLevel >= 20) return 100
  if (gameStore.nextVipExp <= 0) return 100
  return Math.min(100, (gameStore.vipExp / gameStore.nextVipExp) * 100)
})

// 当前VIP特权列表
const currentPrivileges = computed(() => {
  const privileges = [
    '每日可领取VIP礼包',
    '解锁VIP商城',
    '寻访成功率提升',
    '战斗加成提升'
  ]
  
  if (gameStore.vipLevel >= 5) privileges.push('获得专属贵妃')
  if (gameStore.vipLevel >= 10) privileges.push('获得专属大臣')
  if (gameStore.vipLevel >= 15) privileges.push('获得专属灵兽')
  if (gameStore.vipLevel >= 20) privileges.push('解锁所有特权')
  
  return privileges
})

// VIP商城商品
const shopItems = ref([
  { id: 1, name: '国力丹', desc: '使用后国力+500', icon: '💊', price: 100, sold: false },
  { id: 2, name: '金票袋', desc: '打开获得200金票', icon: '💰', price: 150, sold: false },
  { id: 3, name: '经验书', desc: '大臣经验+100', icon: '📚', price: 80, sold: false },
  { id: 4, name: '好感礼盒', desc: '后宫好感+50', icon: '🎁', price: 120, sold: false },
  { id: 5, name: '神兵利器', desc: '大幅提升战力', icon: '⚔️', price: 500, sold: false },
  { id: 6, name: '绝世佳人', desc: '随机获得一名佳人', icon: '👸', price: 1000, sold: false }
])

const redeem = () => {
  if (!redeemCode.value.trim()) {
    redeemMessage.value = '请输入兑换码'
    redeemSuccess.value = false
    return
  }

  const result = gameStore.redeemCode(redeemCode.value)
  
  if (result) {
    redeemMessage.value = '✅ 兑换成功！奖励已发放至账户'
    redeemSuccess.value = true
    redeemCode.value = ''
    // 2秒后自动关闭弹窗
    setTimeout(() => {
      closeRedeemModal()
    }, 2000)
  } else {
    redeemMessage.value = '❌ 无效的兑换码或已被使用'
    redeemSuccess.value = false
  }
}

const closeRedeemModal = () => {
  showRedeemModal.value = false
  redeemCode.value = ''
  redeemMessage.value = ''
  redeemSuccess.value = false
}

const claimDailyReward = () => {
  if (dailyClaimed.value || !gameStore.isVipActive) return
  
  const gold = gameStore.claimVipDaily()
  if (gold > 0) {
    dailyClaimed.value = true
    emit(events.SHOW_MESSAGE, { 
      type: 'success', 
      content: `领取成功！获得 ${gold} 金票！` 
    })
  }
}

// 购买商城道具
const buyItem = (item) => {
  if (item.sold || gameStore.goldTickets < item.price || !gameStore.isVipActive) return
  
  // 扣除金票
  gameStore.goldTickets -= item.price
  item.sold = true

  // 道具使用效果
  let tipContent = `购买成功！获得 ${item.name}`
  if (item.name === '国力丹') {
    gameStore.addNationalPower(500)
  } else if (item.name === '金票袋') {
    gameStore.addGoldTickets(200)
  } else if (item.name === '亲密丹') {
    gameStore.haremItems.intimateDan += 5
  } else if (item.name === '升星丹') {
    gameStore.haremItems.starUpgradeDan += 3
  }

  emit(events.SHOW_MESSAGE, { type: 'success', content: tipContent })
}

onMounted(() => {
  dailyClaimed.value = false
})
</script>

<style scoped>
.vip h2 {
  text-align: center;
  margin-bottom: 1rem;
}
.vip > .card:first-of-type p {
  text-align: center;
  color: #FFF8DC;
}
.vip-content {
  display: grid;
  gap: 1rem;
}
.vip-status-card {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 193, 7, 0.1));
}
.vip-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.vip-badge-wrap {
  text-align: center;
}
.vip-badge {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #8B0000;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  margin-bottom: 0.8rem;
}
.vip-status {
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.95rem;
  white-space: nowrap;
}
.vip-status.valid {
  background: rgba(76, 175, 80, 0.3);
  color: #4CAF50;
  border: 1px solid #4CAF50;
}
.vip-status.expired {
  background: rgba(244, 67, 54, 0.3);
  color: #f44336;
  border: 1px solid #f44336;
}
.no-privilege-tip {
  text-align: center;
  padding: 2rem;
  color: #f44336;
  font-size: 1.1rem;
}
.vip-progress {
  flex: 1;
  min-width: 200px;
}
.progress-bar {
  height: 24px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  transition: width 0.5s;
}
.progress-text {
  color: #FFF8DC;
  margin: 0;
}
.vip-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat {
  background: rgba(255, 215, 0, 0.1);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #FFD700;
}
.stat-icon {
  font-size: 2rem;
}
.stat-content {
  flex: 1;
}
.stat-label {
  display: block;
  color: #FFF8DC;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}
.stat-value {
  display: block;
  color: #FFD700;
  font-size: 1.4rem;
  font-weight: bold;
}
.vip-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
.vip-privileges-card h3,
.vip-shop-card h3,
.vip-levels-card h3 {
  margin-bottom: 1.5rem;
  color: #FFD700;
}
.privileges-list {
  display: grid;
  gap: 0.8rem;
}
.privilege-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}
.privilege-icon {
  font-size: 1.3rem;
}
.privilege-text {
  color: #FFF8DC;
}
.shop-items {
  display: grid;
  gap: 1rem;
}
.shop-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  flex-wrap: wrap;
}
.item-icon {
  font-size: 3rem;
}
.item-info {
  flex: 1;
  min-width: 150px;
}
.item-info h4 {
  margin-bottom: 0.5rem;
  color: #FFD700;
}
.item-info p {
  color: #FFF8DC;
  margin: 0;
}
.item-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}
.item-price span {
  color: #FFD700;
  font-weight: bold;
  font-size: 1.2rem;
}
.item-price button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}
.level-item {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid rgba(255, 215, 0, 0.2);
  text-align: center;
  opacity: 0.6;
}
.level-item.unlocked {
  opacity: 1;
  border-color: rgba(255, 215, 0, 0.5);
}
.level-item.active {
  background: rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
  opacity: 1;
  transform: scale(1.05);
}
.level-badge {
  color: #FFD700;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
.level-requirement {
  color: #FFF8DC;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}
.level-rewards span {
  display: block;
  color: #FFD700;
  font-size: 0.85rem;
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
  max-width: 450px;
  width: 90%;
  text-align: center;
}
.modal h2 {
  margin-bottom: 1rem;
  color: #FFD700;
}
.modal-desc {
  margin-bottom: 1.5rem;
  color: #FFF8DC;
}
.redeem-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border: 2px solid #FFD700;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: #FFD700;
  margin-bottom: 1.5rem;
  text-align: center;
}
.redeem-input::placeholder {
  color: rgba(255, 215, 0, 0.5);
}
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}
.redeem-message {
  padding: 0.8rem;
  border-radius: 8px;
  margin-top: 1rem;
}
.redeem-message.success {
  background: rgba(76, 175, 80, 0.3);
  color: #4CAF50;
}
.redeem-message.error {
  background: rgba(244, 67, 54, 0.3);
  color: #f44336;
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
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: #FFD700;
  border: 2px solid #FFD700;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-secondary:hover {
  background: rgba(255, 215, 0, 0.3);
}
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.card {
  background: rgba(139, 0, 0, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid #FFD700;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}
</style>