# 巡花问柳大世界

这是一个纯静态网站，不需要安装依赖，直接打开 [index.html](C:\Users\lxd_g\Documents\Codex\2026-07-07\q\outputs\xunhua-world\index.html) 就能看。

## 你以后主要改哪里

只需要改这几个地方：

1. `data/site-data.js`
2. `assets/trips/` 里的旅行照片和视频
3. `assets/cats/` 里的猫咪照片
4. `assets/shared/` 里的首页封面或公共图片

## 新增一次旅行怎么做

1. 把照片放进 `assets/trips/`
2. 如果有视频，也放进 `assets/trips/`
3. 打开 `data/site-data.js`
4. 在 `trips` 数组里照着现有格式复制一份，改成你的新旅行
5. 如果这个国家之前没出现过，再去 `countries` 数组补一条国家记录
6. 如果想让首页照片墙也出现新照片，再往 `photoWall` 数组里加几项
7. 如果想让时光轴同步显示，再往 `timeline` 数组里加一项

## `trips` 里一条旅行数据怎么理解

最外层字段：

- `id`: 唯一标识，不能和别的旅行重复
- `country`: 英文国家名，要和地图数据对应，例如 `Japan`
- `countryLabel`: 中文国家名
- `title`: 这次旅行标题
- `cover`: 封面图片路径
- `startDate` / `endDate`: 开始和结束日期，格式 `2026-07-07`
- `days`: 旅行天数
- `cities`: 去过的城市数组
- `note`: 这次旅行的概述
- `tags`: 关键词标签
- `featuredMemory`: 最难忘的瞬间
- `partnerNote`: 给彼此的话
- `entries`: 这次旅行里按天或按场景拆开的内容

`entries` 里的 `items` 支持两种：

### 图片

```js
{
  type: "image",
  src: "./assets/trips/your-photo.jpg",
  caption: "这张照片的标题",
  shotAt: "2026-07-07 18:20",
  location: "日本 东京",
  story: "这里写有趣的事情"
}
```

### 视频

```js
{
  type: "video",
  poster: "./assets/trips/your-video-cover.jpg",
  src: "./assets/trips/your-video.mp4",
  caption: "这段视频的标题",
  shotAt: "2026-07-07 18:20",
  location: "日本 东京",
  story: "这里写视频发生时的事"
}
```

## 新增一个去过的国家怎么做

去 `countries` 数组加一条：

```js
{
  name: "Italy",
  label: "意大利",
  tripIds: ["italy-2027"]
}
```

注意：

- `name` 必须是英文国家名，而且要和地图里的名字一致
- `tripIds` 里填的是这几个旅行的 `id`

## 更新四只猫内容怎么做

去 `cats` 数组里改对应猫咪：

- `avatar`: 猫咪头像
- `personality`: 性格介绍
- `moments`: 日常记录

`moments` 也可以一直往后加。

## 你现在可以直接替换的示例内容

目前站内很多图片是我先帮你放的占位图，用来把页面结构撑起来。  
你后面最值得优先替换的是：

- `assets/shared/hero-collage.jpg`
- `assets/trips/` 下所有 `trip-*.jpg`
- `assets/cats/` 下所有 `cat-*.jpg`

## 这版已经包含的功能

- 首页大图和统计
- 照片滚动墙
- 世界地图国家轮廓悬浮和点击
- 旅程档案切换
- 图片和视频全屏慢速放大弹层
- 猫咪独立模块
- 时光轴
- 关于我们与建站意义

## 后续最适合加的升级

如果你下一步还想继续做，我建议按这个顺序加：

1. 真实照片和真实视频替换
2. 未来心愿地图单独页面
3. 留言册
4. 密码访问
5. 后台编辑器
