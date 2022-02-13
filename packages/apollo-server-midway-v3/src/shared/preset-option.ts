import {
  UsableApolloOption,
  UsableBuildSchemaOption,
  CreateGraphQLMiddlewareOption,
} from '../shared/types';

const DEV_MODE = process.env.NODE_ENV !== 'production';

export const presetApolloOption: UsableApolloOption = {
  context: {},
  rootValue: {},
  introspection: true,
  plugins: [],
  mocks: false,
  mockEntireSchema: false,
  schema: undefined,
};

export const presetBuildSchemaOption: UsableBuildSchemaOption = {
  dateScalarMode: 'timestamp',
  nullableByDefault: false,
  skipCheck: false,
  globalMiddlewares: [],
  authMode: 'error',
  resolvers: ['SKIP_NON_EMPTY_CHECK'],
};

export const presetCreateMiddlewareOption: CreateGraphQLMiddlewareOption = {
  path: '/graphql',
  prodPlaygound: false,
  appendApplicationContext: false,
  disableHealthCheck: DEV_MODE,
  apollo: presetApolloOption,
  schema: {
    ...presetBuildSchemaOption,
    emitSchemaFile: 'schema.graphql',
    container: null,
  },
};

export const presetOption = {
  path: '/graphql',
  prodPlaygound: false,
  appendFaaSContext: false,
  disableHealthCheck: DEV_MODE,
  disableHealthResolver: DEV_MODE,
  apollo: presetApolloOption,
  schema: presetBuildSchemaOption,
};
