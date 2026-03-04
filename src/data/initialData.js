// 初始自带大臣（5个，原有2个+新增3个）
export const initialMinisters = [
  { id: 1, name: '和珅', level: 1, power: 100, politics: 95, military: 70, desc: '清朝权臣，精通理财，深谙圣心', unlockType: 'initial', isInitial: true },
  { id: 2, name: '纪晓岚', level: 1, power: 90, politics: 90, military: 60, desc: '大清第一才子，铁齿铜牙，刚正不阿', unlockType: 'initial', isInitial: true },
  { id: 3, name: '刘墉', level: 1, power: 85, politics: 92, military: 65, desc: '刘罗锅，清正廉明，百姓爱戴的好官', unlockType: 'initial', isInitial: true },
  { id: 4, name: '张廷玉', level: 1, power: 88, politics: 93, military: 62, desc: '三朝元老，配享太庙，清朝文臣之最', unlockType: 'initial', isInitial: true },
  { id: 5, name: '年羹尧', level: 1, power: 95, politics: 70, military: 98, desc: '抚远大将军，平定西北，战功赫赫', unlockType: 'initial', isInitial: true }
]

// 寻访解锁大臣（12个，微服私访随机解锁）
export const searchMinisters = [
  // 文官组
  { id: 6, name: '包拯', level: 1, power: 90, politics: 98, military: 65, desc: '包青天，铁面无私，断案如神，千古清官', unlockType: 'search' },
  { id: 7, name: '狄仁杰', level: 1, power: 92, politics: 96, military: 72, desc: '大唐神探，断案无双，辅佐武周开创盛世', unlockType: 'search' },
  { id: 8, name: '张居正', level: 1, power: 94, politics: 99, military: 70, desc: '大明首辅，一条鞭法，挽救大明于危难', unlockType: 'search' },
  { id: 9, name: '王安石', level: 1, power: 88, politics: 95, military: 68, desc: '北宋名相，熙宁变法，唐宋八大家之一', unlockType: 'search' },
  { id: 10, name: '房玄龄', level: 1, power: 90, politics: 97, military: 70, desc: '贞观名相，筹谋帷幄，定大唐社稷', unlockType: 'search' },
  { id: 11, name: '杜如晦', level: 1, power: 89, politics: 96, military: 69, desc: '房谋杜断，善断大事，贞观之治核心功臣', unlockType: 'search' },
  // 武将组
  { id: 12, name: '岳飞', level: 1, power: 98, politics: 80, military: 100, desc: '精忠报国，抗金名将，民族英雄', unlockType: 'search' },
  { id: 13, name: '韩信', level: 1, power: 99, politics: 75, military: 100, desc: '兵仙，国士无双，助刘邦定大汉天下', unlockType: 'search' },
  { id: 14, name: '卫青', level: 1, power: 95, politics: 78, military: 98, desc: '大汉名将，七战七捷，收复河朔，大破匈奴', unlockType: 'search' },
  { id: 15, name: '霍去病', level: 1, power: 97, politics: 72, military: 99, desc: '封狼居胥，冠军侯，大汉战神，少年成名', unlockType: 'search' },
  { id: 16, name: '李靖', level: 1, power: 96, politics: 82, military: 98, desc: '大唐军神，平萧铣，灭东突厥，定吐谷浑', unlockType: 'search' },
  { id: 17, name: '徐达', level: 1, power: 94, politics: 76, military: 97, desc: '明朝开国第一功臣，灭元大都，百战百胜', unlockType: 'search' }
]

