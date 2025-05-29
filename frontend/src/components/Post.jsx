import React, { useState, useEffect } from 'react';
import {
    Card,
    Title,
    Text,
    Group,
    Modal,
    Button,
    TextInput,
    Textarea,
} from '@mantine/core';
import { IconHeartFilled, IconMessageCircle } from '@tabler/icons-react';
import {
    doc,
    updateDoc,
    increment,
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import Likes from '../components/Likes';
import Comments from '../components/Comments';


const Post = ({ forum, creatorName = 'Unknown', onLike }) => {
    const navigate = useNavigate();

    return (
        <Card
            shadow="sm"
            p="lg"
            withBorder
            mb="md"
            onClick={() => navigate(`/forums/${forum.id}`)}
            style={{ cursor: 'pointer', backgroundColor: 'black' }}
        >
            <Title order={4} c="white">
                {forum.name}
            </Title>

            <Text c="white" style={{ whiteSpace: 'normal' }}>
                {forum.description}
            </Text>

            <Text size="sm" c="dimmed" mt="sm">
                Created by: {creatorName}
            </Text>

            <Group mt="xs" gap={24}>
                {/* ♡ Likes and 💬 Comments are now self-contained */}
                <Likes forumId={forum.id} initialLikes={forum.likes} onLike={onLike} />
                <Comments forum={forum} />
            </Group>

            {forum.createdAt && (
                <Text size="xs" c="dimmed" mt="xs">
                    Created on:{' '}
                    {new Date(forum.createdAt.seconds * 1000).toLocaleDateString()}
                </Text>
            )}
        </Card>
    );
};

export default Post;
