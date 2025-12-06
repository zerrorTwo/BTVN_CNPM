import React, { useState } from 'react';
import { Card, Typography, Space, Tag, Button, InputNumber, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Product, useAddToCartMutation } from '../../store/api';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;
const { Meta } = Card;

interface ProductCardProps {
    product: Product;
    userId: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, userId }) => {
    const [quantity, setQuantity] = useState(1);
    const [addToCart, { isLoading }] = useAddToCartMutation();
    const navigate = useNavigate();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        try {
            await addToCart({ userId, productId: product.id, quantity }).unwrap();
            message.success(`Added ${product.name} to cart`);
            setQuantity(1);
        } catch (error: any) {
            message.error(error?.data?.error || 'Failed to add to cart');
        }
    };

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <Card
            hoverable
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
            cover={
                <div style={{ position: 'relative' }}>
                    <img
                        alt={product.name}
                        src={product.image || 'https://via.placeholder.com/300'}
                        style={{ height: 200, objectFit: 'cover', width: '100%' }}
                    />
                </div>
            }
        >
            <Meta
                title={
                    <Title level={5} ellipsis style={{ marginBottom: 8 }}>
                        {product.name}
                    </Title>
                }
                description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Text type="secondary" ellipsis>
                            {product.description || 'No description available'}
                        </Text>
                        <div>
                            <Tag color="green" style={{ fontSize: 16 }}>
                                ${Number(product.price).toFixed(2)}
                            </Tag>
                        </div>
                        <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 8 }}>
                            <InputNumber
                                min={1}
                                max={99}
                                value={quantity}
                                onChange={(val) => setQuantity(val || 1)}
                                onClick={(e) => e.stopPropagation()}
                                size="small"
                                style={{ width: 60 }}
                            />
                            <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                onClick={handleAddToCart}
                                loading={isLoading}
                                size="small"
                            >
                                Add
                            </Button>
                        </Space>
                    </Space>
                }
            />
        </Card>
    );
};

export default ProductCard;