// 副本通关解锁大臣（30个，每10关解锁1个，对应副本1-30章）
export const battleMinisters = [
  // 第1章 定鼎燕京 10关解锁
  { id: 43, name: '多尔衮', level: 1, power: 105, politics: 90, military: 98, desc: '大清摄政王，定鼎燕京，一统中原的第一功臣', unlockType: 'battle', unlockLevel: 10 },
  // 第2章 平定江南 20关解锁
  { id: 44, name: '洪承畴', level: 1, power: 110, politics: 95, military: 92, desc: '明末清初重臣，平定江南的核心谋臣', unlockType: 'battle', unlockLevel: 20 },
  // 第3章 平定三藩 30关解锁
  { id: 45, name: '吴三桂', level: 1, power: 115, politics: 75, military: 100, desc: '平西王，明末清初的传奇将领，镇守云南', unlockType: 'battle', unlockLevel: 30 },
  // 第4章 收复台湾 40关解锁
  { id: 18, name: '郑成功', level: 1, power: 120, politics: 85, military: 102, desc: '民族英雄，收复台湾，开疆拓土的延平王', unlockType: 'battle', unlockLevel: 40 },
  // 第5章 雅克萨之战 50关解锁
  { id: 46, name: '萨布素', level: 1, power: 125, politics: 80, military: 105, desc: '黑龙江将军，雅克萨之战大败沙俄的名将', unlockType: 'battle', unlockLevel: 50 },
  // 第6章 平定准噶尔 60关解锁
  { id: 47, name: '噶尔丹', level: 1, power: 130, politics: 78, military: 108, desc: '准噶尔汗，雄踞西北，与大清分庭抗礼的草原枭雄', unlockType: 'battle', unlockLevel: 60 },
  // 第7章 征讨缅甸 70关解锁
  { id: 48, name: '傅恒', level: 1, power: 135, politics: 92, military: 106, desc: '乾隆朝首席军机大臣，征讨缅甸的统帅', unlockType: 'battle', unlockLevel: 70 },
  // 第8章 征讨安南 80关解锁
  { id: 49, name: '福康安', level: 1, power: 140, politics: 88, military: 110, desc: '乾隆朝名将，平定廓尔喀，征讨安南的常胜将军', unlockType: 'battle', unlockLevel: 80 },
  // 第9章 征讨廓尔喀 90关解锁
  { id: 50, name: '海兰察', level: 1, power: 145, politics: 75, military: 115, desc: '乾隆朝第一猛将，索伦勇士，身经百战未尝一败', unlockType: 'battle', unlockLevel: 90 },
  // 第10章 平定回疆 100关解锁
  { id: 51, name: '兆惠', level: 1, power: 150, politics: 82, military: 118, desc: '乾隆朝名将，平定回疆，统一西域的功勋之臣', unlockType: 'battle', unlockLevel: 100 },
  // 第11章 横扫六国 110关解锁
  { id: 20, name: '王翦', level: 1, power: 160, politics: 85, military: 120, desc: '战国四大名将，助秦始皇横扫六合，一统天下', unlockType: 'battle', unlockLevel: 110 },
  // 第12章 楚汉争霸 120关解锁
  { id: 13, name: '韩信', level: 1, power: 170, politics: 75, military: 125, desc: '兵仙，国士无双，助刘邦定大汉天下', unlockType: 'battle', unlockLevel: 120 },
  // 第13章 大汉雄风 130关解锁
  { id: 14, name: '卫青', level: 1, power: 180, politics: 88, military: 128, desc: '大汉名将，七战七捷，收复河朔，大破匈奴', unlockType: 'battle', unlockLevel: 130 },
  // 第14章 三国风云 140关解锁
  { id: 23, name: '关羽', level: 1, power: 190, politics: 80, military: 130, desc: '武圣，忠义无双，过五关斩六将，威震华夏', unlockType: 'battle', unlockLevel: 140 },
  // 第15章 魏晋风骨 150关解锁
  { id: 29, name: '司马懿', level: 1, power: 200, politics: 100, military: 125, desc: '晋宣帝，三国最终的赢家，隐忍数十年终成霸业', unlockType: 'battle', unlockLevel: 150 },
  // 第16章 盛世大唐 160关解锁
  { id: 16, name: '李靖', level: 1, power: 210, politics: 92, military: 135, desc: '大唐军神，平萧铣，灭东突厥，定吐谷浑', unlockType: 'battle', unlockLevel: 160 },
  // 第17章 武周天下 170关解锁
  { id: 52, name: '狄仁杰', level: 1, power: 220, politics: 100, military: 95, desc: '大唐神探，断案无双，辅佐武周开创盛世', unlockType: 'battle', unlockLevel: 170 },
  // 第18章 开元盛世 180关解锁
  { id: 53, name: '郭子仪', level: 1, power: 230, politics: 95, military: 138, desc: '再造大唐，平定安史之乱，单骑退回纥的传奇名将', unlockType: 'battle', unlockLevel: 180 },
  // 第19章 大宋江山 190关解锁
  { id: 29, name: '赵匡胤', level: 1, power: 240, politics: 98, military: 140, desc: '宋太祖，黄袍加身，陈桥兵变，开创大宋三百年江山', unlockType: 'battle', unlockLevel: 190 },
  // 第20章 精忠报国 200关解锁
  { id: 12, name: '岳飞', level: 1, power: 250, politics: 85, military: 150, desc: '精忠报国，抗金名将，民族英雄', unlockType: 'battle', unlockLevel: 200 },
  // 第21章 一代天骄 210关解锁
  { id: 42, name: '成吉思汗', level: 1, power: 300, politics: 90, military: 200, desc: '一代天骄，成吉思汗，征服欧亚，世界征服者', unlockType: 'battle', unlockLevel: 210 },
  // 第22章 洪武开国 220关解锁
  { id: 17, name: '徐达', level: 1, power: 320, politics: 88, military: 210, desc: '明朝开国第一功臣，灭元大都，百战百胜', unlockType: 'battle', unlockLevel: 220 },
  // 第23章 永乐盛世 230关解锁
  { id: 54, name: '朱棣', level: 1, power: 350, politics: 95, military: 220, desc: '明成祖，永乐大帝，五征蒙古，郑和下西洋，开创永乐盛世', unlockType: 'battle', unlockLevel: 230 },
  // 第24章 康乾盛世 240关解锁
  { id: 55, name: '康熙', level: 1, power: 380, politics: 100, military: 230, desc: '清圣祖康熙，擒鳌拜，平三藩，收台湾，开创康乾盛世', unlockType: 'battle', unlockLevel: 240 },
  // 第25章 十全武功 250关解锁
  { id: 56, name: '乾隆', level: 1, power: 400, politics: 98, military: 225, desc: '清高宗乾隆，十全武功，康乾盛世的巅峰帝王', unlockType: 'battle', unlockLevel: 250 },
  // 第26章 封神之战 260关解锁
  { id: 41, name: '姜子牙', level: 1, power: 450, politics: 100, military: 250, desc: '太公钓鱼，愿者上钩，百家宗师，武圣', unlockType: 'battle', unlockLevel: 260 },
  // 第27章 春秋战国 270关解锁
  { id: 40, name: '孙武', level: 1, power: 500, politics: 95, military: 300, desc: '兵圣，孙子兵法，百世兵家之师', unlockType: 'battle', unlockLevel: 270 },
  // 第28章 炎黄之战 280关解锁
  { id: 57, name: '蚩尤', level: 1, power: 600, politics: 70, military: 400, desc: '上古兵主，九黎部落首领，铜头铁额，百战百胜', unlockType: 'battle', unlockLevel: 280 },
  // 第29章 三界争霸 290关解锁
  { id: 58, name: '玉皇大帝', level: 1, power: 800, politics: 100, military: 500, desc: '三界至尊，万天帝主，掌管天庭三界', unlockType: 'battle', unlockLevel: 290 },
  // 第30章 千古一帝 300关解锁
  { id: 59, name: '秦始皇', level: 1, power: 1000, politics: 100, military: 600, desc: '始皇帝，横扫六合，一统天下，千古一帝', unlockType: 'battle', unlockLevel: 300 },
]

