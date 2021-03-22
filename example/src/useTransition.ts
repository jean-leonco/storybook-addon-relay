import React from 'react';

declare module 'react' {
  interface IUseTransitionProps {
    timeoutMs?: number;
  }
  export function unstable_useTransition(props?: IUseTransitionProps): [(cb: () => void) => void, boolean];
}

const useTransition = React.unstable_useTransition;

export default useTransition;
