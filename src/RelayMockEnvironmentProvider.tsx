import React from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { createMockEnvironment } from 'relay-test-utils';

interface WithRelayMockEnvironmentProps {
  children: React.ReactNode;
}

const RelayMockEnvironmentProvider = ({ children }: WithRelayMockEnvironmentProps) => {
  const relayEnvironment = createMockEnvironment();

  // Add environment to Relay DevTools https://relay.dev/docs/en/relay-debugging#tools
  // @ts-ignore
  if (window.parent.__RELAY_DEVTOOLS_HOOK__) {
    // @ts-ignore
    window.parent.__RELAY_DEVTOOLS_HOOK__.registerEnvironment(relayEnvironment);
    // @ts-ignore
    window.parent.relayEnvironment = relayEnvironment;
  }

  return <RelayEnvironmentProvider environment={relayEnvironment}>{children}</RelayEnvironmentProvider>;
};

export default RelayMockEnvironmentProvider;
