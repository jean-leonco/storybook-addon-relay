import React from 'react';
import { Meta, Story } from '@storybook/react';
import { RelayQueryPreloader, useQueryReference } from 'storybook-addon-relay';
import faker from 'faker';

import Feed, { FeedProps } from '../Feed';
import { FeedQuery } from '../__generated__/FeedQuery.graphql';

const CONNECTION_PREFIX = 'mock';

export const BasicUsage: Story<FeedProps> = (args) => {
  const { queryReference } = useQueryReference<FeedQuery>();

  return <Feed {...args} queryReference={queryReference!} />;
};

BasicUsage.parameters = {
  relay: {
    query: require('../__generated__/FeedQuery.graphql'),
    mockResolvers: {
      User() {
        return {
          name: faker.name.findName(),
          avatarUri: faker.image.imageUrl(),
        };
      },
      PostConnection() {
        const postCount = 5;
        const edges: any[] = [];

        for (let i = 0; i < postCount; i++) {
          edges.push({
            cursor: btoa(`${CONNECTION_PREFIX}${i}`),
            node: {
              author: { name: faker.name.findName(), avatarUri: faker.image.image() },
              content: faker.lorem.paragraph(),
              createdAt: faker.date.recent().toISOString(),
              commentCount: faker.random.number(10),
              likeCount: faker.random.number(50),
              viewerHasLiked: faker.random.boolean(),
            },
          });
        }

        return {
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: true,
            startCursor: btoa(`${CONNECTION_PREFIX}0`),
            endCursor: btoa(`${CONNECTION_PREFIX}${postCount - 1}`),
          },
          edges,
        };
      },
      TrendingConnection() {
        const totalCount = 5;
        const edges: any[] = [];

        for (let i = 0; i < totalCount; i++) {
          edges.push({
            cursor: btoa(`${CONNECTION_PREFIX}${i}`),
            node: {
              topic: faker.lorem.sentence(),
              mentions: faker.random.number({ min: 1000 * (i + 1), max: 5000 * (i + 1) }),
            },
          });
        }

        return {
          edges,
        };
      },
    },
  },
};

export default {
  title: 'Feed/Feed',
  component: Feed,
  decorators: [
    (Story, { parameters }) => (
      <RelayQueryPreloader {...parameters.relay}>
        <Story />
      </RelayQueryPreloader>
    ),
  ],
} as Meta<FeedProps>;