// VIP专属解锁大臣
export const vipMinisters = [
  { id: 30, name: '程咬金', level: 1, power: 85, politics: 65, military: 90, desc: '混世魔王，大唐开国猛将，福将', unlockType: 'vip', unlockLevel: 2 },
  { id: 31, name: '秦琼', level: 1, power: 88, politics: 70, military: 93, desc: '山东秦叔宝，赛专诸，似孟尝，门神之一', unlockType: 'vip', unlockLevel: 4 },
  { id: 32, name: '尉迟恭', level: 1, power: 90, politics: 68, military: 95, desc: '尉迟敬德，单鞭救主，门神之一', unlockType: 'vip', unlockLevel: 6 },
  { id: 33, name: '薛仁贵', level: 1, power: 93, politics: 72, military: 97, desc: '白袍小将，三箭定天山，大破高句丽', unlockType: 'vip', unlockLevel: 8 },
  { id: 34, name: '刘伯温', level: 1, power: 95, politics: 99, military: 80, desc: '三分天下诸葛亮，一统江山刘伯温，明朝开国军师', unlockType: 'vip', unlockLevel: 10 },
  { id: 35, name: '常遇春', level: 1, power: 96, politics: 70, military: 98, desc: '常十万，明朝开国猛将，百战百胜', unlockType: 'vip', unlockLevel: 12 },
  { id: 36, name: '郭子仪', level: 1, power: 97, politics: 90, military: 98, desc: '再造大唐，平定安史之乱，单骑退回纥', unlockType: 'vip', unlockLevel: 14 },
  { id: 37, name: '李光弼', level: 1, power: 95, politics: 85, military: 97, desc: '中兴名将，平定安史之乱，战功第一', unlockType: 'vip', unlockLevel: 16 },
  { id: 38, name: '范仲淹', level: 1, power: 92, politics: 98, military: 82, desc: '先天下之忧而忧，后天下之乐而乐，北宋名臣', unlockType: 'vip', unlockLevel: 18 },
  { id: 39, name: '辛弃疾', level: 1, power: 94, politics: 90, military: 95, desc: '词中之龙，金戈铁马，气吞万里如虎', unlockType: 'vip', unlockLevel: 19 },
  { id: 40, name: '孙武', level: 1, power: 100, politics: 95, military: 100, desc: '兵圣，孙子兵法，百世兵家之师', unlockType: 'vip', unlockLevel: 20 },
  { id: 41, name: '姜子牙', level: 1, power: 100, politics: 100, military: 100, desc: '太公钓鱼，愿者上钩，百家宗师，武圣', unlockType: 'vip', unlockLevel: 15 }
]

