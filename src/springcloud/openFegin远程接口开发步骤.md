---
title: openFegin远程接口开发步骤
icon: page
order: 1
author: yoystar
date: 2025-06-16
tag:
  - SpringCloud
  - openFegin
  - 远程调用
star: true 
---

##### openFegin远程接口开发步骤：

<details class="lake-collapse"><summary id="uc899d89b" style="text-align: left"><span class="ne-text">以如下两个模块为例：</span></summary><p id="ud11483e2" class="ne-p" style="margin: 0; padding: 0; min-height: 24px; text-align: left"><span class="ne-text">服务调用方：hbmt-tms-rpc-tr069</span></p><p id="u6d187eb3" class="ne-p" style="margin: 0; padding: 0; min-height: 24px; text-align: left"><span class="ne-text">服务被调用方：hbmt-tms-terminal</span></p><p id="u397c92f6" class="ne-p" style="margin: 0; padding: 0; min-height: 24px; text-align: left"><span class="ne-text"></span></p><p id="u22ffd39d" class="ne-p" style="margin: 0; padding: 0; min-height: 24px; text-align: left"><span class="ne-text">1-3步：api-terminal的处理</span></p><p id="u3acf35cb" class="ne-p" style="margin: 0; padding: 0; min-height: 24px; text-align: left"><span class="ne-text">4-6步：被调用方hbmt-tms-terminal的处理</span></p><p id="u5aa42858" class="ne-p" style="margin: 0; padding: 0; min-height: 24px; text-align: left"><span class="ne-text">7-9步：调用方hbmt-tms-rpc-tr069的处理</span></p></details>

1.添加依赖

在pom.xml文件中，添加Spring Cloud OpenFeign的依赖：

```yaml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

2.启用Feign

在Spring Boot主应用类上，添加@EnableFeignClients注解来启用Feign：

```java
@SpringBootApplication
@EnableFeignClients
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

3.定义Feign客户端

创建一个接口并使用@FeignClient注解来定义一个Feign客户端：

```java
@FeignClient(value = "myclient", url = "http://example.com")
public interface MyClient {
    @GetMapping("/some-endpoint")
    String getSomeData();
}
```

myclient是Feign客户端的名称，http://example.com是要访问的服务(服务提供方)的URL，/some-endpoint是你要访问的服务(服务提供方)的具体端点。

4.使用Feign客户端

```java
@Service
public class MyService {
    private final MyClient myClient;

    public MyService(MyClient myClient) {
        this.myClient = myClient;
    }

    public String getSomeData() {
        return myClient.getSomeData();
    }
}
```

你可以在你的服务中注入Feign客户端并使用它来调用远程服务：