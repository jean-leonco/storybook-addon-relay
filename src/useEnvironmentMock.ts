import { useRelayEnvironment } from 'react-relay';
import { MockPayloadGenerator, RelayMockEnvironment } from 'relay-test-utils';
import { MockResolvers } from 'relay-test-utils/lib/RelayMockPayloadGenerator';

const useEnvironmentMock = () => {
  // @ts-ignore
  const relayEnvironment: RelayMockEnvironment = useRelayEnvironment();

  const queueOperationResolver = (mockResolvers?: MockResolvers) => {
    relayEnvironment.mock.queueOperationResolver((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers),
    );
  };

  const resolveMostRecentOperation = (mockResolvers?: MockResolvers) => {
    relayEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers),
    );
  };

  return { mock: relayEnvironment.mock, queueOperationResolver, resolveMostRecentOperation };
};

export default useEnvironmentMock;
