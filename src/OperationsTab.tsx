import { useParameter } from '@storybook/api';
import { Form, SyntaxHighlighter, TabsState } from '@storybook/components';
import React, { useState } from 'react';
import { OperationDescriptor } from 'relay-runtime';

import { RelayStoryProps } from './RelayQueryPreloader';

const getOperationRequest = (operation: OperationDescriptor) => {
  if (!operation) {
    return null;
  }

  return operation.request;
};

const getOperationParams = (operation: OperationDescriptor) => {
  return getOperationRequest(operation)?.node.params;
};

const OperationsTab = () => {
  const { mockResolvers } = useParameter<RelayStoryProps>('relay');
  const [activeIndex, setActiveIndex] = useState(0);

  // @ts-ignore
  const operations: readonly OperationDescriptor[] = window.parent.relayEnvironment.mock.getAllOperations();

  const activeOperation = operations[activeIndex];

  return (
    <>
      <Form.Field label="Operations">
        <Form.Select
          css={``}
          value={activeIndex}
          onChange={(event) => setActiveIndex(Number(event.currentTarget.value))}
          size="auto"
        >
          {operations.map((operation, index) => (
            <option key={index} value={index}>
              {index + 1}. {getOperationParams(operation)?.name}
            </option>
          ))}
        </Form.Select>
      </Form.Field>

      {activeOperation && (
        <TabsState initial="request">
          <div key="request" id="request" title="Request">
            <SyntaxHighlighter language="graphql" copyable bordered padded>
              {getOperationParams(activeOperation)?.text}
            </SyntaxHighlighter>
          </div>

          <div key="variables" id="variables" title="Variables">
            <SyntaxHighlighter language="json" copyable bordered padded>
              {JSON.stringify(getOperationRequest(activeOperation)?.variables, null, 2)}
            </SyntaxHighlighter>
          </div>

          <div key="result" id="result" title="Result">
            <SyntaxHighlighter language="typescript" copyable bordered padded>
              {JSON.stringify(mockResolvers, null, 2)}
            </SyntaxHighlighter>
          </div>
        </TabsState>
      )}
    </>
  );
};

export default OperationsTab;
