<template>
  <div class="setting">
    <BaseCard>
      <h2>⚙️ 游戏设置</h2>
    </BaseCard>

    <BaseCard>
      <h3>💾 存档管理</h3>
      <div class="setting-buttons">
        <BaseButton type="primary" @click="saveGame">💾 手动保存存档</BaseButton>
        <BaseButton type="primary" @click="exportSave">📤 导出存档</BaseButton>
        <label class="file-upload">
          <BaseButton type="primary">📥 导入存档</BaseButton>
          <input type="file" accept=".json" @change="importSave" />
        </label>
        <BaseButton type="danger" @click="resetGame">🔄 重置游戏</BaseButton>
      </div>
      <p class="save-tip">* 游戏每30秒自动保存一次，请勿刷新页面</p>
    </BaseCard>

    <BaseCard>
      <h3>🔒 防刷新设置</h3>
      <div class="setting-item">
        <label class="switch-label">
          <input type="checkbox" v-model="preventRefresh" @change="togglePreventRefresh" />
          <span class="switch"></span>
          禁用页面刷新/关闭提醒
        </label>
        <p class="setting-desc">开启后，刷新或关闭页面时会弹出确认提醒，防止误操作丢失数据</p>
      </div>
    </BaseCard>

    <BaseCard>
      <h3>📊 游戏信息</h3>
      <div class="info-list">
        <div class="info-item">
          <span class="info-label">游戏版本</span>
          <span class="info-value">1.0.0</span>
        </div>
        <div class="info-item">
          <span class="info-label">当前国力</span>
          <span class="info-value">{{ formatNumber(gameStore.totalPower) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">VIP等级</span>
          <span class="info-value">VIP{{ gameStore.vipLevel }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">游戏时长</span>
          <span class="info-value">{{ gameTime }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">存档创建时间</span>
          <span class="info-value">{{ saveCreateTime }}</span>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { formatNumber } from '@/utils/gameUtils'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'

const gameStore = useGameStore()
const preventRefresh = ref(true)
const gameTime = ref('0小时0分钟')
let gameTimer = null

// 存档管理
const saveGame = () => {
  gameStore.saveGame()
  alert('存档保存成功！')
}

const exportSave = () => gameStore.exportSave()
const importSave = (e) => gameStore.importSave(e)

const resetGame = () => {
  if (confirm('确定要重置游戏吗？所有进度将永久丢失，无法恢复！')) {
    gameStore.resetGame()
  }
}

// 防刷新设置
const togglePreventRefresh = () => {
  if (preventRefresh.value) {
    window.addEventListener('beforeunload', handleBeforeUnload)
  } else {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  }
}

const handleBeforeUnload = (e) => {
  e.preventDefault()
  e.returnValue = '您的游戏进度尚未保存，确定要离开吗？'
  return e.returnValue
}

// 游戏时长统计
onMounted(() => {
  if (preventRefresh.value) {
    window.addEventListener('beforeunload', handleBeforeUnload)
  }

  // 游戏时长计时
  const startTime = Date.now()
  gameTimer = setInterval(() => {
    const diff = Date.now() - startTime
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    gameTime.value = `${hours}小时${minutes}分钟`
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  if (gameTimer) clearInterval(gameTimer)
})

const saveCreateTime = computed(() => {
  const saveData = localStorage.getItem('qing_dynasty_save')
  if (!saveData) return '暂无存档'
  try {
    const decrypted = gameStore.decrypt(saveData, 'QING_DYNASTY_2024_SECRET_KEY')
    const data = JSON.parse(decrypted)
    return new Date(data.timestamp).toLocaleString()
  } catch (e) {
    return '未知'
  }
})
</script>

<style scoped>
.setting h2 {
  text-align: center;
  margin-bottom: 0;
}

.setting h3 {
  margin-bottom: 1rem;
  color: #FFD700;
}

.setting-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.file-upload input {
  display: none;
}

.save-tip {
  color: rgba(255, 215, 0, 0.7);
  font-size: 0.9rem;
  margin: 0;
}

.setting-item {
  margin-bottom: 1rem;
}

.switch-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  color: #FFF8DC;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.switch-label input {
  display: none;
}

.switch {
  position: relative;
  width: 50px;
  height: 26px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 13px;
  transition: all 0.3s;
}

.switch::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: #FFF8DC;
  border-radius: 50%;
  transition: all 0.3s;
}

.switch-label input:checked + .switch {
  background: #4CAF50;
}

.switch-label input:checked + .switch::before {
  left: 27px;
}

.setting-desc {
  color: rgba(255, 215, 0, 0.6);
  font-size: 0.9rem;
  margin: 0 0 0 60px;
}

.info-list {
  display: grid;
  gap: 0.8rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.info-label {
  color: #FFF8DC;
}

.info-value {
  color: #FFD700;
  font-weight: bold;
}
</style>