import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import { Product } from '../../types';
import { AddToCartButton } from '../cart/AddToCartButton';
import './ProductCard.css';

const { Text, Title } = Typography;
const { Meta } = Card;

interface ProductCardProps {
    product: Product;
    userId: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, userId }) => {
    return (
        <Card
            hoverable
            className="product-card"
            cover={
                <div className="product-card-image-wrapper">
                    <img
                        alt={product.name}
                        src={product.image || 'https://via.placeholder.com/300'}
                        className="product-card-image"
                    />
                </div>
            }
            actions={[
                <AddToCartButton
                    key="add-to-cart"
                    userId={userId}
                    productId={parseInt(product.id)}
                    initialQuantity={1}
                />,
            ]}
        >
            <Meta
                title={
                    <Title level={5} ellipsis className="product-card-title">
                        {product.name}
                    </Title>
                }
                description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Text
                            type="secondary"
                            ellipsis
                            className="product-card-description"
                        >
                            {product.description || 'No description available'}
                        </Text>
                        <div className="product-card-price-wrapper">
                            <Tag color="green" className="product-card-price">
                                ${product.price.toFixed(2)}
                            </Tag>
                        </div>
                    </Space>
                }
            />
        </Card>
    );
};

export default ProductCard;
