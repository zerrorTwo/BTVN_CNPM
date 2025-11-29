import React, { useState, useEffect, useCallback } from "react";
import {
    Card,
    Row,
    Col,
    Spin,
    Empty,
    message,
    Tag,
    Space,
    Button,
    Badge,
} from "antd";
import {
    ShoppingCartOutlined,
    HeartOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { productService } from "../services/product.service";
import { Product } from "../types";
import { ProductFilterValues } from "./ProductFilters";
import "./ProductList.css";

interface ProductListProps {
    filters: ProductFilterValues;
}

const ProductList: React.FC<ProductListProps> = ({ filters }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    // Load products
    const loadProducts = useCallback(
        async (resetList = false) => {
            if (loading) return;

            try {
                setLoading(true);
                const currentPage = resetList ? 1 : page;

                const response = await productService.getProducts({
                    page: currentPage,
                    limit: 12,
                    search: filters.search || undefined,
                    categoryId: filters.categoryId,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    // Note: Backend doesn't support these yet, but frontend is ready
                    // hasPromotion: filters.hasPromotion,
                    // sortBy: filters.sortBy,
                    // sortOrder: filters.sortOrder,
                });

                if (resetList) {
                    setProducts(response.data);
                    setPage(1);
                } else {
                    setProducts((prev) => [...prev, ...response.data]);
                }

                setHasMore(response.pagination.hasMore);
            } catch (error: any) {
                message.error(error.response?.data?.message || "Không thể tải sản phẩm");
            } finally {
                setLoading(false);
            }
        },
        [filters, page, loading]
    );

    // Reset and reload when filters change
    useEffect(() => {
        setProducts([]);
        setPage(1);
        loadProducts(true);
    }, [filters.search, filters.categoryId, filters.minPrice, filters.maxPrice, filters.hasPromotion, filters.sortBy, filters.sortOrder]);

    // Handle infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
                setPage((prev) => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading]);

    // Load more when page changes
    useEffect(() => {
        if (page > 1) {
            loadProducts(false);
        }
    }, [page]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="product-list-container">
            {/* Products Grid */}
            <div className="products-grid">
                {products.length === 0 && !loading ? (
                    <Empty
                        description="Không tìm thấy sản phẩm nào"
                        style={{ margin: "60px 0" }}
                    />
                ) : (
                    <Row gutter={[24, 24]}>
                        {products.map((product) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                <Badge.Ribbon
                                    text={product.discount && product.discount > 0 ? `-${product.discount}%` : null}
                                    color="red"
                                >
                                    <Card
                                        hoverable
                                        className="product-card"
                                        cover={
                                            <div className="product-image-container">
                                                <img
                                                    alt={product.name}
                                                    src={
                                                        product.imageUrl ||
                                                        `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`
                                                    }
                                                />
                                                <div className="product-overlay">
                                                    <Space size="large">
                                                        <Button
                                                            type="primary"
                                                            shape="circle"
                                                            icon={<ShoppingCartOutlined />}
                                                            size="large"
                                                        />
                                                        <Button
                                                            shape="circle"
                                                            icon={<HeartOutlined />}
                                                            size="large"
                                                        />
                                                    </Space>
                                                </div>
                                                {product.stock < 10 && product.stock > 0 && (
                                                    <Tag color="orange" className="stock-tag">
                                                        Còn {product.stock} sản phẩm
                                                    </Tag>
                                                )}
                                                {product.stock === 0 && (
                                                    <Tag color="red" className="stock-tag">
                                                        Hết hàng
                                                    </Tag>
                                                )}
                                            </div>
                                        }
                                    >
                                        <div className="product-info">
                                            <h3 className="product-name" title={product.name}>
                                                {product.name}
                                            </h3>
                                            {product.category && (
                                                <Tag color="blue" style={{ marginBottom: 8 }}>
                                                    {product.category.name}
                                                </Tag>
                                            )}
                                            <div className="product-price">
                                                {product.discount && product.discount > 0 ? (
                                                    <>
                                                        <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px', marginRight: 8 }}>
                                                            {formatPrice(product.price)}
                                                        </span>
                                                        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                                                            {formatPrice(product.price * (1 - product.discount / 100))}
                                                        </span>
                                                    </>
                                                ) : (
                                                    formatPrice(product.price)
                                                )}
                                            </div>
                                            {product.views && product.views > 0 && (
                                                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                                                    <EyeOutlined /> {product.views} lượt xem
                                                </div>
                                            )}
                                            {product.description && (
                                                <p className="product-description">
                                                    {product.description.length > 60
                                                        ? product.description.substring(0, 60) + "..."
                                                        : product.description}
                                                </p>
                                            )}
                                        </div>
                                    </Card>
                                </Badge.Ribbon>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            {/* Loading Spinner */}
            {loading && (
                <div className="loading-container">
                    <Spin size="large" tip="Đang tải sản phẩm..." />
                </div>
            )}

            {/* End Message */}
            {!hasMore && products.length > 0 && (
                <div className="end-message">
                    <Tag color="success">Đã hiển thị tất cả {products.length} sản phẩm</Tag>
                </div>
            )}
        </div>
    );
};

export default ProductList;
