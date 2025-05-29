import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forumList.css";
import Posts from "../components/Posts";
import LikeButton from "../components/Likes";


/* this helps us to display the list of all the forums in the collections */
const ForumList = ({ forums, usersMap }) => {
    const navigate = useNavigate();

    //formatting for the date
    const formatDate = (timestamp) => {
        if (!timestamp) return "Unknown date";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    //when we click a forum we shoukld go to the details

    const handleForumClick = (id) => {
        navigate(`/forum/${id}`);
    };

    return (
        <div className="forum-list-container">
            <h2 className="forum-title">Latest Discussion Forums</h2>
            {forums.length === 0 ? (
                <p className="no-forums">No forums found.</p>
            ) : (
                forums.map(({ id, name, description, creatorId, likes = 0, commentCount = 0, createdAt }) => {
                    const creator = usersMap[creatorId];
                    return (
                        <div
                            key={id}
                            className="forum-card"
                            onClick={() => handleForumClick(id)}

                        >
                            <div className="forum-header">
                                <h3 className="forum-name">{name}</h3>
                            </div>

                            <p className="forum-description">{description}</p>

                            <div className="forum-badges">
                                <LikeButton forumId={id} initialLikes={likes} />
                                <Posts forumId={id} initialCount={commentCount} />
                            </div>

                            <div className="forum-meta">
                                <span className="forum-creator">
                                    Created by <strong>{creator?.username || "Unknown"}</strong>
                                </span>
                                <span className="forum-date">{formatDate(createdAt)}</span>
                            </div>
                        </div>

                    );
                })
            )}
        </div>
    );
};

export default ForumList;
