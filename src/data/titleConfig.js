// 国力等级称号配置
export const titleConfig = [
  { minPower: 0, maxPower: 1000, title: '九品芝麻官', level: 1, unlock: ['上朝', '后宫'] },
  { minPower: 1001, maxPower: 3000, title: '八品县丞', level: 2, unlock: ['征粮征兵'] },
  { minPower: 3001, maxPower: 6000, title: '七品知县', level: 3, unlock: ['子嗣系统'] },
  { minPower: 6001, maxPower: 10000, title: '六品通判', level: 4, unlock: ['媒人系统'] },
  { minPower: 10001, maxPower: 20000, title: '五品知州', level: 5, unlock: ['副本'] },
  { minPower: 20001, maxPower: 50000, title: '四品知府', level: 6, unlock: ['征战'] },
  { minPower: 50001, maxPower: 100000, title: '三品道员', level: 7, unlock: ['纳贡'] },
  { minPower: 100001, maxPower: 200000, title: '二品巡抚', level: 8, unlock: ['校场'] },
  { minPower: 200001, maxPower: 500000, title: '一品总督', level: 9, unlock: ['灵兽系统'] },
  { minPower: 500001, maxPower: 1000000, title: '郡王', level: 10, unlock: ['VIP商城全部权限'] },
  { minPower: 1000001, maxPower: 3000000, title: '亲王', level: 11, unlock: [] },
  { minPower: 3000001, maxPower: 6000000, title: '太子', level: 12, unlock: [] },
  { minPower: 6000001, maxPower: 10000000, title: '皇帝', level: 13, unlock: [] },
  { minPower: 10000001, maxPower: 30000000, title: '千古一帝', level: 14, unlock: [] },
  { minPower: 30000001, maxPower: 100000000, title: '万世圣君', level: 15, unlock: [] },
]

// 获取当前国力对应的称号
export const getTitleByPower = (power) => {
  return titleConfig.find(item => power >= item.minPower && power <= item.maxPower) || titleConfig[titleConfig.length - 1]
}

// 获取当前解锁的功能
export const getUnlockedFeatures = (power) => {
  const title = getTitleByPower(power)
  const unlocked = []
  titleConfig.forEach(item => {
    if (power >= item.minPower) {
      unlocked.push(...item.unlock)
    }
  })
  return [...new Set(unlocked)]
}