import React from 'react';
import { ShoppingOutlined, MessageOutlined } from '@ant-design/icons';
import { Space, Typography, Tooltip } from 'antd';

const { Text } = Typography;

interface ProductStatsProps {
    purchaseCount: number;
    commentCount: number;
    averageRating?: number | null;
    size?: 'small' | 'default';
}

const ProductStats: React.FC<ProductStatsProps> = ({
    purchaseCount,
    commentCount,
    averageRating,
    size = 'default',
}) => {
    const textSize = size === 'small' ? 12 : 14;

    return (
        <Space size="middle" style={{ marginTop: 8 }}>
            <Tooltip title="Number of customers who purchased">
                <Space size={4}>
                    <ShoppingOutlined style={{ fontSize: textSize, color: '#1890ff' }} />
                    <Text style={{ fontSize: textSize }}>{purchaseCount}</Text>
                </Space>
            </Tooltip>

            <Tooltip title="Number of comments">
                <Space size={4}>
                    <MessageOutlined style={{ fontSize: textSize, color: '#52c41a' }} />
                    <Text style={{ fontSize: textSize }}>{commentCount}</Text>
                </Space>
            </Tooltip>

            {averageRating !== null && averageRating !== undefined && (
                <Tooltip title="Average rating">
                    <Space size={4}>
                        <span style={{ fontSize: textSize, color: '#faad14' }}>⭐</span>
                        <Text style={{ fontSize: textSize }}>{averageRating.toFixed(1)}</Text>
                    </Space>
                </Tooltip>
            )}
        </Space>
    );
};

export default ProductStats;
