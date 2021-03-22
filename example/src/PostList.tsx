import React, { Suspense } from 'react';
import { graphql, usePaginationFragment, useSubscription } from 'react-relay';
import { ROOT_ID } from 'relay-runtime';

import useTransition from './useTransition';

import PostCard from './PostCard';

import { PostListPaginationQuery } from './__generated__/PostListPaginationQuery.graphql';
import { PostList_query$key } from './__generated__/PostList_query.graphql';
import { PostListSubscription } from './__generated__/PostListSubscription.graphql';

export interface PostListProps {
  query: PostList_query$key;
}

const PostList = ({ query }: PostListProps) => {
  const [startTransition, isPending] = useTransition({ timeoutMs: 2000 });

  const { data, loadNext } = usePaginationFragment<PostListPaginationQuery, PostList_query$key>(
    graphql`
      fragment PostList_query on Query
      @argumentDefinitions(first: { type: Int, defaultValue: 10 }, after: { type: String })
      @refetchable(queryName: "PostListPaginationQuery") {
        posts(first: $first, after: $after) @connection(key: "PostList_posts") {
          edges {
            node {
              id
              ...PostCard_post
            }
          }
        }
      }
    `,
    query,
  );

  useSubscription<PostListSubscription>({
    subscription: graphql`
      subscription PostListSubscription($input: PostNewInput!, $connections: [ID!]!) {
        PostNew(input: $input) {
          postEdge @prependEdge(connections: $connections) {
            node {
              id
              ...PostCard_post
            }
          }
        }
      }
    `,
    variables: {
      input: {},
      connections: [`client:${ROOT_ID}:__PostList_posts_connection`],
    },
  });

  if (data.posts.edges.length === 0) {
    return (
      <div
        style={{
          fontSize: '20px',
          color: '#303030',
          width: '100%',
          margin: '28px 0',
          textAlign: 'center',
        }}
      >
        Your feed is empty :(
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Suspense fallback="Loading...">
        {data.posts.edges.map((edge) => (
          <PostCard key={edge.node.id} post={edge.node} />
        ))}
      </Suspense>

      <button
        style={{
          height: '48px',
          padding: '0 20px',
          borderRadius: '6px',
          background: '#1B7340',
          marginTop: '12px',
          color: '#FFFFFF',
        }}
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            loadNext(10);
          });
        }}
      >
        {isPending ? 'Loading...' : 'Load more posts'}
      </button>
    </div>
  );
};

export default PostList;
