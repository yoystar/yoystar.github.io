import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    {
      text: "Spring",
      icon: "leaf",
      prefix: "spring/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Spring Cloud",
      icon: "discover",
      prefix: "springcloud/",
      children: "structure",
      collapsible: true
    },
    {
      text: "并发编程",
      icon: "asynchronous",
      prefix: "concurrent/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Java进阶",
      icon: "java",
      prefix: "advanced/",
      children: "structure",
      collapsible: true
    },
    {
      text: "MySql",
      icon: "mysql",
      prefix: "mysql/",
      children: "structure",
      collapsible: true
    },
    {
      text: "MyBatis",
      icon: "grid",
      prefix: "mybatis/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Redis",
      icon: "workingDirectory",
      prefix: "redis/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Kafka",
      icon: "link",
      prefix: "kafka/",
      children: "structure",
      collapsible: true
    },
    {
      text: "项目实战",
      icon: "creative",
      prefix: "practice/",
      children: "structure",
      collapsible: true
    },
    {
      text: "AI",
      icon: "emmet",
      prefix: "ai/",
      children: "structure",
      collapsible: true
    }
  ],
});
