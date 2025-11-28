import { Form, Input, Button, Card, message, Space, Typography, Divider } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import apiClient from '../services/api';
import { LoginFormData } from '../types';
import './AuthPages.css';

const { Title, Text } = Typography;

export const LoginPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken);
    const setUser = useAuthStore((state) => state.setUser);

    const onFinish = async (values: LoginFormData) => {
        try {
            const response = await apiClient.login(values);
            const { token, user } = response.data;

            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            message.success('Login successful!');
            navigate('/dashboard');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <Card className="auth-card">
                <div className="auth-header">
                    <Title level={2} style={{ margin: 0, textAlign: 'center' }}>
                        Welcome Back
                    </Title>
                    <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: '8px' }}>
                        Sign in to your account
                    </Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                    className="auth-form"
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input
                            placeholder="Enter your email"
                            prefix={<MailOutlined />}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password
                            placeholder="Enter your password"
                            prefix={<LockOutlined />}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Link to="/forgot-password" style={{ float: 'right', marginBottom: '16px' }}>
                            <Text type="secondary">Forgot password?</Text>
                        </Link>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large">
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>

                <Divider>Don't have an account?</Divider>

                <Space direction="vertical" style={{ width: '100%' }}>
                    <Link to="/register" style={{ display: 'block', textAlign: 'center' }}>
                        <Button type="link">Create Account</Button>
                    </Link>
                </Space>
            </Card>
        </div>
    );
};
