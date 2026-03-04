<template>
  <div class="gift-shop">
    <BaseCard>
      <h2>🎁 助力礼包商城</h2>
      <p>超值成长礼包，助力陛下一统天下</p>
    </BaseCard>
    <div class="shop-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['tab-btn', { active: currentTab === tab.key }]"
        @click="currentTab = tab.key"
      >
        {{ tab.name }}
      </button>
    </div>
    <div class="gift-list">
      <div v-for="gift in filteredGifts" :key="gift.id" class="gift-item">
        <div class="gift-icon">{{ gift.icon }}</div>
        <div class="gift-info">
          <h3>{{ gift.name }}</h3>
          <p class="gift-desc">{{ gift.desc }}</p>
          <div class="gift-rewards">
            <span v-for="(reward, index) in gift.rewards" :key="index" class="reward-tag">
              {{ reward }}
            </span>
          </div>
        </div>
        <div class="gift-buy">
          <p class="gift-price">💰 {{ gift.price }} 金票</p>
          <BaseButton 
            type="primary" 
            :disabled="gameStore.goldTickets < gift.price"
            @click="buyGift(gift)"
          >
            {{ gameStore.goldTickets < gift.price ? '金票不足' : '立即购买' }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import { emit, events } from '@/utils/eventBus'

const gameStore = useGameStore()
const currentTab = ref('daily')

// 标签配置
const tabs = [
  { key: 'daily', name: '每日礼包' },
  { key: 'growth', name: '成长礼包' },
  { key: 'vip', name: 'VIP专属' },
  { key: 'timeLimit', name: '限时礼包' }
]

const giftList = ref([
  // 每日礼包
  { 
    id: 'daily_1', 
    tab: 'daily', 
    name: '每日口粮', 
    icon: '🌾', 
    desc: '每日必备粮食礼包', 
    price: 10, 
    rewards: ['粮食*10000', '士兵*5000'] 
  },
  { 
    id: 'daily_2', 
    tab: 'daily', 
    name: '每日小金库', 
    icon: '💰', 
    desc: '每日金票返利', 
    price: 50, 
    rewards: ['金票*100', '国力丹*1'] 
  },
  { 
    id: 'daily_3', 
    tab: 'daily', 
    name: '每日培养包', 
    icon: '📚', 
    desc: '大臣后宫培养必备', 
    price: 30, 
    rewards: ['大臣经验书*5', '后宫好感礼盒*5'] 
  },
  // 成长礼包
  { 
    id: 'growth_1', 
    tab: 'growth', 
    name: '新手起步包', 
    icon: '🎯', 
    desc: '新手必备，快速起步', 
    price: 100, 
    rewards: ['金票*200', '国力丹*5', '粮食*50000', '士兵*30000'] 
  },
  { 
    id: 'growth_2', 
    tab: 'growth', 
    name: '国力飞升包', 
    icon: '📈', 
    desc: '大幅提升国力', 
    price: 300, 
    rewards: ['国力丹*20', '金票*500', '高级经验书*10'] 
  },
  { 
    id: 'growth_3', 
    tab: 'growth', 
    name: '后宫佳丽包', 
    icon: '👸', 
    desc: '后宫培养专属', 
    price: 200, 
    rewards: ['后宫好感礼盒*50', '魅力丹*20', '才艺丹*20'] 
  },
  // VIP专属
  { 
    id: 'vip_1', 
    tab: 'vip', 
    name: 'VIP1专属包', 
    icon: '💎', 
    desc: 'VIP1及以上可购买', 
    price: 100, 
    vipLimit: 1, 
    rewards: ['金票*300', '国力丹*10', '神兵碎片*5'] 
  },
  { 
    id: 'vip_2', 
    tab: 'vip', 
    name: 'VIP5专属包', 
    icon: '💎', 
    desc: 'VIP5及以上可购买', 
    price: 500, 
    vipLimit: 5, 
    rewards: ['金票*1000', '专属时装*1', '高级召唤令*5'] 
  },
  { 
    id: 'vip_3', 
    tab: 'vip', 
    name: 'VIP10专属包', 
    icon: '💎', 
    desc: 'VIP10及以上可购买', 
    price: 1000, 
    vipLimit: 10, 
    rewards: ['金票*2000', '绝世神兵*1', '顶级灵兽碎片*10'] 
  },
  // 限时礼包
  { 
    id: 'timeLimit_1', 
    tab: 'timeLimit', 
    name: '限时冲榜包', 
    icon: '🏆', 
    desc: '冲榜必备，限时折扣', 
    price: 888, 
    rewards: ['金票*2000', '国力丹*50', '顶级经验书*20'] 
  },
  { 
    id: 'timeLimit_2', 
    tab: 'timeLimit', 
    name: '子嗣成长包', 
    icon: '👶', 
    desc: '子嗣培养专属', 
    price: 388, 
    rewards: ['子嗣培养丹*30', '资质丹*20', '缘分石*10'] 
  },
  { 
    id: 'timeLimit_3', 
    tab: 'timeLimit', 
    name: '征战补给包', 
    icon: '⚔️', 
    desc: '征战副本必备', 
    price: 188, 
    rewards: ['士兵*100000', '粮食*200000', '征兵令*10'] 
  },
])

// 礼包过滤
const filteredGifts = computed(() => {
  return giftList.value.filter(gift => {
    if (gift.tab !== currentTab.value) return false
    if (gift.vipLimit && gameStore.vipLevel < gift.vipLimit) return false
    return true
  })
})

const buyGift = (gift) => {
  if (gameStore.goldTickets < gift.price) {
    emit(events.SHOW_MESSAGE, { type: 'error', content: '金票不足，无法购买该礼包' })
    return
  }

  const buyResult = gameStore.buyGift(gift)
  if (!buyResult) return

  let rewardTextList = []
  gift.rewards.forEach(rewardStr => {
    const [rewardName, countStr] = rewardStr.split('*')
    const count = parseInt(countStr) || 0
    if (count <= 0) return

    rewardTextList.push(`${rewardName}*${count}`)

    switch (rewardName.trim()) {
      case '金票':
        gameStore.addGoldTickets(count)
        break
      case '粮食':
        gameStore.grain += count
        break
      case '士兵':
        gameStore.soldiers += count
        break
      case '银两':
        gameStore.addSilver(count)
        break
      default:
        const itemMap = {
          '国力丹': 'power_dan',
          '大臣经验书': 'minister_exp_book',
          '高级经验书': 'minister_exp_book_high',
          '后宫好感礼盒': 'intimate_gift_box',
          '魅力丹': 'charm_dan',
          '才艺丹': 'talent_dan',
          '神兵碎片': 'weapon_fragment',
          '专属时装': 'fashion_special',
          '高级召唤令': 'summon_ticket_high',
          '绝世神兵': 'weapon_legend',
          '顶级灵兽碎片': 'beast_fragment_top',
          '子嗣培养丹': 'child_train_dan',
          '资质丹': 'ability_dan',
          '缘分石': 'fate_stone',
          '征兵令': 'soldier_ticket'
        }
        const itemId = itemMap[rewardName.trim()]
        if (itemId) {
          gameStore.addItem(itemId, count)
        }
        break
    }
  })

  emit(events.SHOW_MESSAGE, {
    type: 'success',
    title: '🎉 购买成功',
    content: `已成功购买【${gift.name}】，获得：${rewardTextList.join('、')}`
  })
}
</script>
<style scoped>
.gift-shop h2 {
  text-align: center;
  margin-bottom: 0.5rem;
}
.gift-shop > div:first-of-type p {
  text-align: center;
  color: #FFF8DC;
}
.shop-tabs {
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
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}
.tab-btn:hover, .tab-btn.active {
  background: linear-gradient(180deg, #FFD700 0%, #FFA500 100%);
  color: #8B0000;
}
.gift-list {
  display: grid;
  gap: 1rem;
}
.gift-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  flex-wrap: wrap;
  transition: all 0.3s;
}
.gift-item:hover {
  border-color: #FFD700;
  transform: translateY(-2px);
}
.gift-icon {
  font-size: 3.5rem;
}
.gift-info {
  flex: 1;
  min-width: 200px;
}
.gift-info h3 {
  margin-bottom: 0.5rem;
  color: #FFD700;
}
.gift-desc {
  color: #FFF8DC;
  margin-bottom: 0.8rem;
}
.gift-rewards {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.reward-tag {
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
}
.gift-buy {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}
.gift-price {
  color: #FFD700;
  font-weight: bold;
  font-size: 1.2rem;
}
</style>