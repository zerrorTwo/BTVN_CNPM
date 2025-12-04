import React from 'react';
import { Empty, Spin } from 'antd';
import { CartItem } from './CartItem';
import { CartItem as CartItemType } from '../../types';
import './CartList.css';

interface CartListProps {
    items: CartItemType[];
    userId: string;
    loading?: boolean;
}

export const CartList: React.FC<CartListProps> = ({ items, userId, loading = false }) => {
    if (loading) {
        return (
            <div className="cart-list-loading">
                <Spin size="large" />
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="cart-list-empty">
                <Empty description="Your cart is empty" />
            </div>
        );
    }

    return (
        <div className="cart-list">
            {items.map((item) => (
                <CartItem key={item.id} item={item} userId={userId} />
            ))}
        </div>
    );
};

export default CartList;

// CartList component for displaying cart items
