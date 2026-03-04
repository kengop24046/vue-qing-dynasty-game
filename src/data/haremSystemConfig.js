// 星级升级规则（完全对齐原版数值梯度）
export const starUpgradeConfig = [
  { star: 1, needFavor: 200, needItem: 10, attrBonus: 0.05, childBonus: 0.02, powerBonus: 100 },
  { star: 2, needFavor: 500, needItem: 20, attrBonus: 0.10, childBonus: 0.04, powerBonus: 300 },
  { star: 3, needFavor: 1000, needItem: 50, attrBonus: 0.15, childBonus: 0.06, powerBonus: 600, unlockSkill: true },
  { star: 4, needFavor: 2000, needItem: 100, attrBonus: 0.20, childBonus: 0.08, powerBonus: 1000 },
  { star: 5, needFavor: 3500, needItem: 200, attrBonus: 0.25, childBonus: 0.10, powerBonus: 1500 },
  { star: 6, needFavor: 5000, needItem: 350, attrBonus: 0.30, childBonus: 0.12, powerBonus: 2200, unlockSkill: true },
  { star: 7, needFavor: 8000, needItem: 500, attrBonus: 0.35, childBonus: 0.15, powerBonus: 3000 },
  { star: 8, needFavor: 12000, needItem: 800, attrBonus: 0.40, childBonus: 0.18, powerBonus: 4000 },
  { star: 9, needFavor: 20000, needItem: 1200, attrBonus: 0.45, childBonus: 0.22, powerBonus: 5500 },
  { star: 10, needFavor: 30000, needItem: 2000, attrBonus: 0.50, childBonus: 0.25, powerBonus: 8000, unlockSkill: true },
  // VIP专属高星上限
  { star: 11, needFavor: 50000, needItem: 3500, attrBonus: 0.60, childBonus: 0.30, powerBonus: 12000, vipLimit: 10 },
  { star: 12, needFavor: 80000, needItem: 5000, attrBonus: 0.70, childBonus: 0.35, powerBonus: 18000, vipLimit: 10 },
  { star: 13, needFavor: 120000, needItem: 8000, attrBonus: 0.80, childBonus: 0.40, powerBonus: 25000, vipLimit: 15 },
  { star: 14, needFavor: 200000, needItem: 12000, attrBonus: 0.90, childBonus: 0.45, powerBonus: 35000, vipLimit: 15 },
  { star: 15, needFavor: 300000, needItem: 20000, attrBonus: 1.00, childBonus: 0.50, powerBonus: 50000, vipLimit: 15 },
]

// 后宫星级专属技能库（原版技能复刻）
export const haremSkillConfig = {
  3: {
    name: '温柔贤淑',
    desc: '宠幸时亲密度获取+50%，生子概率+10%',
    effect: { favorBonus: 0.5, birthBonus: 0.1 }
  },
  6: {
    name: '母仪天下',
    desc: '子嗣初始属性+30%，所有大臣政治属性+2%',
    effect: { childAttrBonus: 0.3, ministerPoliticsBonus: 0.02 }
  },
  10: {
    name: '绝代风华',
    desc: '全局国力+5%，宠幸时有50%概率触发双倍奖励',
    effect: { globalPowerBonus: 0.05, doubleRewardRate: 0.5 }
  },
  15: {
    name: '千古一后',
    desc: '全局国力+10%，所有大臣全属性+5%，子嗣属性翻倍',
    effect: { globalPowerBonus: 0.1, ministerAllBonus: 0.05, childDouble: true }
  }
}

