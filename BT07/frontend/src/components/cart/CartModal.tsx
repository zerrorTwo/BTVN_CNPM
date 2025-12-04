import React from 'react';
import { useQuery } from '@apollo/client';
import { message } from 'antd';
import { GET_CART } from '../../graphql/queries';
import Modal from '../base/Modal';
import CartSummary from './CartSummary';
import './CartModal.css';
import { CartList } from './CartList';

interface CartModalProps {
    userId: string;
    visible: boolean;
    onClose: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ userId, visible, onClose }) => {
    const { data, loading } = useQuery(GET_CART, {
        variables: { userId },
        skip: !visible,
    });

    const cart = data?.cart;

    const handleCheckout = () => {
        if (cart && cart.selectedCount > 0) {
            message.success(`Proceeding to checkout with ${cart.selectedCount} items!`);
            onClose();
        }
    };

    return (
        <Modal
            title="Shopping Cart"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={900}
            className="cart-modal"
        >
            {loading ? (
                <div className="cart-modal-loading">Loading cart...</div>
            ) : cart ? (
                <div className="cart-modal-content">
                    <div className="cart-modal-list">
                        <CartList items={cart.items} userId={userId} />
                    </div>
                    <div className="cart-modal-summary">
                        <CartSummary cart={cart} onCheckout={handleCheckout} />
                    </div>
                </div>
            ) : null}
        </Modal>
    );
};

export default CartModal;
