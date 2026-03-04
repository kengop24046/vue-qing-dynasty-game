<template>
  <div class="message-center">
    <BaseCard>
      <h2>📩 消息中心</h2>
    </BaseCard>

    <div class="message-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['tab-btn', { active: currentTab === tab.key }]"
        @click="currentTab = tab.key"
      >
        {{ tab.name }}
        <span v-if="unreadCount[tab.key] > 0" class="unread-badge">{{ unreadCount[tab.key] }}</span>
      </button>
    </div>

    <div class="message-list">
      <div v-if="filteredMessages.length === 0" class="empty-message">
        <p>暂无消息</p>
      </div>
      <div 
        v-for="message in filteredMessages" 
        :key="message.id" 
        class="message-item"
        :class="{ unread: !message.read }"
        @click="readMessage(message)"
      >
        <div class="message-icon">{{ message.icon }}</div>
        <div class="message-content">
          <h4>{{ message.title }}</h4>
          <p class="message-desc">{{ message.content }}</p>
          <p class="message-time">{{ message.time }}</p>
        </div>
        <div v-if="message.reward && !message.claimed" class="message-reward">
          <BaseButton type="primary" @click.stop="claimReward(message)">领取奖励</BaseButton>
        </div>
        <div v-if="message.claimed" class="claimed-tag">✅ 已领取</div>
      </div>
    </div>

    <div class="message-actions">
      <BaseButton type="secondary" @click="readAll">全部已读</BaseButton>
      <BaseButton type="secondary" @click="clearAll">清空已读</BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import { on, events } from '@/utils/eventBus'

const currentTab = ref('system')
const messageList = ref([])

const tabs = [
  { key: 'system', name: '系统公告' },
  { key: 'game', name: '游戏动态' },
  { key: 'reward', name: '奖励领取' }
]

// 过滤消息
const filteredMessages = computed(() => {
  return messageList.value.filter(m => m.type === currentTab.value).sort((a, b) => b.timestamp - a.timestamp)
})

// 未读计数
const unreadCount = computed(() => {
  const count = {}
  tabs.forEach(tab => {
    count[tab.key] = messageList.value.filter(m => m.type === tab.key && !m.read).length
  })
  return count
})

// 标记已读
const readMessage = (message) => {
  if (!message.read) message.read = true
}

// 全部已读
const readAll = () => {
  filteredMessages.value.forEach(m => m.read = true)
}

// 清空已读
const clearAll = () => {
  messageList.value = messageList.value.filter(m => 
    m.type !== currentTab.value || !m.read || (m.reward && !m.claimed)
  )
}

// 领取奖励
const claimReward = (message) => {
  if (message.claimed) return
  message.claimed = true
  message.read = true
  // 这里可以扩展奖励发放逻辑
  alert(`领取成功！获得 ${message.reward}`)
}

// 添加消息的通用方法
const addMessage = (message) => {
  messageList.value.unshift({
    id: Date.now() + Math.floor(Math.random() * 1000),
    read: false,
    claimed: false,
    timestamp: Date.now(),
    time: new Date().toLocaleString(),
    ...message
  })
}

// 监听游戏事件，自动添加消息
onMounted(() => {
  // 初始化系统公告
  addMessage({
    type: 'system',
    icon: '📢',
    title: '游戏开服公告',
    content: '欢迎陛下体验《穿越大清当皇帝》纯前端文字游戏，祝您游戏愉快，一统天下！'
  })

  // 监听战斗胜利事件
  on(events.BATTLE_WIN, (data) => {
    addMessage({
      type: 'game',
      icon: '⚔️',
      title: '战斗大捷',
      content: `陛下在${data.scene}大获全胜，斩获${data.reward}，威名远扬！`
    })
  })

  // 监听子嗣出生事件
  on(events.CHILD_BORN, (data) => {
    addMessage({
      type: 'game',
      icon: '👶',
      title: '喜得龙裔',
      content: `${data.mother}为陛下诞下了${data.gender === 'male' ? '皇子' : '公主'}${data.name}，恭喜陛下！`
    })
  })

  // 监听VIP升级事件
  on(events.VIP_LEVEL_UP, (data) => {
    addMessage({
      type: 'reward',
      icon: '💎',
      title: 'VIP等级提升',
      content: `恭喜陛下VIP等级提升至${data.level}，解锁专属特权与奖励！`,
      reward: data.reward
    })
  })

  // 监听宠幸事件
  on(events.CONSORT_FAVOR, (data) => {
    addMessage({
      type: 'game',
      icon: '🏮',
      title: '后宫喜讯',
      content: `陛下宠幸了${data.name}，${data.name}好感度提升，对陛下更加倾心！`
    })
  })
})
</script>

<style scoped>
.message-center h2 {
  text-align: center;
  margin-bottom: 0;
}

.message-tabs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.tab-btn {
  position: relative;
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  border: 2px solid #FFD700;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.tab-btn:hover, .tab-btn.active {
  background: linear-gradient(180deg, #FFD700 0%, #FFA500 100%);
  color: #8B0000;
}

.unread-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f44336;
  color: white;
  font-size: 0.7rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-list {
  display: grid;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.empty-message {
  text-align: center;
  padding: 3rem;
  color: #FFF8DC;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  background: rgba(255, 215, 0, 0.05);
  border: 2px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.message-item.unread {
  background: rgba(255, 215, 0, 0.15);
  border-color: #FFD700;
}

.message-item:hover {
  transform: translateY(-2px);
  border-color: #FFD700;
}

.message-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-content h4 {
  margin: 0 0 0.5rem 0;
  color: #FFD700;
}

.message-desc {
  margin: 0 0 0.3rem 0;
  color: #FFF8DC;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-time {
  margin: 0;
  color: rgba(255, 215, 0, 0.6);
  font-size: 0.8rem;
}

.message-reward {
  flex-shrink: 0;
}

.claimed-tag {
  color: #4CAF50;
  font-weight: bold;
  flex-shrink: 0;
}

.message-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>