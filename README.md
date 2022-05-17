# hexo-asset-image
官方`hexo-asset-image`插件，在同时使用`hexo-abbrlink`时，会导致图片路径错误。

本插件是基于官方插件的修改，为了兼容`hexo-abbrlink`插件


Give asset image in hexo a absolutely path automatically

# Usege

```shell
npm install https://github.com/foreveryang321/hexo-asset-image.git --save
```

# Example

> 同时使用hexo-abbrlink

```yaml
root: /
permalink: posts/:abbrlink.html
abbrlink:
  alg: crc32  # 算法：crc16(default) and crc32
  rep: hex    # 进制：dec(default) and hex
```

> 目录结构

```shell
MacGesture2-Publish
├── images/apppicker.jpg
├── logo.jpg
└── rules.jpg
MacGesture2-Publish.md
```

> 用法

Make sure `post_asset_folder: true` in your `_config.yml`.

```
![](./MacGesture2-Publish/images/logo.jpg)
```