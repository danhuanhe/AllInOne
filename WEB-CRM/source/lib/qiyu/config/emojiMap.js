const plist = [
    {"id":"emoticon_emoji_01" ,"tag":"[可爱]" ,"file":"emoji_01.png" },
    {"id":"emoticon_emoji_0" ,"tag":"[大笑]" ,"file":"emoji_00.png" },
    {"id":"emoticon_emoji_02" ,"tag":"[色]" ,"file":"emoji_02.png" },
    {"id":"emoticon_emoji_03" ,"tag":"[嘘]" ,"file":"emoji_03.png" },
    {"id":"emoticon_emoji_04" ,"tag":"[亲]" ,"file":"emoji_04.png" },
    {"id":"emoticon_emoji_05" ,"tag":"[呆]" ,"file":"emoji_05.png" },
    {"id":"emoticon_emoji_06" ,"tag":"[口水]" ,"file":"emoji_06.png" },
    {"id":"emoticon_emoji_145" ,"tag":"[汗]" ,"file":"emoji_145.png" },
    {"id":"emoticon_emoji_07" ,"tag":"[呲牙]" ,"file":"emoji_07.png" },
    {"id":"emoticon_emoji_08" ,"tag":"[鬼脸]" ,"file":"emoji_08.png" },
    {"id":"emoticon_emoji_09" ,"tag":"[害羞]" ,"file":"emoji_09.png" },
    {"id":"emoticon_emoji_10" ,"tag":"[偷笑]" ,"file":"emoji_10.png" },
    {"id":"emoticon_emoji_11" ,"tag":"[调皮]" ,"file":"emoji_11.png" },
    {"id":"emoticon_emoji_12" ,"tag":"[可怜]" ,"file":"emoji_12.png" },
    {"id":"emoticon_emoji_13" ,"tag":"[敲]" ,"file":"emoji_13.png" },
    {"id":"emoticon_emoji_14" ,"tag":"[惊讶]" ,"file":"emoji_14.png" },
    {"id":"emoticon_emoji_15" ,"tag":"[流感]" ,"file":"emoji_15.png" },
    {"id":"emoticon_emoji_16" ,"tag":"[委屈]" ,"file":"emoji_16.png" },
    {"id":"emoticon_emoji_17" ,"tag":"[流泪]" ,"file":"emoji_17.png" },
    {"id":"emoticon_emoji_18" ,"tag":"[嚎哭]" ,"file":"emoji_18.png" },
    {"id":"emoticon_emoji_19" ,"tag":"[惊恐]" ,"file":"emoji_19.png" },
    {"id":"emoticon_emoji_20" ,"tag":"[怒]" ,"file":"emoji_20.png" },
    {"id":"emoticon_emoji_21" ,"tag":"[酷]" ,"file":"emoji_21.png" },
    {"id":"emoticon_emoji_22" ,"tag":"[不说]" ,"file":"emoji_22.png" },
    {"id":"emoticon_emoji_23" ,"tag":"[鄙视]" ,"file":"emoji_23.png" },
    {"id":"emoticon_emoji_24" ,"tag":"[阿弥陀佛]" ,"file":"emoji_24.png" },
    {"id":"emoticon_emoji_25" ,"tag":"[奸笑]" ,"file":"emoji_25.png" },
    {"id":"emoticon_emoji_26" ,"tag":"[睡着]" ,"file":"emoji_26.png" },
    {"id":"emoticon_emoji_27" ,"tag":"[口罩]" ,"file":"emoji_27.png" },
    {"id":"emoticon_emoji_28" ,"tag":"[生气]" ,"file":"emoji_28.png" },
    {"id":"emoticon_emoji_29" ,"tag":"[抠鼻孔]" ,"file":"emoji_29.png" },
    {"id":"emoticon_emoji_30" ,"tag":"[疑问]" ,"file":"emoji_30.png" },
    {"id":"emoticon_emoji_31" ,"tag":"[怒骂]" ,"file":"emoji_31.png" },
    {"id":"emoticon_emoji_32" ,"tag":"[晕]" ,"file":"emoji_32.png" },
    {"id":"emoticon_emoji_33" ,"tag":"[呕吐]" ,"file":"emoji_33.png" },
    {"id":"emoticon_emoji_160" ,"tag":"[拜一拜]" ,"file":"emoji_160.png" },
    {"id":"emoticon_emoji_161" ,"tag":"[惊喜]" ,"file":"emoji_161.png" },
    {"id":"emoticon_emoji_162" ,"tag":"[流汗]" ,"file":"emoji_162.png" },
    {"id":"emoticon_emoji_163" ,"tag":"[卖萌]" ,"file":"emoji_163.png" },
    {"id":"emoticon_emoji_164" ,"tag":"[默契眨眼]" ,"file":"emoji_164.png" },
    {"id":"emoticon_emoji_165" ,"tag":"[烧香拜佛]" ,"file":"emoji_165.png" },
    {"id":"emoticon_emoji_166" ,"tag":"[晚安]" ,"file":"emoji_166.png" },

    {"id":"emoticon_emoji_116" ,"tag":"[撇嘴]" ,"file":"new_emoji_01.png" },
    {"id":"emoticon_emoji_117" ,"tag":"[难过]" ,"file":"1f641.png" },
    {"id":"emoticon_emoji_118" ,"tag":"[冷汗]" ,"file":"1f628.png" },
    {"id":"emoticon_emoji_119" ,"tag":"[抓狂]" ,"file":"1f629.png" },
    {"id":"emoticon_emoji_120" ,"tag":"[傲慢]" ,"file":"1f615.png" },
    {"id":"emoticon_emoji_121" ,"tag":"[困]" ,"file":"1f62a.png" },
    {"id":"emoticon_emoji_123" ,"tag":"[疯了]" ,"file":"1f616.png" },
    {"id":"emoticon_emoji_124" ,"tag":"[白眼]" ,"file":"new_emoji_02.png" },
    {"id":"emoticon_emoji_125" ,"tag":"[衰]" ,"file":"new_emoji_05.png" },
    {"id":"emoticon_emoji_126" ,"tag":"[再见]" ,"file":"new_emoji_06.png" },
    {"id":"emoticon_emoji_127" ,"tag":"[哼哼]" ,"file":"1f63e.png" },
    {"id":"emoticon_emoji_129" ,"tag":"[饥饿]" ,"file":"new_emoji_03.png" },
    {"id":"emoticon_emoji_143" ,"tag":"[飞吻]" ,"file":"new_emoji_10.png" },
    {"id":"emoticon_emoji_144" ,"tag":"[微笑]" ,"file":"1f642.png" },
    {"id":"emoticon_emoji_145" ,"tag":"[泪中带笑]" ,"file":"new_emoji_13.png" },
    {"id":"emoticon_emoji_146" ,"tag":"[吐舌头]" ,"file":"1f61d.png" },
    {"id":"emoticon_emoji_147" ,"tag":"[忧郁]" ,"file":"new_emoji_11.png" },
    {"id":"emoticon_emoji_148" ,"tag":"[尴尬]" ,"file":"1f630.png" },
    {"id":"emoticon_emoji_149" ,"tag":"[舒适]" ,"file":"1f60c.png" },
    {"id":"emoticon_emoji_150" ,"tag":"[不悦]" ,"file":"1f612.png" },
    {"id":"emoticon_emoji_155" ,"tag":"[拍掌]" ,"file":"new_emoji_09.png" },
    {"id":"emoticon_emoji_156" ,"tag":"[糗大了]" ,"file":"new_emoji_07.png" },

    {"id":"emoticon_emoji_122" ,"tag":"[奋斗]" ,"file":"1f4aa-1f3fc.png" },
    {"id":"emoticon_emoji_130" ,"tag":"[乒乓]" ,"file":"new_emoji_23.png" },
    {"id":"emoticon_emoji_131" ,"tag":"[猪头]" ,"file":"1f437.png" },
    {"id":"emoticon_emoji_132" ,"tag":"[玫瑰]" ,"file":"new_emoji_25.png" },
    {"id":"emoticon_emoji_133" ,"tag":"[凋谢]" ,"file":"new_emoji_24.png" },
    {"id":"emoticon_emoji_134" ,"tag":"[瓢虫]" ,"file":"1f41e.png" },
    {"id":"emoticon_emoji_135" ,"tag":"[月亮]" ,"file":"new_emoji_30.png" },
    {"id":"emoticon_emoji_136" ,"tag":"[礼物]" ,"file":"new_emoji_28.png" },
    {"id":"emoticon_emoji_137" ,"tag":"[拥抱]" ,"file":"new_emoji_08.png" },
    {"id":"emoticon_emoji_138" ,"tag":"[抱拳]" ,"file":"new_emoji_18.png" },
    {"id":"emoticon_emoji_139" ,"tag":"[勾引]" ,"file":"new_emoji_19.png" },
    {"id":"emoticon_emoji_140" ,"tag":"[差劲]" ,"file":"new_emoji_20.png" },
    {"id":"emoticon_emoji_141" ,"tag":"[爱你]" ,"file":"new_emoji_21.png" },
    {"id":"emoticon_emoji_142" ,"tag":"[NO]" ,"file":"new_emoji_22.png" },
    {"id":"emoticon_emoji_151" ,"tag":"[幽灵]" ,"file":"1f47b.png" },
    {"id":"emoticon_emoji_152" ,"tag":"[礼盒]" ,"file":"1f49d.png" },
    {"id":"emoticon_emoji_153" ,"tag":"[拜托]" ,"file":"1f64f-1f3fc.png" },
    {"id":"emoticon_emoji_154" ,"tag":"[气球]" ,"file":"1f388.png" },

    {"id":"emoticon_emoji_34" ,"tag":"[强]" ,"file":"emoji_34.png" },
    {"id":"emoticon_emoji_35" ,"tag":"[弱]" ,"file":"emoji_35.png" },
    {"id":"emoticon_emoji_36" ,"tag":"[OK]" ,"file":"emoji_36.png" },
    {"id":"emoticon_emoji_37" ,"tag":"[拳头]" ,"file":"emoji_37.png" },
    {"id":"emoticon_emoji_38" ,"tag":"[胜利]" ,"file":"emoji_38.png" },
    {"id":"emoticon_emoji_39" ,"tag":"[鼓掌]" ,"file":"emoji_39.png" },
    {"id":"emoticon_emoji_167" ,"tag":"[握手]" ,"file":"emoji_167.png" },
    {"id":"emoticon_emoji_40" ,"tag":"[发怒]" ,"file":"emoji_40.png" },
    {"id":"emoticon_emoji_41" ,"tag":"[骷髅]" ,"file":"emoji_41.png" },
    {"id":"emoticon_emoji_42" ,"tag":"[便便]" ,"file":"emoji_42.png" },
    {"id":"emoticon_emoji_43" ,"tag":"[火]" ,"file":"emoji_43.png" },
    {"id":"emoticon_emoji_44" ,"tag":"[溜]" ,"file":"emoji_44.png" },
    {"id":"emoticon_emoji_45" ,"tag":"[爱心]" ,"file":"emoji_45.png" },
    {"id":"emoticon_emoji_46" ,"tag":"[心碎]" ,"file":"emoji_46.png" },
    {"id":"emoticon_emoji_47" ,"tag":"[钟情]" ,"file":"emoji_47.png" },
    {"id":"emoticon_emoji_48" ,"tag":"[唇]" ,"file":"emoji_48.png" },
    {"id":"emoticon_emoji_49" ,"tag":"[戒指]" ,"file":"emoji_49.png" },
    {"id":"emoticon_emoji_50" ,"tag":"[钻石]" ,"file":"emoji_50.png" },
    {"id":"emoticon_emoji_51" ,"tag":"[太阳]" ,"file":"emoji_51.png" },
    {"id":"emoticon_emoji_52" ,"tag":"[有时晴]" ,"file":"emoji_52.png" },
    {"id":"emoticon_emoji_53" ,"tag":"[多云]" ,"file":"emoji_53.png" },
    {"id":"emoticon_emoji_54" ,"tag":"[雷]" ,"file":"emoji_54.png" },
    {"id":"emoticon_emoji_55" ,"tag":"[雨]" ,"file":"emoji_55.png" },
    {"id":"emoticon_emoji_56" ,"tag":"[雪花]" ,"file":"emoji_56.png" },
    {"id":"emoticon_emoji_57" ,"tag":"[爱人]" ,"file":"emoji_57.png" },
    {"id":"emoticon_emoji_58" ,"tag":"[帽子]" ,"file":"emoji_58.png" },
    {"id":"emoticon_emoji_59" ,"tag":"[皇冠]" ,"file":"emoji_59.png" },
    {"id":"emoticon_emoji_60" ,"tag":"[篮球]" ,"file":"emoji_60.png" },
    {"id":"emoticon_emoji_61" ,"tag":"[足球]" ,"file":"emoji_61.png" },
    {"id":"emoticon_emoji_62" ,"tag":"[垒球]" ,"file":"emoji_62.png" },
    {"id":"emoticon_emoji_63" ,"tag":"[网球]" ,"file":"emoji_63.png" },
    {"id":"emoticon_emoji_64" ,"tag":"[台球]" ,"file":"emoji_64.png" },
    {"id":"emoticon_emoji_65" ,"tag":"[咖啡]" ,"file":"emoji_65.png" },
    {"id":"emoticon_emoji_66" ,"tag":"[啤酒]" ,"file":"emoji_66.png" },
    {"id":"emoticon_emoji_67" ,"tag":"[干杯]" ,"file":"emoji_67.png" },
    {"id":"emoticon_emoji_68" ,"tag":"[柠檬汁]" ,"file":"emoji_68.png" },
    {"id":"emoticon_emoji_69" ,"tag":"[餐具]" ,"file":"emoji_69.png" },
    {"id":"emoticon_emoji_70" ,"tag":"[汉堡]" ,"file":"emoji_70.png" },
    {"id":"emoticon_emoji_71" ,"tag":"[鸡腿]" ,"file":"emoji_71.png" },
    {"id":"emoticon_emoji_72" ,"tag":"[面条]" ,"file":"emoji_72.png" },
    {"id":"emoticon_emoji_73" ,"tag":"[冰淇淋]" ,"file":"emoji_73.png" },
    {"id":"emoticon_emoji_74" ,"tag":"[沙冰]" ,"file":"emoji_74.png" },
    {"id":"emoticon_emoji_75" ,"tag":"[生日蛋糕]" ,"file":"emoji_75.png" },
    {"id":"emoticon_emoji_76" ,"tag":"[蛋糕]" ,"file":"emoji_76.png" },
    {"id":"emoticon_emoji_77" ,"tag":"[糖果]" ,"file":"emoji_77.png" },
    {"id":"emoticon_emoji_78" ,"tag":"[葡萄]" ,"file":"emoji_78.png" },
    {"id":"emoticon_emoji_79" ,"tag":"[西瓜]" ,"file":"emoji_79.png" },
    {"id":"emoticon_emoji_80" ,"tag":"[光碟]" ,"file":"emoji_80.png" },
    {"id":"emoticon_emoji_81" ,"tag":"[手机]" ,"file":"emoji_81.png" },
    {"id":"emoticon_emoji_82" ,"tag":"[电话]" ,"file":"emoji_82.png" },
    {"id":"emoticon_emoji_83" ,"tag":"[电视]" ,"file":"emoji_83.png" },
    {"id":"emoticon_emoji_84" ,"tag":"[声音开启]" ,"file":"emoji_84.png" },
    {"id":"emoticon_emoji_85" ,"tag":"[声音关闭]" ,"file":"emoji_85.png" },
    {"id":"emoticon_emoji_86" ,"tag":"[铃铛]" ,"file":"emoji_86.png" },
    {"id":"emoticon_emoji_87" ,"tag":"[锁头]" ,"file":"emoji_87.png" },
    {"id":"emoticon_emoji_88" ,"tag":"[放大镜]" ,"file":"emoji_88.png" },
    {"id":"emoticon_emoji_89" ,"tag":"[灯泡]" ,"file":"emoji_89.png" },
    {"id":"emoticon_emoji_90" ,"tag":"[锤头]" ,"file":"emoji_90.png" },
    {"id":"emoticon_emoji_91" ,"tag":"[烟]" ,"file":"emoji_91.png" },
    {"id":"emoticon_emoji_92" ,"tag":"[炸弹]" ,"file":"emoji_92.png" },
    {"id":"emoticon_emoji_93" ,"tag":"[枪]" ,"file":"emoji_93.png" },
    {"id":"emoticon_emoji_94" ,"tag":"[刀]" ,"file":"emoji_94.png" },
    {"id":"emoticon_emoji_95" ,"tag":"[药]" ,"file":"emoji_95.png" },
    {"id":"emoticon_emoji_96" ,"tag":"[打针]" ,"file":"emoji_96.png" },
    {"id":"emoticon_emoji_97" ,"tag":"[钱袋]" ,"file":"emoji_97.png" },
    {"id":"emoticon_emoji_98" ,"tag":"[钞票]" ,"file":"emoji_98.png" },
    {"id":"emoticon_emoji_99" ,"tag":"[银行卡]" ,"file":"emoji_99.png" },
    {"id":"emoticon_emoji_100" ,"tag":"[手柄]" ,"file":"emoji_100.png" },
    {"id":"emoticon_emoji_101" ,"tag":"[麻将]" ,"file":"emoji_101.png" },
    {"id":"emoticon_emoji_102" ,"tag":"[调色板]" ,"file":"emoji_102.png" },
    {"id":"emoticon_emoji_103" ,"tag":"[电影]" ,"file":"emoji_103.png" },
    {"id":"emoticon_emoji_104" ,"tag":"[麦克风]" ,"file":"emoji_104.png" },
    {"id":"emoticon_emoji_105" ,"tag":"[耳机]" ,"file":"emoji_105.png" },
    {"id":"emoticon_emoji_106" ,"tag":"[音乐]" ,"file":"emoji_106.png" },
    {"id":"emoticon_emoji_107" ,"tag":"[吉他]" ,"file":"emoji_107.png" },
    {"id":"emoticon_emoji_108" ,"tag":"[火箭]" ,"file":"emoji_108.png" },
    {"id":"emoticon_emoji_109" ,"tag":"[飞机]" ,"file":"emoji_109.png" },
    {"id":"emoticon_emoji_110" ,"tag":"[火车]" ,"file":"emoji_110.png" },
    {"id":"emoticon_emoji_111" ,"tag":"[公交]" ,"file":"emoji_111.png" },
    {"id":"emoticon_emoji_112" ,"tag":"[轿车]" ,"file":"emoji_112.png" },
    {"id":"emoticon_emoji_113" ,"tag":"[出租车]" ,"file":"emoji_113.png" },
    {"id":"emoticon_emoji_114" ,"tag":"[警车]" ,"file":"emoji_114.png" },
    {"id":"emoticon_emoji_115" ,"tag":"[自行车]" ,"file":"emoji_115.png" }
  ];

