import { defineStore } from 'pinia'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { encrypt, decrypt, generateHash } from '@/utils/crypto'
import { validateSaveData, fixSaveData, generateSaveHash } from '@/utils/validator'
import { generateNPCChildren } from '@/data/npcChildren'
import { 
  initialHarem, 
  initialMinisters, 
  initialTributeNations, 
  searchHarem,
  searchMinisters,
  battleHarem,
  battleMinisters,
  vipHarem,
  vipMinisters,
  tributeMinisters
} from '@/data/initialData'
import { starUpgradeConfig, haremSkillConfig, ministerBondConfig, haremBondConfig, haremItemConfig } from '@/data/haremSystemConfig'
import { getVipInfo, getNextLevelExp } from '@/data/vipConfig'
import { validateRedeemCode } from '@/data/redeemCodeConfig'
import { itemConfig, itemTypeEnum } from '@/data/itemConfig'
import { consortRankConfig } from '@/data/consortConfig'
import { ministerStarConfig, ministerQualityConfig } from '@/data/ministerConfig'
import { isRedeemCodeUsed, saveUsedRedeemCode } from '@/utils/storage'
import { calculateChildAttribute, calculateTotalPower, calculateWinRate, generatePrinceName, generatePrincessName } from '@/utils/gameUtils'
import { emit, events } from '@/utils/eventBus'

// 核心加密密钥
const SECRET_KEY = 'QING_DYNASTY_2024_SECRET_KEY'
const SAVE_KEY = 'qing_dynasty_save'

