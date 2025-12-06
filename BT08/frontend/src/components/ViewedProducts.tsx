import React from 'react';
import { useGetViewedProductsQuery } from '../store/api';
import { Card, Row, Col, Typography, Spin, Empty } from 'antd';
import FavoriteButton from './FavoriteButton';
import ProductStats from './ProductStats';

const { Title, Text } = Typography;

interface ViewedProductsProps {
    userId: number;
    limit?: number;
}

const ViewedProducts: React.FC<ViewedProductsProps> = ({ userId, limit = 10 }) => {
    const { data: products = [], isLoading } = useGetViewedProductsQuery(
        { userId, limit },
        { skip: !userId }
    );

    if (!userId) {
        return null;
    }

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div style={{ marginTop: 40 }}>
                <Title level={4}>Recently Viewed</Title>
                <Empty description="No recently viewed products" />
            </div>
        );
    }

    return (
        <div style={{ marginTop: 40 }}>
            <Title level={4} style={{ marginBottom: 20 }}>
                Recently Viewed Products
            </Title>
            <Row gutter={[16, 16]}>
                {products.map((product) => (
                    <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            cover={
                                <div style={{ position: 'relative' }}>
                                    <img
                                        alt={product.name}
                                        src={product.image}
                                        style={{ height: 200, objectFit: 'cover', width: '100%' }}
                                    />
                                    <div style={{ position: 'absolute', top: 8, right: 8 }}>
                                        <FavoriteButton
                                            productId={product.id}
                                            isFavorite={product.isFavorite}
                                            userId={userId}
                                            size="small"
                                        />
                                    </div>
                                </div>
                            }
                        >
                            <Card.Meta
                                title={
                                    <div style={{ fontSize: 14, height: 40, overflow: 'hidden' }}>
                                        {product.name}
                                    </div>
                                }
                                description={
                                    <div>
                                        <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                                            ${product.price}
                                        </Text>
                                        <ProductStats
                                            purchaseCount={product.purchaseCount}
                                            commentCount={product.commentCount}
                                            averageRating={product.averageRating}
                                            size="small"
                                        />
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ViewedProducts;
