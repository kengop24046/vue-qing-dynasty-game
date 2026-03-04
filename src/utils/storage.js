import { encrypt, decrypt } from '@/utils/crypto'

const STORAGE_SECRET = 'QING_DYNASTY_STORAGE_SECRET'

// 加密存储
export const setEncryptedStorage = (key, data) => {
  try {
    const jsonStr = JSON.stringify(data)
    const encrypted = encrypt(jsonStr, STORAGE_SECRET)
    localStorage.setItem(key, encrypted)
    return true
  } catch (e) {
    console.error('加密存储失败:', e)
    return false
  }
}

// 解密读取
export const getDecryptedStorage = (key) => {
  try {
    const encrypted = localStorage.getItem(key)
    if (!encrypted) return null
    const decrypted = decrypt(encrypted, STORAGE_SECRET)
    return JSON.parse(decrypted)
  } catch (e) {
    console.error('解密读取失败:', e)
    return null
  }
}

// 移除存储
export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (e) {
    console.error('移除存储失败:', e)
    return false
  }
}

// 清空所有存储
export const clearAllStorage = () => {
  try {
    localStorage.clear()
    return true
  } catch (e) {
    console.error('清空存储失败:', e)
    return false
  }
}

// 存储已使用的兑换码
export const saveUsedRedeemCode = (codeHash) => {
  const usedCodes = getDecryptedStorage('qing_used_redeem_codes') || []
  usedCodes.push(codeHash)
  return setEncryptedStorage('qing_used_redeem_codes', usedCodes)
}

// 检查兑换码是否已使用
export const isRedeemCodeUsed = (codeHash) => {
  const usedCodes = getDecryptedStorage('qing_used_redeem_codes') || []
  return usedCodes.includes(codeHash)
}