// 纳贡解锁大臣
export const tributeMinisters = [
  { id: 42, name: '成吉思汗', level: 1, power: 100, politics: 90, military: 100, desc: '一代天骄，成吉思汗，征服欧亚，世界征服者', unlockType: 'tribute', unlockLevel: 30 }
]

// 初始自带后宫
export const initialHarem = [
  { id: 1, name: '孝贤纯皇后', level: 1, favor: 100, charm: 95, talent: 90, desc: '原配正宫皇后，端庄贤淑，母仪天下', unlockType: 'initial', isInitial: true },
  { id: 2, name: '令贵妃', level: 1, favor: 80, charm: 92, talent: 88, desc: '温柔婉约，聪慧过人，深得圣宠', unlockType: 'initial', isInitial: true }
]

// 寻访解锁后宫
export const searchHarem = [
  { id: 3, name: '夏雨荷', charm: 92, talent: 85, desc: '江南水乡的温婉佳人，一见倾心', unlockType: 'search' },
  { id: 4, name: '林黛玉', charm: 95, talent: 98, desc: '潇湘妃子，才情绝世，弱柳扶风', unlockType: 'search' },
  { id: 5, name: '薛宝钗', charm: 90, talent: 92, desc: '蘅芜君，端庄大气，才德兼备', unlockType: 'search' },
  { id: 6, name: '西施', charm: 100, talent: 88, desc: '四大美女之沉鱼，浣纱佳人', unlockType: 'search' },
  { id: 7, name: '王昭君', charm: 98, talent: 90, desc: '四大美女之落雁，远嫁塞外的明妃', unlockType: 'search' },
  { id: 8, name: '貂蝉', charm: 99, talent: 86, desc: '四大美女之闭月，绝世舞姬，风华绝代', unlockType: 'search' },
  { id: 9, name: '杨玉环', charm: 97, talent: 93, desc: '四大美女之羞花，霓裳羽衣，倾国倾城', unlockType: 'search' },
  { id: 10, name: '柳如是', charm: 94, talent: 96, desc: '秦淮八艳之首，风骨嶒峻，才情卓绝', unlockType: 'search' },
  { id: 11, name: '董小宛', charm: 93, talent: 94, desc: '秦淮八艳，温柔娴静，善解人意', unlockType: 'search' },
  { id: 12, name: '陈圆圆', charm: 96, talent: 89, desc: '秦淮八艳，声甲天下之声，色甲天下之色', unlockType: 'search' },
  { id: 13, name: '李香君', charm: 91, talent: 95, desc: '秦淮八艳，桃花扇底送南朝，气节凛然', unlockType: 'search' },
  { id: 14, name: '卓文君', charm: 89, talent: 97, desc: '蜀中才女，愿得一心人，白首不相离', unlockType: 'search' },
  { id: 15, name: '蔡文姬', charm: 88, talent: 99, desc: '汉末才女，胡笳十八拍，千古留名', unlockType: 'search' },
  { id: 16, name: '上官婉儿', charm: 90, talent: 98, desc: '巾帼宰相，称量天下士，才华横溢', unlockType: 'search' },
  { id: 17, name: '李清照', charm: 87, talent: 100, desc: '千古第一才女，词压江南，文盖塞北', unlockType: 'search' }
]

