import CryptoJS from 'crypto-js'

export const encrypt = (text, key) => {
  return CryptoJS.AES.encrypt(text, key).toString()
}

export const decrypt = (ciphertext, key) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export const generateHash = (text, key) => {
  return CryptoJS.HmacSHA256(text, key).toString()
}