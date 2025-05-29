import { useState, useEffect } from 'react';
import {
    Group,
    Text,
    Modal,
    Textarea,
    Button,
} from '@mantine/core';
import { IconMessages, IconMessageCircle } from '@tabler/icons-react';

import {
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
    getDocs,
    collection,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';

const Comments = ({ forum }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [body, setBody] = useState('');
    const [count, setCount] = useState(forum.comments?.length ?? 0);
    const [dummyUsers, setDummyUsers] = useState([]);
    const [currentForumComments, setCurrentForumComments] = useState(forum.comments ?? []);

    // Update count if comments array changes
    useEffect(() => {
        setCount(currentForumComments.length);
    }, [currentForumComments]);

    // Fetch dummy users once
    useEffect(() => {
        (async () => {
            const snap = await getDocs(collection(db, 'users'));
            setDummyUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        })();
    }, []);

    // Refresh comments after submit
    const refreshComments = async () => {
        const forumDoc = await getDoc(doc(db, 'forums', forum.id));
        if (forumDoc.exists()) {
            const updatedComments = forumDoc.data().comments ?? [];
            setCurrentForumComments(updatedComments);
            setCount(updatedComments.length);
        }
    };

    const submit = async () => {
        if (!body.trim()) return;

        // Get logged-in user or random dummy user as author
        const currentUser = getAuth().currentUser;
        let author = 'Anonymous';

        if (currentUser) {
            author = currentUser.displayName || currentUser.email?.split('@')[0] || currentUser.uid;
        } else if (dummyUsers.length) {
            const random = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
            author = random.username || random.name || 'Anonymous';
        }

        const newComment = {
            description: body.trim(),
            createdBy: author,
            createdAt: new Date(),
        };

        await updateDoc(doc(db, 'forums', forum.id), {
            comments: arrayUnion(newComment),
        });

        await refreshComments();

        setBody('');
        setIsOpen(false);
    };

    return (
        <>
            <Group
                gap={4}
                onClick={e => {
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                style={{ cursor: 'pointer' }}
            >
                <IconMessageCircle size={16} color="#d1d1d1" stroke={1.75} />
                <Text size="sm" c="dimmed">

                    {count}
                </Text>
            </Group>

            <Modal
                opened={isOpen}
                onClose={() => setIsOpen(false)}
                title={`Comment on: ${forum.name}`}
                centered
                onClick={e => e.stopPropagation()}
            >
                {/* NO Name input */}

                <Textarea
                    label="Comment"
                    placeholder="Write your comment…"
                    value={body}
                    onChange={e => setBody(e.currentTarget.value)}
                    autosize
                    minRows={3}
                    mb="md"
                />

                <Button color="green"
                    fullWidth onClick={submit}>
                    Submit Comment
                </Button>
            </Modal>
        </>
    );
};

export default Comments;
