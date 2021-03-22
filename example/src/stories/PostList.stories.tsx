import React from 'react';
import { graphql, usePreloadedQuery } from 'react-relay';
import { Meta, Story } from '@storybook/react';
import { RelayQueryPreloader, useQueryReference } from 'storybook-addon-relay';
import faker from 'faker';

import PostList, { PostListProps } from '../PostList';
import Limiter from '../Limiter';

import { PostListStoriesQuery } from './__generated__/PostListStoriesQuery.graphql';

const query = graphql`
  query PostListStoriesQuery @relay_test_operation {
    ...PostList_query
  }
`;

const CONNECTION_PREFIX = 'mock';

export const BasicUsage: Story<PostListProps> = (args) => {
  const { queryReference } = useQueryReference<PostListStoriesQuery>();

  const data = usePreloadedQuery<PostListStoriesQuery>(query, queryReference!);

  return (
    <Limiter>
      {' '}
      <PostList {...args} query={data} />
    </Limiter>
  );
};

BasicUsage.parameters = {
  relay: {
    query,
    mockResolvers: {
      PostConnection() {
        const totalCount = 5;
        const edges: any[] = [];

        for (let i = 0; i < totalCount; i++) {
          edges.push({
            cursor: btoa(`${CONNECTION_PREFIX}${i}`),
            node: {
              author: { name: faker.name.findName(), avatarUri: faker.image.image() },
              content: faker.lorem.paragraph(),
              createdAt: faker.date.recent().toISOString(),
              commentCount: faker.random.number(15),
              likeCount: faker.random.number(30),
              viewerHasLiked: faker.random.boolean(),
            },
          });
        }

        return {
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: true,
            startCursor: btoa(`${CONNECTION_PREFIX}0`),
            endCursor: btoa(`${CONNECTION_PREFIX}${totalCount - 1}`),
          },
          edges,
        };
      },
    },
  },
};

export const EmptyList: Story<PostListProps> = (args) => {
  const { queryReference } = useQueryReference<PostListStoriesQuery>();

  const data = usePreloadedQuery<PostListStoriesQuery>(query, queryReference!);

  return <PostList {...args} query={data} />;
};

EmptyList.parameters = {
  relay: {
    query,
    mockResolvers: {
      PostConnection() {
        return {
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: btoa(`${CONNECTION_PREFIX}0`),
            endCursor: btoa(`${CONNECTION_PREFIX}0`),
          },
          edges: [],
        };
      },
    },
  },
};

export default {
  title: 'Feed/PostList',
  component: PostList,
  decorators: [
    (Story, { parameters }) => (
      <RelayQueryPreloader {...parameters.relay}>
        <Story />
      </RelayQueryPreloader>
    ),
  ],
} as Meta<PostListProps>;
