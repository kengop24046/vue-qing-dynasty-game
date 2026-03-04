import { princeNameDict, princessNameDict } from '@/data/nameDict'
import { getTitleByPower } from '@/data/titleConfig'
import { getVipInfo } from '@/data/vipConfig'

// 生成皇子名字
export const generatePrinceName = (generationIndex = 0) => {
  const generation = princeNameDict.generation[generationIndex % princeNameDict.generation.length]
  const givenName = princeNameDict.givenName[Math.floor(Math.random() * princeNameDict.givenName.length)]
  return `爱新觉罗·${generation}${givenName}`
}

// 生成公主名字
export const generatePrincessName = () => {
  const title = princessNameDict.title[Math.floor(Math.random() * princessNameDict.title.length)]
  const givenName = princessNameDict.givenName[Math.floor(Math.random() * princessNameDict.givenName.length)]
  return `${title}${givenName}公主`
}

// 计算子嗣属性继承（父母资质）
export const calculateChildAttribute = (motherCharm, motherTalent, fatherBonus = 0, inheritRate = 0.5) => {
  const base = (motherCharm + motherTalent) * inheritRate
  const randomBonus = Math.floor(Math.random() * 20)
  // 20%几率双倍继承
  const isDoubleInherit = Math.random() < 0.2
  return Math.floor(base * (isDoubleInherit ? 2 : 1) + randomBonus + fatherBonus)
}

// 计算国力
export const calculateTotalPower = (nationalPower, harem, ministers, children, beasts) => {
  let total = nationalPower
  // 后宫加成
  harem.forEach(h => total += h.level * 10 + h.charm * 2 + h.talent * 2)
  // 大臣加成
  ministers.forEach(m => total += m.power + m.politics * 3 + m.military * 3)
  // 子嗣加成
  children.forEach(c => total += c.power * 2)
  // 灵兽加成
  beasts.forEach(b => total += b.power)
  return Math.floor(total)
}

// 计算战斗胜率
export const calculateWinRate = (myPower, enemyPower, vipExp = 0) => {
  const vipInfo = getVipInfo(vipExp)
  const vipBonus = vipInfo.privileges.find(p => p.includes('战斗加成')) 
    ? parseInt(vipInfo.privileges.find(p => p.includes('战斗加成')).match(/\d+/)[0]) / 100 
    : 0
  const baseRate = myPower / (myPower + enemyPower)
  return Math.min(0.95, Math.max(0.05, baseRate + vipBonus))
}

// 格式化数字
export const formatNumber = (num) => {
  if (num >= 100000000) return (num / 100000000).toFixed(2) + '亿'
  if (num >= 10000) return (num / 10000).toFixed(2) + '万'
  return num.toLocaleString()
}

// 获取当前时间（游戏内）
export const getGameDate = (year, month) => {
  return `乾隆${year}年${month}月`
}

// 随机事件生成
export const generateRandomEvent = (eventList) => {
  return eventList[Math.floor(Math.random() * eventList.length)]
}