import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import { REGISTER } from '../graphql/mutations';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css'; // Reuse same styles

const { Title, Text } = Typography;

export const RegisterPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const [registerMutation] = useMutation(REGISTER);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const { data } = await registerMutation({
                variables: values,
            });

            login(data.register.user, data.register.accessToken, data.register.refreshToken);
            message.success('Registration successful!');
            navigate('/');
        } catch (error: any) {
            message.error(error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <Card className="login-card">
                <Title level={2} style={{ textAlign: 'center' }}>Register</Title>
                <Form name="register" onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please input valid email!' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block size="large">
                            Register
                        </Button>
                    </Form.Item>
                </Form>

                <Text>
                    Already have an account? <Link to="/login">Login here</Link>
                </Text>
            </Card>
        </div>
    );
};

export default RegisterPage;
