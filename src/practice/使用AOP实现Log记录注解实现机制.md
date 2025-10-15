---
title: 使用AOP实现Log记录注解实现机制
icon: page
order: 5
author: yoystar
date: 2025-04-15
tag:
  - AOP
  - 面向切面
  - 日志记录
  - 注解
star: true 


---

##### 1.自定义一个Log注解

```java
/**
 * 自定义操作日志记录注解
 *
 */
@Target({ElementType.PARAMETER, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {
    /**
     * 模块
     */
    String title() default "";
    /**
     * 功能
     */
    BusinessType businessType() default BusinessType.OTHER;
    /**
     * 操作人类别
     */
    OperatorType operatorType() default OperatorType.MANAGE;
    /**
     * 是否保存请求的参数
     */
    boolean isSaveRequestData() default true;
    /**
     * 是否保存响应的参数
     */
    boolean isSaveResponseData() default true;
    /**
     * 排除指定的请求参数
     */
    String[] excludeParamNames() default {};
}
```

##### 2.在业务代码中使用@Log注解 

```java
    /**
     * 新增设备信息
     */
    @Log(title = "设备信息", businessType = BusinessType.INSERT)
    @RepeatSubmit()
    @PostMapping()
    public R<Void> add(@Validated(AddGroup.class) @RequestBody DeviceInfoBo bo) {
        return toAjax(deviceInfoService.insertByBo(bo));
    }
```

##### 3.自定义一个LogAspect切面通知类

