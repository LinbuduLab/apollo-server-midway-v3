// 由于修改了默认的类型导出位置，需要额外导出 dist 下的类型
export * from './dist/index';

import { CreateKoaGraphQLMiddlewareOption } from './dist/index';

// 标准的扩展声明
declare module '@midwayjs/core/dist/interface' {
  // 将配置合并到 MidwayConfig 中
  interface MidwayConfig {
    graphql?: CreateKoaGraphQLMiddlewareOption;
  }
}