// 副本通关解锁后宫（30个，每10关解锁1个，对应副本1-30章）
export const battleHarem = [
  // 第1章 定鼎燕京 10关解锁
  { id: 46, name: '大玉儿', charm: 92, talent: 88, desc: '孝庄文皇后，清初杰出的女政治家，一生辅佐三代帝王', unlockType: 'battle', unlockLevel: 10 },
  // 第2章 平定江南 20关解锁
  { id: 47, name: '董鄂妃', charm: 93, talent: 89, desc: '顺治帝一生挚爱，温柔贤淑，宠冠后宫', unlockType: 'battle', unlockLevel: 20 },
  // 第3章 平定三藩 30关解锁
  { id: 18, name: '香妃', charm: 94, talent: 87, desc: '身带异香，能引蝶起舞，西域绝色', unlockType: 'battle', unlockLevel: 30 },
  // 第4章 收复台湾 40关解锁
  { id: 48, name: '郑宜娘', charm: 92, talent: 90, desc: '延平王郑成功之妹，文武双全的台湾奇女子', unlockType: 'battle', unlockLevel: 40 },
  // 第5章 雅克萨之战 50关解锁
  { id: 49, name: '索菲亚公主', charm: 95, talent: 91, desc: '沙俄摄政公主，美艳与野心并存的传奇女性', unlockType: 'battle', unlockLevel: 50 },
  // 第6章 平定准噶尔 60关解锁
  { id: 23, name: '赵飞燕', charm: 97, talent: 90, desc: '掌中舞罢箫声绝，三十六宫秋夜长', unlockType: 'battle', unlockLevel: 60 },
  // 第7章 征讨缅甸 70关解锁
  { id: 24, name: '赵合德', charm: 96, talent: 88, desc: '温柔乡英雄冢，媚术无双', unlockType: 'battle', unlockLevel: 70 },
  // 第8章 征讨安南 80关解锁
  { id: 50, name: '黎氏玉瑶', charm: 93, talent: 89, desc: '安南王嫡女，温婉动人的南国佳人', unlockType: 'battle', unlockLevel: 80 },
  // 第9章 征讨廓尔喀 90关解锁
  { id: 26, name: '冯小怜', charm: 95, talent: 86, desc: '玉体横陈，北齐第一美人', unlockType: 'battle', unlockLevel: 90 },
  // 第10章 平定回疆 100关解锁
  { id: 27, name: '武则天', charm: 99, talent: 100, desc: '一代女皇，日月当空，智略过人', unlockType: 'battle', unlockLevel: 100 },
  // 第11章 横扫六国 110关解锁
  { id: 51, name: '阿房女', charm: 98, talent: 92, desc: '秦始皇一生挚爱，赵国邯郸绝色佳人', unlockType: 'battle', unlockLevel: 110 },
  // 第12章 楚汉争霸 120关解锁
  { id: 52, name: '虞姬', charm: 99, talent: 93, desc: '霸王项羽的红颜知己，垓下一曲千古留名', unlockType: 'battle', unlockLevel: 120 },
  // 第13章 大汉雄风 130关解锁
  { id: 28, name: '卫子夫', charm: 91, talent: 89, desc: '大汉贤后，恭谨谦和，母仪天下', unlockType: 'battle', unlockLevel: 130 },
  // 第14章 三国风云 140关解锁
  { id: 53, name: '孙尚香', charm: 94, talent: 92, desc: '东吴郡主，刘备之妻，才捷刚猛，有诸兄之风', unlockType: 'battle', unlockLevel: 140 },
  // 第15章 魏晋风骨 150关解锁
  { id: 54, name: '张春华', charm: 92, talent: 95, desc: '司马懿正妻，智慧过人，辅佐司马家族成就霸业', unlockType: 'battle', unlockLevel: 150 },
  // 第16章 盛世大唐 160关解锁
  { id: 30, name: '长孙皇后', charm: 92, talent: 91, desc: '千古贤后，辅佐太宗开创贞观之治', unlockType: 'battle', unlockLevel: 160 },
  // 第17章 武周天下 170关解锁
  { id: 55, name: '上官婉儿', charm: 90, talent: 98, desc: '巾帼宰相，称量天下士，才华横溢', unlockType: 'battle', unlockLevel: 170 },
  // 第18章 开元盛世 180关解锁
  { id: 25, name: '杨贵妃', charm: 97, talent: 93, desc: '回眸一笑百媚生，六宫粉黛无颜色', unlockType: 'battle', unlockLevel: 180 },
  // 第19章 大宋江山 190关解锁
  { id: 56, name: '花蕊夫人', charm: 95, talent: 94, desc: '后蜀主孟昶的妃子，才华与美貌并存', unlockType: 'battle', unlockLevel: 190 },
  // 第20章 精忠报国 200关解锁
  { id: 57, name: '梁红玉', charm: 93, talent: 92, desc: '南宋抗金女英雄，击鼓退金兵，巾帼不让须眉', unlockType: 'battle', unlockLevel: 200 },
  // 第21章 一代天骄 210关解锁
  { id: 58, name: '孛儿帖', charm: 96, talent: 95, desc: '成吉思汗正妻，蒙古帝国的开国皇后，贤明睿智', unlockType: 'battle', unlockLevel: 210 },
  // 第22章 洪武开国 220关解锁
  { id: 59, name: '马皇后', charm: 90, talent: 96, desc: '明太祖朱元璋的结发妻子，一代贤后', unlockType: 'battle', unlockLevel: 220 },
  // 第23章 永乐盛世 230关解锁
  { id: 60, name: '徐皇后', charm: 91, talent: 93, desc: '明成祖朱棣的皇后，徐达之女，仁孝贤明', unlockType: 'battle', unlockLevel: 230 },
  // 第24章 康乾盛世 240关解锁
  { id: 61, name: '赫舍里皇后', charm: 94, talent: 92, desc: '康熙皇帝的原配皇后，辅政大臣索尼之孙女', unlockType: 'battle', unlockLevel: 240 },
  // 第25章 十全武功 250关解锁
  { id: 62, name: '容妃', charm: 96, talent: 90, desc: '乾隆皇帝的宠妃，来自西域的绝色佳人', unlockType: 'battle', unlockLevel: 250 },
  // 第26章 封神之战 260关解锁
  { id: 63, name: '妲己', charm: 100, talent: 95, desc: '千年狐妖，商纣王的宠妃，绝世妖姬', unlockType: 'battle', unlockLevel: 260 },
  // 第27章 春秋战国 270关解锁
  { id: 64, name: '西施', charm: 100, talent: 88, desc: '四大美女之沉鱼，浣纱佳人', unlockType: 'battle', unlockLevel: 270 },
  // 第28章 炎黄之战 280关解锁
  { id: 65, name: '九天玄女', charm: 100, talent: 100, desc: '上古女神，传授兵法于黄帝，助其战胜蚩尤', unlockType: 'battle', unlockLevel: 280 },
  // 第29章 三界争霸 290关解锁
  { id: 66, name: '王母娘娘', charm: 100, talent: 100, desc: '三界女仙之首，瑶池金母，掌管昆仑仙岛', unlockType: 'battle', unlockLevel: 290 },
  // 第30章 千古一帝 300关解锁
  { id: 67, name: '女娲娘娘', charm: 100, talent: 100, desc: '上古创世女神，抟土造人，炼石补天，万灵之母', unlockType: 'battle', unlockLevel: 300 },
]

