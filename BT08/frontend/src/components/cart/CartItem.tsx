import React from 'react';
import { Checkbox, InputNumber, Space, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { CartItem as CartItemType } from '../../types';
import { UPDATE_CART_ITEM, REMOVE_CART_ITEM } from '../../graphql/mutations';
import { GET_CART } from '../../graphql/queries';
import Button from '../base/Button';
import './CartItem.css';

const { Text } = Typography;

interface CartItemProps {
    item: CartItemType;
    userId: string;
}

export const CartItem: React.FC<CartItemProps> = ({ item, userId }) => {
    const [updateCartItem] = useMutation(UPDATE_CART_ITEM, {
        refetchQueries: [{ query: GET_CART, variables: { userId } }],
    });

    const [removeCartItem] = useMutation(REMOVE_CART_ITEM, {
        refetchQueries: [{ query: GET_CART, variables: { userId } }],
    });

    const handleQuantityChange = (value: number | null) => {
        if (value && value > 0) {
            updateCartItem({
                variables: { id: parseInt(item.id), quantity: value },
            });
        }
    };

    const handleCheckChange = (checked: boolean) => {
        updateCartItem({
            variables: { id: parseInt(item.id), selected: checked },
        });
    };

    const handleRemove = () => {
        removeCartItem({
            variables: { id: parseInt(item.id) },
        });
    };

    return (
        <div className={`cart-item ${item.selected ? 'cart-item-selected' : ''}`}>
            <Checkbox checked={item.selected} onChange={(e) => handleCheckChange(e.target.checked)} />

            <img src={item.product.image} alt={item.product.name} className="cart-item-image" />

            <div className="cart-item-details">
                <Text strong className="cart-item-name">{item.product.name}</Text>
                <Text type="secondary" className="cart-item-description">
                    {item.product.description}
                </Text>
                <Text className="cart-item-price">${item.product.price.toFixed(2)}</Text>
            </div>

            <Space className="cart-item-actions">
                <InputNumber
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={handleQuantityChange}
                    className="cart-item-quantity"
                />
                <Button variant="danger" icon={<DeleteOutlined />} onClick={handleRemove}>
                    Remove
                </Button>
            </Space>
        </div>
    );
};

export default CartItem;
