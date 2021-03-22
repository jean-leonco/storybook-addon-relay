import React, { useState } from 'react';
import { graphql, useFragment, useMutation } from 'react-relay';

import mediaIcon from './assets/media-icon.png';
import audioIcon from './assets/audio-icon.png';

import { PostComposer_query$key } from './__generated__/PostComposer_query.graphql';
import { PostComposerMutation } from './__generated__/PostComposerMutation.graphql';

export interface PostComposerProps {
  query: PostComposer_query$key;
}

const PostComposer = (props: PostComposerProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const data = useFragment<PostComposer_query$key>(
    graphql`
      fragment PostComposer_query on Query {
        viewer {
          name
          avatarUri
        }
      }
    `,
    props.query,
  );

  const [postCreate] = useMutation<PostComposerMutation>(graphql`
    mutation PostComposerMutation($input: PostCreateInput!) {
      PostCreate(input: $input) {
        postEdge {
          cursor
          node {
            ...PostCard_post
          }
        }
        success
        error
      }
    }
  `);

  return (
    <div style={{ width: '100%', background: '#FFFFFF', padding: '14px 15px', margin: '14px 0', borderRadius: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
        <img
          src={data.viewer.avatarUri}
          alt={`${data.viewer.name} avatar`}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            objectFit: 'cover',
            background: '#797979',
            marginRight: '12px',
          }}
        />
        <textarea
          placeholder="Write your post"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            background: '#F4F5F7',
            padding: '12px 16px',
            width: '100%',
            borderRadius: '12px',
            border: '1px solid #F4F5F7',
            color: '#303030',
            fontSize: '14px',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '20px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <button
            style={{
              height: '48px',
              padding: '0 20px',
              borderRadius: '40px',
              background: '#F4F5F7',
              color: '#303030',
              fontWeight: 600,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <img src={mediaIcon} alt="Upload media" style={{ height: '20px', marginRight: '8px' }} />
            Media
          </button>
          <button
            style={{
              height: '48px',
              padding: '0 20px',
              borderRadius: '40px',
              background: '#F4F5F7',
              color: '#303030',
              fontWeight: 600,
              marginLeft: '16px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <img src={audioIcon} alt="Upload audio" style={{ height: '20px', marginRight: '8px' }} />
            Audio
          </button>
        </div>

        <button
          style={{
            height: '48px',
            minWidth: '120px',
            borderRadius: '40px',
            background: '#1B7340',
            marginTop: '12px',
            color: '#FFFFFF',
          }}
          disabled={!content}
          onClick={() => {
            if (isSubmitting) {
              return;
            }

            setSubmitting(true);

            postCreate({
              variables: { input: { content } },
              onCompleted: ({ PostCreate }) => {
                setSubmitting(false);

                if (!PostCreate || PostCreate.error || !PostCreate.success) {
                  // eslint-disable-next-line no-console
                  console.log(PostCreate.error);
                  return;
                }
              },
              onError: (error) => {
                setSubmitting(false);
                // eslint-disable-next-line no-console
                console.log(error);
              },
            });
          }}
        >
          {isSubmitting ? 'Loading...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
