# Apollo-Server-Midway V3

## 简介

- 这里是 Apollo-Server-Midway 的 V3 版本，适用于 [Midway V3](https://midwayjs.org/) 版本
- 适用于 Midway V2 版本： [Apollo-Server-Midway](https://github.com/LinbuduLab/apollo-server-midway)，你也可以直接阅读 [GraphQL | Midway](https://midwayjs.org/docs/2.0.0/extensions/graphql)。
- V3 版本相对比 V2 版本有非常多的改进与新的 Feature 支持，目前仍处于开发阶段中，但已支持了基本的 Koa App 项目，你可以参考 [koa-app-sample-v3](packages/koa-app-sample-v3) ，阅读下方的 **尝鲜** 一节来了解更多。
  - 目前大部分的能力和 V2 保持一致，但移除了内置的 Apollo Plugin
  - 对 Express、 Midway Serverless 的支持尚未完成


## 尝鲜

```bash
$ pnpm install

cd packages/koa-app-sample-v3

pnpm dev
```

> 在完成安装后，你还需要手动修改 `packages/koa-app-sample-v3/node_modules/@midwayjs/koa/dist/framework.js`，注释掉 59 - 61 行代码，来暂时禁用掉 V3 内置的 notFound 中间件。
>
> ```javascript
>  // not found middleware
> const notFound = async (ctx, next) => {
> 	await next();
> 	// if (!ctx._matchedRoute) {
> 	//     throw new core_1.httpError.NotFoundError();
> 	// }
> };
> ```
>
> 

使用以下的简单查询：

```graphql
query {
  QuerySample {
    SampleField
  }
}
```

参考 [GraphQL Middleware](packages/koa-app-sample-v3/src/middleware/graphql.ts) 来了解如何为 Midway V3 编写基于 Apollo Server 的 GraphQL 中间件。

### WIP

- [ ] 使用成本
  - [ ] 支持零配置使用
  - [ ] 支持内置的 PlainTypeDefs、PlainResolvers 来提供快速的上手
  - [ ] 配置及配置声明植入
- [ ] 框架支持
  - [ ] 支持 Express （V3 将不再支持 EggJS）
  - [ ] 支持 Midway Serverless
- [ ] 能力增强
  - [ ] 全新的、基于 V3 的插件
  - [ ] 内置 Prisma 支持
  - [ ] 内置 Nexus 支持
  - [ ] Apollo Tracing & Reporting 支持
