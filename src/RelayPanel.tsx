import { useParameter } from '@storybook/api';
import { Placeholder, SyntaxHighlighter, TabsState } from '@storybook/components';
import React from 'react';

import OperationsTab from './OperationsTab';

import { RelayStoryProps } from './RelayQueryPreloader';

const RelayPanel = () => {
  const relayParams = useParameter<RelayStoryProps>('relay');

  if (!relayParams) {
    return <Placeholder>No mocks for this story</Placeholder>;
  }

  return (
    <TabsState initial="logger">
      <div key="logger" id="logger" title="Event Logger">
        <SyntaxHighlighter language="bash" padded>
          RelayNetworkLogger:
        </SyntaxHighlighter>
      </div>
      <div key="operations" id="operations" title="Operations">
        <OperationsTab />
      </div>
    </TabsState>
  );
};

export default RelayPanel;