```java
/**
 * 操作日志记录处理
 *
 */
@Slf4j
@Aspect
@AutoConfiguration
public class LogAspect {
    /**
     * 排除敏感属性字段
     */
    public static final String[] EXCLUDE_PROPERTIES = { "password", "oldPassword", "newPassword", "confirmPassword" };
    /**
     * 计算操作消耗时间
     */
    private static final ThreadLocal<StopWatch> TIME_THREADLOCAL = new TransmittableThreadLocal<>();
    /**
     * 处理请求前执行
     */
    @Before(value = "@annotation(controllerLog)")
    public void boBefore(JoinPoint joinPoint, Log controllerLog) {
        StopWatch stopWatch = new StopWatch();
        TIME_THREADLOCAL.set(stopWatch);
        stopWatch.start();
    }
    /**
     * 处理完请求后执行
     *
     * @param joinPoint 切点
     */
    @AfterReturning(pointcut = "@annotation(controllerLog)", returning = "jsonResult")
    public void doAfterReturning(JoinPoint joinPoint, Log controllerLog, Object jsonResult) {
        handleLog(joinPoint, controllerLog, null, jsonResult);
    }
    /**
     * 拦截异常操作
     *
     * @param joinPoint 切点
     * @param e         异常
     */
    @AfterThrowing(value = "@annotation(controllerLog)", throwing = "e")
    public void doAfterThrowing(JoinPoint joinPoint, Log controllerLog, Exception e) {
        handleLog(joinPoint, controllerLog, e, null);
    }
    protected void handleLog(final JoinPoint joinPoint, Log controllerLog, final Exception e, Object jsonResult) {
        try {

            // *========数据库日志=========*//
            OperLogEvent operLog = new OperLogEvent();
            operLog.setTenantId(LoginHelper.getTenantId());
            operLog.setStatus(BusinessStatus.SUCCESS.ordinal());
            // 请求的地址
            String ip = ServletUtils.getClientIP();
            operLog.setOperIp(ip);
            operLog.setOperUrl(StringUtils.substring(ServletUtils.getRequest().getRequestURI(), 0, 255));
            LoginUser loginUser = LoginHelper.getLoginUser();
            operLog.setOperName(loginUser.getUsername());
            operLog.setDeptName(loginUser.getDeptName());

            if (e != null) {
                operLog.setStatus(BusinessStatus.FAIL.ordinal());
                operLog.setErrorMsg(StringUtils.substring(e.getMessage(), 0, 2000));
            }
            // 设置方法名称
            String className = joinPoint.getTarget().getClass().getName();
            String methodName = joinPoint.getSignature().getName();
            operLog.setMethod(className + "." + methodName + "()");
            // 设置请求方式
            operLog.setRequestMethod(ServletUtils.getRequest().getMethod());
            // 处理设置注解上的参数
            getControllerMethodDescription(joinPoint, controllerLog, operLog, jsonResult);
            // 设置消耗时间
            StopWatch stopWatch = TIME_THREADLOCAL.get();
            stopWatch.stop();
            operLog.setCostTime(stopWatch.getTime());
            // 发布事件保存数据库
            SpringUtils.context().publishEvent(operLog);
        } catch (Exception exp) {
            // 记录本地异常日志
            log.error("异常信息:{}", exp.getMessage());
            exp.printStackTrace();
        } finally {
            TIME_THREADLOCAL.remove();
        }
    }

    /**
     * 获取注解中对方法的描述信息 用于Controller层注解
     *
     * @param log     日志
     * @param operLog 操作日志
     * @throws Exception
     */
    public void getControllerMethodDescription(JoinPoint joinPoint, Log log, OperLogEvent operLog, Object jsonResult) throws Exception {
        // 设置action动作
        operLog.setBusinessType(log.businessType().ordinal());
        // 设置标题
        operLog.setTitle(log.title());
        // 设置操作人类别
        operLog.setOperatorType(log.operatorType().ordinal());
        // 是否需要保存request，参数和值
        if (log.isSaveRequestData()) {
            // 获取参数的信息，传入到数据库中。
            setRequestValue(joinPoint, operLog, log.excludeParamNames());
        }
        // 是否需要保存response，参数和值
        if (log.isSaveResponseData() && ObjectUtil.isNotNull(jsonResult)) {
            operLog.setJsonResult(StringUtils.substring(JsonUtils.toJsonString(jsonResult), 0, 2000));
        }
    }

    /**
     * 获取请求的参数，放到log中
     *
     * @param operLog 操作日志
     * @throws Exception 异常
     */
    private void setRequestValue(JoinPoint joinPoint, OperLogEvent operLog, String[] excludeParamNames) throws Exception {
        Map<String, String> paramsMap = ServletUtils.getParamMap(ServletUtils.getRequest());
        String requestMethod = operLog.getRequestMethod();
        if (MapUtil.isEmpty(paramsMap)
                && HttpMethod.PUT.name().equals(requestMethod) || HttpMethod.POST.name().equals(requestMethod)) {
            String params = argsArrayToString(joinPoint.getArgs(), excludeParamNames);
            operLog.setOperParam(StringUtils.substring(params, 0, 2000));
        } else {
            MapUtil.removeAny(paramsMap, EXCLUDE_PROPERTIES);
            MapUtil.removeAny(paramsMap, excludeParamNames);
            operLog.setOperParam(StringUtils.substring(JsonUtils.toJsonString(paramsMap), 0, 2000));
        }
    }

    /**
     * 参数拼装
     */
    private String argsArrayToString(Object[] paramsArray, String[] excludeParamNames) {
        StringJoiner params = new StringJoiner(" ");
        if (ArrayUtil.isEmpty(paramsArray)) {
            return params.toString();
        }
        for (Object o : paramsArray) {
            if (ObjectUtil.isNotNull(o) && !isFilterObject(o)) {
                String str = JsonUtils.toJsonString(o);
                Dict dict = JsonUtils.parseMap(str);
                if (MapUtil.isNotEmpty(dict)) {
                    MapUtil.removeAny(dict, EXCLUDE_PROPERTIES);
                    MapUtil.removeAny(dict, excludeParamNames);
                    str = JsonUtils.toJsonString(dict);
                }
                params.add(str);
            }
        }
        return params.toString();
    }

    /**
     * 判断是否需要过滤的对象。
     *
     * @param o 对象信息。
     * @return 如果是需要过滤的对象，则返回true；否则返回false。
     */
    @SuppressWarnings("rawtypes")
    public boolean isFilterObject(final Object o) {
        Class<?> clazz = o.getClass();
        if (clazz.isArray()) {
            return clazz.getComponentType().isAssignableFrom(MultipartFile.class);
        } else if (Collection.class.isAssignableFrom(clazz)) {
            Collection collection = (Collection) o;
            for (Object value : collection) {
                return value instanceof MultipartFile;
            }
        } else if (Map.class.isAssignableFrom(clazz)) {
            Map map = (Map) o;
            for (Object value : map.values()) {
                return value instanceof MultipartFile;
            }
        }
        return o instanceof MultipartFile || o instanceof HttpServletRequest || o instanceof HttpServletResponse
            || o instanceof BindingResult;
    }
}
```

其中切面中定义了如何执行通知方法：

其中@Before(value = "@annotation(controllerLog)")中的controllerLog是形参（实参是Log），实际切面定义的是从public @interface Log这个自定义注解切入。

<img width="602" height="230" alt="image" src="https://github.com/user-attachments/assets/5b11c535-5fa4-4fe0-a904-a9c62bb8f420" />


##### 4.自定义一个接收Log并异步写入的事件监听器Listener

其中使用了如下两个注解：