// VIP专属解锁后宫
export const vipHarem = [
  { id: 31, name: 'VIP专属贵妃', charm: 95, talent: 92, desc: 'VIP5专属，雍容华贵，圣眷正浓', unlockType: 'vip', unlockLevel: 5 },
  { id: 32, name: '安陵容', charm: 88, talent: 90, desc: 'VIP2专属，歌喉婉转，柔情似水', unlockType: 'vip', unlockLevel: 2 },
  { id: 33, name: '沈眉庄', charm: 90, talent: 91, desc: 'VIP4专属，端庄大气，傲骨铮铮', unlockType: 'vip', unlockLevel: 4 },
  { id: 34, name: '华妃', charm: 96, talent: 85, desc: 'VIP6专属，艳压六宫，盛气凌人', unlockType: 'vip', unlockLevel: 6 },
  { id: 35, name: '甄嬛', charm: 98, talent: 99, desc: 'VIP8专属，莞莞类卿，最终权掌后宫', unlockType: 'vip', unlockLevel: 8 },
  { id: 36, name: '富察皇后', charm: 94, talent: 93, desc: 'VIP10专属，端庄温婉，一代贤后', unlockType: 'vip', unlockLevel: 10 },
  { id: 37, name: '如懿', charm: 93, talent: 92, desc: 'VIP12专属，兰因絮果，情深不寿', unlockType: 'vip', unlockLevel: 12 },
  { id: 38, name: '海兰', charm: 91, talent: 94, desc: 'VIP14专属，柔弱外表下的聪慧坚韧', unlockType: 'vip', unlockLevel: 14 },
  { id: 39, name: '高贵妃', charm: 95, talent: 88, desc: 'VIP16专属，戏曲一绝，骄纵明艳', unlockType: 'vip', unlockLevel: 16 },
  { id: 40, name: '嘉妃', charm: 94, talent: 90, desc: 'VIP18专属，玉氏美人，心机深沉', unlockType: 'vip', unlockLevel: 18 },
  { id: 41, name: '令妃', charm: 97, talent: 95, desc: 'VIP20专属，一路逆袭，最终权倾后宫', unlockType: 'vip', unlockLevel: 20 },
  { id: 42, name: '纯元皇后', charm: 100, talent: 98, desc: 'VIP17专属，完美无瑕，皇帝的白月光', unlockType: 'vip', unlockLevel: 17 },
  { id: 43, name: '端妃', charm: 89, talent: 93, desc: 'VIP19专属，与世无争，通透聪慧', unlockType: 'vip', unlockLevel: 19 },
  { id: 44, name: '颖妃', charm: 92, talent: 89, desc: 'VIP13专属，蒙古格格，率真可爱', unlockType: 'vip', unlockLevel: 13 },
  { id: 45, name: '豫妃', charm: 93, talent: 86, desc: 'VIP15专属，草原美人，热情奔放', unlockType: 'vip', unlockLevel: 15 }
]

