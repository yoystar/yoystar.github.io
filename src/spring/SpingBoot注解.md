---
title: SpringBoot注解
icon: page
order: 1
author: yoystar
date: 2020-06-16
tag:
  - Spring
  - SpringBoot
  - 注解
star: true
---

## **<font style="color:rgb(0, 0, 0);">01、背景</font>**
<font style="color:rgb(0, 0, 0);">基</font>于SpringBoot开发<font style="color:rgb(0, 0, 0);">与常规的基于Spring开发的项目最大的不同之处：SpringBoot 里面提供了大量的注解用于快速开发，而且非常简单，基本可以做到开箱即用。</font>

![](https://cdn.nlark.com/yuque/0/2024/png/42586141/1724235096118-43059c50-5cc1-4b3e-857c-68078178a54a.png)

## **<font style="color:rgb(0, 0, 0);">02、常用注解</font>**
#### **<font style="color:rgb(13, 12, 12);">2.1、SpringMVC 相关注解</font>**
+ `<font style="color:rgb(1, 1, 1);">@Controller</font>`

<font style="color:rgb(0, 0, 0);">通常用于修饰</font>`<font style="color:rgb(239, 112, 96);">controller</font>`<font style="color:rgb(0, 0, 0);">层的组件，由控制器负责将用户发来的</font>`<font style="color:rgb(239, 112, 96);">URL</font>`<font style="color:rgb(0, 0, 0);">请求转发到对应的服务接口，通常还需要配合注解</font>`<font style="color:rgb(239, 112, 96);">@RequestMapping</font>`<font style="color:rgb(0, 0, 0);">使用。</font>

+ `<font style="color:rgb(1, 1, 1);">@RequestMapping</font>`

<font style="color:rgb(0, 0, 0);">提供路由信息，负责</font>`<font style="color:rgb(239, 112, 96);">URL</font>`<font style="color:rgb(0, 0, 0);">到</font>`<font style="color:rgb(239, 112, 96);">Controller</font>`<font style="color:rgb(0, 0, 0);">中具体函数的映射，当用于方法上时，可以指定请求协议，比如</font>`<font style="color:rgb(239, 112, 96);">GET</font>`<font style="color:rgb(0, 0, 0);">、</font>`<font style="color:rgb(239, 112, 96);">POST</font>`<font style="color:rgb(0, 0, 0);">、</font>`<font style="color:rgb(239, 112, 96);">PUT</font>`<font style="color:rgb(0, 0, 0);">、</font>`<font style="color:rgb(239, 112, 96);">DELETE</font>`<font style="color:rgb(0, 0, 0);">等等。</font>

+ `<font style="color:rgb(1, 1, 1);">@RequestBody</font>`

<font style="color:rgb(0, 0, 0);">表示请求体的</font>`<font style="color:rgb(239, 112, 96);">Content-Type</font>`<font style="color:rgb(0, 0, 0);">必须为</font>`<font style="color:rgb(239, 112, 96);">application/json</font>`<font style="color:rgb(0, 0, 0);">格式的数据，接收到数据之后会自动将数据绑定到</font>`<font style="color:rgb(239, 112, 96);">Java</font>`<font style="color:rgb(0, 0, 0);">对象上去</font>

+ `<font style="color:rgb(1, 1, 1);">@ResponseBody</font>`

<font style="color:rgb(0, 0, 0);">表示该方法的返回结果直接写入</font>`<font style="color:rgb(239, 112, 96);">HTTP response body</font>`<font style="color:rgb(0, 0, 0);">中，返回数据的格式为</font>`<font style="color:rgb(239, 112, 96);">application/json</font>`

<font style="color:rgb(0, 0, 0);">比如，请求参数为</font>`<font style="color:rgb(239, 112, 96);">json</font>`<font style="color:rgb(0, 0, 0);">格式，返回参数也为</font>`<font style="color:rgb(239, 112, 96);">json</font>`<font style="color:rgb(0, 0, 0);">格式，示例代码如下：</font>

```java
/**
 * 登录服务
 */
@Controller
@RequestMapping("api")
public class LoginController {

    /**
     * 登录请求，post请求协议，请求参数数据格式为json
     * @param request
     */
    @RequestMapping(value = "login", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity login(@RequestBody UserLoginDTO request){
        //...业务处理
        return new ResponseEntity(HttpStatus.OK);
    }
}
```

+ `<font style="color:rgb(1, 1, 1);">@RestController</font>`

<font style="color:rgb(0, 0, 0);">和</font>`<font style="color:rgb(239, 112, 96);">@Controller</font>`<font style="color:rgb(0, 0, 0);">一样，用于标注控制层组件，不同的地方在于：它是</font>`<font style="color:rgb(239, 112, 96);">@ResponseBody</font>`<font style="color:rgb(0, 0, 0);">和</font>`<font style="color:rgb(239, 112, 96);">@Controller</font>`<font style="color:rgb(0, 0, 0);">的合集，也就是说，在当</font>`<font style="color:rgb(239, 112, 96);">@RestController</font>`<font style="color:rgb(0, 0, 0);">用在类上时，表示当前类里面所有对外暴露的接口方法，返回数据的格式都为</font>`<font style="color:rgb(239, 112, 96);">application/json</font>`<font style="color:rgb(0, 0, 0);">，示范代码如下：</font>

```java
@RestController
@RequestMapping("api")
public class LoginController {

    /**
     * 登录请求，post请求协议，请求参数数据格式为json
     * @param request
     */
    @RequestMapping(value = "login", method = RequestMethod.POST)
    public ResponseEntity login(@RequestBody UserLoginDTO request){
        //...业务处理
        return new ResponseEntity(HttpStatus.OK);
    }
}
```

+ `<font style="color:rgb(1, 1, 1);">@RequestParam</font>`

<font style="color:rgb(0, 0, 0);">用于接收请求参数为表单类型的数据，通常用在方法的参数前面，示范代码如下：</font>

```java
/**
 * 登录请求，post请求协议，请求参数数据格式为表单
 */
@RequestMapping(value = "login", method = RequestMethod.POST)
@ResponseBody
public ResponseEntity login(@RequestParam(value = "userName",required = true) String userName,
                            @RequestParam(value = "userPwd",required = true) String userPwd){
    //...业务处理
    return new ResponseEntity(HttpStatus.OK);
}
```

+ `<font style="color:rgb(1, 1, 1);">@PathVariable</font>`

<font style="color:rgb(0, 0, 0);">用于获取请求路径中的参数，通常用于</font>`<font style="color:rgb(239, 112, 96);">restful</font>`<font style="color:rgb(0, 0, 0);">风格的</font>`<font style="color:rgb(239, 112, 96);">api</font>`<font style="color:rgb(0, 0, 0);">上，示范代码如下：</font>

```java
/**
 * restful风格的参数请求
 * @param id
 */
@RequestMapping(value = "queryProduct/{id}", method = RequestMethod.POST)
@ResponseBody
public ResponseEntity queryProduct(@PathVariable("id") String id){
    //...业务处理
    return new ResponseEntity(HttpStatus.OK);
}
```

+ `<font style="color:rgb(1, 1, 1);">@GetMapping</font>`

<font style="color:rgb(0, 0, 0);">除了</font>`<font style="color:rgb(239, 112, 96);">@RequestMapping</font>`<font style="color:rgb(0, 0, 0);">可以指定请求方式之外，还有一些其他的注解，可以用于标注接口路径请求，比如</font>`<font style="color:rgb(239, 112, 96);">GetMapping</font>`<font style="color:rgb(0, 0, 0);">用在方法上时，表示只支持</font>`<font style="color:rgb(239, 112, 96);">get</font>`<font style="color:rgb(0, 0, 0);">请求方法，等价于</font>`<font style="color:rgb(239, 112, 96);">@RequestMapping(value="/get",method=RequestMethod.GET)</font>`

```java
@GetMapping("get")
public ResponseEntity get(){
    return new ResponseEntity(HttpStatus.OK);
}
```

+ `<font style="color:rgb(1, 1, 1);">@PostMapping</font>`

<font style="color:rgb(0, 0, 0);">用在方法上，表示只支持</font>`<font style="color:rgb(239, 112, 96);">post</font>`<font style="color:rgb(0, 0, 0);">方式的请求。</font>

```java
@PostMapping("post")
public ResponseEntity post(){
    return new ResponseEntity(HttpStatus.OK);
}
```

+ `<font style="color:rgb(1, 1, 1);">@PutMapping</font>`

<font style="color:rgb(0, 0, 0);">用在方法上，表示只支持</font>`<font style="color:rgb(239, 112, 96);">put</font>`<font style="color:rgb(0, 0, 0);">方式的请求，通常表示更新某些资源的意思</font>

```java
@PutMapping("put")
public ResponseEntity put(){
    return new ResponseEntity(HttpStatus.OK);
}
```

+ `<font style="color:rgb(1, 1, 1);">@DeleteMapping</font>`

<font style="color:rgb(0, 0, 0);">用在方法上，表示只支持</font>`<font style="color:rgb(239, 112, 96);">delete</font>`<font style="color:rgb(0, 0, 0);">方式的请求，通常表示删除某些资源的意思</font>

```java
@DeleteMapping("delete")
public ResponseEntity delete(){
    return new ResponseEntity(HttpStatus.OK);
}
```

#### **<font style="color:rgb(13, 12, 12);">2.2、bean 相关注解</font>**
+ `<font style="color:rgb(1, 1, 1);">@Service</font>`

<font style="color:rgb(0, 0, 0);">通常用于修饰</font>`<font style="color:rgb(239, 112, 96);">service</font>`<font style="color:rgb(0, 0, 0);">层的组件，声明一个对象，会将类对象实例化并注入到</font>`<font style="color:rgb(239, 112, 96);">bean</font>`<font style="color:rgb(0, 0, 0);">容器里面</font>

```java
@Service
public class DeptService {

    //具体的方法
}
```

+ `<font style="color:rgb(1, 1, 1);">@Component</font>`

<font style="color:rgb(0, 0, 0);">泛指组件，当组件不好归类的时候，可以使用这个注解进行标注，功能类似于于</font>`<font style="color:rgb(239, 112, 96);">@Service</font>`

```java
@Component
public class DeptService {

    //具体的方法
}
```

+ `<font style="color:rgb(1, 1, 1);">@Repository</font>`

<font style="color:rgb(0, 0, 0);">通常用于修饰</font>`<font style="color:rgb(239, 112, 96);">dao</font>`<font style="color:rgb(0, 0, 0);">层的组件，</font>

`<font style="color:rgb(239, 112, 96);">@Repository</font>`<font style="color:rgb(0, 0, 0);">注解属于</font>`<font style="color:rgb(239, 112, 96);">Spring</font>`<font style="color:rgb(0, 0, 0);">里面最先引入的一批注解，它用于将数据访问层 (</font>`<font style="color:rgb(239, 112, 96);">DAO</font>`<font style="color:rgb(0, 0, 0);">层 ) 的类标识为</font>`<font style="color:rgb(239, 112, 96);">Spring Bean</font>`<font style="color:rgb(0, 0, 0);">，具体只需将该注解标注在 DAO类上即可，示例代码如下：</font>

```java
@Repository
public interface RoleRepository extends JpaRepository<Role,Long> {

    //具体的方法
}
```

<font style="color:rgb(0, 0, 0);">为什么现在使用的很少呢？</font>

<font style="color:rgb(0, 0, 0);">主要是因为当我们配置服务启动自动扫描</font>`<font style="color:rgb(239, 112, 96);">dao</font>`<font style="color:rgb(0, 0, 0);">层包时，</font>`<font style="color:rgb(239, 112, 96);">Spring</font>`<font style="color:rgb(0, 0, 0);">会自动帮我们创建一个实现类，然后注入到</font>`<font style="color:rgb(239, 112, 96);">bean</font>`<font style="color:rgb(0, 0, 0);">容器里面。当某些类无法被扫描到时，我们可以显式的在数据持久类上标注</font>`<font style="color:rgb(239, 112, 96);">@Repository</font>`<font style="color:rgb(0, 0, 0);">注解，</font>`<font style="color:rgb(239, 112, 96);">Spring</font>`<font style="color:rgb(0, 0, 0);">会自动帮我们声明对象。</font>

+ `<font style="color:rgb(1, 1, 1);">@Bean</font>`

<font style="color:rgb(0, 0, 0);">相当于 xml 中配置 Bean，意思是产生一个 bean 对象，并交给spring管理，示例代码如下：</font>

```java
@Configuration
public class AppConfig {

    //相当于 xml 中配置 Bean
    @Bean
    public Uploader initFileUploader() {
        return new FileUploader();
    }

}
```

+ `<font style="color:rgb(1, 1, 1);">@Autowired</font>`

<font style="color:rgb(0, 0, 0);">自动导入依赖的</font>`<font style="color:rgb(239, 112, 96);">bean</font>`<font style="color:rgb(0, 0, 0);">对象，默认时按照</font>`<font style="color:rgb(239, 112, 96);">byType</font>`<font style="color:rgb(0, 0, 0);">方式导入对象，而且导入的对象必须存在，当需要导入的对象并不存在时，我们可以通过配置</font>`<font style="color:rgb(239, 112, 96);">required = false</font>`<font style="color:rgb(0, 0, 0);">来关闭强制验证。</font>

```java
@Autowired
private DeptService deptService;
```

+ `<font style="color:rgb(1, 1, 1);">@Resource</font>`

<font style="color:rgb(0, 0, 0);">也是自动导入依赖的</font>`<font style="color:rgb(239, 112, 96);">bean</font>`<font style="color:rgb(0, 0, 0);">对象，</font>**<font style="color:rgb(23, 23, 23);">由</font>**`**<font style="color:rgb(239, 112, 96);">JDK</font>**`**<font style="color:rgb(23, 23, 23);">提供</font>**<font style="color:rgb(0, 0, 0);">，默认是按照</font>`<font style="color:rgb(239, 112, 96);">byName</font>`<font style="color:rgb(0, 0, 0);">方式导入依赖的对象；而</font>`<font style="color:rgb(239, 112, 96);">@Autowired</font>`<font style="color:rgb(0, 0, 0);">默认时按照</font>`<font style="color:rgb(239, 112, 96);">byType</font>`<font style="color:rgb(0, 0, 0);">方式导入对象，当然</font>`<font style="color:rgb(239, 112, 96);">@Resource</font>`<font style="color:rgb(0, 0, 0);">还可以配置成通过</font>`<font style="color:rgb(239, 112, 96);">byType</font>`<font style="color:rgb(0, 0, 0);">方式导入对象。</font>

```java
/**
 * 通过名称导入（默认通过名称导入依赖对象）
 */
@Resource(name = "deptService")
private DeptService deptService;

/**
 * 通过类型导入
 */
@Resource(type = RoleRepository.class)
private DeptService deptService;
```

+ `<font style="color:rgb(1, 1, 1);">@Qualifier</font>`

<font style="color:rgb(0, 0, 0);">当有多个同一类型的</font>`<font style="color:rgb(239, 112, 96);">bean</font>`<font style="color:rgb(0, 0, 0);">时，使用</font>`<font style="color:rgb(239, 112, 96);">@Autowired</font>`<font style="color:rgb(0, 0, 0);">导入会报错，提示当前对象并不是唯一，</font>`<font style="color:rgb(239, 112, 96);">Spring</font>`<font style="color:rgb(0, 0, 0);">不知道导入哪个依赖，这个时候，我们可以使用</font>`<font style="color:rgb(239, 112, 96);">@Qualifier</font>`<font style="color:rgb(0, 0, 0);">进行更细粒度的控制，选择其中一个候选者，一般于</font>`<font style="color:rgb(239, 112, 96);">@Autowired</font>`<font style="color:rgb(0, 0, 0);">搭配使用，示例如下：</font>

```java
@Autowired
@Qualifier("deptService")
private DeptService deptService;
```

+ `<font style="color:rgb(1, 1, 1);">@Scope</font>`

<font style="color:rgb(0, 0, 0);">用于生命一个</font>`<font style="color:rgb(239, 112, 96);">spring bean</font>`<font style="color:rgb(0, 0, 0);">的作用域，作用的范围一共有以下几种：</font>

+ <font style="color:rgb(1, 1, 1);">singleton：唯一 bean 实例，Spring 中的 bean 默认都是单例的。</font>
+ <font style="color:rgb(1, 1, 1);">prototype：每次请求都会创建一个新的 bean 实例，对象多例。</font>
+ <font style="color:rgb(1, 1, 1);">request：每一次 HTTP 请求都会产生一个新的 bean，该 bean 仅在当前 HTTP request 内有效。</font>
+ <font style="color:rgb(1, 1, 1);">session：每一次 HTTP 请求都会产生一个新的 bean，该 bean 仅在当前 HTTP session 内有效。</font>

```java
/**
 * 单例对象
 */
@RestController
@Scope("singleton")
public class HelloController {

}
```

#### **<font style="color:rgb(13, 12, 12);">2.3、</font>****JPA****<font style="color:rgb(13, 12, 12);"> </font>****<font style="color:rgb(13, 12, 12);">相关注解</font>**
+ `<font style="color:rgb(1, 1, 1);">@Entity</font>`<font style="color:rgb(1, 1, 1);">和</font>`<font style="color:rgb(1, 1, 1);">@Table</font>`

<font style="color:rgb(0, 0, 0);">表明这是一个实体类，这两个注解一般一块使用，但是如果表名和实体类名相同的话，</font>`<font style="color:rgb(239, 112, 96);">@Table</font>`<font style="color:rgb(0, 0, 0);">可以省略。</font>

+ `<font style="color:rgb(1, 1, 1);">@Id</font>`

<font style="color:rgb(0, 0, 0);">表示该属性字段对应数据库表中的主键字段。</font>

+ `<font style="color:rgb(1, 1, 1);">@Column</font>`

<font style="color:rgb(0, 0, 0);">表示该属性字段对应的数据库表中的列名，如果字段名与列名相同，则可以省略。</font>

+ `<font style="color:rgb(1, 1, 1);">@GeneratedValue</font>`

<font style="color:rgb(0, 0, 0);">表示主键的生成策略，有四个选项，分别如下：</font>

+ <font style="color:rgb(0, 0, 0);">AUTO：表示由程序控制，是默认选项 ，不设置就是这个</font>
+ <font style="color:rgb(0, 0, 0);">IDENTITY：表示由数据库生成，采用数据库自增长，Oracle 不支持这种方式</font>
+ <font style="color:rgb(0, 0, 0);">SEQUENCE：表示通过数据库的序列生成主键ID，MYSQL 不支持</font>
+ <font style="color:rgb(0, 0, 0);">Table：表示由特定的数据库产生主键，该方式有利于数据库的移植</font>
+ `<font style="color:rgb(239, 112, 96);">@SequenceGeneretor</font>`

<font style="color:rgb(0, 0, 0);">用来定义一个生成主键的序列，它需要与</font>`<font style="color:rgb(239, 112, 96);">@GeneratedValue</font>`<font style="color:rgb(0, 0, 0);">联合使用才有效，以</font>`<font style="color:rgb(239, 112, 96);">TB_ROLE</font>`<font style="color:rgb(0, 0, 0);">表为例，对应的注解配置如下：</font>

```java
@Entity
@Table(name = "TB_ROLE")
@SequenceGenerator(name = "id_seq", sequenceName = "seq_repair",allocationSize = 1)
public class Role implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID，采用【id_seq】序列函数自增长
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "id_seq")
    private Long id;


    /* 角色名称
     */
    @Column(nullable = false)
    private String roleName;

    /**
     * 角色类型
     */
    @Column(nullable = false)
    private String roleType;
}
```

+ `<font style="color:rgb(1, 1, 1);">@Transient</font>`

<font style="color:rgb(0, 0, 0);">表示该属性并非与数据库表的字段进行映射，ORM 框架会将忽略该属性。</font>

```java
/**
 * 忽略该属性
 */
@Column(nullable = false)
@Transient
private String lastTime;
```

+ `<font style="color:rgb(1, 1, 1);">@Basic(fetch=FetchType.LAZY)</font>`

<font style="color:rgb(0, 0, 0);">用在某些属性上，可以实现懒加载的效果，也就是当用到这个字段的时候，才会装载这个属性，如果配置成</font>`<font style="color:rgb(239, 112, 96);">fetch=FetchType.EAGER</font>`<font style="color:rgb(0, 0, 0);">，表示即时加载，也是默认的加载方式！</font>

```java
/**
 * 延迟加载该属性
 */
@Column(nullable = false)
@Basic(fetch = FetchType.LAZY)
private String roleType;
```

+ `<font style="color:rgb(1, 1, 1);">@JoinColumn</font>`

<font style="color:rgb(0, 0, 0);">用于标注表与表之间关系的字段，通常与</font>`<font style="color:rgb(239, 112, 96);">@OneToOne</font>`<font style="color:rgb(0, 0, 0);">、</font>`<font style="color:rgb(239, 112, 96);">@OneToMany</font>`<font style="color:rgb(0, 0, 0);">搭配使用，例如如下</font>

```java
@Entity
@Table(name = "tb_login_log")
public class LoginLog implements Serializable {

    /**
     * 查询登录的用户信息
     */
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    //...get、set
}
```

+ `<font style="color:rgb(1, 1, 1);">@OneToOne</font>`<font style="color:rgb(1, 1, 1);">、</font>`<font style="color:rgb(1, 1, 1);">@OneToMany</font>`<font style="color:rgb(1, 1, 1);">和</font>`<font style="color:rgb(1, 1, 1);">@ManyToOne</font>`

<font style="color:rgb(0, 0, 0);">这三个注解，相当于</font>`<font style="color:rgb(239, 112, 96);">hibernate</font>`<font style="color:rgb(0, 0, 0);">配置文件中的</font>`<font style="color:rgb(239, 112, 96);">一对一</font>`<font style="color:rgb(0, 0, 0);">，</font>`<font style="color:rgb(239, 112, 96);">一对多</font>`<font style="color:rgb(0, 0, 0);">，</font>`<font style="color:rgb(239, 112, 96);">多对一</font>`<font style="color:rgb(0, 0, 0);">配置，比如下面的客户地址表，通过客户 ID，实现客户信息的查询。</font>

```java
@Entity
@Table(name="address")
public class AddressEO implements java.io.Serializable {

    @ManyToOne(cascade = { CascadeType.ALL })
    @JoinColumn(name="customer_id")
    private CustomerEO customer;

    //...get、set
}
```

#### **<font style="color:rgb(13, 12, 12);">2.4、配置相关注解</font>**
+ `<font style="color:rgb(1, 1, 1);">@Configuration</font>`

<font style="color:rgb(0, 0, 0);">表示声明一个 Java 形式的配置类，Spring Boot 提倡基于 Java 的配置，相当于你之前在 xml 中配置 bean，比如声明一个配置类</font>`<font style="color:rgb(239, 112, 96);">AppConfig</font>`<font style="color:rgb(0, 0, 0);">，然后初始化一个</font>`<font style="color:rgb(239, 112, 96);">Uploader</font>`<font style="color:rgb(0, 0, 0);">对象。</font>

```java
@Configuration
public class AppConfig {

    @Bean
    public Uploader initOSSUploader() {
        return new OSSUploader();
    }

}
```

+ `<font style="color:rgb(1, 1, 1);">@EnableAutoConfiguration</font>`

`<font style="color:rgb(239, 112, 96);">@EnableAutoConfiguration</font>`<font style="color:rgb(0, 0, 0);">可以帮助</font>`<font style="color:rgb(239, 112, 96);">SpringBoot</font>`<font style="color:rgb(0, 0, 0);">应用将所有符合条件的</font>`<font style="color:rgb(239, 112, 96);">@Configuration</font>`<font style="color:rgb(0, 0, 0);">配置类，全部都加载到当前</font>`<font style="color:rgb(239, 112, 96);">SpringBoot</font>`<font style="color:rgb(0, 0, 0);">里，并创建对应配置类的</font>`<font style="color:rgb(239, 112, 96);">Bean</font>`<font style="color:rgb(0, 0, 0);">，并把该</font>`<font style="color:rgb(239, 112, 96);">Bean</font>`<font style="color:rgb(0, 0, 0);">实体交给</font>`<font style="color:rgb(239, 112, 96);">IoC</font>`<font style="color:rgb(0, 0, 0);">容器进行管理。</font>

<font style="color:rgb(0, 0, 0);">某些场景下，如果我们想要避开某些配置类的扫描（包括避开一些第三方</font>`<font style="color:rgb(239, 112, 96);">jar</font>`<font style="color:rgb(0, 0, 0);">包下面的配置，可以这样处理。</font>

```java
@Configuration
@EnableAutoConfiguration(exclude = { org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
                                   })
public class AppConfig {

    //具有业务方法
}
```

+ `<font style="color:rgb(1, 1, 1);">@ComponentScan</font>`

<font style="color:rgb(0, 0, 0);">标注哪些路径下的类需要被</font>`<font style="color:rgb(239, 112, 96);">Spring</font>`<font style="color:rgb(0, 0, 0);">扫描，用于自动发现和装配一些</font>`<font style="color:rgb(239, 112, 96);">Bean</font>`<font style="color:rgb(0, 0, 0);">对象，默认配置是扫描当前文件夹下和子目录下的所有类，如果我们想指定扫描某些包路径，可以这样处理。</font>

```java
@ComponentScan(basePackages = {"com.xxx.a", "com.xxx.b", "com.xxx.c"})
```

+ `<font style="color:rgb(1, 1, 1);">@SpringBootApplication</font>`

<font style="color:rgb(0, 0, 0);">等价于使用</font>`<font style="color:rgb(239, 112, 96);">@Configuration</font>`<font style="color:rgb(0, 0, 0);">、</font>`<font style="color:rgb(239, 112, 96);">@EnableAutoConfiguration</font>`<font style="color:rgb(0, 0, 0);">、</font>`<font style="color:rgb(239, 112, 96);">@ComponentScan</font>`<font style="color:rgb(0, 0, 0);">这三个注解，通常用于全局启动类上，示例如下：</font>

```java
@SpringBootApplication
public class PropertyApplication {

    public static void main(String[] args) {
        SpringApplication.run(PropertyApplication.class, args);
    }
}
```

<font style="color:rgb(0, 0, 0);">把</font>`<font style="color:rgb(239, 112, 96);">@SpringBootApplication</font>`<font style="color:rgb(0, 0, 0);">换成</font>`<font style="color:rgb(239, 112, 96);">@Configuration</font>`<font style="color:rgb(0, 0, 0);">、</font>`<font style="color:rgb(239, 112, 96);">@EnableAutoConfiguration</font>`<font style="color:rgb(0, 0, 0);">、</font>`<font style="color:rgb(239, 112, 96);">@ComponentScan</font>`<font style="color:rgb(0, 0, 0);">这三个注解，一样可以启动成功，</font>`<font style="color:rgb(239, 112, 96);">@SpringBootApplication</font>`<font style="color:rgb(0, 0, 0);">只是将这三个注解进行了简化！</font>

+ `<font style="color:rgb(1, 1, 1);">@EnableTransactionManagement</font>`

<font style="color:rgb(0, 0, 0);">表示开启事务支持，等同于 xml 配置方式的</font>`<font style="color:rgb(239, 112, 96);"><tx:annotation-driven /></font>`

```java
@SpringBootApplication
@EnableTransactionManagement`
public class PropertyApplication {

    public static void main(String[] args) {
        SpringApplication.run(PropertyApplication.class, args);
    }
}
```

+ `<font style="color:rgb(1, 1, 1);">@Conditional</font>`

<font style="color:rgb(0, 0, 0);">从 Spring4 开始，可以通过</font>`<font style="color:rgb(239, 112, 96);">@Conditional</font>`<font style="color:rgb(0, 0, 0);">注解实现按条件装载</font>`<font style="color:rgb(239, 112, 96);">bean</font>`<font style="color:rgb(0, 0, 0);">对象，目前 Spring Boot 源码中大量扩展了</font>`<font style="color:rgb(239, 112, 96);">@Condition</font>`<font style="color:rgb(0, 0, 0);">注解，用于实现智能的自动化配置，满足各种使用场景。下面我给大家列举几个常用的注解：</font>

+ `<font style="color:rgb(1, 1, 1);">@ConditionalOnBean</font>`<font style="color:rgb(1, 1, 1);">：当某个特定的</font>`<font style="color:rgb(1, 1, 1);">Bean</font>`<font style="color:rgb(1, 1, 1);">存在时，配置生效</font>
+ `<font style="color:rgb(1, 1, 1);">@ConditionalOnMissingBean</font>`<font style="color:rgb(1, 1, 1);">：当某个特定的</font>`<font style="color:rgb(1, 1, 1);">Bean</font>`<font style="color:rgb(1, 1, 1);">不存在时，配置生效</font>
+ `<font style="color:rgb(1, 1, 1);">@ConditionalOnClass</font>`<font style="color:rgb(1, 1, 1);">：当</font>`<font style="color:rgb(1, 1, 1);">Classpath</font>`<font style="color:rgb(1, 1, 1);">里存在指定的类，配置生效</font>
+ `<font style="color:rgb(1, 1, 1);">@ConditionalOnMissingClass</font>`<font style="color:rgb(1, 1, 1);">：当</font>`<font style="color:rgb(1, 1, 1);">Classpath</font>`<font style="color:rgb(1, 1, 1);">里不存在指定的类，配置生效</font>
+ `<font style="color:rgb(1, 1, 1);">@ConditionalOnExpression</font>`<font style="color:rgb(1, 1, 1);">：当给定的</font>`<font style="color:rgb(1, 1, 1);">SpEL</font>`<font style="color:rgb(1, 1, 1);">表达式计算结果为</font>`<font style="color:rgb(1, 1, 1);">true</font>`<font style="color:rgb(1, 1, 1);">，配置生效</font>
+ `<font style="color:rgb(1, 1, 1);">@ConditionalOnProperty</font>`<font style="color:rgb(1, 1, 1);">：当指定的配置属性有一个明确的值并匹配，配置生效</font>

<font style="color:rgb(0, 0, 0);">具体的应用案例如下：</font>

```java
@Configuration
public class ConditionalConfig {


    /**
     * 当AppConfig对象存在时，创建一个A对象
     * @return
     */
    @ConditionalOnBean(AppConfig.class)
    @Bean
    public A createA(){
        return new A();
    }

    /**
     * 当AppConfig对象不存在时，创建一个B对象
     * @return
     */
    @ConditionalOnMissingBean(AppConfig.class)
    @Bean
    public B createB(){
        return new B();
    }


    /**
     * 当KafkaTemplate类存在时，创建一个C对象
     * @return
     */
    @ConditionalOnClass(KafkaTemplate.class)
    @Bean
    public C createC(){
        return new C();
    }

    /**
     * 当KafkaTemplate类不存在时，创建一个D对象
     * @return
     */
    @ConditionalOnMissingClass(KafkaTemplate.class)
    @Bean
    public D createD(){
        return new D();
    }


    /**
     * 当enableConfig的配置为true，创建一个E对象
     * @return
     */
    @ConditionalOnExpression("${enableConfig:false}")
    @Bean
    public E createE(){
        return new E();
    }


    /**
     * 当filter.loginFilter的配置为true，创建一个F对象
     * @return
     */
    @ConditionalOnProperty(prefix = "filter",name = "loginFilter",havingValue = "true")
    @Bean
    public F createF(){
        return new F();
    }
}
```

+ `<font style="color:rgb(1, 1, 1);">@value</font>`

<font style="color:rgb(0, 0, 0);">可以在任意 Spring 管理的 Bean 中通过这个注解获取任何来源配置的属性值，比如你在</font>`<font style="color:rgb(239, 112, 96);">application.properties</font>`<font style="color:rgb(0, 0, 0);">文件里，定义了一个参数变量！</font>

```java
config.name=zhangsan
```

<font style="color:rgb(0, 0, 0);">在任意的</font>`<font style="color:rgb(239, 112, 96);">bean</font>`<font style="color:rgb(0, 0, 0);">容器里面，可以通过</font>`<font style="color:rgb(239, 112, 96);">@Value</font>`<font style="color:rgb(0, 0, 0);">注解注入参数，获取参数变量值。</font>

```java
@RestController
public class HelloController {

    @Value("${config.name}")
    private String config;

    @GetMapping("config")
    public String config(){
        return JSON.toJSONString(config);
    }
}
```

+ `<font style="color:rgb(1, 1, 1);">@ConfigurationProperties</font>`

<font style="color:rgb(0, 0, 0);">上面</font>`<font style="color:rgb(239, 112, 96);">@Value</font>`<font style="color:rgb(0, 0, 0);">在每个类中获取属性配置值的做法，其实是不推荐的。</font>

<font style="color:rgb(0, 0, 0);">一般在企业项目开发中，不会使用那么杂乱无章的写法而且维护也麻烦，通常会一次性读取一个 Java 配置类，然后在需要使用的地方直接引用这个类就可以多次访问了，方便维护，示例如下：</font>

<font style="color:rgb(0, 0, 0);">首先，在</font>`<font style="color:rgb(239, 112, 96);">application.properties</font>`<font style="color:rgb(0, 0, 0);">文件里定义好参数变量。</font>

```java
config.name=demo_1
config.value=demo_value_1
```

<font style="color:rgb(0, 0, 0);">然后，创建一个 Java 配置类，将参数变量注入即可！</font>

```java
@Component
@RefreshScope //动态刷新配置
@ConfigurationProperties(prefix = "config")
public class Config {

    public String name;

    public String value;

    //...get、set
}
```

<font style="color:rgb(0, 0, 0);">最后，在需要使用的地方，通过</font>`<font style="color:rgb(239, 112, 96);">ioc</font>`<font style="color:rgb(0, 0, 0);">注入</font>`<font style="color:rgb(239, 112, 96);">Config</font>`<font style="color:rgb(0, 0, 0);">对象即可！</font>

+ `<font style="color:rgb(1, 1, 1);">@PropertySource</font>`

<font style="color:rgb(0, 0, 0);">这个注解是用来读取我们自定义的配置文件的，比如导入</font>`<font style="color:rgb(239, 112, 96);">test.properties</font>`<font style="color:rgb(0, 0, 0);">和</font>`<font style="color:rgb(239, 112, 96);">bussiness.properties</font>`<font style="color:rgb(0, 0, 0);">两个配置文件，用法如下：</font>

```java
@SpringBootApplication
@PropertySource(value = {"test.properties","bussiness.properties"})
public class PropertyApplication {

    public static void main(String[] args) {
        SpringApplication.run(PropertyApplication.class, args);
    }
}
```

+ `<font style="color:rgb(1, 1, 1);">@ImportResource</font>`

<font style="color:rgb(0, 0, 0);">用来加载 xml 配置文件，比如导入自定义的</font>`<font style="color:rgb(239, 112, 96);">aaa.xml</font>`<font style="color:rgb(0, 0, 0);">文件，用法如下：</font>

```java
@ImportResource(locations = "classpath:aaa.xml")
@SpringBootApplication
public class PropertyApplication {

    public static void main(String[] args) {
        SpringApplication.run(PropertyApplication.class, args);
    }
}
```

#### **<font style="color:rgb(13, 12, 12);">2.5、异常处理相关注解</font>**
+ `<font style="color:rgb(1, 1, 1);">@ControllerAdvice</font>`<font style="color:rgb(1, 1, 1);">和</font>`<font style="color:rgb(1, 1, 1);">@ExceptionHandler</font>`

<font style="color:rgb(0, 0, 0);">通常组合使用，用于处理全局异常，示例代码如下：</font>

```java
@ControllerAdvice
@Configuration
@Slf4j
public class GlobalExceptionConfig {

    private static final Integer GLOBAL_ERROR_CODE = 500;

    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    public void exceptionHandler(HttpServletRequest request, HttpServletResponse response, Exception e) throws Exception {
        log.error("【统一异常处理器】", e);
        ResultMsg<Object> resultMsg = new ResultMsg<>();
        resultMsg.setCode(GLOBAL_ERROR_CODE);
        if (e instanceof CommonException) {
            CommonException ex = (CommonException) e;
            if(ex.getErrCode() != 0) {
                resultMsg.setCode(ex.getErrCode());
            }
            resultMsg.setMsg(ex.getErrMsg());
        }else {
            resultMsg.setMsg(CommonErrorMsg.SYSTEM_ERROR.getMessage());
        }
        WebUtil.buildPrintWriter(response, resultMsg);
    }


}
```

#### **<font style="color:rgb(13, 12, 12);">2.6、测试相关注解</font>**
+ `<font style="color:rgb(1, 1, 1);">@ActiveProfiles</font>`

<font style="color:rgb(0, 0, 0);">一般作用于测试类上， 用于声明生效的 Spring 配置文件，比如指定</font>`<font style="color:rgb(239, 112, 96);">application-dev.properties</font>`<font style="color:rgb(0, 0, 0);">配置文件。</font>

+ `<font style="color:rgb(1, 1, 1);">@RunWith</font>`<font style="color:rgb(1, 1, 1);">和</font>`<font style="color:rgb(1, 1, 1);">@SpringBootTest</font>`

<font style="color:rgb(0, 0, 0);">一般作用于测试类上， 用于单元测试用，示例如下：</font>

```java
@ActiveProfiles("dev")
@RunWith(SpringRunner.class)
@SpringBootTest
public class TestJunit {

    @Test
    public void executeTask() {
        //测试...
    }
}
```

