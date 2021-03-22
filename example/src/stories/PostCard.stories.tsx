import React from 'react';
import { graphql, usePreloadedQuery } from 'react-relay';
import { Meta, Story } from '@storybook/react';
import { RelayQueryPreloader, useQueryReference } from 'storybook-addon-relay';
import faker from 'faker';

import PostCard, { PostCardProps } from '../PostCard';
import Limiter from '../Limiter';

import { PostCardStoriesQuery } from './__generated__/PostCardStoriesQuery.graphql';

const variables = { id: 'postId' };
const query = graphql`
  query PostCardStoriesQuery($id: ID!) {
    post: node(id: $id) {
      ... on Post {
        ...PostCard_post
      }
    }
  }
`;

const Template: Story<PostCardProps> = (args) => {
  const { queryReference } = useQueryReference<PostCardStoriesQuery>();

  const data = usePreloadedQuery<PostCardStoriesQuery>(query, queryReference!);

  return (
    <Limiter>
      <PostCard {...args} post={data.post!} />
    </Limiter>
  );
};

export const BasicUsage = Template.bind({});
BasicUsage.parameters = {
  relay: {
    query,
    variables,
    mockResolvers: {
      Post() {
        return {
          author: { name: faker.name.findName(), avatarUri: faker.image.imageUrl() },
          content: faker.lorem.paragraph(),
          createdAt: faker.date.recent().toISOString(),
          commentCount: faker.random.number(50),
          likeCount: faker.random.number(200),
          viewerHasLiked: faker.random.boolean(),
        };
      },
    },
  },
};

export default {
  title: 'Feed/PostCard',
  component: PostCard,
  decorators: [
    (Story, { parameters }) => (
      <RelayQueryPreloader {...parameters.relay}>
        <Story />
      </RelayQueryPreloader>
    ),
  ],
} as Meta<PostCardProps>;
