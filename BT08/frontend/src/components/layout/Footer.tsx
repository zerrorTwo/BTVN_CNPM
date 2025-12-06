import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import { GithubOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

export const Footer: React.FC = () => {
    return (
        <AntFooter style={{
            background: '#001529',
            padding: '24px 50px',
            textAlign: 'center'
        }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#fff' }}>Shopping Cart Library</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
                        A modern, reusable shopping cart component library
                    </Text>
                </Space>

                <Divider style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '12px 0' }} />

                <Space size="large">
                    <Link href="https://github.com" target="_blank" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        <GithubOutlined /> GitHub
                    </Link>
                    <Link href="mailto:support@example.com" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        <MailOutlined /> Contact
                    </Link>
                    <Link href="tel:+1234567890" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        <PhoneOutlined /> Support
                    </Link>
                </Space>

                <Divider style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '12px 0' }} />

                <Text style={{ color: 'rgba(255,255,255,0.45)' }}>
                    © {new Date().getFullYear()} Shopping Cart Library. All rights reserved.
                </Text>
            </Space>
        </AntFooter>
    );
};

export default Footer;
