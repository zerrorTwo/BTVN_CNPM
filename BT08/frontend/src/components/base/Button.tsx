import React from 'react';
import { Button as AntButton, ButtonProps } from 'antd';
import './Button.css';

interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<CustomButtonProps> = ({ variant = 'primary', ...props }) => {
    const getType = () => {
        switch (variant) {
            case 'primary':
                return 'primary';
            case 'danger':
                return 'primary';
            case 'secondary':
                return 'default';
            default:
                return 'default';
        }
    };

    return (
        <AntButton
            type={getType()}
            danger={variant === 'danger'}
            className={`cart-library-button cart-library-button-${variant}`}
            {...props}
        />
    );
};

export default Button;
