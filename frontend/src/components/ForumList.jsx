import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Box, Title, Card, Text, Group, Badge } from "@mantine/core";
import '../styles/forumList.css';

const ForumList = () => {
    const [forums, setForums] = useState([]);
    const [usersMap, setUsersMap] = useState({});

    useEffect(() => {
        async function fetchForumsAndUsers() {
            try {
                // Fetch forums
                const forumsSnapshot = await getDocs(collection(db, "forums"));
                const forumsData = forumsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Fetch users
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersArray = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Build map for quick lookup by id
                const map = {};
                usersArray.forEach(user => {
                    map[user.id] = user;
                });

                setForums(forumsData);
                setUsersMap(map);
            } catch (error) {
                console.error("Error fetching forums or users:", error);
            }
        }

        fetchForumsAndUsers();
    }, []);

    // Helper to format Firestore timestamp to readable date string
    const formatDate = (timestamp) => {
        if (!timestamp) return "Unknown date";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div>
            <Title order={2} mb="md">Forums</Title>

            {forums.length === 0 && <Text>No forums found.</Text>}

            <div>
                {forums.map(({ id, name, description, creatorId, likes = 0, comments = 0, createdAt }) => {
                    const creator = usersMap[creatorId];
                    return (
                        <Card key={id} shadow="sm" p="md" mb="md" withBorder>
                            <Group position="apart" mb="xs">
                                <Title order={4}>{name}</Title>
                                <Group spacing="xs">
                                    <Badge color="blue" variant="light">{likes} Likes</Badge>
                                    <Badge color="green" variant="light">{comments} Comments</Badge>
                                </Group>
                            </Group>
                            <Text size="sm" mb="sm">{description}</Text>
                            <Group position="apart" align="center" spacing="xs">
                                <Text size="xs" c="dimmed">
                                    Created by: {creator ? creator.username : "Unknown"}
                                </Text>
                                <Text size="xs" c="dimmed">On: {formatDate(createdAt)}</Text>
                            </Group>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default ForumList;