const pmap = {
    "emoticon_emoji_01":{"tag":"[可爱]", "file":"emoji_01.png"},
    "emoticon_emoji_00":{"tag":"[大笑]", "file":"emoji_00.png"},
    "emoticon_emoji_02":{"tag":"[色]", "file":"emoji_02.png"},
    "emoticon_emoji_03":{"tag":"[嘘]", "file":"emoji_03.png"},
    "emoticon_emoji_04":{"tag":"[亲]", "file":"emoji_04.png"},
    "emoticon_emoji_05":{"tag":"[呆]", "file":"emoji_05.png"},
    "emoticon_emoji_06":{"tag":"[口水]", "file":"emoji_06.png"},
    "emoticon_emoji_145":{"tag":"[汗]", "file":"emoji_145.png"},
    "emoticon_emoji_07":{"tag":"[呲牙]", "file":"emoji_07.png"},
    "emoticon_emoji_08":{"tag":"[鬼脸]", "file":"emoji_08.png"},
    "emoticon_emoji_09":{"tag":"[害羞]", "file":"emoji_09.png"},
    "emoticon_emoji_10":{"tag":"[偷笑]", "file":"emoji_10.png"},
    "emoticon_emoji_11":{"tag":"[调皮]", "file":"emoji_11.png"},
    "emoticon_emoji_12":{"tag":"[可怜]", "file":"emoji_12.png"},
    "emoticon_emoji_13":{"tag":"[敲]", "file":"emoji_13.png"},
    "emoticon_emoji_14":{"tag":"[惊讶]", "file":"emoji_14.png"},
    "emoticon_emoji_15":{"tag":"[流感]", "file":"emoji_15.png"},
    "emoticon_emoji_16":{"tag":"[委屈]", "file":"emoji_16.png"},
    "emoticon_emoji_17":{"tag":"[流泪]", "file":"emoji_17.png"},
    "emoticon_emoji_18":{"tag":"[嚎哭]", "file":"emoji_18.png"},
    "emoticon_emoji_19":{"tag":"[惊恐]", "file":"emoji_19.png"},
    "emoticon_emoji_20":{"tag":"[怒]", "file":"emoji_20.png"},
    "emoticon_emoji_21":{"tag":"[酷]", "file":"emoji_21.png"},
    "emoticon_emoji_22":{"tag":"[不说]", "file":"emoji_22.png"},
    "emoticon_emoji_23":{"tag":"[鄙视]", "file":"emoji_23.png"},
    "emoticon_emoji_24":{"tag":"[阿弥陀佛]", "file":"emoji_24.png"},
    "emoticon_emoji_25":{"tag":"[奸笑]", "file":"emoji_25.png"},
    "emoticon_emoji_26":{"tag":"[睡着]", "file":"emoji_26.png"},
    "emoticon_emoji_27":{"tag":"[口罩]", "file":"emoji_27.png"},
    "emoticon_emoji_28":{"tag":"[生气]", "file":"emoji_28.png"},
    "emoticon_emoji_29":{"tag":"[抠鼻孔]", "file":"emoji_29.png"},
    "emoticon_emoji_30":{"tag":"[疑问]", "file":"emoji_30.png"},
    "emoticon_emoji_31":{"tag":"[怒骂]", "file":"emoji_31.png"},
    "emoticon_emoji_32":{"tag":"[晕]", "file":"emoji_32.png"},
    "emoticon_emoji_33":{"tag":"[呕吐]", "file":"emoji_33.png"},
    "emoticon_emoji_160":{"tag":"[拜一拜]", "file":"emoji_160.png"},
    "emoticon_emoji_161":{"tag":"[惊喜]", "file":"emoji_161.png"},
    "emoticon_emoji_162":{"tag":"[流汗]", "file":"emoji_162.png"},
    "emoticon_emoji_163":{"tag":"[卖萌]", "file":"emoji_163.png"},
    "emoticon_emoji_164":{"tag":"[默契眨眼]", "file":"emoji_164.png"},
    "emoticon_emoji_165":{"tag":"[烧香拜佛]", "file":"emoji_165.png"},
    "emoticon_emoji_166":{"tag":"[晚安]", "file":"emoji_166.png"},
    "emoticon_emoji_34":{"tag":"[强]", "file":"emoji_34.png"},
    "emoticon_emoji_35":{"tag":"[弱]", "file":"emoji_35.png"},
    "emoticon_emoji_36":{"tag":"[OK]", "file":"emoji_36.png"},
    "emoticon_emoji_37":{"tag":"[拳头]", "file":"emoji_37.png"},
    "emoticon_emoji_38":{"tag":"[胜利]", "file":"emoji_38.png"},
    "emoticon_emoji_39":{"tag":"[鼓掌]", "file":"emoji_39.png"},
    "emoticon_emoji_200":{"tag":"[握手]", "file":"emoji_200.png"},
    "emoticon_emoji_40":{"tag":"[发怒]", "file":"emoji_40.png"},
    "emoticon_emoji_41":{"tag":"[骷髅]", "file":"emoji_41.png"},
    "emoticon_emoji_42":{"tag":"[便便]", "file":"emoji_42.png"},
    "emoticon_emoji_43":{"tag":"[火]", "file":"emoji_43.png"},
    "emoticon_emoji_44":{"tag":"[溜]", "file":"emoji_44.png"},
    "emoticon_emoji_45":{"tag":"[爱心]", "file":"emoji_45.png"},
    "emoticon_emoji_46":{"tag":"[心碎]", "file":"emoji_46.png"},
    "emoticon_emoji_47":{"tag":"[钟情]", "file":"emoji_47.png"},
    "emoticon_emoji_48":{"tag":"[唇]", "file":"emoji_48.png"},
    "emoticon_emoji_49":{"tag":"[戒指]", "file":"emoji_49.png"},
    "emoticon_emoji_50":{"tag":"[钻石]", "file":"emoji_50.png"},
    "emoticon_emoji_51":{"tag":"[太阳]", "file":"emoji_51.png"},
    "emoticon_emoji_52":{"tag":"[有时晴]", "file":"emoji_52.png"},
    "emoticon_emoji_53":{"tag":"[多云]", "file":"emoji_53.png"},
    "emoticon_emoji_54":{"tag":"[雷]", "file":"emoji_54.png"},
    "emoticon_emoji_55":{"tag":"[雨]", "file":"emoji_55.png"},
    "emoticon_emoji_56":{"tag":"[雪花]", "file":"emoji_56.png"},
    "emoticon_emoji_57":{"tag":"[爱人]", "file":"emoji_57.png"},
    "emoticon_emoji_58":{"tag":"[帽子]", "file":"emoji_58.png"},
    "emoticon_emoji_59":{"tag":"[皇冠]", "file":"emoji_59.png"},
    "emoticon_emoji_60":{"tag":"[篮球]", "file":"emoji_60.png"},
    "emoticon_emoji_61":{"tag":"[足球]", "file":"emoji_61.png"},
    "emoticon_emoji_62":{"tag":"[垒球]", "file":"emoji_62.png"},
    "emoticon_emoji_63":{"tag":"[网球]", "file":"emoji_63.png"},
    "emoticon_emoji_64":{"tag":"[台球]", "file":"emoji_64.png"},
    "emoticon_emoji_65":{"tag":"[咖啡]", "file":"emoji_65.png"},
    "emoticon_emoji_66":{"tag":"[啤酒]", "file":"emoji_66.png"},
    "emoticon_emoji_67":{"tag":"[干杯]", "file":"emoji_67.png"},
    "emoticon_emoji_68":{"tag":"[柠檬汁]", "file":"emoji_68.png"},
    "emoticon_emoji_69":{"tag":"[餐具]", "file":"emoji_69.png"},
    "emoticon_emoji_70":{"tag":"[汉堡]", "file":"emoji_70.png"},
    "emoticon_emoji_71":{"tag":"[鸡腿]", "file":"emoji_71.png"},
    "emoticon_emoji_72":{"tag":"[面条]", "file":"emoji_72.png"},
    "emoticon_emoji_73":{"tag":"[冰淇淋]", "file":"emoji_73.png"},
    "emoticon_emoji_74":{"tag":"[沙冰]", "file":"emoji_74.png"},
    "emoticon_emoji_75":{"tag":"[生日蛋糕]", "file":"emoji_75.png"},
    "emoticon_emoji_76":{"tag":"[蛋糕]", "file":"emoji_76.png"},
    "emoticon_emoji_77":{"tag":"[糖果]", "file":"emoji_77.png"},
    "emoticon_emoji_78":{"tag":"[葡萄]", "file":"emoji_78.png"},
    "emoticon_emoji_79":{"tag":"[西瓜]", "file":"emoji_79.png"},
    "emoticon_emoji_80":{"tag":"[光碟]", "file":"emoji_80.png"},
    "emoticon_emoji_81":{"tag":"[手机]", "file":"emoji_81.png"},
    "emoticon_emoji_82":{"tag":"[电话]", "file":"emoji_82.png"},
    "emoticon_emoji_83":{"tag":"[电视]", "file":"emoji_83.png"},
    "emoticon_emoji_84":{"tag":"[声音开启]", "file":"emoji_84.png"},
    "emoticon_emoji_85":{"tag":"[声音关闭]", "file":"emoji_85.png"},
    "emoticon_emoji_86":{"tag":"[铃铛]", "file":"emoji_86.png"},
    "emoticon_emoji_87":{"tag":"[锁头]", "file":"emoji_87.png"},
    "emoticon_emoji_88":{"tag":"[放大镜]", "file":"emoji_88.png"},
    "emoticon_emoji_89":{"tag":"[灯泡]", "file":"emoji_89.png"},
    "emoticon_emoji_90":{"tag":"[锤头]", "file":"emoji_90.png"},
    "emoticon_emoji_91":{"tag":"[烟]", "file":"emoji_91.png"},
    "emoticon_emoji_92":{"tag":"[炸弹]", "file":"emoji_92.png"},
    "emoticon_emoji_93":{"tag":"[枪]", "file":"emoji_93.png"},
    "emoticon_emoji_94":{"tag":"[刀]", "file":"emoji_94.png"},
    "emoticon_emoji_95":{"tag":"[药]", "file":"emoji_95.png"},
    "emoticon_emoji_96":{"tag":"[打针]", "file":"emoji_96.png"},
    "emoticon_emoji_97":{"tag":"[钱袋]", "file":"emoji_97.png"},
    "emoticon_emoji_98":{"tag":"[钞票]", "file":"emoji_98.png"},
    "emoticon_emoji_99":{"tag":"[银行卡]", "file":"emoji_99.png"},
    "emoticon_emoji_100":{"tag":"[手柄]", "file":"emoji_100.png"},
    "emoticon_emoji_101":{"tag":"[麻将]", "file":"emoji_101.png"},
    "emoticon_emoji_102":{"tag":"[调色板]", "file":"emoji_102.png"},
    "emoticon_emoji_103":{"tag":"[电影]", "file":"emoji_103.png"},
    "emoticon_emoji_104":{"tag":"[麦克风]", "file":"emoji_104.png"},
    "emoticon_emoji_105":{"tag":"[耳机]", "file":"emoji_105.png"},
    "emoticon_emoji_106":{"tag":"[音乐]", "file":"emoji_106.png"},
    "emoticon_emoji_107":{"tag":"[吉他]", "file":"emoji_107.png"},
    "emoticon_emoji_108":{"tag":"[火箭]", "file":"emoji_108.png"},
    "emoticon_emoji_109":{"tag":"[飞机]", "file":"emoji_109.png"},
    "emoticon_emoji_110":{"tag":"[火车]", "file":"emoji_110.png"},
    "emoticon_emoji_111":{"tag":"[公交]", "file":"emoji_111.png"},
    "emoticon_emoji_112":{"tag":"[轿车]", "file":"emoji_112.png"},
    "emoticon_emoji_113":{"tag":"[出租车]", "file":"emoji_113.png"},
    "emoticon_emoji_114":{"tag":"[警车]", "file":"emoji_114.png"},
    "emoticon_emoji_115":{"tag":"[自行车]", "file":"emoji_115.png"},

    "emoticon_emoji_116":{"tag":"[撇嘴]", "file":"new_emoji_01.png"},
    "emoticon_emoji_117":{"tag":"[难过]", "file":"1f641.png"},
    "emoticon_emoji_118":{"tag":"[冷汗]", "file":"1f628.png"},
    "emoticon_emoji_119":{"tag":"[抓狂]", "file":"1f629.png"},
    "emoticon_emoji_120":{"tag":"[傲慢]", "file":"1f615.png"},
    "emoticon_emoji_121":{"tag":"[困]", "file":"1f62a.png"},
    "emoticon_emoji_122":{"tag":"[疯了]", "file":"1f616.png"},
    "emoticon_emoji_123":{"tag":"[奋斗]", "file":"1f4aa-1f3fc.png"},
    "emoticon_emoji_124":{"tag":"[白眼]", "file":"new_emoji_02.png"},
    "emoticon_emoji_125":{"tag":"[衰]", "file":"new_emoji_05.png"},
    "emoticon_emoji_126":{"tag":"[再见]", "file":"new_emoji_06.png"},
    "emoticon_emoji_127":{"tag":"[哼哼]", "file":"1f63e.png"},
    "emoticon_emoji_128":{"tag":"[阴险]", "file":"1f608.png"},
    "emoticon_emoji_129":{"tag":"[饥饿]", "file":"new_emoji_03.png"},
    "emoticon_emoji_130":{"tag":"[乒乓]", "file":"new_emoji_23.png"},
    "emoticon_emoji_131":{"tag":"[猪头]", "file":"1f437.png"},
    "emoticon_emoji_132":{"tag":"[玫瑰]", "file":"new_emoji_25.png"},
    "emoticon_emoji_133":{"tag":"[凋谢]", "file":"new_emoji_24.png"},
    "emoticon_emoji_134":{"tag":"[瓢虫]", "file":"1f41e.png"},
    "emoticon_emoji_135":{"tag":"[月亮]", "file":"new_emoji_30.png"},
    "emoticon_emoji_136":{"tag":"[礼物]", "file":"new_emoji_28.png"},
    "emoticon_emoji_137":{"tag":"[拥抱]", "file":"new_emoji_08.png"},
    "emoticon_emoji_138":{"tag":"[抱拳]", "file":"new_emoji_18.png"},
    "emoticon_emoji_139":{"tag":"[勾引]", "file":"new_emoji_19.png"},
    "emoticon_emoji_140":{"tag":"[差劲]", "file":"new_emoji_20.png"},
    "emoticon_emoji_141":{"tag":"[爱你]", "file":"new_emoji_21.png"},
    "emoticon_emoji_142":{"tag":"[NO]", "file":"new_emoji_22.png"},
    "emoticon_emoji_143":{"tag":"[飞吻]", "file":"new_emoji_10.png"},
    "emoticon_emoji_144":{"tag":"[微笑]", "file":"1f642.png"},
    "emoticon_emoji_146":{"tag":"[吐舌头]", "file":"1f61d.png"},
    "emoticon_emoji_147":{"tag":"[忧郁]", "file":"new_emoji_11.png"},
    "emoticon_emoji_148":{"tag":"[尴尬]", "file":"1f630.png"},
    "emoticon_emoji_149":{"tag":"[舒适]", "file":"1f60c.png"},
    "emoticon_emoji_150":{"tag":"[不悦]", "file":"1f612.png"},
    "emoticon_emoji_151":{"tag":"[幽灵]", "file":"1f47b.png"},
    "emoticon_emoji_152":{"tag":"[礼盒]", "file":"1f49d.png"},
    "emoticon_emoji_153":{"tag":"[拜托]", "file":"1f64f-1f3fc.png"},
    "emoticon_emoji_154":{"tag":"[气球]", "file":"1f388.png"},
    "emoticon_emoji_155":{"tag":"[拍掌]", "file":"new_emoji_09.png"},
    "emoticon_emoji_156":{"tag":"[泪中带笑]", "file":"1f602.png"},
    "emoticon_emoji_157":{"tag":"[糗大了]", "file":"new_emoji_07.png"}
  };
