import { Layout, Button, Avatar, Dropdown, Space, Card, Row, Col, Statistic, message } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import apiClient from '../services/api';
import { useState, useEffect } from 'react';
import { User } from '../types';
import './DashboardPage.css';

const { Header, Content, Footer } = Layout;

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [userData, setUserData] = useState<User | null>(user || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await apiClient.getCurrentUser();
                setUserData(response.data.user);
            } catch (error) {
                console.error('Failed to fetch current user:', error);
                logout();
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    const handleLogout = async () => {
        try {
            await apiClient.logout();
            logout();
            message.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            message.error('Logout failed');
        }
    };

    const menuItems = [
        {
            key: '1',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
        {
            key: '2',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                    <Space size="large">
                        <h2 style={{ margin: 0, color: '#1890ff' }}>MERN Auth System</h2>
                        <Button type="link" onClick={() => navigate('/products')}>
                            Sản phẩm
                        </Button>
                        <Button type="link" onClick={() => navigate('/dashboard')}>
                            Dashboard
                        </Button>
                    </Space>
                    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar size="large" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                            <span>{userData?.fullName || 'User'}</span>
                        </Space>
                    </Dropdown>
                </div>
            </Header>

            <Content style={{ padding: '50px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Card loading={loading}>
                            <Statistic
                                title="User Email"
                                value={userData?.email || '-'}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Card loading={loading}>
                            <Statistic
                                title="Full Name"
                                value={userData?.fullName || '-'}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Card loading={loading}>
                            <Statistic
                                title="Status"
                                value="Active"
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Card loading={loading}>
                            <Statistic
                                title="Account Type"
                                value="Standard"
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: '30px' }}>
                    <Col xs={24}>
                        <Card
                            title="Welcome to Your Dashboard"
                            extra={<Button type="primary" onClick={handleLogout}>Logout</Button>}
                        >
                            <p>
                                Welcome <strong>{userData?.fullName || 'User'}</strong>! You're successfully logged into the MERN Auth System.
                            </p>
                            <p>This dashboard demonstrates a complete authentication system built with:</p>
                            <ul>
                                <li><strong>Backend:</strong> Express.js + TypeScript + MySQL</li>
                                <li><strong>Frontend:</strong> React + TypeScript + Ant Design</li>
                                <li><strong>Authentication:</strong> JWT tokens</li>
                                <li><strong>Email:</strong> Password reset functionality</li>
                            </ul>
                            <p style={{ marginTop: '20px', color: '#999' }}>
                                You can manage your account using the menu in the top-right corner.
                            </p>
                        </Card>
                    </Col>
                </Row>
            </Content>

            <Footer style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>
                MERN Auth System © 2024. All rights reserved.
            </Footer>
        </Layout>
    );
};