// 初始寻访场景
export const initialScenes = [
  { name: '江南水乡', desc: '烟雨蒙蒙，小桥流水，佳人辈出之地' },
  { name: '京城闹市', desc: '繁华都市，商贾云集，人才济济之所' },
  { name: '苏州园林', desc: '精致典雅，风景如画，文人雅士汇聚' },
  { name: '杭州西湖', desc: '水光潋滟，山色空蒙，流传千古佳话' },
  { name: '秦淮河畔', desc: '桨声灯影，歌舞升平，风流韵事不绝' },
  { name: '名山古刹', desc: '深山藏古寺，世外有高人' }
]

// 初始政务事件
export const initialCourtEvents = [
  {
    title: '🌊 南方水灾',
    desc: '江南地区连降暴雨，洪水泛滥，百姓流离失所，请求朝廷赈灾。',
    choices: [
      { text: '拨银十万两赈灾 (国力+80, 金票-20)', power: 80, gold: -20 },
      { text: '派大臣前往视察 (国力+50)', power: 50, gold: 0 },
      { text: '暂缓处理 (国力-20)', power: -20, gold: 0 }
    ]
  },
  {
    title: '📚 科举考试',
    desc: '三年一度的科举考试开始，各地才子齐聚京城，请求圣上钦点主考官。',
    choices: [
      { text: '亲自主持殿试 (国力+120, 金票-30)', power: 120, gold: -30 },
      { text: '任命大学士为主考 (国力+80)', power: 80, gold: 0 },
      { text: '按往年惯例 (国力+40)', power: 40, gold: 0 }
    ]
  },
  {
    title: '⚔️ 边境告急',
    desc: '北方蛮族蠢蠢欲动，频频骚扰边境，守将请求增派援军。',
    choices: [
      { text: '御驾亲征 (国力+150, 士兵-1000)', power: 150, gold: 0, soldiers: -1000 },
      { text: '派大将军前往 (国力+100, 金票-50)', power: 100, gold: -50 },
      { text: '和亲求和 (国力-50)', power: -50, gold: 0 }
    ]
  }
]

