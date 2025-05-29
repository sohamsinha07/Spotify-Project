import React, { useState } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

/* handles the likes for the forum post and the comments post */

const LikeButton = ({ forumId, initialLikes, commentId }) => {
    const [likes, setLikes] = useState(initialLikes || 0);
    const [liked, setLiked] = useState(false);

    const handleLike = async () => {
        if (liked) return; // Prevent double-liking as in real life

        try {
            let docRef;

            if (commentId) {
                // ability to like the comment in the forum
                docRef = doc(db, 'forums', forumId, 'posts', commentId);
            } else {
                // ability to like the forum post itself
                docRef = doc(db, 'forums', forumId);
            }

            await updateDoc(docRef, {
                likes: increment(1),
            });

            setLikes(likes + 1); //increase likes
            setLiked(true);
        } catch (error) {
            console.error("Error liking item:", error);
        }
    };

    return (
        <button
            onClick={handleLike}
            className="forum-like-button"
            aria-label="Like this item"
        >
            ❤️ {likes}
        </button>
    );
};

export default LikeButton;
