import React, { useState } from 'react';
import { Layout, Row, Col, Spin, Empty, Typography } from 'antd';
import { useQuery } from '@apollo/client';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../components/products/ProductCard';
import { ProductFilter, FilterValues } from '../components/products/ProductFilter';
import { GET_PRODUCTS } from '../graphql/queries';
import { Product } from '../types';
import './ProductsPage.css';

const { Content } = Layout;
const { Title } = Typography;

interface ProductsPageProps {
    userId: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ userId }) => {
    const [filters, setFilters] = useState<FilterValues>({});

    const { loading, error, data } = useQuery(GET_PRODUCTS, {
        variables: { filter: filters },
    });

    const handleFilterChange = (newFilters: FilterValues) => {
        setFilters(newFilters);
    };

    const products: Product[] = data?.products || [];

    return (
        <Layout className="products-page-layout">
            <Header />

            <Content className="products-page-content">
                <div className="products-page-container">
                    <Title level={2} className="products-page-title">
                        Our Products
                    </Title>

                    <Row gutter={[24, 24]}>
                        {/* Filter Sidebar */}
                        <Col xs={24} sm={24} md={24} lg={6}>
                            <ProductFilter onFilterChange={handleFilterChange} />
                        </Col>

                        {/* Products Grid */}
                        <Col xs={24} sm={24} md={24} lg={18}>
                            {loading ? (
                                <div className="products-loading">
                                    <Spin size="large" tip="Loading products..." />
                                </div>
                            ) : error ? (
                                <div className="products-error">
                                    <Empty description={`Error: ${error.message}`} />
                                </div>
                            ) : products.length === 0 ? (
                                <div className="products-empty">
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
