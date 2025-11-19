import React, { useState, useEffect } from "react";
import { ShopLayout } from "../components/ShopLayout";
import { Carousel, Row, Col, Card, Button, Typography, Space } from "antd";
import { ShoppingOutlined, SafetyOutlined, RocketOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { productService, categoryService } from "../services/product.service";
import { Product, Category } from "../types";
import "./HomePage.css";

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        loadFeaturedProducts();
        loadCategories();
    }, []);

    const loadFeaturedProducts = async () => {
        try {
            const response = await productService.getProducts({ limit: 8 });
            setFeaturedProducts(response.data);
        } catch (error) {
            console.error("Failed to load featured products:", error);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories:", error);
        }
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        navigate("/products");
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <ShopLayout onSearch={handleSearch}>
            {/* Hero Carousel */}
            <Carousel autoplay className="hero-carousel">
                <div className="carousel-slide slide-1">
                    <div className="carousel-content">
                        <Title level={1}>Chào mừng đến UTE Shop</Title>
                        <Paragraph style={{ fontSize: 18, color: "#fff" }}>
                            Mua sắm trực tuyến với hàng ngàn sản phẩm chất lượng
                        </Paragraph>
                        <Button type="primary" size="large" onClick={() => navigate("/products")}>
                            Mua sắm ngay
                        </Button>
                    </div>
                </div>
                <div className="carousel-slide slide-2">
                    <div className="carousel-content">
                        <Title level={1}>Ưu đãi lên đến 50%</Title>
                        <Paragraph style={{ fontSize: 18, color: "#fff" }}>
                            Khuyến mãi đặc biệt cho khách hàng mới
                        </Paragraph>
                        <Button type="primary" size="large" onClick={() => navigate("/products")}>
                            Xem ngay
                        </Button>
                    </div>
                </div>
                <div className="carousel-slide slide-3">
                    <div className="carousel-content">
                        <Title level={1}>Giao hàng miễn phí</Title>
                        <Paragraph style={{ fontSize: 18, color: "#fff" }}>
                            Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                        </Paragraph>
                        <Button type="primary" size="large" onClick={() => navigate("/products")}>
                            Mua ngay
                        </Button>
                    </div>
                </div>
            </Carousel>

            {/* Features */}
            <div className="features-section">
                <Row gutter={[32, 32]}>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="feature-card" bordered={false}>
                            <ShoppingOutlined style={{ fontSize: 48, color: "#1890ff" }} />
                            <Title level={4}>Sản phẩm đa dạng</Title>
                            <Paragraph>Hàng ngàn sản phẩm chất lượng</Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="feature-card" bordered={false}>
                            <SafetyOutlined style={{ fontSize: 48, color: "#52c41a" }} />
                            <Title level={4}>Thanh toán an toàn</Title>
                            <Paragraph>Bảo mật thông tin 100%</Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="feature-card" bordered={false}>
                            <RocketOutlined style={{ fontSize: 48, color: "#faad14" }} />
                            <Title level={4}>Giao hàng nhanh</Title>
                            <Paragraph>Giao hàng toàn quốc 24-48h</Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="feature-card" bordered={false}>
                            <CustomerServiceOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />
                            <Title level={4}>Hỗ trợ 24/7</Title>
                            <Paragraph>Tư vấn nhiệt tình, chu đáo</Paragraph>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
                <div className="section">
                    <Title level={2} className="section-title">Danh mục sản phẩm</Title>
                    <Row gutter={[24, 24]}>
                        {categories.slice(0, 6).map((category) => (
                            <Col xs={12} sm={8} md={6} lg={4} key={category.id}>
                                <Card
                                    hoverable
                                    className="category-card"
                                    onClick={() => navigate(`/products?category=${category.id}`)}
                                >
                                    <div className="category-icon">
                                        <ShoppingOutlined style={{ fontSize: 32 }} />
                                    </div>
                                    <Title level={5}>{category.name}</Title>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {/* Featured Products */}
            <div className="section">
                <div className="section-header">
                    <Title level={2} className="section-title">Sản phẩm nổi bật</Title>
                    <Button type="link" onClick={() => navigate("/products")}>
                        Xem tất cả →
                    </Button>
                </div>
                <Row gutter={[24, 24]}>
                    {featuredProducts.map((product) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                            <Card
                                hoverable
                                className="product-card-home"
                                cover={
                                    <div className="product-image">
                                        <img
                                            alt={product.name}
                                            src={
                                                product.imageUrl ||
                                                `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`
                                            }
                                        />
                                    </div>
                                }
                            >
                                <Space direction="vertical" style={{ width: "100%" }}>
                                    <Title level={5} ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
                                        {product.name}
                                    </Title>
                                    <div className="product-price-home">
                                        {formatPrice(product.price)}
                                    </div>
                                    <Button type="primary" block onClick={() => navigate("/products")}>
                                        Xem chi tiết
                                    </Button>
                                </Space>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </ShopLayout>
    );
};

export default HomePage;