export const useGameStore = defineStore('game', () => {
  // 核心基础状态
  const nationalPower = ref(1000)
  const goldTickets = ref(100)
  const silver = ref(10000)
  const grain = ref(10000)
  const soldiers = ref(5000)
  const currentYear = ref(1)
  const currentMonth = ref(1)
  const gameTotalTime = ref(0)
  let gameTimeTimer = null

  // VIP系统状态
  const vipExp = ref(0)
  const vipExpireTime = ref(0)
  const currentTimestamp = ref(Date.now())
  let timeTimer = null
  const isVipActive = computed(() => vipExpireTime.value > currentTimestamp.value)
  const vipRemainingDays = computed(() => {
    if (!isVipActive.value) return 0
    return Math.ceil((vipExpireTime.value - currentTimestamp.value) / (1000 * 60 * 60 * 24))
  })
  const vipLevel = computed(() => {
    if (!isVipActive.value) return 0
    const info = getVipInfo(vipExp.value)
    return info?.level || 0
  })
  const vipInfo = computed(() => getVipInfo(vipExp.value) || {})
  const nextVipExp = computed(() => getNextLevelExp(vipExp.value) || 0)
  const vipDailyClaimedDate = ref('')
  const vipGiftBoughtList = ref([])

  const boughtGiftList = ref([])
  const isGiftBought = (giftId) => {
    return false
  }

  const bagItems = ref({})
  const getItemCount = (itemId) => bagItems.value[itemId] || 0
  const addItem = (itemId, count = 1) => {
    if (!itemConfig[itemId]) return false
    bagItems.value[itemId] = (bagItems.value[itemId] || 0) + count
    emit(events.ITEM_CHANGE, { itemId, count: bagItems.value[itemId] })
    return true
  }
  const reduceItem = (itemId, count = 1) => {
    const currentCount = getItemCount(itemId)
    if (currentCount < count) return false
    bagItems.value[itemId] = currentCount - count
    if (bagItems.value[itemId] <= 0) delete bagItems.value[itemId]
    emit(events.ITEM_CHANGE, { itemId, count: bagItems.value[itemId] || 0 })
    return true
  }
  const bagItemList = computed(() => {
    return Object.keys(bagItems.value).map(itemId => {
      return {
        id: itemId,
        ...itemConfig[itemId],
        count: bagItems.value[itemId]
      }
    }).filter(item => item.count > 0)
  })

  // 后宫系统
  const harem = ref([...initialHarem.map(consort => ({
    ...consort,
    level: 1,
    favor: 50,
    star: 0,
    unlockedSkills: [],
    rank: 8,
    charmExp: 0,
    isPregnant: false,
    pregnantEndTime: 0,
    lastFavorTime: 0,
  }))])
  const haremItems = ref({ intimateDan: 0, starUpgradeDan: 0 })
  const activatedBonds = ref([])
  const favorCD = 1000 * 60 * 5
  const dailyFavorLimit = computed(() => {
    const baseLimit = 3
    return baseLimit + vipLevel.value * 2
  })
  const todayFavorCount = ref(0)
  const todayFavorDate = ref('')
  const checkFavorLimit = () => {
    const today = new Date().toLocaleDateString()
    if (todayFavorDate.value !== today) {
      todayFavorCount.value = 0
      todayFavorDate.value = today
    }
    return todayFavorCount.value < dailyFavorLimit.value
  }
  const checkFavorCD = (consortId) => {
    const consort = harem.value.find(h => h.id === consortId)
    if (!consort) return false
    return Date.now() - consort.lastFavorTime >= favorCD
  }

  // 子嗣系统
  const children = ref([])
  const marriedChildren = ref([])
  const npcChildren = ref(generateNPCChildren(100))
  const totalChildrenCount = computed(() => children.value.length + marriedChildren.value.length)
  const marriedChildrenCount = computed(() => marriedChildren.value.length)

  // 大臣系统
  const ministers = ref([...initialMinisters.map(minister => ({
    ...minister,
    level: 1,
    star: 1,
    business: minister.business || Math.floor(minister.politics / 2),
    agriculture: minister.agriculture || Math.floor(minister.politics / 2),
    military: minister.military || minister.military,
    politics: minister.politics || Math.floor(minister.power / 10),
  }))])
  // 大臣等级上限
  const getMinisterLevelLimit = (star) => {
    const config = ministerStarConfig.find(c => c.star === star)
    return config?.levelLimit || 100
  }

  // 副本&征战系统
  const battleLevel = ref(1)
  const expeditionLevel = ref(1)
  const tributeNations = ref([...initialTributeNations])

  // 消息系统
  const messageList = ref([])
  // 新增消息
  const addMessage = (type, title, content, reward = null) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      type,
      title,
      content,
      reward,
      time: Date.now(),
      isRead: false
    }
    messageList.value.unshift(newMessage)
    emit(events.NEW_MESSAGE, newMessage)
  }
  // 标记已读
  const readAllMessage = () => {
    messageList.value.forEach(msg => msg.isRead = true)
  }

  // 核心资源操作方法
  const addNationalPower = (amount) => {
    nationalPower.value += Math.max(0, amount)
  }
  const addGoldTickets = (amount) => {
    goldTickets.value += Math.max(0, amount)
    addMessage('reward', '金票获得', `获得金票${amount}`, { gold: amount })
  }
  const addSilver = (amount) => {
    silver.value += Math.max(0, amount)
  }
  const reduceSilver = (amount) => {
    if (silver.value < amount) return false
    silver.value -= Math.max(0, amount)
    return true
  }

  // 后宫升星相关
  const getHaremStarInfo = (consortId) => {
    const consort = harem.value.find(h => h.id === consortId)
    if (!consort) return null
    const currentStar = consort.star || 0
    const nextStarConfig = starUpgradeConfig.find(s => s.star === currentStar + 1)
    const currentStarConfig = starUpgradeConfig.find(s => s.star === currentStar)
    
    if (nextStarConfig?.vipLimit && vipLevel.value < nextStarConfig.vipLimit) {
      return {
        currentStar,
        currentConfig: currentStarConfig,
        nextConfig: null,
        canUpgrade: false,
        limitReason: `VIP${nextStarConfig.vipLimit}解锁该星级`
      }
    }
    return {
      currentStar,
      currentConfig: currentStarConfig,
      nextConfig: nextStarConfig,
      canUpgrade: nextStarConfig 
        ? consort.favor >= nextStarConfig.needFavor && getItemCount('star_upgrade_dan') >= nextStarConfig.needItem
        : false,
      limitReason: nextStarConfig ? '' : '已达最高星级'
    }
  }
  const upgradeHaremStar = (consortId) => {
    const consort = harem.value.find(h => h.id === consortId)
    const starInfo = getHaremStarInfo(consortId)
    
    if (!consort || !starInfo?.canUpgrade) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: starInfo?.limitReason || '升星条件不满足！' })
      return false
    }
    reduceItem('star_upgrade_dan', starInfo.nextConfig.needItem)
    consort.star = starInfo.nextConfig.star
    if (starInfo.nextConfig.unlockSkill) {
      consort.unlockedSkills = [...(consort.unlockedSkills || []), starInfo.nextConfig.star]
    }
    emit(events.SHOW_MESSAGE, { type: 'success', title: '升星成功', content: `${consort.name} 成功升至${consort.star}星！` })
    addMessage('game', '妃嫔升星', `${consort.name} 成功升至${consort.star}星，属性大幅提升`)
    calculateBondBonus()
    return true
  }
  const useIntimateDan = (consortId, count = 1) => {
    const consort = harem.value.find(h => h.id === consortId)
    if (!consort) return false
    if (getItemCount('intimate_dan') < count) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '亲密丹数量不足！' })
      return false
    }
    reduceItem('intimate_dan', count)
    consort.favor += haremItemConfig.intimateDan.useEffect.favor * count
    consort.level = Math.floor(consort.favor / 100) + 1
    emit(events.SHOW_MESSAGE, { type: 'success', content: `使用成功！${consort.name} 亲密度+${haremItemConfig.intimateDan.useEffect.favor * count}！` })
    addMessage('game', '亲密丹使用', `对${consort.name}使用了${count}个亲密丹，亲密度提升`)
    return true
  }
  const getHaremFinalAttr = (consort) => {
    if (!consort) return { charm: 0, talent: 0 }
    const starInfo = getHaremStarInfo(consort.id)
    const attrBonus = starInfo?.currentConfig?.attrBonus || 0
    return {
      charm: Math.floor(consort.charm * (1 + attrBonus)),
      talent: Math.floor(consort.talent * (1 + attrBonus))
    }
  }

  // 羁绊系统
  const calculateBondBonus = () => {
    const activated = []
    let totalGlobalPowerBonus = 0
    const ministerAttrBonusMap = {}
    const haremAttrBonusMap = {}
    if (Array.isArray(ministerBondConfig)) {
      ministerBondConfig.forEach(bond => {
        const aConsort = harem.value.find(h => h.name === bond.aName)
        const bMinister = ministers.value.find(m => m.name === bond.bName)
        if (!aConsort || !bMinister) return
        if (aConsort.star < bond.aNeedStar || bMinister.level < bond.bNeedLevel) return
        const starDiff = aConsort.star - bond.aNeedStar
        const levelDiff = Math.floor((bMinister.level - bond.bNeedLevel) / 10)
        const bondLevel = Math.min(5, Math.max(1, Math.floor((starDiff + levelDiff) / 2) + 1))
        const currentBonus = bond.bonus?.[bondLevel - 1]
        if (!currentBonus) return
        activated.push({ ...bond, level: bondLevel, currentBonus })
        if (!haremAttrBonusMap[aConsort.id]) haremAttrBonusMap[aConsort.id] = { charm: 0, talent: 0 }
        haremAttrBonusMap[aConsort.id].charm += currentBonus.aAttrBonus?.charm || 0
        haremAttrBonusMap[aConsort.id].talent += currentBonus.aAttrBonus?.talent || 0
        if (!ministerAttrBonusMap[bMinister.id]) ministerAttrBonusMap[bMinister.id] = { politics: 0, military: 0 }
        if (currentBonus.bAttrBonus?.politics) ministerAttrBonusMap[bMinister.id].politics += currentBonus.bAttrBonus.politics
        if (currentBonus.bAttrBonus?.military) ministerAttrBonusMap[bMinister.id].military += currentBonus.bAttrBonus.military
        totalGlobalPowerBonus += currentBonus.globalPowerBonus || 0
      })
    }
    if (Array.isArray(haremBondConfig)) {
      haremBondConfig.forEach(bond => {
        const aConsort = harem.value.find(h => h.name === bond.aName)
        const bConsort = harem.value.find(h => h.name === bond.bName)
        if (!aConsort || !bConsort) return
        if (aConsort.star < bond.aNeedStar || bConsort.star < bond.bNeedStar) return
        const starDiff = (aConsort.star - bond.aNeedStar) + (bConsort.star - bond.bNeedStar)
        const bondLevel = Math.min(5, Math.max(1, Math.floor(starDiff / 2) + 1))
        const currentBonus = bond.bonus?.[bondLevel - 1]
        if (!currentBonus) return
        activated.push({ ...bond, level: bondLevel, currentBonus })
        ;[aConsort.id, bConsort.id].forEach(id => {
          if (!haremAttrBonusMap[id]) haremAttrBonusMap[id] = { charm: 0, talent: 0 }
          haremAttrBonusMap[id].charm += currentBonus.bothAttrBonus?.charm || 0
          haremAttrBonusMap[id].talent += currentBonus.bothAttrBonus?.talent || 0
        })
        totalGlobalPowerBonus += currentBonus.globalPowerBonus || 0
      })
    }
    activatedBonds.value = activated
    return { activated, totalGlobalPowerBonus, ministerAttrBonusMap, haremAttrBonusMap }
  }
  const getMinisterFinalAttr = (minister) => {
    if (!minister) return { politics: 0, military: 0, power: 0, business: 0, agriculture: 0 }
    const { ministerAttrBonusMap } = calculateBondBonus()
    const bonus = ministerAttrBonusMap[minister.id] || { politics: 0, military: 0 }
    const levelBonus = minister.level * 0.1
    return {
      business: Math.floor(minister.business * (1 + levelBonus + (bonus.politics || 0))),
      agriculture: Math.floor(minister.agriculture * (1 + levelBonus + (bonus.politics || 0))),
      military: Math.floor(minister.military * (1 + levelBonus + (bonus.military || 0))),
      politics: Math.floor(minister.politics * (1 + levelBonus + (bonus.politics || 0))),
      power: Math.floor(minister.power * (1 + levelBonus + (bonus.politics + bonus.military) / 2))
    }
  }
  const totalPower = computed(() => {
    const { totalGlobalPowerBonus } = calculateBondBonus()
    const basePower = calculateTotalPower(
      nationalPower.value, 
      harem.value, 
      ministers.value, 
      [...children.value, ...marriedChildren.value], 
      []
    )
    return Math.floor(basePower * (1 + totalGlobalPowerBonus))
  })

  // 宠幸相关
  const favorConsort = (consortId) => {
    const consort = harem.value.find(h => h.id === consortId)
    if (!consort) return false
    // 校验次数和冷却
    if (!checkFavorLimit()) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: `今日宠幸次数已达上限${dailyFavorLimit.value}次，VIP可提升上限` })
      return false
    }
    if (!checkFavorCD(consortId)) {
      const remainCD = Math.ceil((favorCD - (Date.now() - consort.lastFavorTime)) / 1000 / 60)
      emit(events.SHOW_MESSAGE, { type: 'error', content: `${consort.name} 冷却中，剩余${remainCD}分钟` })
      return false
    }
    if (consort.isPregnant) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: `${consort.name} 已怀有龙裔，无法宠幸` })
      return false
    }
    // 宠幸逻辑
    const starInfo = getHaremStarInfo(consortId)
    const skill3 = consort.unlockedSkills?.includes(3) ? haremSkillConfig[3]?.effect || {} : {}
    const skill10 = consort.unlockedSkills?.includes(10) ? haremSkillConfig[10]?.effect || {} : {}
    const isDouble = Math.random() < (skill10.doubleRewardRate || 0)
    const favorBonus = 1 + (skill3.favorBonus || 0)
    const baseFavor = 10 * favorBonus * (isDouble ? 2 : 1)
    consort.favor += baseFavor
    consort.level = Math.floor(consort.favor / 100) + 1
    consort.lastFavorTime = Date.now()
    todayFavorCount.value += 1
    emit(events.CONSORT_FAVOR, { name: consort.name })
    // 怀孕逻辑
    const birthBonus = 0.3 + (skill3.birthBonus || 0)
    if (Math.random() < birthBonus) {
      giveBirth(consort)
      emit(events.SHOW_MESSAGE, { 
        type: 'success', 
        title: '🎉 喜报！',
        content: `恭喜陛下，${consort.name} 诞下子嗣！` 
      })
      addMessage('game', '妃嫔产子', `${consort.name} 诞下子嗣，国力提升！`)
    }
    if (isDouble) {
      emit(events.SHOW_MESSAGE, { type: 'success', content: `触发双倍奖励！${consort.name} 亲密度+${baseFavor}！` })
    }
    addMessage('game', '宠幸妃嫔', `宠幸了${consort.name}，亲密度提升${baseFavor}`)
    return true
  }
  // 一键随机宠幸
  const randomFavorAll = () => {
    if (!checkFavorLimit()) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: `今日宠幸次数已达上限${dailyFavorLimit.value}次` })
      return false
    }
    // 筛选可宠幸的妃嫔
    const availableConsorts = harem.value.filter(c => {
      return !c.isPregnant && Date.now() - c.lastFavorTime >= favorCD
    })
    if (availableConsorts.length === 0) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '暂无可用的妃嫔，均在冷却或怀孕中' })
      return false
    }
    // 随机宠幸一个
    const randomIndex = Math.floor(Math.random() * availableConsorts.length)
    favorConsort(availableConsorts[randomIndex].id)
    return true
  }
  // 怀孕检查
  const checkPregnantBirth = () => {
    const now = Date.now()
    harem.value.forEach(consort => {
      if (consort.isPregnant && now >= consort.pregnantEndTime) {
        consort.isPregnant = false
        consort.pregnantEndTime = 0
        giveBirth(consort)
      }
    })
  }
  // 生子
  const giveBirth = (consort) => {
    const isMale = Math.random() > 0.5
    const name = isMale ? generatePrinceName(currentYear.value % 12) : generatePrincessName()
    const finalAttr = getHaremFinalAttr(consort)
    const power = calculateChildAttribute(finalAttr.charm, finalAttr.talent)
    const talent = calculateChildAttribute(finalAttr.talent, finalAttr.charm)
    const charm = calculateChildAttribute(finalAttr.charm, finalAttr.talent, 0, 0.3)
    const child = {
      id: Date.now() + Math.random(),
      name,
      gender: isMale ? 'male' : 'female',
      age: 0,
      level: 1,
      power,
      talent,
      charm,
      mother: consort.name,
      married: false,
      spouse: null
    }
    children.value.push(child)
    emit(events.CHILD_BORN, { name: child.name, gender: child.gender, mother: consort.name })
    emit(events.SHOW_MESSAGE, { 
      type: 'success', 
      title: '🎉 皇子降生！',
      content: `${consort.name} 诞下了${isMale ? '皇子' : '公主'} ${child.name}！` 
    })
    addMessage('game', '子嗣降生', `${consort.name} 诞下${isMale ? '皇子' : '公主'} ${child.name}，国力提升`)
    addNationalPower(child.power)
  }
  // 一键随机宠幸
  const randomFavor = () => {
    if (harem.value.length === 0) return
    const randomIndex = Math.floor(Math.random() * harem.value.length)
    favorConsort(harem.value[randomIndex].id)
  }
  // 送礼给妃嫔
  const giveGiftToConsort = (consortId, amount = 20) => {
    const consort = harem.value.find(h => h.id === consortId)
    if (!consort) return
    if (goldTickets.value < 10) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '金票不足！' })
      return
    }
    goldTickets.value -= 10
    consort.favor += amount
    consort.level = Math.floor(consort.favor / 100) + 1
    addMessage('game', '赏赐妃嫔', `赏赐了${consort.name}，亲密度提升${amount}`)
  }
  // 妃位升级
  const upgradeConsortRank = (consortId) => {
    const consort = harem.value.find(h => h.id === consortId)
    if (!consort) return false
    const currentRankConfig = consortRankConfig.find(r => r.rank === consort.rank)
    const nextRankConfig = consortRankConfig.find(r => r.rank === consort.rank - 1)
    if (!nextRankConfig) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '已达最高妃位' })
      return false
    }
    if (consort.favor < nextRankConfig.needFavor) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: `亲密度不足，需要${nextRankConfig.needFavor}亲密度` })
      return false
    }
    if (vipLevel.value < nextRankConfig.needVip) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: `VIP等级不足，需要VIP${nextRankConfig.needVip}` })
      return false
    }
    // 升级
    consort.rank = nextRankConfig.rank
    emit(events.SHOW_MESSAGE, { type: 'success', content: `${consort.name} 成功晋封为${nextRankConfig.name}！` })
    addMessage('game', '妃嫔晋封', `${consort.name} 晋封为${nextRankConfig.name}，魅力大幅提升`)
    return true
  }
  // 妃嫔习礼
  const consortStudy = (consortId) => {
    const consort = harem.value.find(h => h.id === consortId)
    if (!consort) return false
    const studyCost = 1000 * consort.level
    if (!reduceSilver(studyCost)) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '银两不足，无法习礼' })
      return false
    }
    // 增加魅力经验
    consort.charmExp += 100
    // 升级魅力等级
    if (consort.charmExp >= consort.level * 1000) {
      consort.charm += 1
      consort.charmExp = 0
    }
    emit(events.SHOW_MESSAGE, { type: 'success', content: `${consort.name} 习礼完成，魅力提升！` })
    addMessage('game', '妃嫔习礼', `${consort.name} 完成习礼，魅力属性提升`)
    return true
  }

  // 子嗣相关
  const trainChild = (childId) => {
    const child = children.value.find(c => c.id === childId)
    if (!child || child.age >= 18) return
    child.power += 10
    child.talent += 5
    child.charm += 5
    addMessage('game', '子嗣培养', `培养了${child.name}，属性提升`)
  }
  const educateChild = (childId) => {
    const child = children.value.find(c => c.id === childId)
    if (!child || child.age >= 18) return
    child.age = 18
    child.power *= 2
    child.talent *= 1.5
    child.charm *= 1.5
    addMessage('game', '子嗣教养', `${child.name} 已教养成年，可进行联姻`)
  }
  const marryChild = (childId, npcChildId) => {
    const child = children.value.find(c => c.id === childId)
    const npcChild = npcChildren.value.find(n => n.id === npcChildId)
    
    if (!child || !npcChild || child.married) return
    child.married = true
    child.spouse = npcChild
    child.power += npcChild.power * 0.5
    const index = children.value.findIndex(c => c.id === childId)
    if (index > -1) {
      const [married] = children.value.splice(index, 1)
      marriedChildren.value.push(married)
    }
    npcChildren.value = npcChildren.value.filter(n => n.id !== npcChildId)
    const newNPC = generateNPCChildren(1, npcChild.quality)[0]
    npcChildren.value.push(newNPC)
    addNationalPower((child.power + npcChild.power) * 2)
    emit(events.SHOW_MESSAGE, { type: 'success', content: `恭喜陛下，${child.name} 与 ${npcChild.name} 联姻成功！` })
    addMessage('game', '子嗣联姻', `${child.name} 与 ${npcChild.name} 联姻成功，国力大幅提升`)
    return true
  }

  // 大臣相关
  const trainMinister = (ministerId) => {
    const minister = ministers.value.find(m => m.id === ministerId)
    if (!minister) return
    const levelLimit = getMinisterLevelLimit(minister.star)
    if (minister.level >= levelLimit) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: `已达当前星级等级上限${levelLimit}级，需升星突破` })
      return
    }
    const upgradeCost = 500 * Math.pow(1.2, minister.level)
    if (!reduceSilver(upgradeCost)) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '银两不足，无法升级' })
      return
    }
    minister.level++
    minister.power += 15
    minister.politics += 10
    minister.military += 8
    addNationalPower(50)
    addMessage('game', '大臣升级', `${minister.name} 升级至${minister.level}级，属性提升`)
    calculateBondBonus()
  }
  // 大臣升星突破
  const upgradeMinisterStar = (ministerId) => {
    const minister = ministers.value.find(m => m.id === ministerId)
    if (!minister) return false
    const nextStarConfig = ministerStarConfig.find(c => c.star === minister.star + 1)
    if (!nextStarConfig) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '已达最高星级' })
      return false
    }
    // 校验等级和道具
    if (minister.level < nextStarConfig.needLevel) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: `等级不足，需要${nextStarConfig.needLevel}级` })
      return false
    }
    if (getItemCount('minister_break_dan') < nextStarConfig.needItem) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: `大臣突破丹不足，需要${nextStarConfig.needItem}个` })
      return false
    }
    // 升星
    reduceItem('minister_break_dan', nextStarConfig.needItem)
    minister.star = nextStarConfig.star
    emit(events.SHOW_MESSAGE, { type: 'success', content: `${minister.name} 成功突破至${minister.star}星！等级上限提升！` })
    addMessage('game', '大臣突破', `${minister.name} 突破至${minister.star}星，等级上限提升至${getMinisterLevelLimit(minister.star)}级`)
    calculateBondBonus()
    return true
  }
  // 大臣资质提升
  const upgradeMinisterAbility = (ministerId, abilityType, itemId) => {
    const minister = ministers.value.find(m => m.id === ministerId)
    const item = itemConfig[itemId]
    if (!minister || !item || item.type !== itemTypeEnum.MINISTER_ABILITY) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '无效的道具或大臣' })
      return false
    }
    if (!reduceItem(itemId, 1)) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '道具数量不足' })
      return false
    }
    // 提升对应资质
    const addValue = item.effect.value
    minister[abilityType] += addValue
    emit(events.SHOW_MESSAGE, { type: 'success', content: `${minister.name} ${item.effect.abilityName}资质+${addValue}！` })
    addMessage('game', '资质提升', `${minister.name} 使用${item.name}，${item.effect.abilityName}资质提升${addValue}`)
    calculateBondBonus()
    return true
  }
  // 大臣赏赐
  const rewardMinister = (ministerId, itemId, count = 1) => {
    const minister = ministers.value.find(m => m.id === ministerId)
    const item = itemConfig[itemId]
    if (!minister || !item || item.type !== itemTypeEnum.MINISTER_REWARD) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '无效的道具或大臣' })
      return false
    }
    if (!reduceItem(itemId, count)) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '道具数量不足' })
      return false
    }
    // 赏赐效果
    minister.level += item.effect.levelAdd * count
    minister.power += item.effect.powerAdd * count
    emit(events.SHOW_MESSAGE, { type: 'success', content: `赏赐成功！${minister.name} 等级+${item.effect.levelAdd * count}，战力+${item.effect.powerAdd * count}！` })
    addMessage('game', '大臣赏赐', `赏赐${minister.name} ${count}个${item.name}，属性大幅提升`)
    calculateBondBonus()
    return true
  }

  // 副本&征战
  const battle = () => {
    const enemyPower = 500 + battleLevel.value * 200
    const winRate = calculateWinRate(totalPower.value, enemyPower, vipExp.value)
    const win = Math.random() < winRate
    if (win) {
      const currentBattleLevel = battleLevel.value
      battleLevel.value++
      const powerReward = 50 + currentBattleLevel * 10
      const goldReward = 20 + currentBattleLevel * 5
      const silverReward = 1000 + currentBattleLevel * 200
      addNationalPower(powerReward)
      addGoldTickets(goldReward)
      addSilver(silverReward)
      
      let unlockHaremName = null
      const battleHaremInfo = battleHarem.find(h => h.unlockLevel === currentBattleLevel)
      if (battleHaremInfo) {
        const exists = harem.value.find(h => h.name === battleHaremInfo.name)
        if (!exists) {
          harem.value.push({
            id: Date.now() + Math.random(),
            ...battleHaremInfo,
            level: 1,
            favor: 50,
            star: 0,
            unlockedSkills: [],
            rank: 8,
            charmExp: 0,
            isPregnant: false,
            pregnantEndTime: 0,
            lastFavorTime: 0
          })
          unlockHaremName = battleHaremInfo.name
        }
      }
      
      let unlockMinisterName = null
      const battleMinisterInfo = battleMinisters.find(m => m.unlockLevel === currentBattleLevel)
      if (battleMinisterInfo) {
        const exists = ministers.value.find(m => m.name === battleMinisterInfo.name)
        if (!exists) {
          ministers.value.push({
            id: Date.now() + Math.random(),
            ...battleMinisterInfo,
            level: 1,
            star: 1,
            business: Math.floor(battleMinisterInfo.politics / 2),
            agriculture: Math.floor(battleMinisterInfo.politics / 2),
            military: battleMinisterInfo.military,
            politics: Math.floor(battleMinisterInfo.power / 10)
          })
          unlockMinisterName = battleMinisterInfo.name
        }
      }
      emit(events.BATTLE_WIN, { 
        scene: '副本', 
        reward: `+${powerReward}国力 +${goldReward}金票 +${silverReward}银两`,
        unlockHarem: unlockHaremName,
        unlockMinister: unlockMinisterName
      })
      addMessage('game', '副本胜利', `通关副本第${currentBattleLevel}关，获得丰厚奖励`)
      calculateBondBonus()
    }
    return win
  }
  const expedition = () => {
    const enemyPower = 300 + expeditionLevel.value * 150
    const winRate = calculateWinRate(totalPower.value, enemyPower, vipExp.value)
    const win = Math.random() < winRate
    if (win) {
      const currentExpeditionLevel = expeditionLevel.value
      expeditionLevel.value++
      const powerReward = 100 + currentExpeditionLevel * 20
      const goldReward = 50 + currentExpeditionLevel * 10
      const silverReward = 2000 + currentExpeditionLevel * 300
      addNationalPower(powerReward)
      addGoldTickets(goldReward)
      addSilver(silverReward)
      
      let unlockMinisterName = null
      const tributeMinisterInfo = tributeMinisters.find(m => m.unlockLevel === currentExpeditionLevel)
      if (tributeMinisterInfo) {
        const exists = ministers.value.find(m => m.name === tributeMinisterInfo.name)
        if (!exists) {
          ministers.value.push({
            id: Date.now() + Math.random(),
            ...tributeMinisterInfo,
            level: 1,
            star: 1,
            business: Math.floor(tributeMinisterInfo.politics / 2),
            agriculture: Math.floor(tributeMinisterInfo.politics / 2),
            military: tributeMinisterInfo.military,
            politics: Math.floor(tributeMinisterInfo.power / 10)
          })
          unlockMinisterName = tributeMinisterInfo.name
        }
      }
      emit(events.BATTLE_WIN, { 
        scene: '征战', 
        reward: `+${powerReward}国力 +${goldReward}金票 +${silverReward}银两`,
        unlockMinister: unlockMinisterName
      })
      addMessage('game', '征战胜利', `通关征战第${currentExpeditionLevel}关，获得丰厚奖励`)
      calculateBondBonus()
    }
    return win
  }
  const collectTribute = (nationId) => {
    const nation = tributeNations.value.find(n => n.id === nationId)
    if (!nation || expeditionLevel.value < nation.unlockLevel || nation.cooldown > 0) return false
    if (Array.isArray(nation.rewards)) {
      nation.rewards.forEach(reward => {
        if (typeof reward !== 'string') return
        if (reward.includes('金票')) {
          const amount = parseInt(reward.match(/\d+/)?.[0] || 0)
          addGoldTickets(amount)
        }
        if (reward.includes('国力')) {
          const amount = parseInt(reward.match(/\d+/)?.[0] || 0)
          addNationalPower(amount)
        }
        if (reward.includes('粮食')) {
          const amount = parseInt(reward.match(/\d+/)?.[0] || 0)
          grain.value += amount
        }
        if (reward.includes('士兵')) {
          const amount = parseInt(reward.match(/\d+/)?.[0] || 0)
          soldiers.value += amount
        }
        if (reward.includes('银两')) {
          const amount = parseInt(reward.match(/\d+/)?.[0] || 0)
          addSilver(amount)
        }
      })
    }
    nation.cooldown = 300
    nation.cooldownEnd = Date.now() + nation.cooldown * 1000
    addMessage('game', '纳贡收取', `收取了${nation.name}的纳贡，获得丰厚奖励`)
    return true
  }

  // 寻访
  const search = (scene) => {
    const allSearchEvents = [
      ...(Array.isArray(searchHarem) ? searchHarem : []).map(consort => ({
        type: 'consort',
        ...consort,
        source: 'search'
      })),
      ...(Array.isArray(searchMinisters) ? searchMinisters : []).map(minister => ({
        type: 'minister',
        ...minister,
        source: 'search'
      })),
      { type: 'gold', min: 50, max: 200 },
      { type: 'silver', min: 1000, max: 5000 },
      { type: 'power', min: 30, max: 100 },
      { type: 'grain', min: 1000, max: 5000 },
      { type: 'item', itemId: 'star_upgrade_dan', min: 1, max: 3 },
      { type: 'item', itemId: 'intimate_dan', min: 1, max: 5 },
      { type: 'item', itemId: 'minister_break_dan', min: 1, max: 2 },
      { type: 'nothing' }
    ]
    const event = allSearchEvents[Math.floor(Math.random() * allSearchEvents.length)]
    const rewards = []
    if (event.type === 'consort') {
      const exists = harem.value.find(h => h.name === event.name)
      if (!exists) {
        harem.value.push({
          id: Date.now() + Math.random(),
          ...event,
          level: 1,
          favor: 50,
          star: 0,
          unlockedSkills: [],
          rank: 8,
          charmExp: 0,
          isPregnant: false,
          pregnantEndTime: 0,
          lastFavorTime: 0
        })
        rewards.push(`👸 获得佳人: ${event.name}`)
        addMessage('game', '寻访佳人', `寻访获得佳人${event.name}，已纳入后宫`)
      } else {
        addGoldTickets(100)
        rewards.push(`💰 ${event.name}已在后宫，获得金票+100`)
      }
    }
    else if (event.type === 'minister') {
      const exists = ministers.value.find(m => m.name === event.name)
      if (!exists) {
        ministers.value.push({
          id: Date.now() + Math.random(),
          ...event,
          level: 1,
          star: 1,
          business: Math.floor(event.politics / 2),
          agriculture: Math.floor(event.politics / 2),
          military: event.military,
          politics: Math.floor(event.power / 10)
        })
        rewards.push(`👨‍💼 获得贤才: ${event.name}`)
        addMessage('game', '寻访贤才', `寻访获得贤才${event.name}，已入朝为官`)
      } else {
        addGoldTickets(100)
        rewards.push(`💰 ${event.name}已在朝中，获得金票+100`)
      }
    }
    else if (event.type === 'item') {
      const amount = Math.floor(Math.random() * (event.max - event.min + 1)) + event.min
      addItem(event.itemId, amount)
      const itemName = itemConfig[event.itemId].name
      rewards.push(`${itemConfig[event.itemId].icon} ${itemName} +${amount}`)
    }
    else if (event.type === 'silver') {
      const amount = Math.floor(Math.random() * (event.max - event.min + 1)) + event.min
      addSilver(amount)
      rewards.push(`💰 银两 +${amount}`)
    }
    else if (event.type === 'gold') {
      const amount = Math.floor(Math.random() * (event.max - event.min + 1)) + event.min
      addGoldTickets(amount)
      rewards.push(`💰 金票 +${amount}`)
    } else if (event.type === 'power') {
      const amount = Math.floor(Math.random() * (event.max - event.min + 1)) + event.min
      addNationalPower(amount)
      rewards.push(`📈 国力 +${amount}`)
    } else if (event.type === 'grain') {
      const amount = Math.floor(Math.random() * (event.max - event.min + 1)) + event.min
      grain.value += amount
      rewards.push(`🌾 粮食 +${amount}`)
    } else {
      rewards.push('😔 一无所获')
    }
    return { event, rewards }
  }

  // 兑换码充值
  const redeemCode = (code) => {
    if (!code.trim()) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '请输入兑换码' })
      return false
    }
    const codeInfo = validateRedeemCode(code)
    if (!codeInfo || !codeInfo.type) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '无效的兑换码' })
      return false
    }
    const uniqueKey = Array.isArray(codeInfo.encrypted) ? codeInfo.encrypted[0] : codeInfo.encrypted
    const codeHash = generateHash(uniqueKey, 'QING_DYNASTY_REDEEM_2024_SECRET')
    if (isRedeemCodeUsed(codeHash)) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '该兑换码已被使用' })
      return false
    }
    if (codeInfo.type === 'vip_time') {
      const now = Date.now()
      let expire = vipExpireTime.value > now ? vipExpireTime.value + codeInfo.duration : now + codeInfo.duration
      vipExpireTime.value = expire
      vipExp.value = codeInfo.vipExp || 0
      const targetVipLevel = getVipInfo(codeInfo.vipExp)?.level || 0
      for (let l = 1; l <= targetVipLevel; l++) {
        const vipHaremInfo = vipHarem.find(h => h.unlockLevel === l)
        if (vipHaremInfo) {
          const exists = harem.value.find(h => h.name === vipHaremInfo.name)
          if (!exists) {
            harem.value.push({
              id: Date.now() + Math.random(),
              ...vipHaremInfo,
              level: 1,
              favor: 50,
              star: 0,
              unlockedSkills: [],
              rank: 8,
              charmExp: 0,
              isPregnant: false,
              pregnantEndTime: 0,
              lastFavorTime: 0
            })
          }
        }
        const vipMinisterInfo = vipMinisters.find(m => m.unlockLevel === l)
        if (vipMinisterInfo) {
          const exists = ministers.value.find(m => m.name === vipMinisterInfo.name)
          if (!exists) {
            ministers.value.push({
              id: Date.now() + Math.random(),
              ...vipMinisterInfo,
              level: 1,
              star: 1,
              business: Math.floor(vipMinisterInfo.politics / 2),
              agriculture: Math.floor(vipMinisterInfo.politics / 2),
              military: vipMinisterInfo.military,
              politics: Math.floor(vipMinisterInfo.power / 10)
            })
          }
        }
      }
      emit(events.VIP_LEVEL_UP, { level: targetVipLevel, reward: getVipInfo(codeInfo.vipExp)?.rewards?.join('、') || '' })
      emit(events.SHOW_MESSAGE, {
        type: 'success',
        title: '兑换成功',
        content: `✅ 激活${codeInfo.name}！剩余${vipRemainingDays.value}天，获得${codeInfo.gold || 0}金票`
      })
      addMessage('system', 'VIP激活', `成功激活${codeInfo.name}，VIP有效期剩余${vipRemainingDays.value}天`)
    }
    if (codeInfo.type === 'gold') {
      const goldAmount = codeInfo.gold || 0
      addGoldTickets(goldAmount)
      emit(events.SHOW_MESSAGE, {
        type: 'success',
        title: '兑换成功',
        content: `✅ 获得${codeInfo.name}！金票+${goldAmount}`
      })
    }
    // 道具发放
    if (codeInfo.intimateDan > 0) addItem('intimate_dan', codeInfo.intimateDan)
    if (codeInfo.starUpgradeDan > 0) addItem('star_upgrade_dan', codeInfo.starUpgradeDan)
    if (codeInfo.ministerBreakDan > 0) addItem('minister_break_dan', codeInfo.ministerBreakDan)
    saveUsedRedeemCode(codeHash)
    return true
  }

  // VIP每日礼包
  const claimVipDaily = () => {
    if (!isVipActive.value) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '您的VIP已到期，无法领取每日礼包' })
      return 0
    }
    // 校验今日是否已领取
    const today = new Date().toLocaleDateString()
    if (vipDailyClaimedDate.value === today) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '今日已领取过VIP每日礼包' })
      return 0
    }
    const gold = vipInfo.value.dailyGold || 0
    addGoldTickets(gold)
    vipDailyClaimedDate.value = today
    emit(events.SHOW_MESSAGE, { type: 'success', content: `领取成功！获得${gold}金票！` })
    addMessage('reward', '礼包领取', `领取了VIP${vipLevel.value}每日礼包，获得金票${gold}`)
    return gold
  }

  // VIP礼包
  const buyVipGift = (giftLevel) => {
    if (giftLevel > vipLevel.value) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: `VIP等级不足，需要VIP${giftLevel}才可购买` })
      return false
    }
    if (vipGiftBoughtList.value.includes(giftLevel)) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '该VIP礼包已购买' })
      return false
    }
    const giftInfo = vipInfo.value.giftList?.find(g => g.level === giftLevel)
    if (!giftInfo) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '礼包不存在' })
      return false
    }
    if (goldTickets.value < giftInfo.price) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '金票不足' })
      return false
    }
    // 扣除金票
    goldTickets.value -= giftInfo.price
    // 发放奖励
    if (giftInfo.gold > 0) addGoldTickets(giftInfo.gold)
    if (giftInfo.items) {
      giftInfo.items.forEach(item => {
        addItem(item.id, item.count)
      })
    }
    // 标记已购买
    vipGiftBoughtList.value.push(giftLevel)
    emit(events.SHOW_MESSAGE, { type: 'success', content: `VIP${giftLevel}礼包购买成功！奖励已发放` })
    addMessage('reward', 'VIP礼包购买', `购买了VIP${giftLevel}礼包，获得丰厚奖励`)
    return true
  }

  const buyGift = (gift) => {
    // 1. 基础校验
    if (!gift || !gift.id) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '无效的礼包' })
      return false
    }
    //if (isGiftBought(gift.id)) {
    //  emit(events.SHOW_MESSAGE, { type: 'error', content: '该礼包已购买，无法重复购买' })
    //  return false
    //}
    if (goldTickets.value < (gift.price || 0)) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '金票不足，无法购买该礼包' })
      return false
    }

    // 2. 扣除金票
    goldTickets.value -= gift.price

    // 3. 全类型奖励发放
    if (gift.gold > 0) addGoldTickets(gift.gold)
    if (gift.silver > 0) addSilver(gift.silver)
    if (gift.power > 0) addNationalPower(gift.power)
    if (gift.grain > 0) grain.value += gift.grain
    if (gift.soldiers > 0) soldiers.value += gift.soldiers
    
    // 发放道具
    if (gift.items && Array.isArray(gift.items)) {
      gift.items.forEach(item => {
        if (item.id && item.count > 0) {
          addItem(item.id, item.count)
        }
      })
    }
    // 发放VIP时间
    if (gift.vipDays > 0) {
      const now = Date.now()
      vipExpireTime.value = vipExpireTime.value > now 
        ? vipExpireTime.value + gift.vipDays * 24 * 60 * 60 * 1000
        : now + gift.vipDays * 24 * 60 * 60 * 1000
      if (gift.vipExp > 0) {
        vipExp.value += gift.vipExp
      }
    }

    // 标记已购买
    boughtGiftList.value.push(gift.id)

    // 成功提示&消息记录
    emit(events.SHOW_MESSAGE, { 
      type: 'success', 
      title: '购买成功',
      content: `已成功购买【${gift.name}】，奖励已发放！` 
    })
    addMessage('reward', '礼包购买', `购买了【${gift.name}】，获得丰厚奖励`)
    
    return true
  }

  // 征收系统
  const collectTax = () => {
    // 征收收益由大臣商业、农业属性决定
    let totalBusiness = 0
    let totalAgriculture = 0
    ministers.value.forEach(minister => {
      const attr = getMinisterFinalAttr(minister)
      totalBusiness += attr.business
      totalAgriculture += attr.agriculture
    })
    const silverReward = totalBusiness * 100
    const grainReward = totalAgriculture * 100
    addSilver(silverReward)
    grain.value += grainReward
    emit(events.SHOW_MESSAGE, { type: 'success', content: `征收成功！获得银两${silverReward}、粮食${grainReward}` })
    addMessage('game', '征收完成', `完成征收，获得银两${silverReward}、粮食${grainReward}`)
    return { silver: silverReward, grain: grainReward }
  }

  // 存档系统
  const saveGame = () => {
    const saveData = {
      nationalPower: nationalPower.value,
      goldTickets: goldTickets.value,
      silver: silver.value,
      vipExp: vipExp.value,
      vipExpireTime: vipExpireTime.value,
      grain: grain.value,
      soldiers: soldiers.value,
      currentYear: currentYear.value,
      currentMonth: currentMonth.value,
      harem: harem.value,
      ministers: ministers.value,
      children: children.value,
      marriedChildren: marriedChildren.value,
      npcChildren: npcChildren.value,
      battleLevel: battleLevel.value,
      expeditionLevel: expeditionLevel.value,
      tributeNations: tributeNations.value,
      bagItems: bagItems.value,
      activatedBonds: activatedBonds.value,
      vipDailyClaimedDate: vipDailyClaimedDate.value,
      vipGiftBoughtList: vipGiftBoughtList.value,
      boughtGiftList: boughtGiftList.value,
      todayFavorCount: todayFavorCount.value,
      todayFavorDate: todayFavorDate.value,
      gameTotalTime: gameTotalTime.value,
      messageList: messageList.value,
      timestamp: Date.now(),
      hash: ''
    }
    saveData.hash = generateSaveHash(saveData)
    const encrypted = encrypt(JSON.stringify(saveData), SECRET_KEY)
    localStorage.setItem(SAVE_KEY, encrypted)
    emit(events.SHOW_MESSAGE, { type: 'success', content: '💾 游戏存档保存成功！' })
    return true
  }
  const loadGame = () => {
    const saved = localStorage.getItem(SAVE_KEY)
    if (!saved) return false
    try {
      const decrypted = decrypt(saved, SECRET_KEY)
      const saveData = JSON.parse(decrypted)
      const validateResult = validateSaveData(saveData)
      if (!validateResult.valid) {
        emit(events.SHOW_MESSAGE, { type: 'error', title: '存档异常', content: validateResult.message })
        const fixedData = fixSaveData(saveData)
        Object.assign(saveData, fixedData)
      }
      nationalPower.value = saveData.nationalPower || 1000
      goldTickets.value = saveData.goldTickets || 100
      silver.value = saveData.silver || 10000
      vipExp.value = saveData.vipExp || 0
      vipExpireTime.value = saveData.vipExpireTime || 0
      grain.value = saveData.grain || 10000
      soldiers.value = saveData.soldiers || 5000
      currentYear.value = saveData.currentYear || 1
      currentMonth.value = saveData.currentMonth || 1
      harem.value = saveData.harem?.map(c => ({
        ...initialHarem.find(h => h.id === c.id) || c,
        rank: c.rank || 8,
        charmExp: c.charmExp || 0,
        isPregnant: c.isPregnant || false,
        pregnantEndTime: c.pregnantEndTime || 0,
        lastFavorTime: c.lastFavorTime || 0
      })) || [...initialHarem]
      ministers.value = saveData.ministers?.map(m => ({
        ...initialMinisters.find(mi => mi.id === m.id) || m,
        star: m.star || 1,
        business: m.business || Math.floor(m.politics / 2),
        agriculture: m.agriculture || Math.floor(m.politics / 2),
        military: m.military || m.military,
        politics: m.politics || Math.floor(m.power / 10)
      })) || [...initialMinisters]
      children.value = saveData.children || []
      marriedChildren.value = saveData.marriedChildren || []
      npcChildren.value = saveData.npcChildren || generateNPCChildren(100)
      battleLevel.value = saveData.battleLevel || 1
      expeditionLevel.value = saveData.expeditionLevel || 1
      tributeNations.value = saveData.tributeNations || [...initialTributeNations]
      bagItems.value = saveData.bagItems || {}
      activatedBonds.value = saveData.activatedBonds || []
      vipDailyClaimedDate.value = saveData.vipDailyClaimedDate || ''
      vipGiftBoughtList.value = saveData.vipGiftBoughtList || []
      boughtGiftList.value = saveData.boughtGiftList || []
      todayFavorCount.value = saveData.todayFavorCount || 0
      todayFavorDate.value = saveData.todayFavorDate || ''
      gameTotalTime.value = saveData.gameTotalTime || 0
      messageList.value = saveData.messageList || []
      // 自动解锁内容
      const currentVipLevel = vipLevel.value
      if (Array.isArray(vipHarem)) {
        for (let l = 1; l <= currentVipLevel; l++) {
          const vipHaremInfo = vipHarem.find(h => h.unlockLevel === l)
          if (vipHaremInfo) {
            const exists = harem.value.find(h => h.name === vipHaremInfo.name)
            if (!exists) {
              harem.value.push({
                id: Date.now() + Math.random(),
                ...vipHaremInfo,
                level: 1,
                favor: 50,
                star: 0,
                unlockedSkills: [],
                rank: 8,
                charmExp: 0,
                isPregnant: false,
                pregnantEndTime: 0,
                lastFavorTime: 0
              })
            }
          }
        }
      }
      if (Array.isArray(battleHarem)) {
        for (let l = 1; l < battleLevel.value; l++) {
          const battleHaremInfo = battleHarem.find(h => h.unlockLevel === l)
          if (battleHaremInfo) {
            const exists = harem.value.find(h => h.name === battleHaremInfo.name)
            if (!exists) {
              harem.value.push({
                id: Date.now() + Math.random(),
                ...battleHaremInfo,
                level: 1,
                favor: 50,
                star: 0,
                unlockedSkills: [],
                rank: 8,
                charmExp: 0,
                isPregnant: false,
                pregnantEndTime: 0,
                lastFavorTime: 0
              })
            }
          }
        }
      }
      if (Array.isArray(tributeNations.value)) {
        tributeNations.value.forEach(nation => {
          if (nation.cooldownEnd) {
            const remaining = Math.ceil((nation.cooldownEnd - Date.now()) / 1000)
            nation.cooldown = Math.max(0, remaining)
          }
        })
      }
      calculateBondBonus()
      return true
    } catch (e) {
      console.error('加载存档失败:', e)
      emit(events.SHOW_MESSAGE, { type: 'error', content: '存档加载失败，已重置为初始状态' })
      return false
    }
  }
  const exportSave = () => {
    const saved = localStorage.getItem(SAVE_KEY)
    if (!saved) {
      emit(events.SHOW_MESSAGE, { type: 'error', content: '没有存档可导出！' })
      return
    }
    const blob = new Blob([saved], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qing_dynasty_save_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    emit(events.SHOW_MESSAGE, { type: 'success', content: '存档导出成功！' })
  }
  const importSave = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target.result
        const decrypted = decrypt(content, SECRET_KEY)
        const saveData = JSON.parse(decrypted)
        const validateResult = validateSaveData(saveData)
        if (!validateResult.valid) {
          emit(events.SHOW_MESSAGE, { type: 'error', content: '无效的存档文件，已被篡改或损坏！' })
          return
        }
        localStorage.setItem(SAVE_KEY, content)
        loadGame()
        emit(events.SHOW_MESSAGE, { type: 'success', content: '存档导入成功！' })
      } catch (err) {
        console.error('导入失败:', err)
        emit(events.SHOW_MESSAGE, { type: 'error', content: '无效的存档文件！' })
      }
    }
    reader.readAsText(file)
  }
  const resetGame = () => {
    localStorage.removeItem(SAVE_KEY)
    localStorage.removeItem('qing_used_redeem_codes')
    nationalPower.value = 1000
    goldTickets.value = 100
    silver.value = 10000
    vipExp.value = 0
    vipExpireTime.value = 0
    grain.value = 10000
    soldiers.value = 5000
    currentYear.value = 1
    currentMonth.value = 1
    harem.value = [...initialHarem.map(c => ({
      ...c,
      rank: 8,
      charmExp: 0,
      isPregnant: false,
      pregnantEndTime: 0,
      lastFavorTime: 0,
      star: 0,
      unlockedSkills: [],
      level: 1,
      favor: 50
    }))]
    ministers.value = [...initialMinisters.map(m => ({
      ...m,
      level: 1,
      star: 1,
      business: Math.floor(m.politics / 2),
      agriculture: Math.floor(m.politics / 2),
      military: m.military,
      politics: Math.floor(m.power / 10)
    }))]
    children.value = []
    marriedChildren.value = []
    npcChildren.value = generateNPCChildren(100)
    battleLevel.value = 1
    expeditionLevel.value = 1
    tributeNations.value = [...initialTributeNations]
    bagItems.value = {}
    activatedBonds.value = []
    vipDailyClaimedDate.value = ''
    vipGiftBoughtList.value = []
    boughtGiftList.value = []
    todayFavorCount.value = 0
    todayFavorDate.value = ''
    gameTotalTime.value = 0
    messageList.value = []
    
    emit(events.SHOW_MESSAGE, { type: 'success', content: '游戏已重置为初始状态！' })
  }

  // 全局定时器
  const startGlobalTimer = () => {
    if (!timeTimer) {
      timeTimer = setInterval(() => {
        currentTimestamp.value = Date.now()
      }, 1000)
    }
    if (!gameTimeTimer) {
      gameTimeTimer = setInterval(() => {
        gameTotalTime.value += 1
      }, 1000)
    }
    setInterval(() => {
      checkPregnantBirth()
    }, 1000 * 60)
  }
  const stopGlobalTimer = () => {
    if (timeTimer) {
      clearInterval(timeTimer)
      timeTimer = null
    }
    if (gameTimeTimer) {
      clearInterval(gameTimeTimer)
      gameTimeTimer = null
    }
  }

  // 生命周期
  onMounted(() => {
    startGlobalTimer()
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) startGlobalTimer()
      else stopGlobalTimer()
    })
  })
  onUnmounted(() => {
    stopGlobalTimer()
  })

  // 全量导出
  return {
    nationalPower,
    goldTickets,
    silver,
    grain,
    soldiers,
    currentYear,
    currentMonth,
    gameTotalTime,
    vipExp,
    vipExpireTime,
    isVipActive,
    vipRemainingDays,
    vipLevel,
    vipInfo,
    nextVipExp,
    vipDailyClaimedDate,
    vipGiftBoughtList,
    boughtGiftList,
    isGiftBought,
    buyGift,
    bagItems,
    bagItemList,
    getItemCount,
    addItem,
    reduceItem,
    harem,
    haremItems,
    activatedBonds,
    favorCD,
    dailyFavorLimit,
    todayFavorCount,
    todayFavorDate,
    checkFavorCD,
    checkFavorLimit,
    getHaremStarInfo,
    upgradeHaremStar,
    useIntimateDan,
    getHaremFinalAttr,
    calculateBondBonus,
    favorConsort,
    randomFavor,
    randomFavorAll,
    giveGiftToConsort,
    giveBirth,
    upgradeConsortRank,
    consortStudy,
    children,
    marriedChildren,
    npcChildren,
    totalChildrenCount,
    marriedChildrenCount,
    trainChild,
    educateChild,
    marryChild,
    ministers,
    getMinisterFinalAttr,
    getMinisterLevelLimit,
    trainMinister,
    upgradeMinisterStar,
    upgradeMinisterAbility,
    rewardMinister,
    battleLevel,
    expeditionLevel,
    tributeNations,
    totalPower,
    battle,
    expedition,
    collectTribute,
    search,
    redeemCode,
    claimVipDaily,
    buyVipGift,
    collectTax,
    messageList,
    addMessage,
    readAllMessage,
    addNationalPower,
    addGoldTickets,
    addSilver,
    reduceSilver,
    saveGame,
    loadGame,
    exportSave,
    importSave,
    resetGame,
    decrypt,
    encrypt
  }
})