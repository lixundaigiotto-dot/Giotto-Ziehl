window.SITE_DATA = {
  site: {
    title: "巡花问柳大世界",
    subtitle: "把我们走过的路、爱过的风景和共同的生活，慢慢存成一生的回忆。",
    footerText: "故事未完，下一站待定。",
    heroImage: "./assets/shared/hero-collage.jpg"
  },
  about: {
    introTitle: "关于我们",
    intro:
      "这是属于我们两个人的小小世界。它会记录每一次出发、每一次迷路、每一次相视一笑，也会把那些以后可能会模糊的瞬间重新留在眼前。",
    whyTitle: "为什么做这个网站",
    why:
      "因为照片会越积越多，聊天记录会被时间淹没，但我们想给彼此留一座可以慢慢长大的记忆档案馆。这里不是为了展示给所有人看，而是为了很多年以后我们还可以回来，重新走一遍那些一起走过的路。"
  },
  stats: {
    countriesVisited: 3,
    tripsCompleted: 3,
    totalTravelDays: 24,
    citiesVisited: 8,
    totalPhotos: 17,
    catMembers: 4
  },
  nav: [
    { id: "home", label: "首页" },
    { id: "map", label: "旅行地图" },
    { id: "trips", label: "旅程档案" },
    { id: "timeline", label: "时光轴" },
    { id: "cats", label: "猫咪宇宙" },
    { id: "about", label: "关于我们" }
  ],
  highlights: [
    {
      title: "第一次一起远行",
      description: "把出发前一晚紧张又兴奋的心情也留在这里。",
      icon: "01"
    },
    {
      title: "未来心愿地图",
      description: "给还没去过的国家也留一个位置，像给未来写一封预告信。",
      icon: "02"
    },
    {
      title: "旅行留言册",
      description: "每次旅行结束后，给彼此留一句只属于当下的话。",
      icon: "03"
    }
  ],
  photoWall: [
    {
      src: "./assets/trips/trip-japan-1.jpg",
      title: "京都的清晨",
      meta: "2025.04 · 日本"
    },
    {
      src: "./assets/trips/trip-japan-2.jpg",
      title: "大阪夜色",
      meta: "2025.04 · 日本"
    },
    {
      src: "./assets/trips/trip-thailand-1.jpg",
      title: "海边黄昏",
      meta: "2025.10 · 泰国"
    },
    {
      src: "./assets/trips/trip-thailand-2.jpg",
      title: "曼谷街头",
      meta: "2025.10 · 泰国"
    },
    {
      src: "./assets/trips/trip-france-1.jpg",
      title: "塞纳河边",
      meta: "2026.05 · 法国"
    },
    {
      src: "./assets/trips/trip-france-2.jpg",
      title: "雨后的里昂",
      meta: "2026.05 · 法国"
    },
    {
      src: "./assets/shared/photo-wall-placeholder.jpg",
      title: "这里等你们的新照片",
      meta: "持续更新中"
    }
  ],
  wishList: [
    { place: "冰岛", note: "想一起看极光和黑沙滩。" },
    { place: "新西兰", note: "想开车穿过很大的草地和湖。" },
    { place: "意大利", note: "想慢慢吃饭，慢慢走路。" }
  ],
  countries: [
    {
      name: "Japan",
      label: "日本",
      tripIds: ["japan-kansai-2025"]
    },
    {
      name: "Thailand",
      label: "泰国",
      tripIds: ["thailand-island-2025"]
    },
    {
      name: "France",
      label: "法国",
      tripIds: ["france-spring-2026"]
    }
  ],
  timeline: [
    {
      date: "2025.04.12",
      title: "日本关西春日旅行",
      text: "第一次一起把陌生城市走成自己的地图。"
    },
    {
      date: "2025.10.02",
      title: "泰国海边假期",
      text: "第一次一起在完全不赶时间的海边待好几天。"
    },
    {
      date: "2026.05.18",
      title: "法国初夏散步",
      text: "把巴黎和里昂都走得很慢，像在看一部很长的电影。"
    }
  ],
  cats: [
    {
      id: "bubu",
      name: "步步",
      nickname: "家里的巡视组组长",
      avatar: "./assets/cats/cat-bubu.jpg",
      personality: "喜欢抢最好的观景位，也最爱假装不在乎地陪着你。",
      moments: [
        {
          title: "窗台值班",
          date: "2026.06.19",
          text: "你们一收拾行李，它就会先跳上窗台开始观察局势。",
          mediaType: "image",
          src: "./assets/cats/cat-bubu.jpg"
        }
      ]
    },
    {
      id: "nainai",
      name: "奶奶",
      nickname: "最会撒娇的情绪安抚员",
      avatar: "./assets/cats/cat-nainai.jpg",
      personality: "你们回家最先跑过来的常常是它。",
      moments: [
        {
          title: "门口迎接仪式",
          date: "2026.06.23",
          text: "每次出门回来，它都会认真完成迎接工作。",
          mediaType: "image",
          src: "./assets/cats/cat-nainai.jpg"
        }
      ]
    },
    {
      id: "mitao",
      name: "咪桃",
      nickname: "神秘观察家",
      avatar: "./assets/cats/cat-mitao.jpg",
      personality: "看起来冷静，但总会在你最没注意的时候蹭过来。",
      moments: [
        {
          title: "躲在角落偷看",
          date: "2026.06.28",
          text: "拍照的时候它永远像导演一样在旁边看着。",
          mediaType: "image",
          src: "./assets/cats/cat-mitao.jpg"
        }
      ]
    },
    {
      id: "tangyuan",
      name: "汤圆",
      nickname: "一团会移动的柔软",
      avatar: "./assets/cats/cat-tangyuan.jpg",
      personality: "吃饱后就会找一个最圆满的姿势躺着。",
      moments: [
        {
          title: "午后团成一团",
          date: "2026.07.01",
          text: "看着它睡觉，会让人觉得家是有重量的。",
          mediaType: "image",
          src: "./assets/cats/cat-tangyuan.jpg"
        }
      ]
    }
  ],
  trips: [
    {
      id: "japan-kansai-2025",
      country: "Japan",
      countryLabel: "日本",
      title: "2025 关西春日小远行",
      cover: "./assets/trips/trip-japan-cover.jpg",
      startDate: "2025-04-12",
      endDate: "2025-04-18",
      days: 7,
      cities: ["京都", "大阪", "奈良"],
      coordinates: [135.5023, 34.6937],
      note: "第一次一起把攻略变成了真实的街道和晚风。",
      tags: ["第一次一起出国", "樱花", "暴走", "神社", "夜色"],
      featuredMemory: "在奈良快日落的时候慢慢走回车站，谁都舍不得说这一天结束了。",
      partnerNote: "以后想和你把更多陌生城市也走成习惯。",
      entries: [
        {
          dayLabel: "Day 1",
          title: "到达大阪",
          summary: "拖着箱子出站的时候还有点紧张，但抬头看见熟悉又陌生的街景，心一下就落下来了。",
          items: [
            {
              type: "image",
              src: "./assets/trips/trip-japan-2.jpg",
              caption: "晚上在道顿堀附近晃了很久。",
              shotAt: "2025-04-12 21:16",
              location: "大阪 道顿堀",
              story: "原本只想随便走走，结果一路被路边店铺和灯光拖得越来越晚。"
            }
          ]
        },
        {
          dayLabel: "Day 3",
          title: "京都的清晨",
          summary: "起得很早，街道还安静，像只有我们两个人知道这座城市已经醒了。",
          items: [
            {
              type: "image",
              src: "./assets/trips/trip-japan-1.jpg",
              caption: "伏见稻荷前的风很轻。",
              shotAt: "2025-04-14 07:24",
              location: "京都 伏见稻荷",
              story: "这一刻很像时间放慢了，连说话都不想太大声。"
            }
          ]
        },
        {
          dayLabel: "Day 5",
          title: "奈良慢慢走",
          summary: "没有刻意赶景点，只是一起晒太阳、拍照、走路。",
          items: [
            {
              type: "image",
              src: "./assets/trips/trip-japan-3.jpg",
              caption: "奈良的草地和光都很温柔。",
              shotAt: "2025-04-16 16:48",
              location: "奈良公园",
              story: "本来担心一天不够玩，后来发现慢慢走才是最好的玩法。"
            }
          ]
        }
      ]
    },
    {
      id: "thailand-island-2025",
      country: "Thailand",
      countryLabel: "泰国",
      title: "2025 曼谷与海岛的慢节奏假期",
      cover: "./assets/trips/trip-thailand-cover.jpg",
      startDate: "2025-10-02",
      endDate: "2025-10-09",
      days: 8,
      cities: ["曼谷", "苏梅岛"],
      coordinates: [100.5018, 13.7563],
      note: "这次不像旅行，更像暂时住进了另一种天气里。",
      tags: ["海边", "日落", "椰子", "按摩", "发呆"],
      featuredMemory: "在海边坐到天黑，谁都没有催着要回去。",
      partnerNote: "和你一起浪费时间，是我最喜欢的计划。",
      entries: [
        {
          dayLabel: "Day 2",
          title: "曼谷街头",
          summary: "热气、香味、车流和颜色全部扑过来，但意外地让人很开心。",
          items: [
            {
              type: "image",
              src: "./assets/trips/trip-thailand-2.jpg",
              caption: "街角摊位前停了很久。",
              shotAt: "2025-10-03 18:02",
              location: "曼谷",
              story: "因为不知道选哪一种小吃，最后干脆点了两份。"
            }
          ]
        },
        {
          dayLabel: "Day 5",
          title: "海边黄昏",
          summary: "风吹得人很轻，时间也像跟着慢下来了。",
          items: [
            {
              type: "image",
              src: "./assets/trips/trip-thailand-1.jpg",
              caption: "海边落日值得看很多次。",
              shotAt: "2025-10-06 17:41",
              location: "苏梅岛",
              story: "我们坐在沙滩边上什么都没干，但那一小时很完整。"
            }
          ]
        }
      ]
    },
    {
      id: "france-spring-2026",
      country: "France",
      countryLabel: "法国",
      title: "2026 法国初夏散步计划",
      cover: "./assets/trips/trip-france-cover.jpg",
      startDate: "2026-05-18",
      endDate: "2026-05-26",
      days: 9,
      cities: ["巴黎", "里昂", "阿讷西"],
      coordinates: [2.3522, 48.8566],
      note: "我们这次像是故意把脚步放慢，好让每一顿饭、每一条街都被记住。",
      tags: ["面包", "散步", "河边", "下雨", "电影感"],
      featuredMemory: "雨停之后在里昂往回走的那段路，像一整部电影的结尾。",
      partnerNote: "谢谢你愿意和我一起把普通的一天也过得很好看。",
      entries: [
        {
          dayLabel: "Day 2",
          title: "巴黎河边",
          summary: "没有太多安排，只是一直走，走到天色开始发亮又发暗。",
          items: [
            {
              type: "image",
              src: "./assets/trips/trip-france-1.jpg",
              caption: "塞纳河边的风把人吹得很清醒。",
              shotAt: "2026-05-19 19:18",
              location: "巴黎 塞纳河",
              story: "当时突然觉得旅行最好的部分其实就是两个人并肩走着。"
            }
          ]
        },
        {
          dayLabel: "Day 6",
          title: "雨后的里昂",
          summary: "等雨停的过程不算浪费，反而让这座城市变得更柔软了。",
          items: [
            {
              type: "image",
              src: "./assets/trips/trip-france-2.jpg",
              caption: "潮湿空气里的灯光很好看。",
              shotAt: "2026-05-23 20:05",
              location: "里昂",
              story: "后来回看照片，最喜欢的就是这种没有刻意摆拍的瞬间。"
            }
          ]
        }
      ]
    }
  ]
};
