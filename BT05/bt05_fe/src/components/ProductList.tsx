import React, { useState, useEffect, useCallback } from "react";
import {
    Card,
    Row,
    Col,
    Spin,
    Empty,
    message,
    Select,
    Button,
    InputNumber,
    Tag,
    Space,
} from "antd";
import {
    ShoppingCartOutlined,
    HeartOutlined,
} from "@ant-design/icons";
import { productService, categoryService, ProductFilters } from "../services/product.service";
import { Product, Category } from "../types";
import "./ProductList.css";

const { Option } = Select;

interface ProductListProps {
    searchQuery?: string;
}

const ProductList: React.FC<ProductListProps> = ({ searchQuery }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState<ProductFilters>({
        page: 1,
        limit: 12,
        search: searchQuery,
    });
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await categoryService.getCategories();
                setCategories(data);
            } catch (error) {
                message.error("Không thể tải danh mục");
            }
        };
        loadCategories();
    }, []);

    // Load products
    const loadProducts = useCallback(
        async (resetList = false) => {
            if (loading) return;

            try {
                setLoading(true);
                const response = await productService.getProducts(filters);

                if (resetList) {
                    setProducts(response.data);
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
        [filters, loading]
    );

    // Update search from props
    useEffect(() => {
        if (searchQuery !== filters.search) {
            setProducts([]);
            setFilters(prev => ({ ...prev, search: searchQuery, page: 1 }));
        }
    }, [searchQuery]);

    // Initial load
    useEffect(() => {
        loadProducts(true);
    }, [filters.search, filters.categoryId, filters.minPrice, filters.maxPrice]);

    // Handle infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
                setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }));
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading]);

    // Load more when page changes
    useEffect(() => {
        if (filters.page && filters.page > 1) {
            loadProducts(false);
        }
    }, [filters.page]);

    // Handle category filter
    const handleCategoryChange = (categoryId: number | undefined) => {
        setProducts([]);
        setFilters((prev) => ({ ...prev, categoryId, page: 1 }));
    };

    // Handle price filter
    const handlePriceFilter = () => {
        setProducts([]);
        setFilters((prev) => ({
            ...prev,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
            page: 1,
        }));
    };

    // Reset filters
    const handleReset = () => {
        setMinPrice(null);
        setMaxPrice(null);
        setProducts([]);
        setFilters({ page: 1, limit: 12, search: searchQuery });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="product-list-container">
            {/* Filters Section */}
            <div className="filters-section">
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={6}>
                        <Select
                            placeholder="Tất cả danh mục"
                            allowClear
                            onChange={handleCategoryChange}
                            style={{ width: "100%" }}
                            size="large"
                        >
                            {categories.map((cat) => (
                                <Option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={12} md={4}>
                        <InputNumber
                            placeholder="Giá từ"
                            min={0}
                            value={minPrice}
                            onChange={(value) => setMinPrice(value)}
                            style={{ width: "100%" }}
                            size="large"
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                        />
                    </Col>
                    <Col xs={12} md={4}>
                        <InputNumber
                            placeholder="Giá đến"
                            min={0}
                            value={maxPrice}
                            onChange={(value) => setMaxPrice(value)}
                            style={{ width: "100%" }}
                            size="large"
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                        />
                    </Col>
                    <Col xs={12} md={4}>
                        <Button type="primary" onClick={handlePriceFilter} block size="large">
                            Áp dụng
                        </Button>
                    </Col>
                    <Col xs={12} md={4}>
                        <Button onClick={handleReset} block size="large">
                            Đặt lại
                        </Button>
                    </Col>
                </Row>
            </div>

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
                                            {formatPrice(product.price)}
                                        </div>
                                        {product.description && (
                                            <p className="product-description">
                                                {product.description.length > 60
                                                    ? product.description.substring(0, 60) + "..."
                                                    : product.description}
                                            </p>
                                        )}
                                    </div>
                                </Card>
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
