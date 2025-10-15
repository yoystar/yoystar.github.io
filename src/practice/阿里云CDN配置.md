---
title: 阿里云CDN配置
icon: page
order: 7
author: yoystar
date: 2025-05-15
tag:
  - MySQL
  - EXPLAIN
  - SQL调优
star: true 
---

## 一.阿里云CDN配置以及缓存预热

##### 1. 登录[CDN控制台](https://cdn.console.aliyun.com/domain/list)。

##### 2. 单击刷新预热，操作类型选择预热，在URL框内输入URL地址，单击提交，预热任务会将需要预热的文件预热到CDN的二级节点上。

<img width="884" height="711" alt="image" src="https://github.com/user-attachments/assets/48e8b059-25e8-44d8-bfe6-ef9492965b0e" />


##### 3. 单击操作记录，即可查看资源预热的详细记录和进度。预热进度为100%，表示预热执行完成，预热数量多会影响预热进度，请您耐心等待。 说明：预热任务的状态为成功，表示预热任务提交成功，并不代表文件已经预热结束。

##### 4. 执行如下命令，查看预热任务的执行状态。

```xml
curl -I 'http://yourwebsite.cn/SC_Update/IP816N_57TE0/update_V1.0.1_20241029.zip'
curl -I 'http://yourwebsite.cn/SC_Update/IP816N_57TE0/speedtest/speed.ts'
```

<img width="972" height="311" alt="image" src="https://github.com/user-attachments/assets/aadc3ec2-36d9-43af-8d6f-8a2751732ea9" />


**说明**：

- Via的前半部分代表二级节点状态，其中的“H”表示命中，说明文件已经预热到二级节点，不需要再回源站。
- Via的后半部分代表一级节点的状态，“M”表示一级节点上没有缓存，需要向二级节点回源。

##### 5. CDN节点架构及缓存策略

CDN缓存节点可分为L1节点和L2节点。L1节点分布在全国各省市，L2节点分布在几个大区下，简单架构如下图所示。

<img width="745" height="533" alt="image" src="https://github.com/user-attachments/assets/395f055e-0ff7-426f-ada9-22055791d5e5" />


CDN节点缓存策略如下：

1. 客户端在请求域名时，先向本地DNS查询该域名对应的IP地址，本地DNS再向权威DNS进行查询，由阿里云CDN进行调度，为该DNS分配对应的节点。
2. 客户端向CDN节点发起连接请求，当L1节点有缓存资源时，会命中该资源，直接将数据返回给客户端。当L1节点无缓存资源时，会向L2节点请求对应资源，如果L2节点有缓存资源，则将资源同步到L1节点，并返回给用户；如果L2节点无缓存资源，则直接回客户源站获取资源，并按照配置的缓存策略进行缓存。

## 二.给二级域名添加CDN

##### 1.首先进入CDN控制台，添加域名：

<img width="1858" height="401" alt="image" src="https://github.com/user-attachments/assets/8e80d20c-3f68-49b8-9970-714cabd77124" />


##### 2.新添加域名配置如下：

<img width="1491" height="890" alt="image" src="https://github.com/user-attachments/assets/f8e54986-1b82-4c1a-b473-2e9ebf230690" />


<img width="1793" height="731" alt="image" src="https://github.com/user-attachments/assets/bdc02d75-985f-436c-8a15-254e29112ac3" />


<img width="1761" height="850" alt="image" src="https://github.com/user-attachments/assets/e4955f2c-4509-4168-a612-63cb00f36e25" />


##### 3.配置完成后，复制新添加链接对应的CNAME:

<img width="1853" height="370" alt="image" src="https://github.com/user-attachments/assets/ff2e91be-1fca-4b4d-b70a-94a6f949fae1" />


##### 4.进入DNS解析控制台，新添加一条DNS解析记录：

主机记录为以上步骤新添加的域名；

记录类型为CNAME；

记录值为步骤3获取的CNAME值

<img width="1838" height="538" alt="image" src="https://github.com/user-attachments/assets/640bbee9-2e25-4b87-98df-afaacd570afa" />


##### 5.若依框架中，将新添加的域名配置为"自定义域名"，如下图所示：

<img width="884" height="740" alt="image" src="https://github.com/user-attachments/assets/27ea2fdb-ca24-4b31-92c1-860475467b95" />


##### 6.注意信息：

**标准DNS协议规定：**同一个主机名（如cdn.example.com）不能同时存在A记录和CNAME记录，否则会导致解析异常或不可预期的行为，因此配置cdn的二级域名需要单独一条，与其他业务用的二级域名区分开，例如minio的域名需要两个：

minio.yourwebsite.cn，用于文件上传、控制台登录等业务。

minio-cdn.yourwebsite.cn，用于文件下载的cdn加速。



**CDN涉及端口信息有两个，分别为：**

​    **用户访问CDN的端口（即CDN加速域名的端口）：**默认HTTP 80 和 HTTPS 443，大多数CDN服务商（包括阿里云、腾讯云、七牛云等）只支持80和443端口，不支持自定义其他端口（如9000等）。

​    **CDN回源到源站的端口（即CDN节点向源站服务器请求时用的端口）：**可以在CDN控制台源站配置里指定回源端口（如9000等），这会决定CDN节点回源时访问源站的哪个端口。



**正确的访问CDN链接（http使用默认80端口）：**

http://minio.yourwebsite.cn/your-bucket/image/2025/05/20/891c073b81924eff819ba2072bdf516f_1070938f17a646599294518da8ce2dfb_update98.zip 

**不正确****的访问CDN链接（错误的带上回源端口）：**


http://minio.yourwebsite.cn:9000/your-bucket/image/2025/05/20/891c073b81924eff819ba2072bdf516f_1070938f17a646599294518da8ce2dfb_update98.zip
