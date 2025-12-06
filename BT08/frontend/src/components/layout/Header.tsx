import React, { useState } from 'react';
import { Layout, Menu, Typography, Badge, Button, Space } from 'antd';
import {
    ShoppingCartOutlined,
    UserOutlined,
    HeartOutlined,
    AppstoreOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetCartQuery } from '../../store/api';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
    userId: number;
    onCartClick?: () => void;
    onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userId, onCartClick, onLogout }) => {
    const { data: cartData } = useGetCartQuery(userId);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/',
            icon: <AppstoreOutlined />,
            label: 'Products',
        },
        {
            key: '/favorites',
            icon: <HeartOutlined />,
            label: 'Favorites',
        },
    ];

    const currentPath = location.pathname === '/favorites' ? '/favorites' : '/';

    return (
        <AntHeader style={{
            background: '#001529',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <Space>
                <ShoppingCartOutlined style={{ fontSize: 24, color: 'white' }} />
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                    Shopping Cart
                </Title>
            </Space>

            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[currentPath]}
                items={menuItems}
                onClick={({ key }) => navigate(key)}
                style={{ flex: 1, minWidth: 0, marginLeft: 24 }}
            />

            <Space size="large">
                <Badge count={cartData?.totalItems || 0} showZero>
                    <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={onCartClick}
                        size="large"
                    >
                        Cart
                    </Button>
                </Badge>

                {onLogout && (
                    <Button
                        icon={<LogoutOutlined />}
                        onClick={onLogout}
                        size="large"
                    >
                        Logout
                    </Button>
                )}
            </Space>
        </AntHeader>
    );
};

export default Header;
