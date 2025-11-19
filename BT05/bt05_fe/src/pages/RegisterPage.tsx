import { Form, Input, Button, Card, message, Space, Typography, Divider } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import apiClient from '../services/api';
import { RegisterFormData } from '../types';
import './AuthPages.css';

const { Title, Text } = Typography;

export const RegisterPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken);
    const setUser = useAuthStore((state) => state.setUser);

    const onFinish = async (values: RegisterFormData) => {
        try {
            const response = await apiClient.register(values);
            const { token, user } = response.data;

            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            message.success('Registration successful!');
            navigate('/dashboard');
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                errors.forEach((err: any) => {
                    message.error(err.msg || err.message);
                });
            } else {
                message.error(error.response?.data?.message || 'Registration failed');
            }
        }
    };

    return (
        <div className="auth-container">
            <Card className="auth-card">
                <div className="auth-header">
                    <Title level={2} style={{ margin: 0, textAlign: 'center' }}>
                        Create Account
                    </Title>
                    <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: '8px' }}>
                        Join us today
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
                        name="fullName"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter your full name' }]}
                    >
                        <Input
                            placeholder="Enter your full name"
                            prefix={<UserOutlined />}
                            size="large"
                        />
                    </Form.Item>

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
                        rules={[
                            { required: true, message: 'Please enter your password' },
                            { min: 6, message: 'Password must be at least 6 characters' },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                message: 'Password must contain uppercase, lowercase, and numbers',
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="Enter your password"
                            prefix={<LockOutlined />}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        rules={[
                            { required: true, message: 'Please confirm your password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Confirm your password"
                            prefix={<LockOutlined />}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large">
                            Create Account
                        </Button>
                    </Form.Item>
                </Form>

                <Divider>Already have an account?</Divider>

                <Space direction="vertical" style={{ width: '100%' }}>
                    <Link to="/login" style={{ display: 'block', textAlign: 'center' }}>
                        <Button type="link">Sign In</Button>
                    </Link>
                </Space>
            </Card>
        </div>
    );
};
