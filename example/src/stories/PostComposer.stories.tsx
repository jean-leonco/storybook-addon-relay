import React from 'react';
import { graphql, usePreloadedQuery } from 'react-relay';
import { Meta, Story } from '@storybook/react';
import { RelayQueryPreloader, useQueryReference } from 'storybook-addon-relay';
import faker from 'faker';

import PostComposer, { PostComposerProps } from '../PostComposer';
import Limiter from '../Limiter';

import { PostComposerStoriesQuery } from './__generated__/PostComposerStoriesQuery.graphql';

const query = graphql`
  query PostComposerStoriesQuery {
    ...PostComposer_query
  }
`;

const Template: Story<PostComposerProps> = (args) => {
  const { queryReference } = useQueryReference<PostComposerStoriesQuery>();

  const data = usePreloadedQuery<PostComposerStoriesQuery>(query, queryReference!);

  return (
    <Limiter>
      {' '}
      <PostComposer {...args} query={data} />
    </Limiter>
  );
};

export const BasicUsage = Template.bind({});
BasicUsage.parameters = {
  relay: {
    query,
    mockResolvers: {
      User() {
        return {
          name: faker.name.findName(),
          avatarUri: faker.image.imageUrl(),
        };
      },
    },
  },
};

export default {
  title: 'Feed/PostComposer',
  component: PostComposer,
  decorators: [
    (Story, { parameters }) => (
      <RelayQueryPreloader {...parameters.relay}>
        <Story />
      </RelayQueryPreloader>
    ),
  ],
} as Meta<PostComposerProps>;
