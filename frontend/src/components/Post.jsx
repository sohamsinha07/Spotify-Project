import React from "react";
import { Card, Text, Group, Avatar, Button } from "@mantine/core";
import { IconHeart, IconMessageCircle } from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import '../styles/post.css';

dayjs.extend(relativeTime);

/* this is where people can create a post and have it be seen in the forum page */
const Post = ({ forum, onLike, onComment }) => {
    return (
        <Card className="forumCard">
            <div className="forumInfo">
                <div className="forum-user">
                    <Avatar src={forum.userAvatar} alt={forum.userName} radius="xl" />
                    <div className="forum-user-details">
                        <p className="forum-username">{forum.userName}</p>
                        <p className="forum-timestamp">{dayjs(forum.createdAt).fromNow()}</p>
                    </div>
                </div>
            </div>

            <h3 className="forum-title">{forum.title}</h3>
            <p className="forum-snippet">{forum.snippet}</p>

            <div className="forum-actions">
                <Button
                    variant="light"
                    leftIcon={<IconHeart size={16} />}
                    onClick={() => onLike(forum.id)}
                >
                    {forum.likes}
                </Button>
                <Button
                    variant="light"
                    leftIcon={<IconMessageCircle size={16} />}
                    onClick={() => onComment(forum.id)}
                >
                    {forum.commentsCount} Comments
                </Button>
            </div>
        </Card>
    );
};

export default Post;
