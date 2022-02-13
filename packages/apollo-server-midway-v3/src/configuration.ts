import { Configuration } from '@midwayjs/decorator';
import {
  ILifeCycle,
  IMidwayApplication,
  IMidwayContainer,
} from '@midwayjs/core';

@Configuration({
  imports: [],
  namespace: 'graphql',
})
export class GraphQLConfiguration implements ILifeCycle {
  async onReady(
    container: IMidwayContainer,
    app: IMidwayApplication
  ): Promise<void> {}

  async onStop(): Promise<void> {}
}
