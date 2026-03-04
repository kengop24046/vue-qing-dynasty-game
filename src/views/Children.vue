<template>
  <div class="children">
    <div class="card">
      <h2>👶 皇子公主</h2>
      <p>当前共有 {{ gameStore.children.length }} 位未成婚子嗣</p>
    </div>

    <div v-if="gameStore.children.length === 0" class="card">
      <p style="text-align: center; color: #FFF8DC;">暂无子嗣，快去后宫宠幸妃嫔吧！</p>
    </div>

    <div class="grid-3">
      <div v-for="child in gameStore.children" :key="child.id" class="card child-card">
        <div class="child-avatar">{{ child.gender === 'male' ? '👦' : '👧' }}</div>
        <h3>{{ child.name }}</h3>
        <div class="child-stats">
          <p>年龄: {{ child.age }}{{ child.age >= 18 ? ' (成年)' : '' }}</p>
          <p>能力: {{ child.power }}</p>
          <p>天赋: {{ child.talent }}</p>
          <p>魅力: {{ child.charm }}</p>
          <p>生母: {{ child.mother }}</p>
        </div>
        <div class="child-actions">
          <button v-if="child.age < 18" class="btn-primary" @click="trainChild(child.id)">📚 培养</button>
          <button v-if="child.age < 18" class="btn-secondary" @click="educateChild(child.id)">🎓 教养成年</button>
          <button v-if="child.age >= 18" class="btn-primary" @click="goToMatchmaker(child)">💒 联姻</button>
          <button class="btn-secondary" @click="showDetail(child)">📋 详情</button>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="selectedChild" class="modal-overlay" @click="selectedChild = null">
      <div class="modal" @click.stop>
        <h2>{{ selectedChild.name }}</h2>
        <div class="modal-stats">
          <p><strong>性别:</strong> {{ selectedChild.gender === 'male' ? '皇子' : '公主' }}</p>
          <p><strong>年龄:</strong> {{ selectedChild.age }}岁</p>
          <p><strong>能力:</strong> {{ selectedChild.power }}</p>
          <p><strong>天赋:</strong> {{ selectedChild.talent }}</p>
          <p><strong>魅力:</strong> {{ selectedChild.charm }}</p>
          <p><strong>生母:</strong> {{ selectedChild.mother }}</p>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="selectedChild = null">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const selectedChild = ref(null)

const trainChild = (id) => gameStore.trainChild(id)
const educateChild = (id) => gameStore.educateChild(id)

const showDetail = (child) => {
  selectedChild.value = child
}

const goToMatchmaker = (child) => {
  // 跳转到媒人系统
  const event = new CustomEvent('navigate', { detail: 'matchmaker' })
  window.dispatchEvent(event)
}
</script>

<style scoped>
.children h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.children > .card:first-of-type p {
  text-align: center;
  color: #FFF8DC;
}

.child-card {
  text-align: center;
  transition: all 0.3s;
}

.child-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(255, 215, 0, 0.3);
}

.child-avatar {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.child-card h3 {
  margin-bottom: 1rem;
  color: #FFD700;
}

.child-stats {
  text-align: left;
  margin-bottom: 1rem;
  color: #FFF8DC;
}

.child-stats p {
  margin: 0.3rem 0;
}

.child-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
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
  max-width: 500px;
  width: 90%;
}

.modal h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #FFD700;
}

.modal-stats {
  margin-bottom: 1.5rem;
  color: #FFF8DC;
}

.modal-stats p {
  margin: 0.8rem 0;
  font-size: 1.1rem;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
</style>