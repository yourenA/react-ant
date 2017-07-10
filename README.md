## Preview

```bash
$ npm install
$ npm start
```

## 流程图JSON字段

### nodeDataArray：图形节点

  key:唯一标识
  
  loc：位置

* 分组category：ofGroups (绿色矩形)

    title:分组名称(可编辑)
    

* 开始 category:start(绿色圆形)

    text:描述(固定)
    

* 结束 category:end(黑色圆形)

    text:描述(固定)
    

* 条件语句 category:if(蓝色菱形)

    text:条件描述(可编辑)
    

* 循环语句 category:for(紫色菱形)

    text:循环次数描述(可编辑)
    

* 错误输出 category:errOut(红色椭圆形)
    
    text:描述(固定)
    

* 备注 category:comment(浅黄色五边形)

    text:描述(可编辑)
    

* 设置参数 category:set(棕色矩形)

    text:描述(固定)
    params:参数(可编辑) 格式:```[{key:xxx,value:xxx},{key:xxx,value:xxx},{key:xxx},{value:xxx},{}]```，其中key或value可以单独出现或只显示一个空对象{}，这种时候需要将其排除


* 语句 category:item(黄色矩形)

    title:语句标题(可编辑)
    
    params:参数(可编辑) 格式:同“设置参数”中的params
    
    errors:错误参数(可编辑) 格式:同“设置参数”中的params
    

>nodeDataArray每个对象中的group:value表示当前图形在哪一个分组下，value值为分组的key值。如：
```
{"title":"分组", "isGroup":true, "category":"OfGroups", "key":"123456", "loc":"-114 -429"}
{"text":"错误输出", "category":"errOut", "key":"xxxxxx", "loc":"-295 -423", "group":"123456"}
```
表示‘错误输出’这个图形在key为123456的分组之中


### linkDataArray：图形连线

from:线的起点，指向nodeDataArray中对象的key

to:线的终点，指向nodeDataArray中对象的key

linkText:在“*条件语句*”或“*循环语句*”连线编辑后会出现这个字段，当没有编辑不会出现这个字段







