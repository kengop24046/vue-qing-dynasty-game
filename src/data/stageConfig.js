// ==================== 副本关卡配置（参考原版闯关玩法，30章300关）====================
/**
 * 副本章节规则：
 * 1. 每章10关，总计30章300关，分3大板块
 * 2. 每章第5关为精英关，第10关为BOSS关
 * 3. 每关有推荐国力、敌方战力、固定掉落
 * 4. BOSS关解锁名臣/后宫、开启下一章节
 */
export const battleStageConfig = [
  // 第一板块：江山一统（1-10章，清朝开国剧情）
  {
    chapterId: 1,
    chapterName: "定鼎燕京",
    totalStage: 10,
    unlockLevel: 1,
    recommendPower: 1000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "摄政王多尔衮" : `燕京守军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 500 + i * 200,
      recommendPower: 1000 + i * 300,
      drop: i === 9
        ? ["大臣经验书*10", "资质丹*5", "名臣: 多尔衮"]
        : i === 4
          ? ["大臣经验书*5", "银两*10000", "粮草*10000"]
          : ["大臣经验书*2", "银两*5000", "粮草*5000"]
    }))
  },
  {
    chapterId: 2,
    chapterName: "平定江南",
    totalStage: 10,
    unlockLevel: 10,
    recommendPower: 5000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "南明弘光帝" : `江南守军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 3000 + i * 500,
      recommendPower: 5000 + i * 600,
      drop: i === 9
        ? ["大臣经验书*15", "资质丹*8", "后宫: 董小宛"]
        : i === 4
          ? ["大臣经验书*8", "银两*20000", "粮草*20000"]
          : ["大臣经验书*3", "银两*8000", "粮草*8000"]
    }))
  },
  {
    chapterId: 3,
    chapterName: "平定三藩",
    totalStage: 10,
    unlockLevel: 20,
    recommendPower: 12000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "平西王吴三桂" : `三藩叛军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 8000 + i * 800,
      recommendPower: 12000 + i * 1000,
      drop: i === 9
        ? ["大臣经验书*20", "资质丹*10", "名臣: 吴三桂"]
        : i === 4
          ? ["大臣经验书*10", "银两*50000", "粮草*50000"]
          : ["大臣经验书*5", "银两*10000", "粮草*10000"]
    }))
  },
  {
    chapterId: 4,
    chapterName: "收复台湾",
    totalStage: 10,
    unlockLevel: 30,
    recommendPower: 25000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "延平王郑成功" : `台湾水师第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 15000 + i * 1200,
      recommendPower: 25000 + i * 1500,
      drop: i === 9
        ? ["大臣经验书*25", "资质丹*12", "名臣: 郑成功"]
        : i === 4
          ? ["大臣经验书*12", "银两*80000", "粮草*80000"]
          : ["大臣经验书*6", "银两*15000", "粮草*15000"]
    }))
  },
  {
    chapterId: 5,
    chapterName: "雅克萨之战",
    totalStage: 10,
    unlockLevel: 40,
    recommendPower: 40000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "沙俄督军托尔布津" : `沙俄侵略军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 25000 + i * 1500,
      recommendPower: 40000 + i * 2000,
      drop: i === 9
        ? ["大臣经验书*30", "资质丹*15", "神兵碎片*10"]
        : i === 4
          ? ["大臣经验书*15", "银两*100000", "粮草*100000"]
          : ["大臣经验书*8", "银两*20000", "粮草*20000"]
    }))
  },
  {
    chapterId: 6,
    chapterName: "平定准噶尔",
    totalStage: 10,
    unlockLevel: 50,
    recommendPower: 60000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "准噶尔汗噶尔丹" : `准噶尔叛军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 40000 + i * 2000,
      recommendPower: 60000 + i * 2500,
      drop: i === 9
        ? ["大臣经验书*35", "资质丹*18", "名臣: 噶尔丹"]
        : i === 4
          ? ["大臣经验书*18", "银两*150000", "粮草*150000"]
          : ["大臣经验书*10", "银两*30000", "粮草*30000"]
    }))
  },
  {
    chapterId: 7,
    chapterName: "征讨缅甸",
    totalStage: 10,
    unlockLevel: 60,
    recommendPower: 90000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "缅甸王莽白" : `缅甸守军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 60000 + i * 2500,
      recommendPower: 90000 + i * 3000,
      drop: i === 9
        ? ["大臣经验书*40", "资质丹*20", "后宫: 陈圆圆"]
        : i === 4
          ? ["大臣经验书*20", "银两*200000", "粮草*200000"]
          : ["大臣经验书*12", "银两*40000", "粮草*40000"]
    }))
  },
  {
    chapterId: 8,
    chapterName: "征讨安南",
    totalStage: 10,
    unlockLevel: 70,
    recommendPower: 120000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "安南王黎维祁" : `安南守军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 80000 + i * 3000,
      recommendPower: 120000 + i * 3500,
      drop: i === 9
        ? ["大臣经验书*45", "资质丹*22", "神兵碎片*20"]
        : i === 4
          ? ["大臣经验书*22", "银两*250000", "粮草*250000"]
          : ["大臣经验书*15", "银两*50000", "粮草*50000"]
    }))
  },
  {
    chapterId: 9,
    chapterName: "征讨廓尔喀",
    totalStage: 10,
    unlockLevel: 80,
    recommendPower: 160000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "廓尔喀王拉纳·巴哈都尔" : `廓尔喀军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 110000 + i * 3500,
      recommendPower: 160000 + i * 4000,
      drop: i === 9
        ? ["大臣经验书*50", "资质丹*25", "名臣: 福康安"]
        : i === 4
          ? ["大臣经验书*25", "银两*300000", "粮草*300000"]
          : ["大臣经验书*18", "银两*60000", "粮草*60000"]
    }))
  },
  {
    chapterId: 10,
    chapterName: "平定回疆",
    totalStage: 10,
    unlockLevel: 90,
    recommendPower: 200000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "大小和卓" : `回疆叛军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 150000 + i * 4000,
      recommendPower: 200000 + i * 5000,
      drop: i === 9
        ? ["大臣经验书*60", "资质丹*30", "后宫: 香妃", "名臣: 兆惠"]
        : i === 4
          ? ["大臣经验书*30", "银两*500000", "粮草*500000"]
          : ["大臣经验书*20", "银两*100000", "粮草*100000"]
    }))
  },
  // 第二板块：历朝风云（11-20章，穿越历朝历代剧情，原版核心玩法）
  {
    chapterId: 11,
    chapterName: "横扫六国",
    totalStage: 10,
    unlockLevel: 100,
    recommendPower: 300000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "秦始皇嬴政" : `六国守军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 200000 + i * 5000,
      recommendPower: 300000 + i * 6000,
      drop: i === 9
        ? ["大臣经验书*80", "资质丹*50", "名臣: 秦始皇", "后宫: 阿房女"]
        : i === 4
          ? ["大臣经验书*40", "银两*800000", "粮草*800000"]
          : ["大臣经验书*25", "银两*150000", "粮草*150000"]
    }))
  },
  {
    chapterId: 12,
    chapterName: "楚汉争霸",
    totalStage: 10,
    unlockLevel: 110,
    recommendPower: 400000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "楚霸王项羽" : `楚军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 300000 + i * 6000,
      recommendPower: 400000 + i * 7000,
      drop: i === 9
        ? ["大臣经验书*100", "资质丹*60", "名臣: 项羽", "后宫: 虞姬"]
        : i === 4
          ? ["大臣经验书*50", "银两*1000000", "粮草*1000000"]
          : ["大臣经验书*30", "银两*200000", "粮草*200000"]
    }))
  },
  {
    chapterId: 13,
    chapterName: "大汉雄风",
    totalStage: 10,
    unlockLevel: 120,
    recommendPower: 550000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "汉武帝刘彻" : `匈奴军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 400000 + i * 7000,
      recommendPower: 550000 + i * 8000,
      drop: i === 9
        ? ["大臣经验书*120", "资质丹*70", "名臣: 汉武帝", "后宫: 卫子夫"]
        : i === 4
          ? ["大臣经验书*60", "银两*1500000", "粮草*1500000"]
          : ["大臣经验书*35", "银两*300000", "粮草*300000"]
    }))
  },
  {
    chapterId: 14,
    chapterName: "三国风云",
    totalStage: 10,
    unlockLevel: 130,
    recommendPower: 700000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "汉昭烈帝刘备" : `魏军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 500000 + i * 8000,
      recommendPower: 700000 + i * 9000,
      drop: i === 9
        ? ["大臣经验书*150", "资质丹*80", "名臣: 刘备", "后宫: 孙尚香"]
        : i === 4
          ? ["大臣经验书*70", "银两*2000000", "粮草*2000000"]
          : ["大臣经验书*40", "银两*400000", "粮草*400000"]
    }))
  },
  {
    chapterId: 15,
    chapterName: "魏晋风骨",
    totalStage: 10,
    unlockLevel: 140,
    recommendPower: 900000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "晋宣帝司马懿" : `吴军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 650000 + i * 9000,
      recommendPower: 900000 + i * 10000,
      drop: i === 9
        ? ["大臣经验书*180", "资质丹*90", "名臣: 司马懿", "后宫: 张春华"]
        : i === 4
          ? ["大臣经验书*80", "银两*2500000", "粮草*2500000"]
          : ["大臣经验书*45", "银两*500000", "粮草*500000"]
    }))
  },
  {
    chapterId: 16,
    chapterName: "盛世大唐",
    totalStage: 10,
    unlockLevel: 150,
    recommendPower: 1100000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "唐太宗李世民" : `突厥军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 800000 + i * 10000,
      recommendPower: 1100000 + i * 12000,
      drop: i === 9
        ? ["大臣经验书*200", "资质丹*100", "名臣: 李世民", "后宫: 长孙皇后"]
        : i === 4
          ? ["大臣经验书*100", "银两*3000000", "粮草*3000000"]
          : ["大臣经验书*50", "银两*600000", "粮草*600000"]
    }))
  },
  {
    chapterId: 17,
    chapterName: "武周天下",
    totalStage: 10,
    unlockLevel: 160,
    recommendPower: 1400000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "圣神皇帝武则天" : `反周军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 1000000 + i * 12000,
      recommendPower: 1400000 + i * 15000,
      drop: i === 9
        ? ["大臣经验书*250", "资质丹*120", "名臣: 武则天", "后宫: 武则天"]
        : i === 4
          ? ["大臣经验书*120", "银两*4000000", "粮草*4000000"]
          : ["大臣经验书*60", "银两*800000", "粮草*800000"]
    }))
  },
  {
    chapterId: 18,
    chapterName: "开元盛世",
    totalStage: 10,
    unlockLevel: 170,
    recommendPower: 1800000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "唐玄宗李隆基" : `吐蕃军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 1300000 + i * 15000,
      recommendPower: 1800000 + i * 18000,
      drop: i === 9
        ? ["大臣经验书*300", "资质丹*150", "名臣: 李隆基", "后宫: 杨玉环"]
        : i === 4
          ? ["大臣经验书*150", "银两*5000000", "粮草*5000000"]
          : ["大臣经验书*80", "银两*1000000", "粮草*1000000"]
    }))
  },
  {
    chapterId: 19,
    chapterName: "大宋江山",
    totalStage: 10,
    unlockLevel: 180,
    recommendPower: 2200000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "宋太祖赵匡胤" : `辽军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 1600000 + i * 18000,
      recommendPower: 2200000 + i * 20000,
      drop: i === 9
        ? ["大臣经验书*350", "资质丹*180", "名臣: 赵匡胤", "后宫: 花蕊夫人"]
        : i === 4
          ? ["大臣经验书*180", "银两*6000000", "粮草*6000000"]
          : ["大臣经验书*100", "银两*1200000", "粮草*1200000"]
    }))
  },
  {
    chapterId: 20,
    chapterName: "精忠报国",
    totalStage: 10,
    unlockLevel: 190,
    recommendPower: 2800000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "金兀术" : `金军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 2000000 + i * 20000,
      recommendPower: 2800000 + i * 25000,
      drop: i === 9
        ? ["大臣经验书*400", "资质丹*200", "名臣: 金兀术", "绝世神兵*1"]
        : i === 4
          ? ["大臣经验书*200", "银两*8000000", "粮草*8000000"]
          : ["大臣经验书*120", "银两*1500000", "粮草*1500000"]
    }))
  },
  // 第三板块：千古一帝（21-30章，终极挑战，原版顶级关卡）
  {
    chapterId: 21,
    chapterName: "一代天骄",
    totalStage: 10,
    unlockLevel: 200,
    recommendPower: 3500000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "成吉思汗" : `蒙古铁骑第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 2500000 + i * 25000,
      recommendPower: 3500000 + i * 30000,
      drop: i === 9
        ? ["大臣经验书*500", "资质丹*300", "名臣: 成吉思汗"]
        : i === 4
          ? ["大臣经验书*250", "银两*10000000", "粮草*10000000"]
          : ["大臣经验书*150", "银两*2000000", "粮草*2000000"]
    }))
  },
  {
    chapterId: 22,
    chapterName: "洪武开国",
    totalStage: 10,
    unlockLevel: 210,
    recommendPower: 4500000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "明太祖朱元璋" : `元军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 3500000 + i * 30000,
      recommendPower: 4500000 + i * 35000,
      drop: i === 9
        ? ["大臣经验书*600", "资质丹*350", "名臣: 朱元璋", "后宫: 马皇后"]
        : i === 4
          ? ["大臣经验书*300", "银两*12000000", "粮草*12000000"]
          : ["大臣经验书*180", "银两*2500000", "粮草*2500000"]
    }))
  },
  {
    chapterId: 23,
    chapterName: "永乐盛世",
    totalStage: 10,
    unlockLevel: 220,
    recommendPower: 5500000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "明成祖朱棣" : `北元军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 4500000 + i * 35000,
      recommendPower: 5500000 + i * 40000,
      drop: i === 9
        ? ["大臣经验书*700", "资质丹*400", "名臣: 朱棣"]
        : i === 4
          ? ["大臣经验书*350", "银两*15000000", "粮草*15000000"]
          : ["大臣经验书*200", "银两*3000000", "粮草*3000000"]
    }))
  },
  {
    chapterId: 24,
    chapterName: "康乾盛世",
    totalStage: 10,
    unlockLevel: 230,
    recommendPower: 7000000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "清圣祖康熙" : `叛军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 5500000 + i * 40000,
      recommendPower: 7000000 + i * 45000,
      drop: i === 9
        ? ["大臣经验书*800", "资质丹*450", "名臣: 康熙"]
        : i === 4
          ? ["大臣经验书*400", "银两*20000000", "粮草*20000000"]
          : ["大臣经验书*250", "银两*4000000", "粮草*4000000"]
    }))
  },
  {
    chapterId: 25,
    chapterName: "十全武功",
    totalStage: 10,
    unlockLevel: 240,
    recommendPower: 9000000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "清高宗乾隆" : `外敌第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 7000000 + i * 45000,
      recommendPower: 9000000 + i * 50000,
      drop: i === 9
        ? ["大臣经验书*900", "资质丹*500", "名臣: 乾隆", "后宫: 香妃(终极)"]
        : i === 4
          ? ["大臣经验书*450", "银两*25000000", "粮草*25000000"]
          : ["大臣经验书*300", "银两*5000000", "粮草*5000000"]
    }))
  },
  {
    chapterId: 26,
    chapterName: "封神之战",
    totalStage: 10,
    unlockLevel: 250,
    recommendPower: 12000000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "姜太公姜子牙" : `商军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 9000000 + i * 50000,
      recommendPower: 12000000 + i * 60000,
      drop: i === 9
        ? ["大臣经验书*1000", "资质丹*600", "名臣: 姜子牙"]
        : i === 4
          ? ["大臣经验书*500", "银两*30000000", "粮草*30000000"]
          : ["大臣经验书*350", "银两*6000000", "粮草*6000000"]
    }))
  },
  {
    chapterId: 27,
    chapterName: "春秋战国",
    totalStage: 10,
    unlockLevel: 260,
    recommendPower: 15000000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "兵圣孙武" : `列国联军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 12000000 + i * 60000,
      recommendPower: 15000000 + i * 70000,
      drop: i === 9
        ? ["大臣经验书*1200", "资质丹*700", "名臣: 孙武", "孙子兵法*1"]
        : i === 4
          ? ["大臣经验书*600", "银两*40000000", "粮草*40000000"]
          : ["大臣经验书*400", "银两*8000000", "粮草*8000000"]
    }))
  },
  {
    chapterId: 28,
    chapterName: "炎黄之战",
    totalStage: 10,
    unlockLevel: 270,
    recommendPower: 20000000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "蚩尤" : `九黎军第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 15000000 + i * 70000,
      recommendPower: 20000000 + i * 80000,
      drop: i === 9
        ? ["大臣经验书*1500", "资质丹*800", "名臣: 蚩尤"]
        : i === 4
          ? ["大臣经验书*750", "银两*50000000", "粮草*50000000"]
          : ["大臣经验书*500", "银两*10000000", "粮草*10000000"]
    }))
  },
  {
    chapterId: 29,
    chapterName: "三界争霸",
    totalStage: 10,
    unlockLevel: 280,
    recommendPower: 30000000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "玉皇大帝" : `天兵天将第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 20000000 + i * 80000,
      recommendPower: 30000000 + i * 100000,
      drop: i === 9
        ? ["大臣经验书*2000", "资质丹*1000", "绝世神器*1"]
        : i === 4
          ? ["大臣经验书*1000", "银两*80000000", "粮草*80000000"]
          : ["大臣经验书*600", "银两*15000000", "粮草*15000000"]
    }))
  },
  {
    chapterId: 30,
    chapterName: "千古一帝",
    totalStage: 10,
    unlockLevel: 290,
    recommendPower: 50000000,
    stageList: Array.from({ length: 10 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 9 ? "终极BOSS: 历代帝王联军" : `帝王近卫第${i + 1}营`,
      isElite: i === 4,
      isBoss: i === 9,
      enemyPower: 30000000 + i * 100000,
      recommendPower: 50000000 + i * 200000,
      drop: i === 9
        ? ["大臣经验书*5000", "资质丹*3000", "全图鉴名臣解锁", "全图鉴后宫解锁", "千古一帝称号"]
        : i === 4
          ? ["大臣经验书*2000", "银两*100000000", "粮草*100000000"]
          : ["大臣经验书*1000", "银两*20000000", "粮草*20000000"]
    }))
  }
]

// ==================== 征战关卡配置（参考原版征战天下玩法，10大地图200关）====================
/**
 * 征战章节规则：
 * 1. 10大历史地图，每个地图20关，总计200关
 * 2. 每个地图：16普通关 + 3精英关 + 1最终BOSS关
 * 3. 核心机制：消耗士兵出征，胜利获得战功，战功提升军衔，军衔有全局国力加成
 * 4. 通关地图解锁对应藩属国，每日可领取纳贡奖励
 */
export const expeditionStageConfig = [
  {
    mapId: 1,
    mapName: "平定三藩",
    totalStage: 20,
    unlockPower: 5000,
    soldierCostPerStage: 1000,
    tributaryUnlock: "三藩",
    stageList: Array.from({ length: 20 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 19 ? "终极BOSS: 吴三桂" : i >= 16 ? `叛军精锐第${i - 15}营` : `叛军第${i + 1}营`,
      isElite: i >= 16 && i <= 18,
      isBoss: i === 19,
      enemyPower: 3000 + i * 1000,
      recommendPower: 5000 + i * 1200,
      soldierCost: 1000 + i * 200,
      warExpDrop: 100 + i * 50,
      drop: i === 19
        ? ["战功*10000", "名臣: 吴三桂", "藩属国: 三藩解锁"]
        : i >= 16
          ? ["战功*2000", "军资*50000", "装备碎片*5"]
          : ["战功*500", "军资*10000", "士兵*5000"]
    }))
  },
  {
    mapId: 2,
    mapName: "收复台湾",
    totalStage: 20,
    unlockPower: 30000,
    soldierCostPerStage: 5000,
    tributaryUnlock: "台湾",
    stageList: Array.from({ length: 20 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 19 ? "终极BOSS: 郑成功" : i >= 16 ? `水师精锐第${i - 15}营` : `水师第${i + 1}营`,
      isElite: i >= 16 && i <= 18,
      isBoss: i === 19,
      enemyPower: 20000 + i * 2000,
      recommendPower: 30000 + i * 2500,
      soldierCost: 5000 + i * 500,
      warExpDrop: 300 + i * 100,
      drop: i === 19
        ? ["战功*20000", "名臣: 郑成功", "藩属国: 台湾解锁"]
        : i >= 16
          ? ["战功*4000", "军资*100000", "装备碎片*10"]
          : ["战功*1000", "军资*20000", "士兵*10000"]
    }))
  },
  {
    mapId: 3,
    mapName: "雅克萨之战",
    totalStage: 20,
    unlockPower: 80000,
    soldierCostPerStage: 10000,
    tributaryUnlock: "沙俄",
    stageList: Array.from({ length: 20 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 19 ? "终极BOSS: 托尔布津" : i >= 16 ? `俄军精锐第${i - 15}营` : `俄军第${i + 1}营`,
      isElite: i >= 16 && i <= 18,
      isBoss: i === 19,
      enemyPower: 60000 + i * 3000,
      recommendPower: 80000 + i * 3500,
      soldierCost: 10000 + i * 800,
      warExpDrop: 500 + i * 150,
      drop: i === 19
        ? ["战功*30000", "名臣: 托尔布津", "藩属国: 沙俄解锁"]
        : i >= 16
          ? ["战功*6000", "军资*200000", "装备碎片*15"]
          : ["战功*1500", "军资*30000", "士兵*15000"]
    }))
  },
  {
    mapId: 4,
    mapName: "平定准噶尔",
    totalStage: 20,
    unlockPower: 150000,
    soldierCostPerStage: 20000,
    tributaryUnlock: "准噶尔",
    stageList: Array.from({ length: 20 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 19 ? "终极BOSS: 噶尔丹" : i >= 16 ? `蒙古精锐第${i - 15}营` : `蒙古军第${i + 1}营`,
      isElite: i >= 16 && i <= 18,
      isBoss: i === 19,
      enemyPower: 100000 + i * 4000,
      recommendPower: 150000 + i * 4500,
      soldierCost: 20000 + i * 1000,
      warExpDrop: 800 + i * 200,
      drop: i === 19
        ? ["战功*50000", "名臣: 噶尔丹", "藩属国: 准噶尔解锁"]
        : i >= 16
          ? ["战功*10000", "军资*300000", "装备碎片*20"]
          : ["战功*2000", "军资*50000", "士兵*20000"]
    }))
  },
  {
    mapId: 5,
    mapName: "征讨缅甸",
    totalStage: 20,
    unlockPower: 300000,
    soldierCostPerStage: 50000,
    tributaryUnlock: "缅甸",
    stageList: Array.from({ length: 20 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 19 ? "终极BOSS: 缅甸王莽白" : i >= 16 ? `缅军精锐第${i - 15}营` : `缅军第${i + 1}营`,
      isElite: i >= 16 && i <= 18,
      isBoss: i === 19,
      enemyPower: 200000 + i * 5000,
      recommendPower: 300000 + i * 6000,
      soldierCost: 50000 + i * 2000,
      warExpDrop: 1000 + i * 300,
      drop: i === 19
        ? ["战功*80000", "名臣: 莽白", "藩属国: 缅甸解锁"]
        : i >= 16
          ? ["战功*15000", "军资*500000", "装备碎片*25"]
          : ["战功*3000", "军资*80000", "士兵*30000"]
    }))
  },
  {
    mapId: 6,
    mapName: "征讨安南",
    totalStage: 20,
    unlockPower: 600000,
    soldierCostPerStage: 100000,
    tributaryUnlock: "安南",
    stageList: Array.from({ length: 20 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 19 ? "终极BOSS: 安南王黎维祁" : i >= 16 ? `安南精锐第${i - 15}营` : `安南军第${i + 1}营`,
      isElite: i >= 16 && i <= 18,
      isBoss: i === 19,
      enemyPower: 400000 + i * 6000,
      recommendPower: 600000 + i * 7000,
      soldierCost: 100000 + i * 3000,
      warExpDrop: 1500 + i * 400,
      drop: i === 19
        ? ["战功*100000", "名臣: 黎维祁", "藩属国: 安南解锁"]
        : i >= 16
          ? ["战功*20000", "军资*800000", "装备碎片*30"]
          : ["战功*5000", "军资*100000", "士兵*50000"]
    }))
  },
  {
    mapId: 7,
    mapName: "征讨廓尔喀",
    totalStage: 20,
    unlockPower: 1200000,
    soldierCostPerStage: 200000,
    tributaryUnlock: "廓尔喀",
    stageList: Array.from({ length: 20 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 19 ? "终极BOSS: 拉纳·巴哈都尔" : i >= 16 ? `廓尔喀精锐第${i - 15}营` : `廓尔喀军第${i + 1}营`,
      isElite: i >= 16 && i <= 18,
      isBoss: i === 19,
      enemyPower: 800000 + i * 8000,
      recommendPower: 1200000 + i * 10000,
      soldierCost: 200000 + i * 5000,
      warExpDrop: 2000 + i * 500,
      drop: i === 19
        ? ["战功*150000", "名臣: 福康安", "藩属国: 廓尔喀解锁"]
        : i >= 16
          ? ["战功*30000", "军资*1000000", "装备碎片*40"]
          : ["战功*8000", "军资*200000", "士兵*80000"]
    }))
  },
  {
    mapId: 8,
    mapName: "平定回疆",
    totalStage: 20,
    unlockPower: 2500000,
    soldierCostPerStage: 500000,
    tributaryUnlock: "回疆",
    stageList: Array.from({ length: 20 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 19 ? "终极BOSS: 大小和卓" : i >= 16 ? `回疆精锐第${i - 15}营` : `回疆军第${i + 1}营`,
      isElite: i >= 16 && i <= 18,
      isBoss: i === 19,
      enemyPower: 1800000 + i * 10000,
      recommendPower: 2500000 + i * 12000,
      soldierCost: 500000 + i * 10000,
      warExpDrop: 3000 + i * 800,
      drop: i === 19
        ? ["战功*200000", "名臣: 兆惠", "藩属国: 回疆解锁"]
        : i >= 16
          ? ["战功*50000", "军资*2000000", "装备碎片*50"]
          : ["战功*10000", "军资*300000", "士兵*100000"]
    }))
  },
  {
    mapId: 9,
    mapName: "远征沙俄",
    totalStage: 20,
    unlockPower: 5000000,
    soldierCostPerStage: 1000000,
    tributaryUnlock: "俄罗斯",
    stageList: Array.from({ length: 20 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 19 ? "终极BOSS: 彼得大帝" : i >= 16 ? `俄军近卫第${i - 15}营` : `俄军第${i + 1}营`,
      isElite: i >= 16 && i <= 18,
      isBoss: i === 19,
      enemyPower: 3500000 + i * 15000,
      recommendPower: 5000000 + i * 20000,
      soldierCost: 1000000 + i * 20000,
      warExpDrop: 5000 + i * 1000,
      drop: i === 19
        ? ["战功*500000", "名臣: 彼得大帝", "藩属国: 俄罗斯解锁"]
        : i >= 16
          ? ["战功*100000", "军资*5000000", "绝世装备碎片*10"]
          : ["战功*20000", "军资*500000", "士兵*200000"]
    }))
  },
  {
    mapId: 10,
    mapName: "远征欧亚",
    totalStage: 20,
    unlockPower: 10000000,
    soldierCostPerStage: 2000000,
    tributaryUnlock: "欧亚藩属",
    stageList: Array.from({ length: 20 }, (_, i) => ({
      stageId: i + 1,
      stageName: i === 19 ? "终极BOSS: 欧洲联军" : i >= 16 ? `联军精锐第${i - 15}营` : `联军第${i + 1}营`,
      isElite: i >= 16 && i <= 18,
      isBoss: i === 19,
      enemyPower: 8000000 + i * 20000,
      recommendPower: 10000000 + i * 30000,
      soldierCost: 2000000 + i * 50000,
      warExpDrop: 10000 + i * 2000,
      drop: i === 19
        ? ["战功*1000000", "全图鉴名臣解锁", "天下共主称号", "全藩属国解锁"]
        : i >= 16
          ? ["战功*200000", "军资*10000000", "绝世装备*1"]
          : ["战功*50000", "军资*1000000", "士兵*500000"]
    }))
  }
]

// ==================== 军衔系统配置（原版核心机制）====================
export const militaryRankConfig = [
  { rankId: 1, rankName: "从九品校尉", warExpRequired: 0, powerBonus: 0.01 },
  { rankId: 2, rankName: "正九品校尉", warExpRequired: 10000, powerBonus: 0.02 },
  { rankId: 3, rankName: "从八品副尉", warExpRequired: 30000, powerBonus: 0.03 },
  { rankId: 4, rankName: "正八品副尉", warExpRequired: 60000, powerBonus: 0.04 },
  { rankId: 5, rankName: "从七品都尉", warExpRequired: 100000, powerBonus: 0.05 },
  { rankId: 6, rankName: "正七品都尉", warExpRequired: 150000, powerBonus: 0.06 },
  { rankId: 7, rankName: "从六品游击", warExpRequired: 250000, powerBonus: 0.08 },
  { rankId: 8, rankName: "正六品游击", warExpRequired: 400000, powerBonus: 0.1 },
  { rankId: 9, rankName: "从五品参将", warExpRequired: 600000, powerBonus: 0.12 },
  { rankId: 10, rankName: "正五品参将", warExpRequired: 1000000, powerBonus: 0.15 },
  { rankId: 11, rankName: "从四品副将", warExpRequired: 1500000, powerBonus: 0.18 },
  { rankId: 12, rankName: "正四品副将", warExpRequired: 2500000, powerBonus: 0.2 },
  { rankId: 13, rankName: "从三品总兵", warExpRequired: 4000000, powerBonus: 0.25 },
  { rankId: 14, rankName: "正三品总兵", warExpRequired: 6000000, powerBonus: 0.3 },
  { rankId: 15, rankName: "从二品提督", warExpRequired: 10000000, powerBonus: 0.35 },
  { rankId: 16, rankName: "正二品提督", warExpRequired: 15000000, powerBonus: 0.4 },
  { rankId: 17, rankName: "从一品将军", warExpRequired: 25000000, powerBonus: 0.5 },
  { rankId: 18, rankName: "正一品将军", warExpRequired: 50000000, powerBonus: 0.6 },
  { rankId: 19, rankName: "镇国大将军", warExpRequired: 100000000, powerBonus: 0.8 },
  { rankId: 20, rankName: "天下兵马大元帅", warExpRequired: 500000000, powerBonus: 1.0 },
]

// 获取当前军衔信息
export const getMilitaryRank = (warExp) => {
  for (let i = militaryRankConfig.length - 1; i >= 0; i--) {
    if (warExp >= militaryRankConfig[i].warExpRequired) {
      return militaryRankConfig[i]
    }
  }
  return militaryRankConfig[0]
}