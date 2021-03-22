import React from 'react';
import { graphql, usePreloadedQuery } from 'react-relay';
import { Meta, Story } from '@storybook/react';
import { RelayQueryPreloader, useQueryReference } from 'storybook-addon-relay';
import faker from 'faker';

import Trending, { TrendingProps } from '../Trending';

import Limiter from '../Limiter';

import { TrendingStoriesQuery } from './__generated__/TrendingStoriesQuery.graphql';

const query = graphql`
  query TrendingStoriesQuery {
    ...Trending_query
  }
`;

const CONNECTION_PREFIX = 'mock';

const Template: Story<TrendingProps> = (args) => {
  const { queryReference } = useQueryReference<TrendingStoriesQuery>();

  const data = usePreloadedQuery<TrendingStoriesQuery>(query, queryReference!);

  return (
    <Limiter maxWidth={400} center={false}>
      <Trending {...args} query={data} />
    </Limiter>
  );
};

export const BasicUsage = Template.bind({});
BasicUsage.parameters = {
  relay: {
    query,
    mockResolvers: {
      TrendingConnection() {
        const totalCount = 5;
        const edges: any[] = [];

        for (let i = 0; i < totalCount; i++) {
          edges.push({
            cursor: btoa(`${CONNECTION_PREFIX}${i}`),
            node: {
              topic: faker.lorem.paragraph().slice(0, 22),
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
  title: 'Feed/Trending',
  component: Trending,
  decorators: [
    (Story, { parameters }) => (
      <RelayQueryPreloader {...parameters.relay}>
        <Story />
      </RelayQueryPreloader>
    ),
  ],
} as Meta<TrendingProps>;
