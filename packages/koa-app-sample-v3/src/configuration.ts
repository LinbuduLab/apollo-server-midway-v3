import { Configuration, App } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';

import * as ApolloMidway from 'apollo-server-midway3';

import { GraphQLMiddleware } from './middleware/graphql';
import { IMidwayContainer } from '@midwayjs/core';

@Configuration({
  imports: [
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    ApolloMidway,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady(container: IMidwayContainer) {
    container.registerObject('foo', 'bar');

    // add middleware
    // this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
    this.app.getMiddleware().insertFirst(GraphQLMiddleware);
    this.app.getMiddleware().insertFirst(ApolloMidway.GraphQLKoaMiddleware);
  }
}