// 纳贡国家配置
export const initialTributeNations = [
  { id: 1, name: '高丽国', flag: '🇰🇷', unlockLevel: 5, cooldown: 300, rewards: ['金票 +50', '国力 +30', '粮食 +2000'] },
  { id: 2, name: '东瀛国', flag: '🇯🇵', unlockLevel: 10, cooldown: 300, rewards: ['金票 +80', '国力 +50', '士兵 +500'] },
  { id: 3, name: '琉球国', flag: '🏝️', unlockLevel: 15, cooldown: 300, rewards: ['金票 +100', '国力 +70', '粮食 +3000'] },
  { id: 4, name: '安南國', flag: '🇻🇳', unlockLevel: 20, cooldown: 300, rewards: ['金票 +120', '国力 +90', '士兵 +800'] },
  { id: 5, name: '暹罗国', flag: '🇹🇭', unlockLevel: 25, cooldown: 300, rewards: ['金票 +150', '国力 +120', '粮食 +5000'] },
  { id: 6, name: '波斯国', flag: '🇮🇷', unlockLevel: 30, cooldown: 300, rewards: ['金票 +200', '国力 +150', '士兵 +1000'] }
]

// 灵兽图鉴
export const initialBeasts = [
  { id: 1, name: '青龙', icon: '🐉', desc: '东方神兽，主春生', basePower: 500, rarity: 5 },
  { id: 2, name: '白虎', icon: '🐅', desc: '西方神兽，主杀伐', basePower: 480, rarity: 5 },
  { id: 3, name: '朱雀', icon: '🦅', desc: '南方神兽，主火德', basePower: 450, rarity: 4 },
  { id: 4, name: '玄武', icon: '🐢', desc: '北方神兽，主寿元', basePower: 420, rarity: 4 },
  { id: 5, name: '麒麟', icon: '🦄', desc: '祥瑞之兽，主太平', basePower: 550, rarity: 5 },
  { id: 6, name: '貔貅', icon: '🐲', desc: '招财之兽，主财富', basePower: 380, rarity: 3 },
  { id: 7, name: '白泽', icon: '🐐', desc: '知晓万鬼之名', basePower: 400, rarity: 4 },
  { id: 8, name: '毕方', icon: '🦜', desc: '火灾之兆', basePower: 350, rarity: 3 }
]