## Preview

```bash
$ npm install
$ npm run build
$ npm run pm2:prod
```

## 流程图JSON字段

### nodeDataArray：图形节点

  key:唯一标识
  
  loc：位置

* 分组category：OfGroups (绿色矩形)

    title:分组名称(可编辑)
    

* 开始 category:start(绿色圆形)

    text:描述(固定)
    

* 结束 category:end(黑色圆形)

    text:描述(固定)
    

* 条件语句 category:if(紫色五边形)

    text:条件描述(可编辑)
    

* 循环分组category：ForGroups (蓝色矩形)

    title:循环分组名称(可编辑)
    
    times:循环次数(可编辑)

    default_value:默认值(可编辑)


* <del>错误输出 category:errOut(红色椭圆形)
    
    text:描述(固定)
  </del>

* 备注 category:comment(浅黄色五边形)

    text:描述(可编辑)
    

* <del>设置参数 category:set(棕色矩形)

    text:描述(固定)
    
    params:参数(可编辑) 右击添加 格式:```[{key:xxx,value:xxx},{key:xxx,value:xxx},{key:xxx},{value:xxx},{}]```，其中key或value可以单独出现或只显示一个空对象{}，这种时候需要将其排除
  </del>

* dll方法 category:item(黄色矩形)


    title:方法名称(唯一标识)
    
    desc:方法描述(可编辑)
    
    params:参数  格式:```[{key:xxx,value:xxx,is_output_parameter:false},{key:xxx,value:xxx,is_output_parameter:true}]```其中is_output_parameter表示该参数是否是输出参数

    namespace:命名空间
    
    <del>outcome_variable:结果变量(可编辑)</del>
    
    <del>deviation:结果允许误差(可编辑)</del>
    
    <del>upper_limit:结果上限(可编辑)</del>
    
    <del>lower_limit:结果下限(可编辑)</del>
    
    <del>errors:错误参数(可编辑) 右击添加  格式:同“设置参数”中的params</del>
    

>nodeDataArray每个对象中的**group:value**表示当前图形在哪一个分组下，value值为分组的key值。如：
```
{"title":"分组", "isGroup":true, "category":"OfGroups", "key":"123456", "loc":"-114 -429"}
{"text":"错误输出", "category":"errOut", "key":"xxxxxx", "loc":"-295 -423", "group":"123456"}
```
表示‘错误输出’这个图形在key为123456的分组之中


### linkDataArray：图形连线

from:线的起点，指向nodeDataArray中对象的key

to:线的终点，指向nodeDataArray中对象的key

linkDataArray[i].condition=YES/NO : 判断是否符合条件





