// 道具
export const itemTypeEnum = {
  CONSORT_FAVOR: 'consort_favor',
  CONSORT_STAR: 'consort_star',
  MINISTER_BREAK: 'minister_break',
  MINISTER_ABILITY: 'minister_ability',
  MINISTER_REWARD: 'minister_reward',
  CURRENCY: 'currency',
  OTHER: 'other'
}

export const itemConfig = {
  intimate_dan: {
    id: 'intimate_dan',
    name: '亲密丹',
    icon: '💖',
    type: itemTypeEnum.CONSORT_FAVOR,
    desc: '使用后可增加妃嫔亲密度',
    source: '寻访、VIP礼包、活动、兑换码',
    useScene: 'harem',
    maxStack: 9999
  },
  star_upgrade_dan: {
    id: 'star_upgrade_dan',
    name: '升星丹',
    icon: '✨',
    type: itemTypeEnum.CONSORT_STAR,
    desc: '妃嫔升星必备材料，可大幅提升妃嫔属性',
    source: '副本、寻访、VIP礼包、兑换码',
    useScene: 'harem',
    maxStack: 9999
  },
  minister_break_dan: {
    id: 'minister_break_dan',
    name: '大臣突破丹',
    icon: '📜',
    type: itemTypeEnum.MINISTER_BREAK,
    desc: '大臣星级突破必备材料，突破后提升等级上限',
    source: '征战、VIP礼包、征收、兑换码',
    useScene: 'minister',
    maxStack: 9999
  },
  politics_book: {
    id: 'politics_book',
    name: '政治典籍',
    icon: '📚',
    type: itemTypeEnum.MINISTER_ABILITY,
    desc: '使用后增加大臣政治资质1点',
    source: 'VIP礼包、活动、纳贡',
    useScene: 'minister_ability',
    effect: {
      abilityType: 'politics',
      abilityName: '政治',
      value: 1
    },
    maxStack: 999
  },
  military_book: {
    id: 'military_book',
    name: '兵书战策',
    icon: '⚔️',
    type: itemTypeEnum.MINISTER_ABILITY,
    desc: '使用后增加大臣军事资质1点',
    source: '征战、副本、活动',
    useScene: 'minister_ability',
    effect: {
      abilityType: 'military',
      abilityName: '军事',
      value: 1
    },
    maxStack: 999
  },
  business_book: {
    id: 'business_book',
    name: '商道全书',
    icon: '💰',
    type: itemTypeEnum.MINISTER_ABILITY,
    desc: '使用后增加大臣商业资质1点',
    source: '征收、VIP礼包、活动',
    useScene: 'minister_ability',
    effect: {
      abilityType: 'business',
      abilityName: '商业',
      value: 1
    },
    maxStack: 999
  },
  agriculture_book: {
    id: 'agriculture_book',
    name: '农桑纪要',
    icon: '🌾',
    type: itemTypeEnum.MINISTER_ABILITY,
    desc: '使用后增加大臣农业资质1点',
    source: '征收、寻访、纳贡',
    useScene: 'minister_ability',
    effect: {
      abilityType: 'agriculture',
      abilityName: '农业',
      value: 1
    },
    maxStack: 999
  },
  minister_exp_book: {
    id: 'minister_exp_book',
    name: '经验典籍',
    icon: '📖',
    type: itemTypeEnum.MINISTER_REWARD,
    desc: '赏赐给大臣，可增加大臣等级1级、战力100点',
    source: '副本、活动、VIP礼包',
    useScene: 'minister_reward',
    effect: {
      levelAdd: 1,
      powerAdd: 100
    },
    maxStack: 9999
  }
}