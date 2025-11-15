import { Form, Input, Button, Card, message, Typography, Spin } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../services/api';
import { ResetPasswordFormData } from '../types';
import { useState } from 'react';
import './AuthPages.css';

const { Title, Text } = Typography;

export const ResetPasswordPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const token = searchParams.get('token');

    if (!token) {
        return (
            <div className="auth-container">
                <Card className="auth-card" style={{ textAlign: 'center' }}>
                    <Title level={3}>Invalid Reset Link</Title>
                    <Text>The reset link is invalid or has expired.</Text>
                    <Button type="primary" onClick={() => navigate('/forgot-password')} style={{ marginTop: '20px' }}>
                        Request New Link
                    </Button>
                </Card>
            </div>
        );
    }

    const onFinish = async (values: ResetPasswordFormData) => {
        try {
            setLoading(true);
            await apiClient.resetPassword({ ...values, token });
            message.success('Password reset successfully! Redirecting to login...');
            form.resetFields();
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to reset password');
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
                            Enter your new password
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
                            name="password"
                            label="New Password"
                            rules={[
                                { required: true, message: 'Please enter your new password' },
                                { min: 6, message: 'Password must be at least 6 characters' },
                                {
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                    message: 'Password must contain uppercase, lowercase, and numbers',
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
                                placeholder="Confirm your new password"
                                prefix={<LockOutlined />}
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                                Reset Password
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Spin>
        </div>
    );
};
