---
title: Spring中的各种工具类
icon: page
order: 6
author: yoystar
date: 2025-03-11
tag:
  - 工具类
  - Utils
  - Spring
star: true 
---

Spring 为开发者提供了丰富多样的工具类，这些工具类涵盖了从 Bean 操作、集合处理、字符串处理，到反射操作、文件复制、资源加载等几乎所有开发场景，它可以大幅提升开发效率和代码质量。不废话，直接上干货！

**1. BeanUtils**

- **类路径**：org.springframework.beans.BeanUtils
- **用途**：提供操作JavaBean属性的便利方法，常用于复制同名属性从一个bean到另一个bean。
- **主要方法**：

- copyProperties(Object source, Object target)：从源对象复制属性到目标对象，忽略不同数据类型的属性。

- instantiateClass(Class<T> clazz)：使用其无参构造器实例化一个类。

**2. CollectionUtils**

- **类路径**：org.springframework.util.CollectionUtils
- **用途**：提供各种集合操作的工具方法。
- **主要方法**：

- isEmpty(Collection<?> collection)：检查集合是否为空或null。

- mergeArrayIntoCollection(Object array, Collection<Object> collection)：将数组中的元素合并到集合中。

- findValueOfType(Collection<?> collection, Class<?> type)：在集合中查找指定类型的元素。

**3. StringUtils**

- **类路径**：org.springframework.util.StringUtils
- **用途**：提供各种字符串处理的工具方法。
- **主要方法**：

- hasText(String str)：检查字符串是否包含非空白字符。

- commaDelimitedListToStringArray(String str)：将逗号分隔的字符串转换为字符串数组。

- split(String toSplit, String delimiter)：分割字符串但不使用正则表达式。

**4. ObjectUtils**

- **类路径**：org.springframework.util.ObjectUtils
- **用途**：提供各种对象操作的工具方法。
- **主要方法**：

- isEmpty(Object obj)：检查对象、数组是否为空或null。

- nullSafeEquals(Object o1, Object o2)：null安全的比较两个对象是否相等。

**5. ReflectionUtils**

- **类路径**：org.springframework.util.ReflectionUtils
- **用途**：提供反射相关的工具方法，简化对Java反射API的使用。
- **主要方法**：

- doWithFields(Class<?> clazz, ReflectionUtils.FieldCallback fc)：对指定类的每个字段执行给定的回调。

- findMethod(Class<?> clazz, String name, Class<?>... paramTypes)：在指定类中查找方法。

**6. ClassUtils**

- **类路径**：org.springframework.util.ClassUtils
- **用途**：提供与类和类加载器相关的工具方法。
- **主要方法**：

- getDefaultClassLoader()：获取默认类加载器。

- isPresent(String className, ClassLoader classLoader)：检查给定名称的类是否存在。

**7. AopUtils**

- **类路径**：org.springframework.aop.support.AopUtils
- **用途**：提供与面向切面编程相关的工具方法。
- **主要方法**：

- isAopProxy(Object obj)：检查给定对象是否为AOP代理。

- getTargetClass(Object candidate)：获取代理对象背后的目标类。

**8. PropertyAccessorUtils**

- **类路径**：org.springframework.beans.PropertyAccessorUtils
- **用途**：提供属性访问器相关的工具方法。
- **主要方法**：

- getPropertyAccessorName(String propertyName)：从复合属性名中获取最终的属性访问器名。

**9. FileCopyUtils**

- **类路径**：org.springframework.util.FileCopyUtils
- **用途**：提供文件复制相关的工具方法。
- **主要方法**：

- copy(byte[] in, OutputStream out)：将字节数组复制到输出流。

- copy(File in, File out)：将一个文件内容复制到另一个文件。

**10. ResourceUtils**

- **类路径**：org.springframework.util.ResourceUtils
- **用途**：识别资源加载的工具类，帮助加载类路径或者文件系统内的资源文件。
- **主要方法**：

- getFile(String resourceLocation)：根据资源路径获取文件。

- getURL(String resourceLocation)：根据资源路径获取URL。

**11. TransactionSynchronizationManager**

- **类路径**：org.springframework.transaction.support.TransactionSynchronizationManager
- **用途**：用于事务同步，管理资源和事务同步相关的回调。
- **主要方法**：

- bindResource(Object key, Object value)：绑定资源到当前事务。

- getResource(Object key)：获取绑定到当前事务的资源。

**12. WebUtils**

- **类路径**：org.springframework.web.util.WebUtils
- **用途**：为Web应用程序提供工具方法。
- **主要方法**：

- getRealPath(ServletContext servletContext, String path)：获取相对于Web应用根目录的真实路径。

- findParameterValue(Map<String, ?> params, String paramName)：在参数Map中查找指定的参数值。

 **13.Instant 统计时间的类**

- **类路径**：java.time.Instant

- **用途**：用于时间的统计与处理，可精确到纳秒，支持时间戳的获取、时间点的比较和计算等操作，常用于记录事件发生时间、统计程序执行耗时等场景。

- **主要方法**：

  now ()：获取当前的时间点（UTC 时间）。

  toEpochMilli ()：将当前时间点转换为从 1970-01-01 00:00:00 UTC 开始计算的毫秒数时间戳。

  isAfter (Instant otherInstant)：判断当前时间点是否在另一个时间点之后。