import React from 'react';
import { Input as AntInput, InputProps } from 'antd';
import './Input.css';

export const Input: React.FC<InputProps> = (props) => {
    return <AntInput className="cart-library-input" {...props} />;
};

export default Input;
