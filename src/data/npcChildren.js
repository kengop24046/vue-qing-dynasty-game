const surnames = ['钮祜禄', '富察', '佟佳', '瓜尔佳', '马佳', '索绰罗', '齐佳', '那拉']
const maleNames = ['博文', '仲谦', '叔贤', '季礼', '子墨', '子瑜', '浩然', '明轩']
const femaleNames = ['婉儿', '诗韵', '梦瑶', '雨萱', '静娴', '雅琴', '雪梅', '兰心']

export const generateNPCChildren = (count, minQuality = 1) => {
  const children = []
  for (let i = 0; i < count; i++) {
    const isMale = Math.random() > 0.5
    const quality = Math.max(minQuality, Math.floor(Math.random() * 5) + 1) // 1-5品质
    const surname = surnames[Math.floor(Math.random() * surnames.length)]
    const name = isMale 
      ? maleNames[Math.floor(Math.random() * maleNames.length)]
      : femaleNames[Math.floor(Math.random() * femaleNames.length)]
    
    const basePower = quality * 50 + Math.floor(Math.random() * 50)
    
    children.push({
      id: Date.now() + i,
      name: surname + name,
      gender: isMale ? 'male' : 'female',
      age: 18 + Math.floor(Math.random() * 5),
      quality,
      power: basePower,
      talent: 50 + quality * 10 + Math.floor(Math.random() * 20),
      charm: 50 + quality * 10 + Math.floor(Math.random() * 20),
      family: surnames[Math.floor(Math.random() * surnames.length)] + '氏'
    })
  }
  return children
}