// 1. 君臣红颜羁绊
export const ministerBondConfig = [
  {
    bondId: 1,
    bondName: '霸王别姬',
    desc: '力拔山兮气盖世，时不利兮骓不逝',
    aType: 'harem',
    aName: '虞姬',
    aNeedStar: 3,
    bType: 'minister',
    bName: '项羽',
    bNeedLevel: 30,
    // 1-5级加成
    bonus: [
      { level: 1, aAttrBonus: { charm: 0.1, talent: 0.1 }, bAttrBonus: { military: 0.1 }, globalPowerBonus: 0.005 },
      { level: 2, aAttrBonus: { charm: 0.2, talent: 0.2 }, bAttrBonus: { military: 0.2 }, globalPowerBonus: 0.01 },
      { level: 3, aAttrBonus: { charm: 0.35, talent: 0.35 }, bAttrBonus: { military: 0.35 }, globalPowerBonus: 0.02 },
      { level: 4, aAttrBonus: { charm: 0.5, talent: 0.5 }, bAttrBonus: { military: 0.5 }, globalPowerBonus: 0.035 },
      { level: 5, aAttrBonus: { charm: 0.8, talent: 0.8 }, bAttrBonus: { military: 0.8 }, globalPowerBonus: 0.05 },
    ]
  },
  {
    bondId: 2,
    bondName: '长恨歌',
    desc: '在天愿作比翼鸟，在地愿为连理枝',
    aType: 'harem',
    aName: '杨贵妃',
    aNeedStar: 3,
    bType: 'minister',
    bName: '李隆基',
    bNeedLevel: 30,
    bonus: [
      { level: 1, aAttrBonus: { charm: 0.1, talent: 0.15 }, bAttrBonus: { politics: 0.1, military: 0.1 }, globalPowerBonus: 0.005 },
      { level: 2, aAttrBonus: { charm: 0.2, talent: 0.25 }, bAttrBonus: { politics: 0.2, military: 0.2 }, globalPowerBonus: 0.01 },
      { level: 3, aAttrBonus: { charm: 0.35, talent: 0.4 }, bAttrBonus: { politics: 0.35, military: 0.35 }, globalPowerBonus: 0.02 },
      { level: 4, aAttrBonus: { charm: 0.5, talent: 0.6 }, bAttrBonus: { politics: 0.5, military: 0.5 }, globalPowerBonus: 0.035 },
      { level: 5, aAttrBonus: { charm: 0.8, talent: 0.9 }, bAttrBonus: { politics: 0.8, military: 0.8 }, globalPowerBonus: 0.05 },
    ]
  },
  {
    bondId: 3,
    bondName: '孝贤辅政',
    desc: '一代贤后，辅佐乾隆开创盛世',
    aType: 'harem',
    aName: '孝贤纯皇后',
    aNeedStar: 3,
    bType: 'minister',
    bName: '傅恒',
    bNeedLevel: 30,
    bonus: [
      { level: 1, aAttrBonus: { charm: 0.12, talent: 0.12 }, bAttrBonus: { military: 0.12, politics: 0.1 }, globalPowerBonus: 0.006 },
      { level: 2, aAttrBonus: { charm: 0.22, talent: 0.22 }, bAttrBonus: { military: 0.22, politics: 0.2 }, globalPowerBonus: 0.012 },
      { level: 3, aAttrBonus: { charm: 0.38, talent: 0.38 }, bAttrBonus: { military: 0.38, politics: 0.35 }, globalPowerBonus: 0.022 },
      { level: 4, aAttrBonus: { charm: 0.55, talent: 0.55 }, bAttrBonus: { military: 0.55, politics: 0.5 }, globalPowerBonus: 0.038 },
      { level: 5, aAttrBonus: { charm: 0.85, talent: 0.85 }, bAttrBonus: { military: 0.85, politics: 0.8 }, globalPowerBonus: 0.055 },
    ]
  },
  {
    bondId: 4,
    bondName: '武朝双璧',
    desc: '巾帼宰相，辅佐女皇开创武周盛世',
    aType: 'harem',
    aName: '武则天',
    aNeedStar: 3,
    bType: 'minister',
    bName: '狄仁杰',
    bNeedLevel: 30,
    bonus: [
      { level: 1, aAttrBonus: { charm: 0.1, talent: 0.2 }, bAttrBonus: { politics: 0.2 }, globalPowerBonus: 0.008 },
      { level: 2, aAttrBonus: { charm: 0.2, talent: 0.35 }, bAttrBonus: { politics: 0.35 }, globalPowerBonus: 0.015 },
      { level: 3, aAttrBonus: { charm: 0.35, talent: 0.5 }, bAttrBonus: { politics: 0.5 }, globalPowerBonus: 0.025 },
      { level: 4, aAttrBonus: { charm: 0.5, talent: 0.7 }, bAttrBonus: { politics: 0.7 }, globalPowerBonus: 0.04 },
      { level: 5, aAttrBonus: { charm: 0.8, talent: 1.0 }, bAttrBonus: { politics: 1.0 }, globalPowerBonus: 0.06 },
    ]
  },
  {
    bondId: 5,
    bondName: '精忠报国',
    desc: '巾帼英雄，与岳将军共抗金兵',
    aType: 'harem',
    aName: '梁红玉',
    aNeedStar: 3,
    bType: 'minister',
    bName: '岳飞',
    bNeedLevel: 30,
    bonus: [
      { level: 1, aAttrBonus: { charm: 0.1, talent: 0.1 }, bAttrBonus: { military: 0.15 }, globalPowerBonus: 0.006 },
      { level: 2, aAttrBonus: { charm: 0.2, talent: 0.2 }, bAttrBonus: { military: 0.25 }, globalPowerBonus: 0.012 },
      { level: 3, aAttrBonus: { charm: 0.35, talent: 0.35 }, bAttrBonus: { military: 0.4 }, globalPowerBonus: 0.022 },
      { level: 4, aAttrBonus: { charm: 0.5, talent: 0.5 }, bAttrBonus: { military: 0.6 }, globalPowerBonus: 0.038 },
      { level: 5, aAttrBonus: { charm: 0.8, talent: 0.8 }, bAttrBonus: { military: 0.9 }, globalPowerBonus: 0.055 },
    ]
  },
  {
    bondId: 6,
    bondName: '江东二乔',
    desc: '遥想公瑾当年，小乔初嫁了，雄姿英发',
    aType: 'harem',
    aName: '小乔',
    aNeedStar: 3,
    bType: 'minister',
    bName: '周瑜',
    bNeedLevel: 30,
    bonus: [
      { level: 1, aAttrBonus: { charm: 0.15, talent: 0.15 }, bAttrBonus: { military: 0.15, politics: 0.1 }, globalPowerBonus: 0.007 },
      { level: 2, aAttrBonus: { charm: 0.25, talent: 0.25 }, bAttrBonus: { military: 0.25, politics: 0.2 }, globalPowerBonus: 0.014 },
      { level: 3, aAttrBonus: { charm: 0.4, talent: 0.4 }, bAttrBonus: { military: 0.4, politics: 0.35 }, globalPowerBonus: 0.024 },
      { level: 4, aAttrBonus: { charm: 0.6, talent: 0.6 }, bAttrBonus: { military: 0.6, politics: 0.5 }, globalPowerBonus: 0.04 },
      { level: 5, aAttrBonus: { charm: 0.9, talent: 0.9 }, bAttrBonus: { military: 0.9, politics: 0.8 }, globalPowerBonus: 0.06 },
    ]
  },
  {
    bondId: 7,
    bondName: '大汉双璧',
    desc: '卫氏姐弟，辅佐汉武开创大汉盛世',
    aType: 'harem',
    aName: '卫子夫',
    aNeedStar: 3,
    bType: 'minister',
    bName: '卫青',
    bNeedLevel: 30,
    bonus: [
      { level: 1, aAttrBonus: { charm: 0.12, talent: 0.12 }, bAttrBonus: { military: 0.15 }, globalPowerBonus: 0.006 },
      { level: 2, aAttrBonus: { charm: 0.22, talent: 0.22 }, bAttrBonus: { military: 0.25 }, globalPowerBonus: 0.012 },
      { level: 3, aAttrBonus: { charm: 0.38, talent: 0.38 }, bAttrBonus: { military: 0.4 }, globalPowerBonus: 0.022 },
      { level: 4, aAttrBonus: { charm: 0.55, talent: 0.55 }, bAttrBonus: { military: 0.6 }, globalPowerBonus: 0.038 },
      { level: 5, aAttrBonus: { charm: 0.85, talent: 0.85 }, bAttrBonus: { military: 0.9 }, globalPowerBonus: 0.055 },
    ]
  },
  {
    bondId: 8,
    bondName: '洪武贤后',
    desc: '家有贤妻，犹国之良相',
    aType: 'harem',
    aName: '马皇后',
    aNeedStar: 3,
    bType: 'minister',
    bName: '朱元璋',
    bNeedLevel: 30,
    bonus: [
      { level: 1, aAttrBonus: { charm: 0.1, talent: 0.15 }, bAttrBonus: { politics: 0.1, military: 0.1 }, globalPowerBonus: 0.007 },
      { level: 2, aAttrBonus: { charm: 0.2, talent: 0.25 }, bAttrBonus: { politics: 0.2, military: 0.2 }, globalPowerBonus: 0.014 },
      { level: 3, aAttrBonus: { charm: 0.35, talent: 0.4 }, bAttrBonus: { politics: 0.35, military: 0.35 }, globalPowerBonus: 0.024 },
      { level: 4, aAttrBonus: { charm: 0.5, talent: 0.6 }, bAttrBonus: { politics: 0.5, military: 0.5 }, globalPowerBonus: 0.04 },
      { level: 5, aAttrBonus: { charm: 0.8, talent: 0.9 }, bAttrBonus: { politics: 0.8, military: 0.8 }, globalPowerBonus: 0.06 },
    ]
  },
  {
    bondId: 9,
    bondName: '秦淮风骨',
    desc: '桃花扇底送南朝，风骨嶒峻柳如是',
    aType: 'harem',
    aName: '柳如是',
    aNeedStar: 3,
    bType: 'minister',
    bName: '钱谦益',
    bNeedLevel: 30,
    bonus: [
      { level: 1, aAttrBonus: { charm: 0.1, talent: 0.2 }, bAttrBonus: { politics: 0.15 }, globalPowerBonus: 0.005 },
      { level: 2, aAttrBonus: { charm: 0.2, talent: 0.35 }, bAttrBonus: { politics: 0.25 }, globalPowerBonus: 0.01 },
      { level: 3, aAttrBonus: { charm: 0.35, talent: 0.5 }, bAttrBonus: { politics: 0.4 }, globalPowerBonus: 0.02 },
      { level: 4, aAttrBonus: { charm: 0.5, talent: 0.7 }, bAttrBonus: { politics: 0.6 }, globalPowerBonus: 0.035 },
      { level: 5, aAttrBonus: { charm: 0.8, talent: 1.0 }, bAttrBonus: { politics: 0.9 }, globalPowerBonus: 0.05 },
    ]
  },
  {
    bondId: 10,
    bondName: '一代天骄',
    desc: '蒙古帝国开国皇后，辅佐成吉思汗一统欧亚',
    aType: 'harem',
    aName: '孛儿帖',
    aNeedStar: 3,
    bType: 'minister',
    bName: '成吉思汗',
    bNeedLevel: 30,
    bonus: [
      { level: 1, aAttrBonus: { charm: 0.15, talent: 0.15 }, bAttrBonus: { military: 0.15 }, globalPowerBonus: 0.008 },
      { level: 2, aAttrBonus: { charm: 0.25, talent: 0.25 }, bAttrBonus: { military: 0.25 }, globalPowerBonus: 0.015 },
      { level: 3, aAttrBonus: { charm: 0.4, talent: 0.4 }, bAttrBonus: { military: 0.4 }, globalPowerBonus: 0.025 },
      { level: 4, aAttrBonus: { charm: 0.6, talent: 0.6 }, bAttrBonus: { military: 0.6 }, globalPowerBonus: 0.04 },
      { level: 5, aAttrBonus: { charm: 0.9, talent: 0.9 }, bAttrBonus: { military: 0.9 }, globalPowerBonus: 0.06 },
    ]
  }
]

