import React, { useCallback } from 'react';
import { graphql, useFragment, useMutation } from 'react-relay';

import likeIcon from './assets/like-icon.png';
import likedIcon from './assets/liked-icon.png';

import { PostLikeButtonLikeMutation } from './__generated__/PostLikeButtonLikeMutation.graphql';
import { PostLikeButtonUnlikeMutation } from './__generated__/PostLikeButtonUnlikeMutation.graphql';
import { PostLikeButton_post$key } from './__generated__/PostLikeButton_post.graphql';

const likeOptimisticResponse = (post) => ({
  PostLike: {
    success: true,
    error: null,
    postEdge: {
      node: {
        id: post.id,
        viewerHasLiked: true,
        likeCount: post.likeCount + 1,
      },
    },
  },
});

const unlikeOptimisticResponse = (post) => ({
  PostUnlike: {
    success: true,
    error: null,
    postEdge: {
      node: {
        id: post.id,
        viewerHasLiked: false,
        likeCount: post.likeCount - 1,
      },
    },
  },
});

interface PostLikeButtonProps {
  post: PostLikeButton_post$key;
}

const PostLikeButton = (props: PostLikeButtonProps) => {
  const post = useFragment<PostLikeButton_post$key>(
    graphql`
      fragment PostLikeButton_post on Post {
        id
        viewerHasLiked
        likeCount
      }
    `,
    props.post,
  );

  const [postLike] = useMutation<PostLikeButtonLikeMutation>(graphql`
    mutation PostLikeButtonLikeMutation($input: PostLikeInput!) {
      PostLike(input: $input) {
        success
        error
        postEdge {
          node {
            id
            viewerHasLiked
            likeCount
          }
        }
      }
    }
  `);
  const [postUnlike] = useMutation<PostLikeButtonUnlikeMutation>(graphql`
    mutation PostLikeButtonUnlikeMutation($input: PostUnlikeInput!) {
      PostUnlike(input: $input) {
        success
        error
        postEdge {
          node {
            id
            viewerHasLiked
            likeCount
          }
        }
      }
    }
  `);

  const handleLike = useCallback(() => {
    const config = {
      variables: {
        input: {
          post: post.id,
        },
      },
      optimisticResponse: post.viewerHasLiked ? unlikeOptimisticResponse(post) : likeOptimisticResponse(post),
    };

    const mutationFn = post.viewerHasLiked ? postUnlike : postLike;

    mutationFn(config);
  }, [post, postLike, postUnlike]);

  return (
    <button
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '16px' }}
      onClick={handleLike}
    >
      <img
        src={post.viewerHasLiked ? likedIcon : likeIcon}
        alt="Like post"
        style={{ height: '25px', marginRight: '8px' }}
      />
      {post.likeCount}
    </button>
  );
};

export default PostLikeButton;
