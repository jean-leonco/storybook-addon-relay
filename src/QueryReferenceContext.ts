import { createContext, useContext } from 'react';
import { PreloadedQuery } from 'react-relay';
import { OperationType } from 'relay-runtime';

interface IQueryReferenceContext<TQuery extends OperationType = any> {
  queryReference: PreloadedQuery<TQuery> | null | undefined;
}

const QueryReferenceContext = createContext<IQueryReferenceContext>({ queryReference: null });

export const useQueryReference = <TQuery extends OperationType = any>() => {
  return useContext<IQueryReferenceContext<TQuery>>(QueryReferenceContext);
};

export default QueryReferenceContext;