​    @Async：用于指示一个方法是异步的，即它应该在后台线程中运行，而不是在调用它的线程中运行。这允许主线程继续执行其他任务，而不需要等待这个方法完成。为了使 @Async 注解生效，需要在配置中启用异步方法执行，例如，通过在 Spring 配置类中添加 @EnableAsync 注解。

​    @EventListener：这个注解用于指示一个方法是事件监听器，即它应该在某个特定的事件被发布时执行。这个注解的参数是一个或多个事件类，表示这个方法应该监听哪些事件。当一个匹配的事件被发布时，这个方法将被调用。

以下代码中，就是OperLogEvent和LogininforEvent被发布时，会自动调用saveLog和saveLogininfor方法。其中发布的代码在步骤2中以及登录操作时的publishEvent：

<img width="796" height="174" alt="image" src="https://github.com/user-attachments/assets/89a5699f-d018-4fee-ab31-3a0637850ebd" />


<img width="980" height="788" alt="image" src="https://github.com/user-attachments/assets/fe028e0b-45b6-412b-9cc7-86b002ec1a70" />


```java
/**
 * 异步调用日志服务
 *
 */
@Component
@Slf4j
public class LogEventListener {

    @DubboReference
    private RemoteLogService remoteLogService;
    @DubboReference
    private RemoteClientService remoteClientService;

    /**
     * 保存系统日志记录
     */
    @Async
    @EventListener
    public void saveLog(OperLogEvent operLogEvent) {
        RemoteOperLogBo sysOperLog = BeanUtil.toBean(operLogEvent, RemoteOperLogBo.class);
        remoteLogService.saveLog(sysOperLog);
    }

    @Async
    @EventListener
    public void saveLogininfor(LogininforEvent logininforEvent) {
        HttpServletRequest request = logininforEvent.getRequest();
        final UserAgent userAgent = UserAgentUtil.parse(request.getHeader("User-Agent"));
        final String ip = ServletUtils.getClientIP(request);
        // 客户端信息
        String clientid = request.getHeader(LoginHelper.CLIENT_KEY);
        RemoteClientVo clientVo = null;
        if (StringUtils.isNotBlank(clientid)) {
            clientVo = remoteClientService.queryByClientId(clientid);
        }

        String address = AddressUtils.getRealAddressByIP(ip);
        StringBuilder s = new StringBuilder();
        s.append(getBlock(ip));
        s.append(address);
        s.append(getBlock(logininforEvent.getUsername()));
        s.append(getBlock(logininforEvent.getStatus()));
        s.append(getBlock(logininforEvent.getMessage()));
        // 打印信息到日志
        log.info(s.toString(), logininforEvent.getArgs());
        // 获取客户端操作系统
        String os = userAgent.getOs().getName();
        // 获取客户端浏览器
        String browser = userAgent.getBrowser().getName();
        // 封装对象
        RemoteLogininforBo logininfor = new RemoteLogininforBo();
        logininfor.setTenantId(logininforEvent.getTenantId());
        logininfor.setUserName(logininforEvent.getUsername());
        if (ObjectUtil.isNotNull(clientVo)) {
            logininfor.setClientKey(clientVo.getClientKey());
            logininfor.setDeviceType(clientVo.getDeviceType());
        }
        logininfor.setIpaddr(ip);
        logininfor.setLoginLocation(address);
        logininfor.setBrowser(browser);
        logininfor.setOs(os);
        logininfor.setMsg(logininforEvent.getMessage());
        // 日志状态
        if (StringUtils.equalsAny(logininforEvent.getStatus(), Constants.LOGIN_SUCCESS, Constants.LOGOUT, Constants.REGISTER)) {
            logininfor.setStatus(Constants.SUCCESS);
        } else if (Constants.LOGIN_FAIL.equals(logininforEvent.getStatus())) {
            logininfor.setStatus(Constants.FAIL);
        }
        remoteLogService.saveLogininfor(logininfor);
    }

    private String getBlock(Object msg) {
        if (msg == null) {
            msg = "";
        }
        return "[" + msg + "]";
    }

}
```

##### 5.依赖关系

以上的EventListener是在common-log模块定义中，并通过如下的META-INF/spring/的import文件，将EventListener的对象被 Spring Boot 自动配置系统识别并自动配置，放到Spring的IOC容器中管理，因此publishEvent的模块需要引入common-log的依赖，才可以完成EventListener的调用：

```xml
com.hbmt.common.log.event.LogEventListener
com.hbmt.common.log.aspect.LogAspect
<!-- Common Log -->
<dependency>
  <groupId>com.hbmt</groupId>
  <artifactId>common-log</artifactId>
</dependency>

```
