import { Middleware, App } from '@midwayjs/decorator';
import { IMiddleware } from '@midwayjs/core';
import {
  IMidwayKoaApplication,
  IMidwayKoaContext,
  NextFunction,
  Context,
} from '@midwayjs/koa';

import { ApolloServer } from 'apollo-server-koa';
import { buildSchemaSync } from 'type-graphql';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';

import { SampleResolver } from '../resolvers/sample.resolver';

@Middleware()
export class GraphQLMiddleware implements IMiddleware<Context, NextFunction> {
  static Identifer = 'GraphQLMiddleware';

  static getName(): string {
    return GraphQLMiddleware.Identifer;
  }

  @App()
  app: IMidwayKoaApplication;

  resolve() {
    return async (_ctx: IMidwayKoaContext, next: NextFunction) => {
      // const container = this.app.getApplicationContext();

      const schema = buildSchemaSync({
        resolvers: [SampleResolver],
        // 使用应用上下文作为容器
        // container,
        // 使用请求上下文作为容器
        container: ({ context }) => context.container,
        authMode: 'error',
        emitSchemaFile: 'schema.graphql',
      });

      const server = new ApolloServer({
        schema,
        // 这里的 ctx 实际上是被 Midway 处理过的，所以你可以拿到 requestContext
        context: ({ ctx }: { ctx: IMidwayKoaContext }) => {
          return {
            container: ctx.requestContext,
            reqCtx: ctx,
          };
        },
        plugins: [
          ['production'].includes(process.env.NODE_ENV) ||
          process.env.DISABLE_PLAYGROUND
            ? ApolloServerPluginLandingPageDisabled()
            : ApolloServerPluginLandingPageGraphQLPlayground({
                settings: {
                  'editor.theme': 'dark',
                  'editor.reuseHeaders': true,
                  'editor.fontSize': 14,
                  'editor.fontFamily': '"Fira Code"',
                  'schema.polling.enable': true,
                  'schema.polling.interval': 5000,
                  'tracing.hideTracingResponse': false,
                  'queryPlan.hideQueryPlanResponse': false,
                },
              }),
        ],
        // introspection: true,
      });

      await server.start();

      server.applyMiddleware({
        app: this.app,
        path: '/apollo',
      });

      await next();
    };
  }
}
