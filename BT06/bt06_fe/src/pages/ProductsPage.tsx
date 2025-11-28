import React, { useState } from "react";
import { Row, Col } from "antd";
import { ShopLayout } from "../components/ShopLayout";
import ProductList from "../components/ProductList";
import { ProductFilters, ProductFilterValues } from "../components/ProductFilters";

const ProductsPage: React.FC = () => {
    const [filters, setFilters] = useState<ProductFilterValues>({
        search: '',
        categoryId: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        hasPromotion: false,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
    });

    const handleFilterChange = (newFilters: ProductFilterValues) => {
        setFilters(newFilters);
    };

    return (
        <ShopLayout>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={6}>
                    <ProductFilters onFilterChange={handleFilterChange} />
                </Col>
                <Col xs={24} lg={18}>
                    <ProductList filters={filters} />
                </Col>
            </Row>
        </ShopLayout>
    );
};

export default ProductsPage;
