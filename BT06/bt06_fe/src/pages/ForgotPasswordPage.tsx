import { Form, Input, Button, Card, message, Typography, Divider, Spin } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';
import { useState } from 'react';
import './AuthPages.css';

const { Title, Text } = Typography;

export const ForgotPasswordPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            await apiClient.forgotPassword({
                email: values.email,
                password: values.password,
            });
            message.success('Password updated successfully!');
            form.resetFields();
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Spin spinning={loading}>
                <Card className="auth-card">
                    <div className="auth-header">
                        <Title level={2} style={{ margin: 0, textAlign: 'center' }}>
                            Reset Password
                        </Title>
                        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: '8px' }}>
                            Enter your email and new password
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
                            label="Email Address"
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
                            label="New Password"
                            rules={[
                                { required: true, message: 'Please enter your new password' },
                                { min: 8, message: 'Password must be at least 8 characters' },
                                {
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                                    message: 'Password must contain uppercase, lowercase, number, and special character',
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Enter your new password"
                                prefix={<LockOutlined />}
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm New Password"
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
                                placeholder="Confirm your new password"
                                prefix={<LockOutlined />}
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                                Update Password
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider>Remember your password?</Divider>

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/login">
                            <Button type="link">Back to Sign In</Button>
                        </Link>
                    </div>
                </Card>
            </Spin>
        </div>
    );
};