// 2. 姐妹情深羁绊
export const haremBondConfig = [
  {
    bondId: 101,
    bondName: '江东双姝',
    desc: '大乔小乔，江东二乔，绝色双娇',
    aType: 'harem',
    aName: '大乔',
    aNeedStar: 3,
    bType: 'harem',
    bName: '小乔',
    bNeedStar: 3,
    bonus: [
      { level: 1, bothAttrBonus: { charm: 0.1, talent: 0.1 }, globalPowerBonus: 0.005 },
      { level: 2, bothAttrBonus: { charm: 0.2, talent: 0.2 }, globalPowerBonus: 0.01 },
      { level: 3, bothAttrBonus: { charm: 0.35, talent: 0.35 }, globalPowerBonus: 0.02 },
      { level: 4, bothAttrBonus: { charm: 0.5, talent: 0.5 }, globalPowerBonus: 0.035 },
      { level: 5, bothAttrBonus: { charm: 0.8, talent: 0.8 }, globalPowerBonus: 0.05 },
    ]
  },
  {
    bondId: 102,
    bondName: '飞燕合德',
    desc: '赵家姐妹，宠冠汉宫，温柔乡英雄冢',
    aType: 'harem',
    aName: '赵飞燕',
    aNeedStar: 3,
    bType: 'harem',
    bName: '赵合德',
    bNeedStar: 3,
    bonus: [
      { level: 1, bothAttrBonus: { charm: 0.15, talent: 0.1 }, globalPowerBonus: 0.006 },
      { level: 2, bothAttrBonus: { charm: 0.25, talent: 0.2 }, globalPowerBonus: 0.012 },
      { level: 3, bothAttrBonus: { charm: 0.4, talent: 0.35 }, globalPowerBonus: 0.022 },
      { level: 4, bothAttrBonus: { charm: 0.6, talent: 0.5 }, globalPowerBonus: 0.038 },
      { level: 5, bothAttrBonus: { charm: 0.9, talent: 0.8 }, globalPowerBonus: 0.055 },
    ]
  },
  {
    bondId: 103,
    bondName: '莞眉之交',
    desc: '甄嬛与沈眉庄，深宫之中的真挚姐妹情',
    aType: 'harem',
    aName: '甄嬛',
    aNeedStar: 3,
    bType: 'harem',
    bName: '沈眉庄',
    bNeedStar: 3,
    bonus: [
      { level: 1, bothAttrBonus: { charm: 0.1, talent: 0.15 }, globalPowerBonus: 0.006 },
      { level: 2, bothAttrBonus: { charm: 0.2, talent: 0.25 }, globalPowerBonus: 0.012 },
      { level: 3, bothAttrBonus: { charm: 0.35, talent: 0.4 }, globalPowerBonus: 0.022 },
      { level: 4, bothAttrBonus: { charm: 0.5, talent: 0.6 }, globalPowerBonus: 0.038 },
      { level: 5, bothAttrBonus: { charm: 0.8, talent: 0.9 }, globalPowerBonus: 0.055 },
    ]
  },
  {
    bondId: 104,
    bondName: '秦淮八艳',
    desc: '柳如是与董小宛，秦淮风骨，绝代双姝',
    aType: 'harem',
    aName: '柳如是',
    aNeedStar: 3,
    bType: 'harem',
    bName: '董小宛',
    bNeedStar: 3,
    bonus: [
      { level: 1, bothAttrBonus: { charm: 0.1, talent: 0.2 }, globalPowerBonus: 0.005 },
      { level: 2, bothAttrBonus: { charm: 0.2, talent: 0.35 }, globalPowerBonus: 0.01 },
      { level: 3, bothAttrBonus: { charm: 0.35, talent: 0.5 }, globalPowerBonus: 0.02 },
      { level: 4, bothAttrBonus: { charm: 0.5, talent: 0.7 }, globalPowerBonus: 0.035 },
      { level: 5, bothAttrBonus: { charm: 0.8, talent: 1.0 }, globalPowerBonus: 0.05 },
    ]
  },
  {
    bondId: 105,
    bondName: '四大美女',
    desc: '西施与王昭君，沉鱼落雁，绝代风华',
    aType: 'harem',
    aName: '西施',
    aNeedStar: 3,
    bType: 'harem',
    bName: '王昭君',
    bNeedStar: 3,
    bonus: [
      { level: 1, bothAttrBonus: { charm: 0.2, talent: 0.1 }, globalPowerBonus: 0.008 },
      { level: 2, bothAttrBonus: { charm: 0.3, talent: 0.2 }, globalPowerBonus: 0.015 },
      { level: 3, bothAttrBonus: { charm: 0.45, talent: 0.35 }, globalPowerBonus: 0.025 },
      { level: 4, bothAttrBonus: { charm: 0.65, talent: 0.5 }, globalPowerBonus: 0.04 },
      { level: 5, bothAttrBonus: { charm: 1.0, talent: 0.8 }, globalPowerBonus: 0.06 },
    ]
  }
]

// ==================== 道具配置 ====================
export const haremItemConfig = {
  intimateDan: {
    name: '亲密丹',
    desc: '使用后可增加后宫亲密度10点，是升星的核心道具',
    useEffect: { favor: 10 }
  },
  starUpgradeDan: {
    name: '后宫升星丹',
    desc: '后宫星级突破的必备道具，仅可通过副本、礼包、活动获取',
    useEffect: { starUpgradeItem: 1 }
  }
}