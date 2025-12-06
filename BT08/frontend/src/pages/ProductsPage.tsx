import React, { useState } from 'react';
import { Layout, Row, Col, Spin, Empty, Typography } from 'antd';
import { useGetProductsQuery } from '../store/api';
import { ProductCard } from '../components/products/ProductCard';
import { ProductFilter, FilterValues } from '../components/products/ProductFilter';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

const { Content } = Layout;
const { Title } = Typography;

interface ProductsPageProps {
    userId: number;
    onLogout?: () => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ userId, onLogout }) => {
    const [filters, setFilters] = useState<FilterValues>({});

    const { data: products = [], isLoading, error } = useGetProductsQuery({
        userId,
        ...filters,
    });

    const handleFilterChange = (newFilters: FilterValues) => {
        setFilters(newFilters);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header userId={userId} onLogout={onLogout} />

            <Content style={{ padding: '24px' }}>
                <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                    <Title level={2}>Our Products</Title>

                    <Row gutter={[24, 24]}>
                        {/* Filter Sidebar */}
                        <Col xs={24} sm={24} md={24} lg={6}>
                            <ProductFilter filters={filters} onFilterChange={handleFilterChange} />
                        </Col>

                        {/* Products Grid */}
                        <Col xs={24} sm={24} md={24} lg={18}>
                            {isLoading ? (
                                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                    <Spin size="large" />
                                </div>
                            ) : error ? (
                                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                    <Empty description="Error loading products" />
                                </div>
                            ) : products.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                    <Empty description="No products found. Try adjusting your filters." />
                                </div>
                            ) : (
                                <Row gutter={[16, 16]}>
                                    {products.map((product) => (
                                        <Col key={product.id} xs={24} sm={12} md={8} lg={8} xl={6}>
                                            <ProductCard product={product} userId={userId} />
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Col>
                    </Row>
                </div>
            </Content>

            <Footer />
        </Layout>
    );
};

export default ProductsPage;
