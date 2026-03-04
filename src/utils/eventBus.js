import { ref } from 'vue'

// 事件列表
export const events = {
  NAVIGATE: 'navigate',
  SHOW_MESSAGE: 'showMessage',
  SAVE_GAME: 'saveGame',
  LOAD_GAME: 'loadGame',
  BATTLE_WIN: 'battleWin',
  BATTLE_LOSE: 'battleLose',
  CHILD_BORN: 'childBorn',
  CONSORT_FAVOR: 'consortFavor',
  VIP_LEVEL_UP: 'vipLevelUp'
}

// 事件订阅者
const subscribers = {}

// 订阅事件
export const on = (event, callback) => {
  if (!subscribers[event]) {
    subscribers[event] = []
  }
  subscribers[event].push(callback)
}

// 取消订阅
export const off = (event, callback) => {
  if (!subscribers[event]) return
  subscribers[event] = subscribers[event].filter(cb => cb !== callback)
}

// 触发事件
export const emit = (event, data) => {
  if (!subscribers[event]) return
  subscribers[event].forEach(callback => {
    try {
      callback(data)
    } catch (e) {
      console.error(`事件${event}执行错误:`, e)
    }
  })
}

// 全局消息状态
export const messageState = ref({
  show: false,
  type: 'info',
  title: '',
  content: '',
  duration: 3000
})

// 显示消息
export const showMessage = (options) => {
  messageState.value = {
    show: true,
    ...options
  }
  if (options.duration !== 0) {
    setTimeout(() => {
      messageState.value.show = false
    }, options.duration || 3000)
  }
}