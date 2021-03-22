import React from 'react';
import { graphql, useRefetchableFragment } from 'react-relay';

import useTransition from './useTransition';

import refreshIcon from './assets/refresh-icon.png';

import { TrendingRefetchQuery } from './__generated__/TrendingRefetchQuery.graphql';
import { Trending_query$key } from './__generated__/Trending_query.graphql';

export interface TrendingProps {
  query: Trending_query$key;
}

const Trending = (props: TrendingProps) => {
  const [startTransition, isPending] = useTransition({ timeoutMs: 2000 });

  const [data, refetch] = useRefetchableFragment<TrendingRefetchQuery, Trending_query$key>(
    graphql`
      fragment Trending_query on Query @refetchable(queryName: "TrendingRefetchQuery") {
        trending(first: 5) {
          edges {
            node {
              id
              topic
              mentions
            }
          }
        }
      }
    `,
    props.query,
  );

  return (
    <div style={{ width: '100%', background: '#FFFFFF', padding: '14px 15px', margin: '14px 0', borderRadius: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '20px', color: '#303030', fontWeight: 'bold' }}>Trending topics</span>
        <button
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              refetch({});
            });
          }}
        >
          {isPending ? (
            'Loading...'
          ) : (
            <img src={refreshIcon} alt="Refresh trending topics" style={{ height: '18px' }} />
          )}
        </button>
      </div>

      {data.trending.edges.map((edge) => (
        <div
          key={edge.node.id}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '20px 0',
          }}
        >
          <span>{edge.node.topic.length > 20 ? edge.node.topic.slice(0, 17).concat('...') : edge.node.topic}</span>
          <span>{edge.node.mentions} mentions</span>
        </div>
      ))}
    </div>
  );
};

export default Trending;
