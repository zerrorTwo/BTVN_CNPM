import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { useSearchParams } from "react-router-dom";
import { ShopLayout } from "../components/ShopLayout";
import ProductList from "../components/ProductList";
import { ProductFilters, ProductFilterValues } from "../components/ProductFilters";

const ProductsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState<ProductFilterValues>({
        search: '',
        categoryId: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        hasPromotion: false,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
    });

    // Initialize filters from URL parameters on mount
    useEffect(() => {
        const searchQuery = searchParams.get('search');
        const categoryId = searchParams.get('category');

        if (searchQuery || categoryId) {
            setFilters(prev => ({
                ...prev,
                search: searchQuery || '',
                categoryId: categoryId ? parseInt(categoryId) : undefined,
            }));
        }
    }, [searchParams]);

    const handleFilterChange = (newFilters: ProductFilterValues) => {
        setFilters(newFilters);
    };

    return (
        <ShopLayout>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={6}>
                    <ProductFilters
                        onFilterChange={handleFilterChange}
                        initialFilters={filters}
                    />
                </Col>
                <Col xs={24} lg={18}>
                    <ProductList filters={filters} />
                </Col>
            </Row>
        </ShopLayout>
    );
};

export default ProductsPage;
