import { Config, App, Middleware } from '@midwayjs/decorator';
import { IMiddleware } from '@midwayjs/core';
import {
  NextFunction,
  Context,
  Application,
  IMidwayKoaApplication,
} from '@midwayjs/koa';

import {
  ApolloServer as ApolloServerKoa,
  Config as ApolloServerKoaConfig,
} from 'apollo-server-koa';

import { buildSchemaSync } from 'type-graphql';

import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import { GraphQLSchema } from 'graphql';
import { playgroundDefaultSettings } from '../shared/constants';
import { presetApolloOption, presetOption } from '../shared/preset-option';
import {
  CreateGraphQLMiddlewareOption,
  CreateKoaGraphQLMiddlewareOption,
} from '../shared/types';
import merge from 'lodash/merge';
import { getFallbackResolverPath } from '../shared/utils';

export const sharedInitGraphQLSchema = (
  app: Application,
  options: CreateGraphQLMiddlewareOption['schema']
) => {
  const {
    resolvers = getFallbackResolverPath(app),
    authMode,
    authChecker,
    dateScalarMode,
    nullableByDefault,
    skipCheck,
    globalMiddlewares,
    emitSchemaFile,
  } = options;

  const schema = buildSchemaSync({
    resolvers,
    dateScalarMode,
    nullableByDefault,
    skipCheck,
    globalMiddlewares,
    authMode,
    authChecker,
    emitSchemaFile,
    container: app.getApplicationContext(),
  });

  return schema;
};

const getPresetPluginList = (prodPlaygound: boolean, schema: GraphQLSchema) => {
  const plugins = [
    prodPlaygound || process.env.NODE_ENV !== 'production'
      ? ApolloServerPluginLandingPageGraphQLPlayground({
          settings: playgroundDefaultSettings,
        })
      : ApolloServerPluginLandingPageDisabled(),
  ].filter(Boolean);

  return plugins;
};

export function initKoaApolloServer(
  ctx: Context,
  app: Application,
  schema: GraphQLSchema,
  config: ApolloServerKoaConfig,
  extraConfig: { prodPlaygound?: boolean; appendApplicationContext?: boolean }
): ApolloServerKoa {
  const merged = merge(presetApolloOption, config, extraConfig);

  const {
    context: userGraphQLContext,
    dataSources,
    mocks,
    mockEntireSchema,
    introspection,
    persistedQueries,
    plugins,
    prodPlaygound,
    appendApplicationContext,
  } = merged;

  const server = new ApolloServerKoa({
    schema,
    persistedQueries,
    context: appendApplicationContext
      ? ({ ctx }: { ctx: Context }) => {
          return {
            ...userGraphQLContext,
            appContext: ctx,
            container: app.getApplicationContext(),
          };
        }
      : userGraphQLContext,
    plugins: [...getPresetPluginList(prodPlaygound, schema), ...plugins],
    dataSources,
    mocks,
    mockEntireSchema,
    introspection,
  });

  return server;
}

@Middleware()
export class GraphQLKoaMiddleware
  implements IMiddleware<Context, NextFunction>
{
  @Config('graphql')
  externalconfig: CreateKoaGraphQLMiddlewareOption;

  @App()
  app: IMidwayKoaApplication;

  static Identifer = 'GraphQLKoaMiddleware';

  static getName(): string {
    return GraphQLKoaMiddleware.Identifer;
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const {
        apollo,
        schema: buildSchemaOptions,
        path,
        prodPlaygound,
        appendApplicationContext,
        cors,
        bodyParserConfig,
        disableHealthCheck,
        onHealthCheck = null,
      } = merge(presetOption, this.externalconfig);

      const schema =
        apollo?.schema ?? sharedInitGraphQLSchema(this.app, buildSchemaOptions);

      const server = initKoaApolloServer(ctx, this.app, schema, apollo, {
        prodPlaygound,
        appendApplicationContext,
      });

      await server.start();

      server.applyMiddleware({
        app: this.app,
        path,
        cors,
        bodyParserConfig,
        disableHealthCheck,
        onHealthCheck,
      });

      await next();
    };
  }
}
