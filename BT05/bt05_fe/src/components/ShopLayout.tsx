import React from "react";
import { Layout, Menu, Badge, Button, Input, Space, Dropdown } from "antd";
import {
    ShoppingCartOutlined,
    UserOutlined,
    HomeOutlined,
    AppstoreOutlined,
    LoginOutlined,
    LogoutOutlined,
    DashboardOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import type { MenuProps } from "antd";
import "./ShopLayout.css";

const { Header, Content, Footer } = Layout;
const { Search } = Input;

interface ShopLayoutProps {
    children: React.ReactNode;
    onSearch?: (value: string) => void;
}

export const ShopLayout: React.FC<ShopLayoutProps> = ({ children, onSearch }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const userMenuItems: MenuProps["items"] = user
        ? [
            {
                key: "dashboard",
                label: <Link to="/dashboard">Dashboard</Link>,
                icon: <DashboardOutlined />,
            },
            {
                key: "logout",
                label: "Đăng xuất",
                icon: <LogoutOutlined />,
                onClick: handleLogout,
            },
        ]
        : [
            {
                key: "login",
                label: <Link to="/login">Đăng nhập</Link>,
                icon: <LoginOutlined />,
            },
            {
                key: "register",
                label: <Link to="/register">Đăng ký</Link>,
                icon: <UserOutlined />,
            },
        ];

    return (
        <Layout className="shop-layout">
            <Header className="shop-header">
                <div className="header-container">
                    <div className="logo" onClick={() => navigate("/")}>
                        <ShoppingCartOutlined style={{ fontSize: "32px", color: "#fff" }} />
                        <span className="logo-text">UTE Shop</span>
                    </div>

                    <div className="header-search">
                        <Search
                            placeholder="Tìm kiếm sản phẩm..."
                            allowClear
                            enterButton="Tìm"
                            size="large"
                            onSearch={onSearch}
                            style={{ width: "100%" }}
                        />
                    </div>

                    <Space className="header-actions" size="large">
                        <Badge count={0} showZero>
                            <Button
                                type="text"
                                icon={<ShoppingCartOutlined style={{ fontSize: "24px", color: "#fff" }} />}
                                size="large"
                            />
                        </Badge>

                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <Button
                                type="text"
                                icon={<UserOutlined style={{ fontSize: "24px", color: "#fff" }} />}
                                size="large"
                            >
                                {user ? user.fullName : "Tài khoản"}
                            </Button>
                        </Dropdown>
                    </Space>
                </div>
            </Header>

            <Header className="shop-navbar">
                <div className="navbar-container">
                    <Menu
                        mode="horizontal"
                        defaultSelectedKeys={["home"]}
                        items={[
                            {
                                key: "home",
                                icon: <HomeOutlined />,
                                label: <Link to="/">Trang chủ</Link>,
                            },
                            {
                                key: "products",
                                icon: <AppstoreOutlined />,
                                label: <Link to="/products">Sản phẩm</Link>,
                            },
                        ]}
                        style={{ flex: 1, minWidth: 0, border: "none" }}
                    />
                </div>
            </Header>

            <Content className="shop-content">
                <div className="content-container">{children}</div>
            </Content>

            <Footer className="shop-footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h3>Về chúng tôi</h3>
                        <p>UTE Shop - Nơi mua sắm trực tuyến uy tín</p>
                    </div>
                    <div className="footer-section">
                        <h3>Liên hệ</h3>
                        <p>Email: info@uteshop.com</p>
                        <p>Phone: 0123-456-789</p>
                    </div>
                    <div className="footer-section">
                        <h3>Chính sách</h3>
                        <p>
                            <Link to="#">Chính sách bảo mật</Link>
                        </p>
                        <p>
                            <Link to="#">Điều khoản sử dụng</Link>
                        </p>
                    </div>
                </div>
                <div className="footer-bottom">UTE Shop ©2025 - Tất cả quyền được bảo lưu</div>
            </Footer>
        </Layout>
    );
};
