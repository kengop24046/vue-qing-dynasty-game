import { generateHash } from '@/utils/crypto'

const SAVE_SECRET = 'QING_DYNASTY_2024_SECRET_KEY'

export const generateSaveHash = (saveData) => {
  const dataForHash = { ...saveData }
  delete dataForHash.hash
  return generateHash(JSON.stringify(dataForHash), SAVE_SECRET)
}

export const validateSaveData = (saveData) => {
  if (!saveData || typeof saveData !== 'object') {
    return { valid: false, message: '存档格式错误' }
  }

  const requiredFields = ['nationalPower', 'goldTickets', 'vipExp', 'harem', 'ministers', 'children', 'timestamp']
  for (const field of requiredFields) {
    if (!(field in saveData)) {
      return { valid: false, message: `存档缺失字段: ${field}` }
    }
  }

  const savedHash = saveData.hash
  const calculatedHash = generateSaveHash(saveData)
  if (savedHash !== calculatedHash) {
    return { valid: false, message: '存档已被篡改或损坏' }
  }

  if (saveData.nationalPower < 0 || saveData.goldTickets < 0 || saveData.vipExp < 0) {
    return { valid: false, message: '存档数值异常' }
  }

  return { valid: true, message: '存档验证通过' }
}

export const fixSaveData = (saveData) => {
  const fixedData = { ...saveData }
  fixedData.nationalPower = Math.max(0, fixedData.nationalPower || 1000)
  fixedData.goldTickets = Math.max(0, fixedData.goldTickets || 100)
  fixedData.vipExp = Math.max(0, fixedData.vipExp || 0)
  fixedData.grain = Math.max(0, fixedData.grain || 10000)
  fixedData.soldiers = Math.max(0, fixedData.soldiers || 5000)
  
  fixedData.harem = Array.isArray(fixedData.harem) ? fixedData.harem : []
  fixedData.ministers = Array.isArray(fixedData.ministers) ? fixedData.ministers : []
  fixedData.children = Array.isArray(fixedData.children) ? fixedData.children : []
  fixedData.marriedChildren = Array.isArray(fixedData.marriedChildren) ? fixedData.marriedChildren : []
  fixedData.npcChildren = Array.isArray(fixedData.npcChildren) ? fixedData.npcChildren : []
  
  fixedData.hash = generateSaveHash(fixedData)
  
  return fixedData
}