const pmap2 = {
    "[大笑]": "emoticon_emoji_00",
    "[可爱]": "emoticon_emoji_01",
    "[色]": "emoticon_emoji_02",
    "[嘘]": "emoticon_emoji_03",
    "[亲]": "emoticon_emoji_04",
    "[呆]": "emoticon_emoji_05",
    "[口水]": "emoticon_emoji_06",
    "[汗]": "emoticon_emoji_145",
    "[呲牙]": "emoticon_emoji_07",
    "[鬼脸]": "emoticon_emoji_08",
    "[害羞]": "emoticon_emoji_09",
    "[偷笑]": "emoticon_emoji_10",
    "[调皮]": "emoticon_emoji_11",
    "[可怜]": "emoticon_emoji_12",
    "[敲]": "emoticon_emoji_13",
    "[惊讶]": "emoticon_emoji_14",
    "[流感]": "emoticon_emoji_15",
    "[委屈]": "emoticon_emoji_16",
    "[流泪]": "emoticon_emoji_17",
    "[嚎哭]": "emoticon_emoji_18",
    "[惊恐]": "emoticon_emoji_19",
    "[怒]": "emoticon_emoji_20",
    "[酷]": "emoticon_emoji_21",
    "[不说]": "emoticon_emoji_22",
    "[鄙视]": "emoticon_emoji_23",
    "[阿弥陀佛]": "emoticon_emoji_24",
    "[奸笑]": "emoticon_emoji_25",
    "[睡着]": "emoticon_emoji_26",
    "[口罩]": "emoticon_emoji_27",
    "[生气]": "emoticon_emoji_28",
    "[抠鼻孔]": "emoticon_emoji_29",
    "[疑问]": "emoticon_emoji_30",
    "[怒骂]": "emoticon_emoji_31",
    "[晕]": "emoticon_emoji_32",
    "[呕吐]": "emoticon_emoji_33",
    "[拜一拜]": "emoticon_emoji_160",
    "[惊喜]": "emoticon_emoji_161",
    "[流汗]": "emoticon_emoji_162",
    "[卖萌]": "emoticon_emoji_163",
    "[默契眨眼]": "emoticon_emoji_164",
    "[烧香拜佛]": "emoticon_emoji_165",
    "[晚安]": "emoticon_emoji_166",
    "[强]": "emoticon_emoji_34",
    "[弱]": "emoticon_emoji_35",
    "[OK]": "emoticon_emoji_36",
    "[拳头]": "emoticon_emoji_37",
    "[胜利]": "emoticon_emoji_38",
    "[鼓掌]": "emoticon_emoji_39",
    "[握手]": "emoticon_emoji_200",
    "[发怒]": "emoticon_emoji_40",
    "[骷髅]": "emoticon_emoji_41",
    "[便便]": "emoticon_emoji_42",
    "[火]": "emoticon_emoji_43",
    "[溜]": "emoticon_emoji_44",
    "[爱心]": "emoticon_emoji_45",
    "[心碎]": "emoticon_emoji_46",
    "[钟情]": "emoticon_emoji_47",
    "[唇]": "emoticon_emoji_48",
    "[戒指]": "emoticon_emoji_49",
    "[钻石]": "emoticon_emoji_50",
    "[太阳]": "emoticon_emoji_51",
    "[有时晴]": "emoticon_emoji_52",
    "[多云]": "emoticon_emoji_53",
    "[雷]": "emoticon_emoji_54",
    "[雨]": "emoticon_emoji_55",
    "[雪花]": "emoticon_emoji_56",
    "[爱人]": "emoticon_emoji_57",
    "[帽子]": "emoticon_emoji_58",
    "[皇冠]": "emoticon_emoji_59",
    "[篮球]": "emoticon_emoji_60",
    "[足球]": "emoticon_emoji_61",
    "[垒球]": "emoticon_emoji_62",
    "[网球]": "emoticon_emoji_63",
    "[台球]": "emoticon_emoji_64",
    "[咖啡]": "emoticon_emoji_65",
    "[啤酒]": "emoticon_emoji_66",
    "[干杯]": "emoticon_emoji_67",
    "[柠檬汁]": "emoticon_emoji_68",
    "[餐具]": "emoticon_emoji_69",
    "[汉堡]": "emoticon_emoji_70",
    "[鸡腿]": "emoticon_emoji_71",
    "[面条]": "emoticon_emoji_72",
    "[冰淇淋]": "emoticon_emoji_73",
    "[沙冰]": "emoticon_emoji_74",
    "[生日蛋糕]": "emoticon_emoji_75",
    "[蛋糕]": "emoticon_emoji_76",
    "[糖果]": "emoticon_emoji_77",
    "[葡萄]": "emoticon_emoji_78",
    "[西瓜]": "emoticon_emoji_79",
    "[光碟]": "emoticon_emoji_80",
    "[手机]": "emoticon_emoji_81",
    "[电话]": "emoticon_emoji_82",
    "[电视]": "emoticon_emoji_83",
    "[声音开启]": "emoticon_emoji_84",
    "[声音关闭]": "emoticon_emoji_85",
    "[铃铛]": "emoticon_emoji_86",
    "[锁头]": "emoticon_emoji_87",
    "[放大镜]": "emoticon_emoji_88",
    "[灯泡]": "emoticon_emoji_89",
    "[锤头]": "emoticon_emoji_90",
    "[烟]": "emoticon_emoji_91",
    "[炸弹]": "emoticon_emoji_92",
    "[枪]": "emoticon_emoji_93",
    "[刀]": "emoticon_emoji_94",
    "[药]": "emoticon_emoji_95",
    "[打针]": "emoticon_emoji_96",
    "[钱袋]": "emoticon_emoji_97",
    "[钞票]": "emoticon_emoji_98",
    "[银行卡]": "emoticon_emoji_99",
    "[手柄]": "emoticon_emoji_100",
    "[麻将]": "emoticon_emoji_101",
    "[调色板]": "emoticon_emoji_102",
    "[电影]": "emoticon_emoji_103",
    "[麦克风]": "emoticon_emoji_104",
    "[耳机]": "emoticon_emoji_105",
    "[音乐]": "emoticon_emoji_106",
    "[吉他]": "emoticon_emoji_107",
    "[火箭]": "emoticon_emoji_108",
    "[飞机]": "emoticon_emoji_109",
    "[火车]": "emoticon_emoji_110",
    "[公交]": "emoticon_emoji_111",
    "[轿车]": "emoticon_emoji_112",
    "[出租车]": "emoticon_emoji_113",
    "[警车]": "emoticon_emoji_114",
    "[自行车]": "emoticon_emoji_115",

    "[撇嘴]": "emoticon_emoji_116",
    "[难过]": "emoticon_emoji_117",
    "[冷汗]": "emoticon_emoji_118",
    "[抓狂]": "emoticon_emoji_119",
    "[傲慢]": "emoticon_emoji_120",
    "[困]": "emoticon_emoji_121",
    "[疯了]": "emoticon_emoji_122",
    "[奋斗]": "emoticon_emoji_123",
    "[白眼]": "emoticon_emoji_124",
    "[衰]": "emoticon_emoji_125",
    "[再见]": "emoticon_emoji_126",
    "[哼哼]": "emoticon_emoji_127",
    "[阴险]":"emoticon_emoji_128",
    "[饥饿]": "emoticon_emoji_129",
    "[乒乓]": "emoticon_emoji_130",
    "[猪头]": "emoticon_emoji_131",
    "[玫瑰]": "emoticon_emoji_132",
    "[凋谢]": "emoticon_emoji_133",
    "[瓢虫]": "emoticon_emoji_134",
    "[月亮]": "emoticon_emoji_135",
    "[礼物]": "emoticon_emoji_136",
    "[拥抱]": "emoticon_emoji_137",
    "[抱拳]": "emoticon_emoji_138",
    "[勾引]": "emoticon_emoji_139",
    "[差劲]": "emoticon_emoji_140",
    "[爱你]": "emoticon_emoji_141",
    "[NO]": "emoticon_emoji_142",
    "[飞吻]": "emoticon_emoji_143",
    "[微笑]": "emoticon_emoji_144",
    "[吐舌头]": "emoticon_emoji_146",
    "[忧郁]": "emoticon_emoji_147",
    "[尴尬]": "emoticon_emoji_148",
    "[舒适]" : "emoticon_emoji_149",
    "[不悦]": "emoticon_emoji_150",
    "[幽灵]": "emoticon_emoji_151",
    "[礼盒]": "emoticon_emoji_152",
    "[拜托]": "emoticon_emoji_153",
    "[气球]": "emoticon_emoji_154",
    "[拍掌]": "emoticon_emoji_155",
    "[泪中带笑]": "emoticon_emoji_156",
    "[糗大了]" : "emoticon_emoji_157"
};

export default {plist, pmap, pmap2};