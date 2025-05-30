import React, { useState } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

// Add the formatNumber function here or import from utils.js
const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + ' M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + ' K';
    return num.toString();
};

const LikeButton = ({ forumId, initialLikes, commentId }) => {
    const [likes, setLikes] = useState(initialLikes || 0);
    const [liked, setLiked] = useState(false);

    const handleLike = async () => {
        if (liked) return; // Prevent double-liking

        try {
            let docRef;

            if (commentId) {
                docRef = doc(db, 'forums', forumId, 'posts', commentId);
            } else {
                docRef = doc(db, 'forums', forumId);
            }

            await updateDoc(docRef, {
                likes: increment(1),
            });

            setLikes(likes + 1); // Increase local likes
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
            ❤️ {formatNumber(likes)}
        </button>
    );
};

export default LikeButton;
export { formatNumber };