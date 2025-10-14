---
title: Mybatis实用知识碎碎念
icon: page
order: 1
author: yoystar
date: 2025-01-15
tag:
  - Mybatis
  - Mapper
  - 自动填充
  - TableField注解
star: true 

---

## 1.Mapper文件：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.hbmt.terminal.mapper.FirmwareInfoMapper">
  <!-- resultMap用于从SQL查询结果 映射到 实体类 -->
  <!-- id以及result为普通属性映射 -->
  <!-- association为关联对象映射 -->
  <!-- collection为集合映射 -->

  <!-- resultMap映射器 用于从SQL查询结果 映射到 实体类 -->
  <resultMap id="FirmwareInfoResult" type="com.hbmt.common.iot.bean.terminal.vo.FirmwareInfoVo">
    <id property="id" column="id"/>
    <!-- 多结构嵌套自动映射需带上每个实体的主键id 否则映射会失败 -->
    <result property="modelId" column="model_id"/>
    <association property="modelInfoVo" column="model_id" resultMap="modelInfoResult"/>
  </resultMap>

  <resultMap id="modelInfoResult" type="com.hbmt.common.iot.bean.terminal.vo.ModelInfoVo">
    <!--将上一级对象中查询到的model_id赋值给对象的id，防止id被错误的映射成上一级对象的id-->
    <id property="id" column="model_id"/>
    <!--默认自动映射的规则：数据库结果集中的列名和Java对象的属性名相同（不区分大小写），那么MyBatis就会将这个列的值赋给这个属性-->
    <!--如果列名和属性名不完全相同，或者想要更精细的控制映射规则，那么就需要使用 <result> 元素来定义映射关系-->
    <result property="modelName" column="model_name"/>
    <result property="modelCode" column="model_code"/>
    <!-- 多结构嵌套自动映射需带上每个实体的主键id 否则映射会失败 -->
    <result property="companyId" column="company_id"/>
    <association property="companyInfoVo" column="company_id" resultMap="CompanyInfoResult"/>
  </resultMap>

  <resultMap id="CompanyInfoResult" type="com.hbmt.common.iot.bean.terminal.vo.CompanyInfoVo">
    <id property="id" column="company_id"/>
    <result property="companyCode" column="company_code"/>
    <result property="companyName" column="company_name"/>
    <result property="companyOui" column="company_oui"/>
  </resultMap>
  <!-- sql片段 -->
  <sql id="selectFirmwareVo">
    select f.id,
    f.firmware_version,
    f.firmware_sign,
    f.file_path,
    f.file_size,
    f.file_name,
    f.remark,
    f.model_id,
    m.model_code,
    m.model_name,
    m.company_id,
    c.company_code,
    c.company_name,
    c.company_oui,
    f.agent_id,
    f.is_releases,
    f.upload_type,
    f.create_time,
    f.update_time
    from t22_firmware_info f
    left join t02_model_info m on f.model_id = m.id
    left join t01_company_info c on m.company_id = c.id
  </sql>

  <!-- resultMap为自定义的resultMap标签的id -->
  <select id="selectFirmwareInfoById" parameterType="String" resultMap="FirmwareInfoResult">
    <include refid="selectFirmwareVo"/>
    where f.del_flag = '0' and f.id = #{id}
  </select>

  <!-- resultMap为自定义的resultMaph标签的id -->
  <select id="selectFirmwareInfoList" resultMap="FirmwareInfoResult">
    <include refid="selectFirmwareVo"/>
    where f.del_flag = '0'
    <if test="bo.firmwareVersion != null and bo.firmwareVersion != ''">
      and f.firmware_version = #{bo.firmwareVersion}
    </if>
    <if test="bo.firmwareSign != null and bo.firmwareSign != ''">
      and f.firmware_sign = #{bo.firmwareSign}
    </if>
    <if test="bo.filePath != null and bo.filePath != ''">
            and f.file_path = #{bo.filePath}
        </if>
        <if test="bo.fileSize != null and bo.fileSize != ''">
            and f.file_size = #{bo.fileSize}
        </if>
        <if test="bo.fileName != null and bo.fileName != ''">
            and f.file_name like CONCAT('%', #{bo.fileName}, '%')
        </if>
        <if test="bo.modelId != null">
            and f.model_id = #{bo.modelId}
        </if>
        <if test="bo.agentId != null">
            and f.agent_id = #{bo.agentId}
        </if>
        <if test="bo.isReleases != null">
            and f.is_releases = #{bo.isReleases}
        </if>
        <if test="bo.uploadType != null">
            and f.upload_type = #{bo.uploadType}
        </if>
    </select>

</mapper>
```

## 2.TableField注解

@TableField(exist = false)是MyBatis-Plus的一个注解，用于表示Java对象和数据库表之间映射关系。

当在一个Java类的字段上使用@TableField(exist = false)注解时，这意味着这个字段不对应数据库表中的任何列，MyBatis-Plus在执行CRUD操作时将会忽略这个字段。

这个注解通常用于以下情况：

\1. 当Java类中有一些字段，这些字段在数据库表中没有对应的列，但仍然希望在类中保留这些字段。例如，这些字段可能是计算字段，或者是其他业务逻辑需要的临时字段。

\2. 当Java类是一个数据库视图的映射，而这个视图包含了一些在原始表中不存在的列。

```java
@TableField(exist = false)
private String event; 
```

## 3.Mybatis自动填充字段工具

工具链接：https://baomidou.com/guides/auto-fill-field/

原理及实现：

实体类继承BaseEntity类，BaseEntity类中需要自动填充的字段，添加以下注解：

```java
    /**
     * 创建部门
     */
    @TableField(fill = FieldFill.INSERT)
    private Long createDept;

    /**
     * 创建者
     */
    @TableField(fill = FieldFill.INSERT)
    private Long createBy;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;

    /**
     * 更新者
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateBy;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;
```

自动填充具体填充逻辑在如下代码中：

```java
/**
 * MP注入处理器
 *
 */
@Slf4j
public class InjectionMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        try {
            if (ObjectUtil.isNotNull(metaObject)
                && metaObject.getOriginalObject() instanceof BaseEntity baseEntity) {
                Date current = ObjectUtil.isNotNull(baseEntity.getCreateTime())
                    ? baseEntity.getCreateTime() : new Date();
                baseEntity.setCreateTime(current);
                baseEntity.setUpdateTime(current);
                LoginUser loginUser = getLoginUser();
                if (ObjectUtil.isNotNull(loginUser)) {
                    Long userId = ObjectUtil.isNotNull(baseEntity.getCreateBy())
                        ? baseEntity.getCreateBy() : loginUser.getUserId();
                    // 当前已登录 且 创建人为空 则填充
                    baseEntity.setCreateBy(userId);
                    // 当前已登录 且 更新人为空 则填充
                    baseEntity.setUpdateBy(userId);
                    baseEntity.setCreateDept(ObjectUtil.isNotNull(baseEntity.getCreateDept())
                        ? baseEntity.getCreateDept() : loginUser.getDeptId());
                }
            }
        } catch (Exception e) {
            throw new ServiceException("自动注入异常 => " + e.getMessage(), HttpStatus.HTTP_UNAUTHORIZED);
        }
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        try {
            if (ObjectUtil.isNotNull(metaObject)
                && metaObject.getOriginalObject() instanceof BaseEntity baseEntity) {
                Date current = new Date();
                // 更新时间填充(不管为不为空)
                baseEntity.setUpdateTime(current);
                LoginUser loginUser = getLoginUser();
                // 当前已登录 更新人填充(不管为不为空)
                if (ObjectUtil.isNotNull(loginUser)) {
                    baseEntity.setUpdateBy(loginUser.getUserId());
                }
            }
        } catch (Exception e) {
            throw new ServiceException("自动注入异常 => " + e.getMessage(), HttpStatus.HTTP_UNAUTHORIZED);
        }
    }

    /**
     * 获取登录用户
     */
    private LoginUser getLoginUser() {
        LoginUser loginUser;
        try {
            loginUser = LoginHelper.getLoginUser();
        } catch (Exception e) {
            log.warn("自动注入警告 => 用户未登录");
            return null;
        }
        return loginUser;
    }

}
<!-- 自定义insert或者update语句时，需要把>>>自动填充字段也写<<<，防止出现异常-->
<!-- 首次绑定终端用户+终端设备-->
insert into r04_device_user_device (id, device_user_id, device_id, status, create_time,
                                    update_time, create_dept,
                                    create_by, update_by, version,
                                    del_flag)
values (#{id}, #{deviceUserId}, #{deviceId}, 0, #{createTime}, #{updateTime}, #{createDept}, #{createBy},
        #{updateBy}, 0, 0)
```

## 4.Mybatis中传入的参数

当 MyBatis 的 SQL 映射语句中只有一个参数时，可以在 `#{}` 中随意命名参数。例如方法如下：

```java
public User selectUserById(int id);
```

可以在 SQL 映射语句中这样使用参数：

```sql
SELECT * FROM user WHERE id = #{anyNameYouWant}
```

在这个例子中，`anyNameYouWant` 就是参数的名称。MyBatis 会自动将方法的参数映射到 SQL 语句的参数。

但是，如果方法有多个参数，那么需要使用 `@Param` 注解来指定参数的名称，然后在 SQL 映射语句中使用这个名称。例如：

```java
public User selectUserByIdAndName(@Param("id") int id, @Param("name") String name);
```

可以在 SQL 映射语句中这样使用参数：

```sql
SELECT * FROM user WHERE id = #{id} AND name = #{name}
```

在这个例子中，`id` 和 `name` 是参数的名称，需要在 `#{}` 中使用这些名称。