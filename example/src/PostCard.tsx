import React, { useMemo } from 'react';
import { graphql, useFragment } from 'react-relay';
import { formatDistance } from 'date-fns';

import commentIcon from './assets/comment-icon.png';

import { PostCard_post$key } from './__generated__/PostCard_post.graphql';
import PostLikeButton from './PostLikeButton';

export interface PostCardProps {
  post: PostCard_post$key;
}

const PostCard = (props: PostCardProps) => {
  const post = useFragment<PostCard_post$key>(
    graphql`
      fragment PostCard_post on Post {
        author {
          name
          avatarUri
        }
        content
        createdAt
        commentCount
        ...PostLikeButton_post
      }
    `,
    props.post,
  );

  const formattedData = useMemo(() => formatDistance(new Date(post.createdAt), new Date()), []);

  return (
    <div style={{ width: '100%', background: '#FFFFFF', padding: '14px 15px', margin: '14px 0', borderRadius: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <img
          src={post.author.avatarUri}
          alt={`${post.author.name} avatar`}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            objectFit: 'cover',
            background: '#797979',
            marginRight: '12px',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '15px', color: '#303030', fontWeight: 'bold', marginBottom: '4px' }}>
            {post.author.name}
          </span>
          <span style={{ fontSize: '13px', color: '#797979' }}>{formattedData}</span>
        </div>
      </div>

      <p style={{ fontSize: '15px', color: '#303030', marginTop: '20px' }}>{post.content}</p>

      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
        <button style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <img src={commentIcon} alt="Comment post" style={{ height: '25px', marginRight: '8px' }} />
          {post.commentCount}
        </button>
        <PostLikeButton post={post} />
      </div>
    </div>
  );
};

export default PostCard;
