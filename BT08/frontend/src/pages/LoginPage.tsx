import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LOGIN } from '../graphql/mutations';
import './LoginPage.css';

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loginMutation] = useMutation(LOGIN);

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const { data } = await loginMutation({
                variables: values,
            });

            login(data.login.user, data.login.accessToken, data.login.refreshToken);
            message.success('Login successful!');
            navigate('/');
        } catch (error: any) {
            message.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <Card className="login-card">
                <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
                <Form name="login" onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please input valid email!' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block size="large">
                            Login
                        </Button>
                    </Form.Item>
                </Form>

                <Text>
                    Don't have an account? <Link to="/register">Register here</Link>
                </Text>
            </Card>
        </div>
    );
};

export default LoginPage;
