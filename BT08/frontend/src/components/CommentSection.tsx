import React, { useState } from 'react';
import {
    useGetCommentsQuery,
    useAddCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} from '../store/api';
import { Card, List, Rate, Input, Button, Avatar, Typography, Space, Popconfirm, message, Spin } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { TextArea } = Input;
const { Title, Text } = Typography;

interface CommentSectionProps {
    productId: number;
    userId?: number;
    averageRating?: number | null;
    commentCount: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({
    productId,
    userId,
    averageRating,
    commentCount,
}) => {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [editRating, setEditRating] = useState(5);

    const { data: comments = [], isLoading } = useGetCommentsQuery(productId);
    const [addComment, { isLoading: adding }] = useAddCommentMutation();
    const [updateComment, { isLoading: updating }] = useUpdateCommentMutation();
    const [deleteComment, { isLoading: deleting }] = useDeleteCommentMutation();

    const handleSubmit = async () => {
        if (!userId) {
            message.warning('Please login to add a comment');
            return;
        }

        if (!content.trim()) {
            message.warning('Please enter a comment');
            return;
        }

        try {
            await addComment({ userId, productId, content, rating }).unwrap();
            message.success('Comment added successfully');
            setContent('');
            setRating(5);
        } catch (error: any) {
            message.error(error?.data?.error || 'Failed to add comment');
        }
    };

    const handleEdit = (comment: any) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
        setEditRating(comment.rating);
    };

    const handleUpdate = async (id: number) => {
        try {
            await updateComment({ id, content: editContent, rating: editRating }).unwrap();
            message.success('Comment updated successfully');
            setEditingId(null);
        } catch (error: any) {
            message.error(error?.data?.error || 'Failed to update comment');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteComment(id).unwrap();
            message.success('Comment deleted successfully');
        } catch (error: any) {
            message.error(error?.data?.error || 'Failed to delete comment');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditContent('');
        setEditRating(5);
    };

    return (
        <div style={{ marginTop: 40 }}>
            <Title level={4}>
                Customer Reviews ({commentCount})
                {averageRating && (
                    <span style={{ marginLeft: 16, fontSize: 16, color: '#faad14' }}>
                        <Rate disabled value={averageRating} allowHalf /> ({averageRating.toFixed(1)})
                    </span>
                )}
            </Title>

            {/* Add Comment Form */}
            {userId && (
                <Card style={{ marginBottom: 24 }}>
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <div>
                            <Text>Your Rating:</Text>
                            <Rate value={rating} onChange={setRating} />
                        </div>
                        <TextArea
                            rows={4}
                            placeholder="Write your review..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <Button type="primary" onClick={handleSubmit} loading={adding}>
                            Submit Review
                        </Button>
                    </Space>
                </Card>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <List
                    itemLayout="vertical"
                    dataSource={comments}
                    renderItem={(comment) => (
                        <List.Item
                            key={comment.id}
                            actions={
                                userId === comment.userId
                                    ? [
                                        <Button
                                            key="edit"
                                            type="link"
                                            icon={<EditOutlined />}
                                            onClick={() => handleEdit(comment)}
                                        >
                                            Edit
                                        </Button>,
                                        <Popconfirm
                                            key="delete"
                                            title="Are you sure you want to delete this comment?"
                                            onConfirm={() => handleDelete(comment.id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button type="link" danger icon={<DeleteOutlined />} loading={deleting}>
                                                Delete
                                            </Button>
                                        </Popconfirm>,
                                    ]
                                    : []
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} />}
                                title={
                                    <Space>
                                        <Text strong>
                                            {comment.user.firstName && comment.user.lastName
                                                ? `${comment.user.firstName} ${comment.user.lastName}`
                                                : comment.user.username}
                                        </Text>
                                        <Rate disabled value={comment.rating} />
                                    </Space>
                                }
                                description={dayjs(comment.createdAt).fromNow()}
                            />

                            {editingId === comment.id ? (
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <div>
                                        <Text>Rating:</Text>
                                        <Rate value={editRating} onChange={setEditRating} />
                                    </div>
                                    <TextArea
                                        rows={4}
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                    />
                                    <Space>
                                        <Button
                                            type="primary"
                                            onClick={() => handleUpdate(comment.id)}
                                            loading={updating}
                                        >
                                            Save
                                        </Button>
                                        <Button onClick={handleCancelEdit}>Cancel</Button>
                                    </Space>
                                </Space>
                            ) : (
                                <Text>{comment.content}</Text>
                            )}
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default CommentSection;
