import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { message, InputNumber } from 'antd';
import { ADD_TO_CART } from '../../graphql/mutations';
import { GET_CART } from '../../graphql/queries';
import Button from '../base/Button';
import './AddToCartButton.css';

interface AddToCartButtonProps {
    productId: number;
    userId: string;
    initialQuantity?: number;
    showQuantitySelector?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
    productId,
    userId,
    initialQuantity = 1,
    showQuantitySelector = false,
}) => {
    const [quantity, setQuantity] = useState(initialQuantity);

    const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
        refetchQueries: [{ query: GET_CART, variables: { userId } }],
        onCompleted: () => {
            message.success(`Added ${quantity} item(s) to cart!`);
        },
        onError: (error) => {
            message.error(`Failed to add to cart: ${error.message}`);
        },
    });

    const handleAddToCart = () => {
        addToCart({
            variables: {
                userId,
                productId,
                quantity,
            },
        });
    };

    return (
        <div className="add-to-cart-button-wrapper">
            {showQuantitySelector && (
                <InputNumber
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={(value) => setQuantity(value || 1)}
                    className="add-to-cart-quantity"
                />
            )}
            <Button
                variant="primary"
                icon={<ShoppingCartOutlined />}
                loading={loading}
                onClick={handleAddToCart}
                className="add-to-cart-button"
            >
                Add to Cart
            </Button>
        </div>
    );
};

export default AddToCartButton;
