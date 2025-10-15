import{_ as l,W as c,X as o,Y as a,a0 as n,a1 as t,a2 as e,$ as p,C as i}from"./framework-6ae9e88c.js";const u={},r=p(`<h2 id="一、为什么要防止反编译" tabindex="-1"><a class="header-anchor" href="#一、为什么要防止反编译" aria-hidden="true">#</a> 一、为什么要防止反编译？</h2><p>Java项目交付的Jar包本质是字节码（Bytecode）的集合，而字节码本身就具有高度可读性。面对JD-GUI、Fernflower、CFR等反编译工具时，业务代码几乎处于&quot;裸奔&quot;状态——客户只需拖拽Jar包至工具界面，瞬间就能将字节码还原成接近原始形态的Java源码。</p><p>想象这样的场景：你熬夜开发的SpringBoot项目，客户反手一个反编译，直接白嫖核心业务逻辑，稍作修改便据为己有。这种&quot;源码裸奔&quot;不仅造成经济损失，更让技术投入变得毫无壁垒。 本文主要介绍如何通过一些技术方案，增加反编译的难度或者很难获取到真实的业务逻辑。当然这些方案不可能百分之百防的住（JVM的原理就不支持），但是至少能过滤掉99%只会使用反编译工具，而不深入分析的客户。</p><h2 id="二、为什么springboot的jar包是反编译重灾区" tabindex="-1"><a class="header-anchor" href="#二、为什么springboot的jar包是反编译重灾区" aria-hidden="true">#</a> 二、为什么SpringBoot的Jar包是反编译重灾区？</h2><h3 id="从打包结构看" tabindex="-1"><a class="header-anchor" href="#从打包结构看" aria-hidden="true">#</a> 从打包结构看</h3><p>SpringBoot的.jar本质是zip压缩包（后缀可任意修改），解压即得清晰的文件结构：</p><ul><li><code>/BOOT-INF/classes</code> 存储编译后的.class文件</li><li><code>/BOOT-INF/lib</code> 存放项目依赖</li><li><code>/META-INF</code> 包含SpringBoot启动配置</li></ul><p>这些.class文件正是反编译的核心目标，用Jadx等工具几乎可还原带注释的源码。</p><h3 id="从jvm机制看" tabindex="-1"><a class="header-anchor" href="#从jvm机制看" aria-hidden="true">#</a> 从JVM机制看</h3><p>Java字节码设计初衷是为了跨平台执行而非加密，必须保留完整的类结构、方法签名和变量类型信息。SpringBoot在编译时非常的克制，仅做基础优化，变量名、方法名等语义化信息均完整保留，这给反编译工具提供了完美素材。</p><h2 id="三、防护核心思路" tabindex="-1"><a class="header-anchor" href="#三、防护核心思路" aria-hidden="true">#</a> 三、防护核心思路</h2><ol><li><strong>代码混淆</strong> - 让源码看不懂</li><li><strong>字节码加密</strong> - 让工具直接报错</li><li><strong>陷阱机制</strong> - 主动反制逆向行为</li></ol><h2 id="四、代码混淆实战-proguard" tabindex="-1"><a class="header-anchor" href="#四、代码混淆实战-proguard" aria-hidden="true">#</a> 四、代码混淆实战（ProGuard）</h2><h3 id="基本原理" tabindex="-1"><a class="header-anchor" href="#基本原理" aria-hidden="true">#</a> 基本原理</h3><p>ProGuard通过<strong>重命名、删除无用代码、结构优化</strong>实现防护：</p><div class="language-plain line-numbers-mode" data-ext="plain"><pre class="language-plain"><code>原始代码 → 压缩（删除无效代码） → 优化（逻辑改写） → 混淆（名称替换） → 输出加密包
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,16),d={id:"maven插件配置",tabindex:"-1"},k=a("a",{class:"header-anchor",href:"#maven插件配置","aria-hidden":"true"},"#",-1),v=p(`<div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>pluginManagement</span><span class="token punctuation">&gt;</span></span>
    <span class="token comment">&lt;!--  代码混淆proguard maven插件  --&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugin</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>com.github.wvengen<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>proguard-maven-plugin<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>2.6.1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>executions</span><span class="token punctuation">&gt;</span></span>
        <span class="token comment">&lt;!--   package时执行proguard   --&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>execution</span><span class="token punctuation">&gt;</span></span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>phase</span><span class="token punctuation">&gt;</span></span>package<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>phase</span><span class="token punctuation">&gt;</span></span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>goals</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>goal</span><span class="token punctuation">&gt;</span></span>proguard<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>goal</span><span class="token punctuation">&gt;</span></span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>goals</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>execution</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>executions</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>configuration</span><span class="token punctuation">&gt;</span></span>
        <span class="token comment">&lt;!--  输入的jar包  --&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>injar</span><span class="token punctuation">&gt;</span></span>\${project.build.finalName}.jar<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>injar</span><span class="token punctuation">&gt;</span></span>
        <span class="token comment">&lt;!--  输出的jar包  --&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>outjar</span><span class="token punctuation">&gt;</span></span>\${project.build.finalName}.jar<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>outjar</span><span class="token punctuation">&gt;</span></span>
        <span class="token comment">&lt;!--  是否进行混淆，默认为true  --&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>obfuscate</span><span class="token punctuation">&gt;</span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>obfuscate</span><span class="token punctuation">&gt;</span></span>
        <span class="token comment">&lt;!--  关键修改：使用maven.multiModuleProjectDirectory指向父工程根目录  --&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>proguardInclude</span><span class="token punctuation">&gt;</span></span>\${maven.multiModuleProjectDirectory}/proguard.conf<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>proguardInclude</span><span class="token punctuation">&gt;</span></span>   
        <span class="token comment">&lt;!--  额外的jar,项目编译所需的jar  --&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>libs</span><span class="token punctuation">&gt;</span></span>

        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>libs</span><span class="token punctuation">&gt;</span></span>

        <span class="token comment">&lt;!--  对输入jar进行过滤，如对META-INFO文件不处理  --&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>inLibsFilter</span><span class="token punctuation">&gt;</span></span>!META-INF/**,!META-INF/versions/**<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>inLibsFilter</span><span class="token punctuation">&gt;</span></span>
        <span class="token comment">&lt;!--  输出路径配置,必须包含injar标签中填写的jar  --&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>outputDirectory</span><span class="token punctuation">&gt;</span></span>\${project.build.directory}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>outputDirectory</span><span class="token punctuation">&gt;</span></span>
        <span class="token comment">&lt;!--  上面使用了conf配置文件，options无需配置  --&gt;</span>
        <span class="token comment">&lt;!--&lt;options&gt;&lt;/options&gt;--&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>putLibraryJarsInTempDir</span><span class="token punctuation">&gt;</span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>putLibraryJarsInTempDir</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>configuration</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugin</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugins</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>pluginManagement</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token comment">&lt;!-- proGuard 代码混淆 --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugin</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>net.roseboy<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>classfinal-maven-plugin<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugin</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置策略-proguard-conf" tabindex="-1"><a class="header-anchor" href="#配置策略-proguard-conf" aria-hidden="true">#</a> 配置策略（proguard.conf）</h3><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token comment"># proguard.conf</span>
<span class="token comment"># ProGuard配置文件</span>

<span class="token comment"># 保留Spring Boot主类</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">public class * extends org.springframework.boot.SpringApplication</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">public class * { public static void main(java.lang.String[]); }</span>

<span class="token comment"># 保留Spring相关注解</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">@org.springframework.stereotype.** class *</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">@org.springframework.web.bind.annotation.** class *</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">@org.springframework.boot.autoconfigure.** class *</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">@org.springframework.context.annotation.** class *</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">@org.springframework.boot.context.properties.** class *</span>

<span class="token comment"># 保留MyBatis相关</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">@org.apache.ibatis.annotations.** class *</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class * implements org.apache.ibatis.mapping.**</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class * extends org.apache.ibatis.mapping.**</span>

<span class="token comment"># 保留Dubbo相关</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">@org.apache.dubbo.config.annotation.** class *</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class * implements org.apache.dubbo.rpc.**</span>

<span class="token comment"># 保留实体类和VO</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class com.hbmt.**.vo.** { *; }</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class com.hbmt.**.entity.** { *; }</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class com.hbmt.**.bean.** { *; }</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class com.hbmt.**.dto.** { *; }</span>

<span class="token comment"># 保留配置文件相关</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class **.R</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class **.R$*</span>

<span class="token comment"># 保留FastJSON相关</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class com.alibaba.fastjson.** { *; }</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class com.alibaba.fastjson2.** { *; }</span>

<span class="token comment"># 保留Jackson相关</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class com.fasterxml.jackson.** { *; }</span>

<span class="token comment"># 保留日志相关</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class org.slf4j.** { *; }</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class ch.qos.logback.** { *; }</span>

<span class="token comment"># 保留工具类</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class com.hbmt.**.utils.** { *; }</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class com.hbmt.**.common.** { *; }</span>

<span class="token comment"># 保留枚举类</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class * extends java.lang.Enum { *; }</span>

<span class="token comment"># 保留序列化相关</span>
<span class="token key attr-name">-keep</span> <span class="token value attr-value">class * implements java.io.Serializable { *; }</span>
<span class="token key attr-name">-keepclassmembers</span> <span class="token value attr-value">class * implements java.io.Serializable {</span>
<span class="token key attr-name">    static</span> <span class="token value attr-value">final long serialVersionUID;</span>
<span class="token key attr-name">    private</span> <span class="token value attr-value">static final java.io.ObjectStreamField[] serialPersistentFields;</span>
<span class="token key attr-name">    private</span> <span class="token value attr-value">void writeObject(java.io.ObjectOutputStream);</span>
<span class="token key attr-name">    private</span> <span class="token value attr-value">void readObject(java.io.ObjectInputStream);</span>
<span class="token key attr-name">    java.lang.Object</span> <span class="token value attr-value">writeReplace();</span>
<span class="token key attr-name">    java.lang.Object</span> <span class="token value attr-value">readResolve();</span>
}

<span class="token comment"># 混淆配置</span>
-dontshrink
-dontoptimize
-dontwarn
-ignorewarnings

<span class="token comment"># 重命名策略</span>
<span class="token key attr-name">-repackageclasses</span> <span class="token value attr-value">&#39;&#39;</span>
-allowaccessmodification
-overloadaggressively

<span class="token comment"># 保留行号信息（便于调试）</span>
<span class="token key attr-name">-keepattributes</span> <span class="token value attr-value">SourceFile,LineNumberTable</span>

<span class="token comment"># 保留注解</span>
<span class="token key attr-name">-keepattributes</span> <span class="token value attr-value">*Annotation*</span>

<span class="token comment"># 保留泛型信息</span>
<span class="token key attr-name">-keepattributes</span> <span class="token value attr-value">Signature</span>

<span class="token comment"># 保留内部类</span>
<span class="token key attr-name">-keepattributes</span> <span class="token value attr-value">InnerClasses</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、字节码加密-classfinal" tabindex="-1"><a class="header-anchor" href="#五、字节码加密-classfinal" aria-hidden="true">#</a> 五、字节码加密（ClassFinal）</h2><h3 id="加密方案选择" tabindex="-1"><a class="header-anchor" href="#加密方案选择" aria-hidden="true">#</a> 加密方案选择</h3><ul><li><strong>FinalClass</strong>：轻量级加密，内存解密零残留</li><li><strong>XJar</strong>：支持依赖库加密，需配套启动器</li><li><strong>ClassFinal</strong>：支持SpringBoot 3.1.x + JDK17（虽然 ClassFinal 项目在 Gitee 上拥有 1.6K 的 Star，但目前是暂停维护状态。在使用过程中，部分用户反馈 JDK 17 + Spring Boot 3.3.0/3.2.0 ，可能会出现 “Startup failed, invalid password” 的错误，自测Boot 3.1.0/3.1.7 与 JDK 17 的组合运行良好，使用前请自行测试兼容性）</li></ul>`,7),g=p(`<h3 id="maven配置示例" tabindex="-1"><a class="header-anchor" href="#maven配置示例" aria-hidden="true">#</a> Maven配置示例</h3><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>build</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>pluginManagement</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugins</span><span class="token punctuation">&gt;</span></span>
      <span class="token comment">&lt;!-- classfinal用于字节码加密 --&gt;</span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugin</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>configuration</span><span class="token punctuation">&gt;</span></span>
          <span class="token comment">&lt;!-- 排除 Spring 相关类 --&gt;</span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>excludes</span><span class="token punctuation">&gt;</span></span>org.spring<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>excludes</span><span class="token punctuation">&gt;</span></span>
          <span class="token comment">&lt;!-- 排除配置文件相关类 --&gt;</span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>excludes</span><span class="token punctuation">&gt;</span></span>**/R.class,**/R$*.class,**/*Config.class,**/*Configuration.class<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>excludes</span><span class="token punctuation">&gt;</span></span>
          <span class="token comment">&lt;!-- 排除第三方库 --&gt;</span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>excludes</span><span class="token punctuation">&gt;</span></span>com.fasterxml.jackson.**,com.alibaba.fastjson.**,org.apache.commons.**,org.slf4j.**,ch.qos.logback.**<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>excludes</span><span class="token punctuation">&gt;</span></span>
          <span class="token comment">&lt;!-- #表示启动时不需要密码，用于控制是否可以启动，对于字节码加密来说，密码无实际用途 --&gt;</span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>password</span><span class="token punctuation">&gt;</span></span>#<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>password</span><span class="token punctuation">&gt;</span></span>
          <span class="token comment">&lt;!-- 加密的包名，多个包用逗号分隔 --&gt;</span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>packages</span><span class="token punctuation">&gt;</span></span>\${project.groupId}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>packages</span><span class="token punctuation">&gt;</span></span>
          <span class="token comment">&lt;!-- 加密的配置文件，多个文件用逗号分隔 --&gt;</span>
          <span class="token comment">&lt;!--&lt;cfgfiles&gt;application.yml&lt;/cfgfiles&gt;--&gt;</span>
          <span class="token comment">&lt;!-- 需要加密的jar依赖文件，多个包用逗号分隔，此处加密项目公共模块 --&gt;</span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>libjars</span><span class="token punctuation">&gt;</span></span>common-*.jar<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>libjars</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>configuration</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>net.roseboy<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>classfinal-maven-plugin<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>1.2.1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>executions</span><span class="token punctuation">&gt;</span></span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>execution</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>phase</span><span class="token punctuation">&gt;</span></span>package<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>phase</span><span class="token punctuation">&gt;</span></span> <span class="token comment">&lt;!-- 在打包阶段执行加密 --&gt;</span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>goals</span><span class="token punctuation">&gt;</span></span>
              <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>goal</span><span class="token punctuation">&gt;</span></span>classFinal<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>goal</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>goals</span><span class="token punctuation">&gt;</span></span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>execution</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>executions</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugin</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugins</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>pluginManagement</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>build</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token comment">&lt;!-- classfinal 字节码加密 --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugin</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>net.roseboy<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>classfinal-maven-plugin<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugin</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置完成之后，同步maven，然后package打包，会在工程target目录下生成一个yourpaoject-encrypted.jar的文件，这个就是加密后的文件。</p><p>加密后的项目需要设置javaagent来启动，项目在启动过程中解密class，完全内存解密，不留下任何解密后的文件。解密逻辑已经自动加入到 yourpaoject-encrypted.jar中，所以启动时-javaagent与-jar相同即可，不需要额外的Agent jar包。</p><h3 id="启动方式" tabindex="-1"><a class="header-anchor" href="#启动方式" aria-hidden="true">#</a> 启动方式</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#有密码的启动命令：</span>
<span class="token comment">#参数说明 </span>
<span class="token comment"># -pwd      加密项目的密码   </span>
<span class="token comment"># -pwdname  环境变量中密码的名字</span>
<span class="token function">java</span> -javaagent:yourpaoject-encrypted.jar<span class="token operator">=</span><span class="token string">&#39;-pwd 123456&#39;</span> <span class="token parameter variable">-jar</span> yourpaoject-encrypted.jar

<span class="token comment">#无密码的启动命令：</span>
<span class="token function">java</span> -javaagent:yourpaoject-encrypted.jar <span class="token parameter variable">-jar</span> yourpaoject-encrypted.jar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动时，如果在控制台总看到以下界面显示，说明字节码解密成功，可以无差别的使用项目了： <img width="463" height="105" alt="image" src="https://github.com/user-attachments/assets/ae42588e-dcc0-4fe8-af5a-a2eba29def5c"></p><h2 id="六、主动防御-逆向工具探测" tabindex="-1"><a class="header-anchor" href="#六、主动防御-逆向工具探测" aria-hidden="true">#</a> 六、主动防御：逆向工具探测</h2><p>在关键类中植入反制代码，虽然不能完全限制反编译，但是可以有效瘫痪现成的逆向工具，并影响攻击者的系统：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">static</span> <span class="token punctuation">{</span>
    <span class="token class-name">String</span> vmName <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">getProperty</span><span class="token punctuation">(</span><span class="token string">&quot;java.vm.name&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>vmName <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> vmName<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span><span class="token string">&quot;Decompiler&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>err<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;[警报] 检测到反编译行为！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 此处可扩展为日志轰炸、线程阻塞等机制</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="七、防护策略建议" tabindex="-1"><a class="header-anchor" href="#七、防护策略建议" aria-hidden="true">#</a> 七、防护策略建议</h2><table><thead><tr><th>方案</th><th>防护强度</th><th>侵入性</th><th>维护成本</th></tr></thead><tbody><tr><td>代码混淆</td><td>★★★</td><td>中</td><td>高</td></tr><tr><td>字节码加密</td><td>★★★★</td><td>低</td><td>低</td></tr><tr><td>反制陷阱</td><td>★★</td><td>高</td><td>低</td></tr></tbody></table><p><strong>推荐组合策略</strong>：优先采用字节码加密（对业务无侵入），配合ProGuard混淆关键业务类。防御代码建议用于敏感模块，但需谨慎避免影响正常调试。<br><strong>没有绝对安全的系统，但至少要做一些工作，让破解者付出远高于开发成本的代价！</strong></p>`,14);function m(b,h){const s=i("font");return c(),o("div",null,[r,a("p",null,[n("对于微服务框架，实现如下"),t(s,{style:{color:"rgb(74, 74, 74)"}},{default:e(()=>[n("：")]),_:1})]),a("h3",d,[k,n(),t(s,{style:{color:"rgb(74, 74, 74)"}},{default:e(()=>[n("Maven插件配置")]),_:1})]),v,a("p",null,[n("对于微服务框架，实现如下"),t(s,{style:{color:"rgb(74, 74, 74)"}},{default:e(()=>[n("：")]),_:1})]),g])}const y=l(u,[["render",m],["__file","Java项目如何防止反编译？拒绝源码_裸奔_的防护指南.html.vue"]]);export{y as default};
