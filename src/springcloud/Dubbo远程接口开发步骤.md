---
title: Dubbo远程接口开发步骤
icon: page
order: 2
author: yoystar
date: 2025-06-16
tag:
  - SpringCloud
  - Dubbo
  - 远程调用
  - RPC
star: true 
---

##### Dubbo远程接口开发步骤：

<details class="lake-collapse"><summary id="ud2b1b0a4" style="text-align: left"><span class="ne-text">以如下两个模块为例：</span></summary><p id="ud11483e2" class="ne-p" style="margin: 0; padding: 0; min-height: 24px; text-align: left"><span class="ne-text">服务调用方：hbmt-tms-rpc-tr069</span></p><p id="u6d187eb3" class="ne-p" style="margin: 0; padding: 0; min-height: 24px; text-align: left"><span class="ne-text">服务被调用方：hbmt-tms-terminal</span></p><p id="u397c92f6" class="ne-p" style="margin: 0; padding: 0; min-height: 24px; text-align: left"><span class="ne-text"></span></p><p id="u22ffd39d" class="ne-p" style="margin: 0; padding: 0; min-height: 24px; text-align: left"><span class="ne-text">1-3步：api-terminal的处理</span></p><p id="u3acf35cb" class="ne-p" style="margin: 0; padding: 0; min-height: 24px; text-align: left"><span class="ne-text">4-6步：被调用方hbmt-tms-terminal的处理</span></p><p id="u5aa42858" class="ne-p" style="margin: 0; padding: 0; min-height: 24px; text-align: left"><span class="ne-text">7-9步：调用方hbmt-tms-rpc-tr069的处理</span></p></details>

##### 1.如果是新模块,添加Dubbo的rpc远程调用，需要在hbmt-tms-api模块下新建被调用方Modules模块，目录层级如下：

