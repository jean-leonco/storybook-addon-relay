import { GraphQLResponse, OperationDescriptor, RequestParameters, Variables } from 'relay-runtime';

type LogEvent =
  | {
      name: 'queryresource.fetch';
      operation: OperationDescriptor;
      fetchPolicy: string;
      renderPolicy: string;
      hasFullQuery: boolean;
      shouldFetch: boolean;
    }
  | {
      name: 'execute.info';
      transactionID: number;
      info: any;
    }
  | {
      name: 'execute.start';
      transactionID: number;
      params: RequestParameters;
      variables: Variables;
    }
  | {
      name: 'execute.next';
      transactionID: number;
      response: GraphQLResponse;
    }
  | {
      name: 'execute.error';
      transactionID: number;
      error: Error;
    }
  | {
      name: 'execute.complete';
      transactionID: number;
    }
  | {
      name: 'execute.unsubscribe';
      transactionID: number;
    };

type LogEventRecord = Record<number, LogEvent>;

const unlogged: LogEventRecord | LogEventRecord[][] = [];

export const RelayNetworkLogger = (event: LogEvent) => {
  if (event.name === 'queryresource.fetch') {
    return;
  }

  const { transactionID } = event;

  if (event.name === 'execute.start') {
    unlogged[transactionID] = [event];
    return;
  }

  if (event.name === 'execute.next') {
    unlogged[transactionID] = [...(unlogged[transactionID] as LogEventRecord[]), event];
    return;
  }

  if (event.name === 'execute.error' || event.name === 'execute.complete' || event.name === 'execute.unsubscribe') {
    delete unlogged[transactionID];
    return;
  }
};
