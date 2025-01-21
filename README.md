## TODO 瀑布流图片展示+虚拟滚动
vue-waterfall-plugin-next+vue-virtual-scroller

## TODO 接入图配文 文生图大模型

## number类型溢出问题
由于后端id字段为long类型，到前端js会发生溢出，后端响应中将long以及int等number类型转换成了string类型
某些非id字段在请求时为number类型，会发生类型不匹配问题
1. 在响应拦截器中将非id字段的为数字的string类型字段转换成number类型
2. 借助AI工具修改openapi生成的TS类型，将id字段改为string

## 图片跨域问题
访问对象存储图片时出现跨域问题，在对象存储配置跨域问题，经过排查是浏览器HTTP缓存的问题，禁用缓存即可恢复使用

## 截图实现原理 html2canvas
1. 获取img元素
2. 创建canvas元素操作img
3. 使用canvas裁剪图片 canvas.drawImage(img)
    截图的区域可以根据截图框相对于图片的偏移量来计算
4. 返回截图的二进制流Blob，canvas.toBlob
