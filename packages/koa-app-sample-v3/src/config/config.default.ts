import { MidwayConfig } from '@midwayjs/core';
import { SampleResolver } from '../resolvers/sample.resolver';
import { CreateGraphQLMiddlewareOption } from 'apollo-server-midway3';
import { ServerRegistration } from 'apollo-server-koa';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1644730611884_1067',
  koa: {
    port: 7001,
  },
  graphql: <CreateGraphQLMiddlewareOption>{
    schema: {
      resolvers: [SampleResolver],
    },
    path: '/graphql',
  },
  apollo: <ServerRegistration>{
    path: '/graphql',
  },
} as MidwayConfig;
