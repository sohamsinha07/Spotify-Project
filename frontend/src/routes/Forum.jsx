import React, { useState, useEffect } from 'react';
import Post from '../components/Post';
import { Card, Text, Title, Stack, Loader, Box, Button, Group, Modal, Input, Container, ActionIcon } from "@mantine/core";
import '../styles/forum.css';
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, increment, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { IconPlus, IconHeartFilled, IconMessageCircle } from '@tabler/icons-react';
import CreateForumPost from '../components/CreateForumPost';
import ForumList from '../components/ForumList';

const Forum = () => {
    const [forums, setForums] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [usersMap, setUsersMap] = useState({});
    const [error, setError] = useState("");
    const [modalOpened, setModalOpened] = useState(false);
    const navigate = useNavigate();


    <ForumList />
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch forums
                const forumsSnapshot = await getDocs(collection(db, "forums"));
                const forumsData = forumsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Fetch users either randomly or from logged in user
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Create a map: userId => username
                const map = {};
                usersData.forEach(user => {
                    map[user.id] = user.username || "Unknown";
                });

                setForums(forumsData);
                setUsersMap(map);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    //handling the likes
    const handleLike = async (forumId) => {
        try {
            const forumRef = doc(db, "forums", forumId);
            await updateDoc(forumRef, {
                likes: increment(1),
            });

            // Update local state to reflect the new like immediately
            setForums((prevForums) =>
                prevForums.map((forum) =>
                    forum.id === forumId
                        ? { ...forum, likes: (forum.likes ?? 0) + 1 }
                        : forum
                )
            );
        } catch (error) {
            console.error("Error updating likes:", error);
        }
    };


    //search for what you want
    const filteredForums = forums.filter((forum) =>
        forum.name && forum.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container size="lg" mt="md" className="forum-container">
            <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                mb="md"
                className="forum-search-input"
            />

            {/* Plus button to open modal */}
            <ActionIcon
                size="lg"
                variant="filled"
                color="blue"
                onClick={() => setModalOpened(true)}
                mb="md"
                className="forum-add-button"
            >
                <IconPlus size={24} />
            </ActionIcon>

            {/* Modal for creating new forum post */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                centered
                classNames={{ modal: 'forum-modal' }}
            >
                <CreateForumPost
                    onSubmit={async () => {
                        // Refetch forums after creation
                        const querySnapshot = await getDocs(collection(db, "forums"));
                        const forumList = querySnapshot.docs.map(doc => ({
                            id: doc.id, ...doc.data()
                        }));
                        setForums(forumList);
                        setModalOpened(false);
                    }}
                />
            </Modal>

            {loading && <p className="forum-loading">Loading forums...</p>}
            {error && <p className="forum-error">{error}</p>}

            {!loading && !error && filteredForums.length === 0 && (
                <p className="forum-no-results">No forums found.</p>
            )}



            {!loading && !error && filteredForums.length > 0 && filteredForums.map(forum => (
                <Card
                    key={forum.id}
                    shadow="sm"
                    p="lg"
                    withBorder
                    mb="md"
                    onClick={() => navigate(`/forums/${forum.id}`)}
                    style={{ cursor: "pointer", backgroundColor: "black" }}

                >

                    <Title order={4} style={{ color: 'white' }}>
                        {forum.name}
                    </Title>

                    <p style={{ color: 'white', whiteSpace: 'normal' }}>{forum.description}</p>

                    {/* either a user or it is unknown */}
                    <Text size="sm" c="dimmed" mt="sm">
                        Created by: {usersMap[forum.creatorId] || "Unknown"}

                        {/*making sure it is side by side (heart and comment) */}
                    </Text>
                    <div className="forum-icons-row">
                        <Text
                            size="sm"
                            c="dimmed"
                            mt="xs"
                            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLike(forum.id);
                            }}
                        >
                            <IconHeartFilled size={16} color="red" /> {forum.likes ?? 0}
                        </Text>

                        <Text size="sm" c="dimmed" mt="xs" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <IconMessageCircle size={16} stroke="gray" /> {forum.comments ?? 0}
                        </Text>
                    </div>

                    {/* gives us date for when someone is created */}
                    {forum.createdAt && (
                        <Text size="xs" c="dimmed" mt="xs">
                            Created on: {new Date(forum.createdAt.seconds * 1000).toLocaleDateString()}
                        </Text>
                    )}
                </Card>
            ))}

        </Container >
    );
};

export default Forum;