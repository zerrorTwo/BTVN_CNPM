import React from 'react';
import { Modal as AntModal, ModalProps } from 'antd';
import './Modal.css';

export const Modal: React.FC<ModalProps> = (props) => {
    return <AntModal className="cart-library-modal" {...props} />;
};

export default Modal;
