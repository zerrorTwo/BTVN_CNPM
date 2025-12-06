import React from 'react';
import { Layout, Card, Row, Col, Typography, Empty, Spin } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useGetFavoritesQuery } from '../store/api';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import ProductStats from '../components/ProductStats';

const { Content } = Layout;
const { Title, Text } = Typography;

interface FavoritesPageExampleProps {
    userId?: number;
}

const FavoritesPageExample: React.FC<FavoritesPageExampleProps> = ({ userId = 1 }) => {
    const { data: products = [], isLoading } = useGetFavoritesQuery(userId);
    const navigate = useNavigate();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header userId={userId} />

            <Content style={{ padding: '24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Title level={2}>
                        <HeartFilled style={{ color: '#ff4d4f', marginRight: 8 }} />
                        My Favorites ({products.length})
                    </Title>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}>
                            <Spin size="large" />
                        </div>
                    ) : products.length === 0 ? (
                        <Empty
                            description="No favorite products yet"
                            style={{ marginTop: 60 }}
                        />
                    ) : (
                        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                            {products.map((product) => (
                                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                                    <Card
                                        hoverable
                                        onClick={() => navigate(`/product/${product.id}`)}
                                        cover={
                                            <img
                                                alt={product.name}
                                                src={product.image}
                                                style={{ height: 200, objectFit: 'cover' }}
                                            />
                                        }
                                    >
                                        <Card.Meta
                                            title={product.name}
                                            description={
                                                <div>
                                                    <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                                                        ${Number(product.price).toFixed(2)}
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
                    )}
                </div>
            </Content>

            <Footer />
        </Layout>
    );
};

export default FavoritesPageExample;
