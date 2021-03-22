import React from 'react';
import { PreloadedQuery, graphql, usePreloadedQuery } from 'react-relay';

import Limiter from './Limiter';
import PostComposer from './PostComposer';
import PostList from './PostList';
import Trending from './Trending';

import { FeedQuery } from './__generated__/FeedQuery.graphql';

export interface FeedProps {
  queryReference: PreloadedQuery<FeedQuery>;
}

const getSpan = (span: number) => {
  return `${(span * 100) / 24}%`;
};

const Feed = (props: FeedProps) => {
  const data = usePreloadedQuery<FeedQuery>(
    graphql`
      query FeedQuery {
        ...PostComposer_query
        ...PostList_query
        ...Trending_query
      }
    `,
    props.queryReference,
  );

  return (
    <Limiter maxWidth={1200} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginRight: '40px',
          width: getSpan(16),
        }}
      >
        <PostComposer query={data} />
        <PostList query={data} />
      </div>

      <div style={{ width: getSpan(8) }}>
        <Trending query={data} />
      </div>
    </Limiter>
  );
};

export default Feed;
