import React from 'react';
import { Divider, Space, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Cart } from '../../types';
import Button from '../base/Button';
import './CartSummary.css';

const { Text, Title } = Typography;

interface CartSummaryProps {
    cart: Cart;
    onCheckout?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ cart, onCheckout }) => {
    const hasSelectedItems = cart.selectedCount > 0;

    return (
        <div className="cart-summary">
            <Title level={4} className="cart-summary-title">Order Summary</Title>

            <Space direction="vertical" className="cart-summary-details" size="middle">
                <div className="cart-summary-row">
                    <Text>Total Items:</Text>
                    <Text strong>{cart.totalItems}</Text>
                </div>

                <div className="cart-summary-row">
                    <Text>Selected Items:</Text>
                    <Text strong className="cart-summary-selected">{cart.selectedCount}</Text>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div className="cart-summary-row">
                    <Text>Subtotal:</Text>
                    <Text strong>${cart.totalPrice.toFixed(2)}</Text>
                </div>

                <div className="cart-summary-row cart-summary-total">
                    <Text strong>Total to Pay:</Text>
                    <Title level={3} className="cart-summary-total-price">
                        ${cart.selectedTotalPrice.toFixed(2)}
                    </Title>
                </div>

                <Button
                    variant="primary"
                    size="large"
                    block
                    disabled={!hasSelectedItems}
                    icon={<ShoppingCartOutlined />}
                    onClick={onCheckout}
                    className="cart-summary-checkout"
                >
                    Proceed to Checkout ({cart.selectedCount} items)
                </Button>
            </Space>
        </div>
    );
};

export default CartSummary;
