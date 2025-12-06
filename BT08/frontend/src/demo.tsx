import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { message } from 'antd';
import { store } from './store';
import { ProductsPage } from './pages/ProductsPage';
import ProductDetailExample from './pages/ProductDetailExample';
import FavoritesPageExample from './pages/FavoritesPageExample';
import 'antd/dist/reset.css';
import './styles/index.css';

const App = () => {
    // For demo, using userId = 1
    const userId = 1;

    const handleLogout = () => {
        message.success('Logged out successfully');
        // In real app, clear auth tokens and redirect to login
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProductsPage userId={userId} onLogout={handleLogout} />} />
                <Route path="/product/:id" element={<ProductDetailExample userId={userId} />} />
                <Route path="/favorites" element={<FavoritesPageExample userId={userId} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>
    );
}
