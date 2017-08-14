---
title: utility
description: 基础教程
author: imink
group: HELPER
index: [2, 0]
---

## mapValues(obj, handler)
用于轮询处理对象，返回一个经过处理过的新的对象，类似适用于对象的 reduce 方法

### 参数/props 
#### obj - 需要处理的对象
#### handler - 处理函数
handler 接受参数为 value, key, 即 obj 的键值对。

### 返回值
返回经过处理的新的对象

### 用法

```js
import { mapValues } from '@cicada/render/lib/util'
const oldObj = {
  one: 1,
  two: 2,
  three: 3
}
const newObj = mapValues(oldObj, (value, key) => { return value + 1})

```