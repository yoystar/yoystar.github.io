---
title: MapStruct对象映射工具
icon: page
order: 6
author: yoystar
date: 2025-03-15
tag:
  - MapStruct
  - 映射
  - 对象转换
star: true 


---

#### 1. 官网：

https://mapstruct.org/

#### 2. 简介：

MapStruct 是一个 Java 注解处理器，用于自动生成类型安全的对象映射类。它可以帮助在不同的 Java Bean 之间进行数据转换，而无需手动编写转换代码。

#### 3. 使用步骤：

##### 3.1. 创建一个Convert接口：

注意：该转换器仅支持<<<单向转换>>>，只能从BaseMapper<ClassName_1, ClassName_2>中的ClassName_1单向转换成ClassName_2，如果需要反向转换，需要创建一个新的接口文件。

ModelInfoVo转换成ModelInfo示例:

```java
package com.hbmt.common.iot.bean.terminal.convert;

import com.hbmt.common.iot.bean.terminal.ModelInfo;
import com.hbmt.common.iot.bean.terminal.vo.ModelInfoVo;
import io.github.linpeilie.BaseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

/**
 * ModelInfo设备模型 Vo数据转换器
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ModelInfoVoToModelInfoConvert extends BaseMapper<ModelInfoVo, ModelInfo> {
}
```

##### 3.2. 添加工具类MapstructUtils（如果已有，无需处理）：

```java
package com.hbmt.common.core.utils;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ObjectUtil;
import io.github.linpeilie.Converter;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Mapstruct 工具类
 * <p>参考文档：<a href="https://mapstruct.plus/introduction/quick-start.html">mapstruct-plus</a></p>
 *
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MapstructUtils {

    private final static Converter CONVERTER = SpringUtils.getBean(Converter.class);

    /**
     * 将 T 类型对象，转换为 desc 类型的对象并返回
     *
     * @param source 数据来源实体
     * @param desc   描述对象 转换后的对象
     * @return desc
     */
    public static <T, V> V convert(T source, Class<V> desc) {
        if (ObjectUtil.isNull(source)) {
            return null;
        }
        if (ObjectUtil.isNull(desc)) {
            return null;
        }
        return CONVERTER.convert(source, desc);
    }

    /**
     * 将 T 类型对象，按照配置的映射字段规则，给 desc 类型的对象赋值并返回 desc 对象
     *
     * @param source 数据来源实体
     * @param desc   转换后的对象
     * @return desc
     */
    public static <T, V> V convert(T source, V desc) {
        if (ObjectUtil.isNull(source)) {
            return null;
        }
        if (ObjectUtil.isNull(desc)) {
            return null;
        }
        return CONVERTER.convert(source, desc);
    }

    /**
     * 将 T 类型的集合，转换为 desc 类型的集合并返回
     *
     * @param sourceList 数据来源实体列表
     * @param desc       描述对象 转换后的对象
     * @return desc
     */
    public static <T, V> List<V> convert(List<T> sourceList, Class<V> desc) {
        if (ObjectUtil.isNull(sourceList)) {
            return null;
        }
        if (CollUtil.isEmpty(sourceList)) {
            return CollUtil.newArrayList();
        }
        return CONVERTER.convert(sourceList, desc);
    }

    /**
     * 将 Map 转换为 beanClass 类型的集合并返回
     *
     * @param map       数据来源
     * @param beanClass bean类
     * @return bean对象
     */
    public static <T> T convert(Map<String, Object> map, Class<T> beanClass) {
        if (MapUtil.isEmpty(map)) {
            return null;
        }
        if (ObjectUtil.isNull(beanClass)) {
            return null;
        }
        return CONVERTER.convert(map, beanClass);
    }

}
```

##### 3.3. 使用MapstructUtils工具类执行转换：

```java
ModelInfo modelInfo = MapstructUtils.convert(modelInfoVo, ModelInfo.class);
```

##### 3.4. 如果待转换的实体类中，又嵌套了其他的实体类：

例如：<ModelInfoVo中的CpeConfigVo>需要转换成<ModelInfo中CpeConfig>

ModelInfoVo和ModelInfo的待映射实体类<<<字段名需要相同>>>

<details class="lake-collapse"><summary id="u0e387099"><span class="ne-text">ModelInfoVo类中的CpeConfigVo实体类字段 命名成：cpeConfig</span></summary><p id="u49856e0f" class="ne-p" style="margin: 0; padding: 0; min-height: 24px"><img src="https://github.com/user-attachments/assets/b862f084-9ed4-4101-a5e8-b4e0a7cea04f" width="734" title="" crop="0,0,1,1" id="uXhV0" class="ne-image"></p></details>

<details class="lake-collapse"><summary id="u3226bbc8"><span class="ne-text">ModelInfo类中的CpeConfig实体类字段 命名成：cpeConfig</span></summary><p id="u83d556c2" class="ne-p" style="margin: 0; padding: 0; min-height: 24px"><img src="https://github.com/user-attachments/assets/2c75047c-58d5-44d3-8f35-d2d76362e9fd" width="592" title="" crop="0,0,1,1" id="u3875882b" class="ne-image"></p></details>


##### 3.5. 有了已经定义的类型转换类，待转换的实体类中，又嵌套了其他的实体类,导致的异常：

编译异常log：

```shell
D:\Code_IDEA\HiTMService\hbmt-tms-common\common-iot\target\generated-sources\annotations\com\hbmt\common\iot\bean\terminal\vo\DeviceInfoVoToDeviceInfoMapper.java:14:8
java: Ambiguous mapping methods found for mapping property "ModelInfoVo modelInfo" to ModelInfo: ModelInfo ConvertMapperAdapter.com_hbmt_common_iot_bean_terminal_vo_ModelInfoVoToModelInfo(ModelInfoVo param), ModelInfo ModelInfoVoToModelInfoConvert.convert(ModelInfoVo arg0). See https://mapstruct.org/faq/#ambiguous for more info. Occured at 'T convert(S arg0)' in 'BaseMapper'.
```

解决方案：

1.给被嵌套的Conventer添加@Named注解：

<img width="909" height="196" alt="image" src="https://github.com/user-attachments/assets/7aabd0b6-3fc1-4b89-9405-43892f46a1bc" />


2.待转换类在使用添加如下修改(修改第1步后如果生效，且convert的impl实现类中已经生成了被嵌套对象的转换，第2步可以省略)：

<img width="940" height="299" alt="image" src="https://github.com/user-attachments/assets/761a7012-77f0-45b3-9002-98001121fc42" />


#### 4. 问题调查方法：

如果实体类转换异常，或者嵌套的实体类转换异常，需要查看如下目录的文件：

```xml
target/classes/com/hbmt/common/iot/bean/terminal/convert/AAAToBBBConvertImpl.class
```

查看Convert接口的实现类，其中是否有参数转换或者嵌套实体类转换的代码，如下图所示：

<img width="916" height="859" alt="image" src="https://github.com/user-attachments/assets/c6d2898e-6f93-4384-991e-a6f9af68db5e" />





如果嵌套的实体类没有上图的转换过程，需要检查转换两端的实体类中，嵌套实体类的<字段名是否相同>

