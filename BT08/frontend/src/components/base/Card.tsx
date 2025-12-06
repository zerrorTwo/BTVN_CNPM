import React from 'react';
import { Card as AntCard, CardProps } from 'antd';
import './Card.css';

export const Card: React.FC<CardProps> = (props) => {
    return <AntCard className="cart-library-card" {...props} />;
};

export default Card;
