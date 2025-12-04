import React, { useState } from 'react';
import { Layout, Menu, Typography, Space, Badge, Button } from 'antd';
import { ShoppingCartOutlined, HomeOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GET_CART } from '../../graphql/queries';
import { CartModal } from '../cart/CartModal';
import './Header.css';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
    onMenuClick?: (key: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const [cartVisible, setCartVisible] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Get cart data for badge count
    const { data } = useQuery(GET_CART, {
        variables: { userId: user?.id || '1' },
        skip: !user,
        pollInterval: 3000, // Refresh every 3 seconds
    });

    const cartItemCount = data?.cart?.totalItems || 0;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: 'Home',
        },
        {
            key: 'products',
            icon: <AppstoreOutlined />,
            label: 'Products',
        },
    ];

    return (
        <>
            <AntHeader className="cart-library-header">
                <div className="cart-library-header-content">
                    <Space>
                        <ShoppingCartOutlined style={{ fontSize: '24px', color: '#fff' }} />
                        <Title level={3} style={{ color: '#fff', margin: 0 }}>
                            Shopping Cart Library
                        </Title>
                    </Space>

                    <Space size="large">
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['products']}
                            items={menuItems}
                            onClick={({ key }) => onMenuClick?.(key)}
                            className="cart-library-menu"
                        />

                        <Badge count={cartItemCount} showZero>
                            <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                onClick={() => setCartVisible(true)}
                                size="large"
                            >
                                Cart
                            </Button>
                        </Badge>

                        <Button
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            size="large"
                        >
                            Logout
                        </Button>
                    </Space>
                </div>
            </AntHeader>

            <CartModal
                userId={user?.id || '1'}
                visible={cartVisible}
                onClose={() => setCartVisible(false)}
            />
        </>
    );
};

export default Header;
