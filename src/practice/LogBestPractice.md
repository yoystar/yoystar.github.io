---
title: Log日志记录最佳实践
icon: page
order: 1
author: yoystar
date: 2023-02-16
tag:
  - 日志记录
  - 最佳实践
  - Log
star: true
---

##### <font style="color:rgb(24, 25, 28);">1.不要在日志记录过程中中断业务流程 </font>
```java
//错误示例：
public void createShop(Shop shop){
    //shop 可能为null，或者name可能为null，导致空指针，中断业务流程
    log.info("create and print log:{}",shop.getName().toLowCase());
    //业务逻辑
}
```

##### <font style="color:rgb(24, 25, 28);">2.不要使用System.out.println输出值</font>
```java
//System.out.println并没有打印到日志文件中，只会在终端输出，无法对日志采集或者收集；
//同时println方法使用了synchronized关键字，带锁且同步，性能低，资源消耗较多。

//正确示例：
//使用日志框架记录日志信息
public void record_log(){
    log.info("this method to record log is good...");
}

//项目中使用log输出的格式，需要包含类名+方法名等
log.inf("<类名> >>> <方法名>：<参数1>:{}, <参数2>:{}", value1, value2);
```

##### <font style="color:rgb(24, 25, 28);">3.禁止直接使用Log4j或者LogBack的API</font>
```java
//禁止使用Log4j或者LogBack的API，直接进行日志操作，会造成日志系统跟自己的业务系统强耦合；

//正确示例：
//使用slf4j门面模式的日志框架，有如下两种实现方法
//1.使用lombok的@Slf4j注解;
@Slf4j
public class test{
    //...
}

//2.使用slf4j的工厂类API，直接获取Logger变量，使用Logger打印日志
import org.slf4j.Logger;
import org.slf4j.LoggerFactory ;
private static final Logger logger = LoggerFactory.getLogger(xxx.class);

```

##### <font style="color:rgb(24, 25, 28);">4.对日志的输出，禁用拼接字符串，推荐使用占位符的方式。</font>
```java
//错误示例：
//使用字符串拼接的日志输出，虽然根据日志输出等级的配置，日志可能不输出，
//但是会执行字符串拼接操作，如果是对象，还会执行toString方法，浪费系统资源。
public void hello (String name){
    log.trace("trace hello:"+name);
    log.debug("debug hello:"+name);
    log.info("info hello:"+name);
}

//正确示例：
public void hello (String name){
    log.trace("trace hello:{}", name);
    log.debug("debug hello:{}", name);
    log.info("info hello:{}", name);
}


```

##### <font style="color:rgb(24, 25, 28);">5.exception异常打印，禁用e.printStrackTrace()</font>
```java
//exception异常打印，禁用e.printStrackTrace()
//e.printStrackTrace会生成字符串的堆栈信息，会占用字符串常量池内存空间，造成系统阻塞。

//错误示例：
pbulic void hello(){
    try{
        //业务代码...
    }cache (Exception e){
        e.printStrackTrace();
    }
}

//错误示例：
//e.getMessage错误原因没有记录写详细的堆栈异常信息，只记录错误基本描述信息，不利于排查问题
pbulic void hello(){
    try{
        //业务代码...
    }cache (Exception e){
        log.err("execute failed:",e.getMessage());
    }
}

//正确示例：
pbulic void hello(){
    try{
        //业务代码...
    }cache (Exception e){
        log.err("execute failed:",e);
    }
}
```

##### <font style="color:rgb(24, 25, 28);">6.exception异常打印，不要记录日志后又抛出异常</font>
```java
//错误示例：
//不要记录日志后又继续throw e抛出异常，抛出去的异常一定会在外层再被处理，造成重复异常记录
pbulic void hello(){
    try{
        //业务代码...
    }cache (Exception e){
        log.err("execute failed:",e);
        throw e;
    }
}

//正确方法：
pbulic void hello(){
    try{
        //业务代码...
    }cache (Exception e){
        log.err("execute failed:",e);
    }
}
```

##### <font style="color:rgb(24, 25, 28);">7.日志内禁止使用JSON工具的序列化对象</font>
```java
//错误示例：
//JSON工具使用get方法将对象序列化，如果get方法被重写，有存在抛出异常的情况。
public void hello(Object data){
    log.info("print log,data={}",JSON.toJSONString(data));
}

//正确示例:
//使用自定义的toString方法
public void hello(Object data){
    log.info("hello and print log,data={}",data);
}
```

##### <font style="color:rgb(24, 25, 28);">8.不要打印无意义的日志</font>
```java
//错误示例：
//不带任何业务信息的日志，对排查故障毫无意义
public void hello(){
    log.info("hello and print log");
    //业务逻辑...
}

public void hello(){
    hello1();
    log.info("hello1 111");
    hello2();
    log.info("hello2 222");
}

//正确示例：
//要携带相关业务信息，有利于排查问题快速定位到原因
public void hello(String id){
    log.info("hello and print log,id={}", id);
    //业务逻辑...
}

```

##### <font style="color:rgb(24, 25, 28);">9.不要在循环中打印日志</font>
```java
//错误示例：
//不要在循环中打印日志
public void hello(){
    for(String s : strList){
        log.info("hello and print log : {}", s);
        //业务逻辑...
    }
}
```

