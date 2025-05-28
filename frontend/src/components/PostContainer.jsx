import React, { useState } from "react";
import Post from "./Post";

const PostsContainer = ({ forumsData }) => {
    // We'll keep forums in local state for demo; in real app fetch/update backend
    const [forums, setForums] = useState(forumsData);

    // Handle "like" clicks (example, increment likes locally)
    const handleLike = (forumId) => {
        setForums((prev) =>
            prev.map((f) =>
                f.id === forumId ? { ...f, likes: (f.likes ?? 0) + 1 } : f
            )
        );
    };

    // Handle comment submission
    const handleSubmitComment = (forumId, commentText) => {
        setForums((prev) =>
            prev.map((f) => {
                if (f.id === forumId) {
                    // Add new comment to the comments array (create if missing)
                    const updatedComments = f.commentsArray
                        ? [...f.commentsArray, { user: "CurrentUser", text: commentText }]
                        : [{ user: "CurrentUser", text: commentText }];

                    return {
                        ...f,
                        commentsCount: (f.commentsCount ?? 0) + 1,
                        commentsArray: updatedComments,
                    };
                }
                return f;
            })
        );
    };

    return (
        <>
            {forums.map((forum) => (
                <Post
                    key={forum.id}
                    forum={forum}
                    onLike={handleLike}
                    onSubmitComment={handleSubmitComment}
                    onComment={() => { }}
                />
            ))}
        </>
    );
};

export default PostsContainer;
