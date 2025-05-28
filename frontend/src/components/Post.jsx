import React, { useState } from 'react';
import { Card, Button, Modal, Textarea } from '@mantine/core';
import { IconHeart, IconMessageCircle } from '@tabler/icons-react';

const Post = ({ forum, onLike, comments, onAddComment }) => {
    const [commentsOpened, setCommentsOpened] = useState(false);
    const [newComment, setNewComment] = useState('');

    const handleSubmitComment = () => {
        if (newComment.trim() === '') return;

        onAddComment(forum.id, newComment);
        setNewComment('');
        // Optionally close modal here: setCommentsOpened(false);
    };

    return (
        <>
            <Card>
                <h3>{forum.title}</h3>
                <p>{forum.snippet}</p>

                <Button leftIcon={<IconHeart />} onClick={() => onLike(forum.id)}>
                    {forum.likes}
                </Button>

                <Button
                    leftIcon={<IconMessageCircle />}
                    onClick={() => setCommentsOpened(true)}
                >
                    {forum.commentsCount} Comments
                </Button>
            </Card>

            <Modal
                opened={commentsOpened}
                onClose={() => setCommentsOpened(false)}
                title="Comments"
            >
                {/* Comment list */}
                <div>
                    {comments.length === 0 && <p>No comments yet</p>}
                    {comments.map((comment) => (
                        <div key={comment.id} style={{ marginBottom: 10 }}>
                            <b>{comment.userName}:</b> {comment.text}
                        </div>
                    ))}
                </div>

                {/* Add comment box */}
                <Textarea
                    placeholder="Write your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.currentTarget.value)}
                    minRows={3}
                    mb="md"
                />
                <Button onClick={handleSubmitComment}>Submit Comment</Button>
            </Modal>
        </>
    );
};

export default Post;
