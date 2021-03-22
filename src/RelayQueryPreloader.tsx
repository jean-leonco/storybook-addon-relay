import React, { Suspense, useEffect, useMemo } from 'react';
import { useQueryLoader } from 'react-relay';
import { GraphQLTaggedNode, OperationType, VariablesOf } from 'relay-runtime';
import { MockResolvers } from 'relay-test-utils/lib/RelayMockPayloadGenerator';

import QueryReferenceContext from './QueryReferenceContext';
import RelayMockEnvironmentProvider from './RelayMockEnvironmentProvider';
import useEnvironmentMock from './useEnvironmentMock';

export interface RelayStoryProps<TQuery extends OperationType = any> {
  query: GraphQLTaggedNode;
  variables?: VariablesOf<TQuery>;
  mockResolvers: MockResolvers;
  fallback?: React.ReactNode;
  timeout?: number;
  children: React.ReactNode;
}

const RelayQueryPreloader = <TQuery extends OperationType>({
  query,
  variables = {},
  mockResolvers,
  fallback = 'Loading',
  timeout,
  children,
}: RelayStoryProps<TQuery>) => {
  const { resolveMostRecentOperation } = useEnvironmentMock();

  const [queryReference, loadQuery] = useQueryLoader<TQuery>(query);

  const context = useMemo(() => ({ queryReference }), [queryReference]);

  useEffect(() => {
    /*  if (queryReference !== null) {
      disposeQuery();
      return;
    } */

    loadQuery(variables);

    if (timeout) {
      setTimeout(() => {
        resolveMostRecentOperation(mockResolvers);
      }, timeout);
    } else {
      resolveMostRecentOperation(mockResolvers);
    }

    /*  return () => {
      disposeQuery();
    }; */
  }, []);

  if (queryReference === null) {
    return null;
  }

  return (
    <Suspense fallback={fallback}>
      <QueryReferenceContext.Provider value={context}>{children}</QueryReferenceContext.Provider>
    </Suspense>
  );
};

interface RelayQueryPreloaderWrapperProps<TQuery extends OperationType = any> extends RelayStoryProps<TQuery> {
  withEnvironmentProvider: boolean;
}

const RelayQueryPreloaderWrapper = <TQuery extends OperationType>({
  withEnvironmentProvider = true,
  ...props
}: RelayQueryPreloaderWrapperProps<TQuery>) => {
  if (!withEnvironmentProvider) {
    return <RelayQueryPreloader {...props} />;
  }

  return (
    <RelayMockEnvironmentProvider>
      <RelayQueryPreloader {...props} />
    </RelayMockEnvironmentProvider>
  );
};

export default RelayQueryPreloaderWrapper;
