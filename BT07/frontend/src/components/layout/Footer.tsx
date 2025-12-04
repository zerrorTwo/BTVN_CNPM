import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import { GithubOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import './Footer.css';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

export const Footer: React.FC = () => {
    return (
        <AntFooter className="cart-library-footer">
            <div className="cart-library-footer-content">
                <Space direction="vertical" size="small" className="footer-section">
                    <Text strong style={{ color: '#fff' }}>Shopping Cart Library</Text>
                    <Text style={{ color: '#rgba(255,255,255,0.65)' }}>
                        A modern, reusable shopping cart component library
                    </Text>
                </Space>

                <Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

                <Space size="large" className="footer-links">
                    <Link href="https://github.com" target="_blank" style={{ color: '#rgba(255,255,255,0.85)' }}>
                        <GithubOutlined /> GitHub
                    </Link>
                    <Link href="mailto:support@example.com" style={{ color: '#rgba(255,255,255,0.85)' }}>
                        <MailOutlined /> Contact
                    </Link>
                    <Link href="tel:+1234567890" style={{ color: '#rgba(255,255,255,0.85)' }}>
                        <PhoneOutlined /> Support
                    </Link>
                </Space>

                <Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

                <Text style={{ color: '#rgba(255,255,255,0.45)' }}>
                    © {new Date().getFullYear()} Shopping Cart Library. All rights reserved.
                </Text>
            </div>
        </AntFooter>
    );
};

export default Footer;