##### <font style="color:rgb(24, 25, 28);">10.不要重复打印相同日志</font>
```java
//错误示例：
//打印相同日志
public void hello(){
    log.info("hello and print log : {}", s);
    word(s);
}
private void word(String s){
    log.info("hello and print log : {}", s);
}
```

##### <font style="color:rgb(24, 25, 28);">11.重要的方法要记录调用日志</font>
```java
//正确示例：
//重要方法在入口处记录调用日志，在出口处记录参数等
public String doSomething(String id, String type){
    log.info("start: {}, {}", id, type);
    String res = process(id, type);
    log.info("end: {}, {}, {}", id, type, res);
}
```

##### 12.建议只打印必要属性，避免打印整个对象（属性可能会很多）
```java
//错误示例：
private void word(Data data){
    log.info("hello and print log : {}", data);
    //业务逻辑...
}

//正确示例：
private void word(Data data){
    log.info("hello and print log : id={}, type={}", data.getId(), data.getType());
    //业务逻辑...
}
```

##### <font style="color:rgb(24, 25, 28);">13.不要滥用error级别的日志</font>
```java
//error意味着系统发生了非常严重的问题，必须有人介入立即处理，如果系统配置了告警系统，一般warn不会告警，但是error级别的问题，会根据监控配置，进行电话、短信或者邮件告警。
```

##### 14.exception捕获相关内容
<font style="color:rgb(89, 97, 114);">容易错误的捕获异常方式：</font>

```java
try {
  // 业务代码
  // ...
  Thread.sleep(1000L);
} catch (Exception e) {
}
```

+ <font style="color:rgb(89, 97, 114);">捕获了过于通用的异常</font><font style="color:rgb(89, 97, 114);"> </font>`Exception`<font style="color:rgb(89, 97, 114);">，应改为对应的</font><font style="color:rgb(89, 97, 114);"> </font>`InterruptedException`<font style="color:rgb(89, 97, 114);">。这么做的目的是因为：第一方便阅读代码，知道可能会出现什么具体的异常；第二不捕获意料之外的异常。</font>
+ <font style="color:rgb(89, 97, 114);">不要捕获异常之后啥都不做（生吞异常）。这就是给自己挖坑，之后程序遇到问题，很难定位到这里。</font>

<font style="color:rgb(89, 97, 114);"></font>

```java
try {
    // 业务代码
    // …
} catch (IOException e) {
    e.printStackTrace();
}
```

+ <font style="color:rgb(89, 97, 114);">自娱自乐是 ok 的，但不要放到生产环境中。因为 </font>`e.printStackTrace()`<font style="color:rgb(89, 97, 114);"> 的功能是：Prints this throwable and its backtrace to the </font>**<font style="color:rgb(89, 97, 114);">standard error stream。</font>**<font style="color:rgb(89, 97, 114);">很难判断它到底输出到哪里去了。</font>
+ <font style="color:rgb(89, 97, 114);">应该用成熟的日志工具如 Slf4j 等。</font>

<font style="color:rgb(89, 97, 114);"></font>

```java
try {
    // 业务逻辑 A
    // 业务逻辑 B
    // 业务逻辑 C
    // ...
} catch (Exception e) {
    log.error("have exception", e);
}
```

+ <font style="color:rgb(89, 97, 114);">不能因为怕丢失异常捕获，就把一大段代码都框到一个 try-catch 模块中。</font>
+ <font style="color:rgb(89, 97, 114);">try-catch 代码段会产生额外的</font><font style="color:#DF2A3F;">性能开销</font><font style="color:rgb(89, 97, 114);">，它往往会影响 JVM 对代码进行优化。</font>

<font style="color:rgb(89, 97, 114);"></font>

###### <font style="color:rgb(89, 97, 114);">为什么代码中经常能看到 </font>`catch XXException`<font style="color:rgb(89, 97, 114);">，却几乎看不到 </font>`catch XXError`<font style="color:rgb(89, 97, 114);"> 或 </font>`catch Throwable`<font style="color:rgb(89, 97, 114);"> 呢？</font>
+ <font style="color:rgb(89, 97, 114);">Exception 才是应该关注处理的异常，这种异常处理后还可以使程序正常运行。</font>
+ <font style="color:rgb(89, 97, 114);">Error 属于重大问题，是会使程序直接崩溃的，捕获了也没什么用，很难让程序再「活」过来。</font>
+ <font style="color:rgb(89, 97, 114);">至于 Throwable，首先不应该捕获这么宽泛的问题（比捕获 Exception 还严重），第二其中包含了 Error 也不是应该处理的问题。</font>
+ <font style="color:rgb(89, 97, 114);">因此，Error 和 Throwable 除非你明确知道在干什么，否则不要捕获这两种。</font>

<font style="color:rgb(77, 77, 77);"></font>

###### <font style="color:rgb(77, 77, 77);">catch和throw的区别：</font>
<font style="color:rgb(77, 77, 77);">对于可能会有异常的程序块，用try{}包住，用catch{}处理，如果try中有异常的话，程序不会中断，而是转到catch中执行。</font>

<font style="color:rgb(77, 77, 77);">而throw语句可以引发明确的异常，程序到了throw语句就立即停止，不会执行后面的程序。</font>

