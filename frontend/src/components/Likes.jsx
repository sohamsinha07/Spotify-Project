import { Group, Text } from '@mantine/core';
import { IconHeartFilled } from '@tabler/icons-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

const Likes = ({ forumId, initialLikes, onLike }) => {
    const handleLike = async (e) => {
        e.stopPropagation();
        if (onLike) return onLike(forumId);
        await updateDoc(doc(db, 'forums', forumId), { likes: increment(1) });
    };

    return (
        <Group gap={4} onClick={handleLike}>
            <IconHeartFilled size={16} color="red" />
            <Text size="sm" c="dimmed">{initialLikes ?? 0}</Text>
        </Group>
    );
};

export default Likes;
