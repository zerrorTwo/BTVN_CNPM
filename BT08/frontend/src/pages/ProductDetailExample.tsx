import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Card, Row, Col, Typography, Button, Spin, Divider } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useGetProductQuery, useTrackProductViewMutation } from '../store/api';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import FavoriteButton from '../components/FavoriteButton';
import ProductStats from '../components/ProductStats';
import SimilarProducts from '../components/SimilarProducts';
import CommentSection from '../components/CommentSection';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface ProductDetailExampleProps {
    userId?: number;
}

const ProductDetailExample: React.FC<ProductDetailExampleProps> = ({ userId = 1 }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const productId = parseInt(id || '1');

    const { data: product, isLoading } = useGetProductQuery({ id: productId, userId });
    const [trackView] = useTrackProductViewMutation();

    // Track product view when component mounts
    useEffect(() => {
        if (productId && userId) {
            trackView({ userId, productId });
        }
    }, [productId, userId, trackView]);

    if (isLoading) {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Header userId={userId} />
                <Content style={{ padding: '100px 24px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Spin size="large" />
                    </div>
                </Content>
                <Footer />
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Header userId={userId} />
                <Content style={{ padding: '100px 24px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Title level={3}>Product not found</Title>
                        <Button onClick={() => navigate('/')}>Back to Products</Button>
                    </div>
                </Content>
                <Footer />
            </Layout>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header userId={userId} />

            <Content style={{ padding: '24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/')}
                        style={{ marginBottom: 16 }}
                    >
                        Back to Products
                    </Button>

                    <Card>
                        <Row gutter={32}>
                            {/* Product Image */}
                            <Col xs={24} md={10}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{ width: '100%', borderRadius: 8 }}
                                />
                            </Col>

                            {/* Product Info */}
                            <Col xs={24} md={14}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <Title level={2}>{product.name}</Title>
                                    <FavoriteButton
                                        productId={product.id}
                                        isFavorite={product.isFavorite}
                                        userId={userId}
                                        size="middle"
                                    />
                                </div>

                                <ProductStats
                                    purchaseCount={product.purchaseCount}
                                    commentCount={product.commentCount}
                                    averageRating={product.averageRating}
                                    size="default"
                                />

                                <Divider />

                                <Title level={3} style={{ color: '#1890ff', marginBottom: 16 }}>
                                    ${Number(product.price).toFixed(2)}
                                </Title>

                                <Paragraph>{product.description}</Paragraph>

                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ShoppingCartOutlined />}
                                    style={{ marginTop: 16 }}
                                >
                                    Add to Cart
                                </Button>
                            </Col>
                        </Row>
                    </Card>

                    {/* Similar Products */}
                    <SimilarProducts productId={productId} userId={userId} limit={6} />

                    {/* Comments Section */}
                    <CommentSection
                        productId={productId}
                        userId={userId}
                        averageRating={product.averageRating}
                        commentCount={product.commentCount}
                    />
                </div>
            </Content>

            <Footer />
        </Layout>
    );
};

export default ProductDetailExample;