![img](https://cdn.nlark.com/yuque/0/2024/png/42586141/1714470419672-cfe6abd8-dbb0-441f-b814-a91a173d009f.png)

##### 2.被调用方从domain中拷贝vo、bo以及对象实体类到api-xxx的目录结构中，并重命名成RemoteXXXXX

![img](https://cdn.nlark.com/yuque/0/2024/png/42586141/1715072979104-18f530e7-a0c6-42a3-adba-38b87d2f6c93.png)

##### 3.被调用方在api-terminal模块下，新建RemoteXXXXService的接口，里面定义需要被调用的远程方法名：

```java
package com.hbmt.terminal.api;

import com.hbmt.terminal.api.domain.vo.RemoteCpeConfigVo;

/**
 * CPE配置Service远程接口
 *
 * @author HBMT-DEV
 * @date 2024-03-25
 */
public interface RemoteCpeConfigService {

    /**
     * 查询CPE配置
     *
     * @param id 终端id
     * @return 客户端对象
     */
    RemoteCpeConfigVo queryById(String id);
}
```

##### 4.被调用方hbmt-tms-terminal模块的pom文件中引入api-terminal的依赖：

```plain
<dependency>
    <groupId>com.hbmt</groupId>
    <artifactId>api-terminal</artifactId>
</dependency>
```

##### 5. 被调用方hbmt-tms-terminal模块，目录结构中添加/domain/convert目录，并在其中添加XXXXVoConvert对象转换接口

![img](https://cdn.nlark.com/yuque/0/2024/png/42586141/1714471251547-b39e6dd7-14b4-4338-bc70-13d0f37a006b.png?x-oss-process=image%2Fcrop%2Cx_0%2Cy_0%2Cw_461%2Ch_359)

XXXXVoConvert类型转换类：

**BaseMapper后为为待转换的泛型，需要根据实际需求修改**

```java
package com.hbmt.terminal.domain.convert;

import com.hbmt.terminal.api.domain.vo.RemoteCpeConfigVo;
import com.hbmt.terminal.domain.vo.CpeConfigVo;
import io.github.linpeilie.BaseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

/**
 * Cpe配置数据转换器
 * BaseMapper后为为待转换的泛型，需要根据实际需求修改
 *
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CpeConfigVoConvert extends BaseMapper<CpeConfigVo, RemoteCpeConfigVo> {
}
```

##### 6.被调用方hbmt-tms-terminal模块，目录结构中添加/dubbo目录，并在其中添加RemoteXXXXService接口的实现类

![img](https://cdn.nlark.com/yuque/0/2024/png/42586141/1714471251547-b39e6dd7-14b4-4338-bc70-13d0f37a006b.png)

RemoteXXXXServiceImpl实现类中Override重写接口的方法，执行具体的操作逻辑，并转换返回结果XXXXVo类型为RemoteXXXXVo：

注意，该类上需要**添加@DubboService注解**，用于标注这是一个Dubbo远程调用类。

```java
package com.hbmt.terminal.dubbo;

import com.hbmt.common.core.utils.MapstructUtils;
import com.hbmt.terminal.api.RemoteCpeConfigService;
import com.hbmt.terminal.api.domain.vo.RemoteCpeConfigVo;
import com.hbmt.terminal.domain.vo.CpeConfigVo;
import com.hbmt.terminal.service.ICpeConfigService;
import lombok.RequiredArgsConstructor;
import org.apache.dubbo.config.annotation.DubboService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@DubboService
public class RemoteCpeConfigServiceImpl implements RemoteCpeConfigService {

    private final ICpeConfigService cpeConfigService;

    /**
     * 查询CPE配置
     *
     * @param id
     */
    @Override
    public RemoteCpeConfigVo queryById(String id) {
        CpeConfigVo vo = cpeConfigService.queryById(id);
        System.out.println(vo);
        return MapstructUtils.convert(vo, RemoteCpeConfigVo.class);
    }
}
```





##### 7.调用方hbmt-tms-tr069模块，pom文件中引入api-terminal的依赖：

```yaml
<dependency>
    <groupId>com.hbmt</groupId>
    <artifactId>api-terminal</artifactId>
</dependency>
```

##### 8.调用方hbmt-tms-tr069模块，将被调用的远程服务，依赖注入到Spring容器中，并调用远程方法：

使用**@DubboReference注解**，实现Dubbo服务的依赖注入

然后像本地方法调用一样，运行远程方法

```java
package com.hbmt.tr069.service.impl;

import com.hbmt.terminal.api.RemoteCpeConfigService;
import com.hbmt.tr069.service.IAcsService;
import lombok.RequiredArgsConstructor;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AcsServiceImpl implements IAcsService {

    @DubboReference
    RemoteCpeConfigService remoteCpeConfigService;

    /**
     * 重启设备
     */
    @Override
    public Boolean getRemoteCpeConfig(String sn) {
        System.out.println("----------------------------->sn:"+ sn + " Rebooting...");
        //像本地方法一样，调用远程方法
        System.out.println(remoteCpeConfigService.queryById("1"));

        System.out.println("sn:"+ sn + " Reboot Done!");
        return true;
    }

}
```

##### 9.调用方hbmt-tms-tr069模块，在Filter过滤器等位置，无法使用@DubboReference注解，则使用如下方法，直接从Spring的IOC容器中获取

```java
// CPE配置参数
RemoteCpeConfigService remoteCpeConfigService;
//Filter中获取Dubbo远程服务RemoteCpeConfigService
ApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(filterConfig.getServletContext());
remoteCpeConfigService = context.getBean(RemoteCpeConfigService.class);
```

10.设置Dubbo调用的loadbalance

```java
//------------------------------------------------------------
//1.编写loadbanlance文件
package com.hbmt.common.loadbalance.core;

import cn.hutool.core.net.NetUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.dubbo.common.URL;
import org.apache.dubbo.rpc.Invocation;
import org.apache.dubbo.rpc.Invoker;
import org.apache.dubbo.rpc.cluster.loadbalance.AbstractLoadBalance;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * 自定义 Dubbo 负载均衡算法
 *
 */
@Slf4j
public class CustomDubboLoadBalancer extends AbstractLoadBalance {

    @Override
    protected <T> Invoker<T> doSelect(List<Invoker<T>> invokers, URL url, Invocation invocation) {
        for (Invoker<T> invoker : invokers) {
            //TODO：优先负载均衡本地服务，生产环境需要处理，或者注释掉common-loadbanlancer依赖
            if (NetUtil.localIpv4s().contains(invoker.getUrl().getHost())) {
                log.warn("Dubbo LoadBanlance TO ------------------->LOCAL SERVER >>>IP = " + invoker.getUrl().getHost());
                return invoker;
            }
        }
        return invokers.get(ThreadLocalRandom.current().nextInt(invokers.size()));
    }
}

//------------------------------------------------------------
//2.resources/META-INF/dubbo下创建org.apache.dubbo.rpc.cluster.LoadBalance文件，其中添加内容：
customDubboLoadBalancer=com.hbmt.common.loadbalance.core.CustomDubboLoadBalancer

//------------------------------------------------------------
//3.@DubboReference中设置loadbanlance
@DubboReference(loadbalance = "customDubboLoadBalancer")
private RemoteTr069AlarmLogService remoteTr069AlarmLogService;
```