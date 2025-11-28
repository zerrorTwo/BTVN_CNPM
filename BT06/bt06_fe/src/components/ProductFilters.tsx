import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Checkbox, Slider, Button, Row, Col, Space } from 'antd';
import { SearchOutlined, ClearOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { useDebounce } from '../hooks/useDebounce';
import apiClient from '../services/api';

const { Option } = Select;

export interface ProductFilterValues {
    search: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    hasPromotion: boolean;
    sortBy: 'price' | 'views' | 'createdAt';
    sortOrder: 'ASC' | 'DESC';
}

interface ProductFiltersProps {
    onFilterChange: (filters: ProductFilterValues) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange }) => {
    const [searchInput, setSearchInput] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [filters, setFilters] = useState<ProductFilterValues>({
        search: '',
        categoryId: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        hasPromotion: false,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
    });

    const debouncedSearch = useDebounce(searchInput, 500);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.axiosInstance.get('/categories');
                if (response.data.success) {
                    setCategories(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Update filters when debounced search changes
    useEffect(() => {
        setFilters(prev => ({ ...prev, search: debouncedSearch }));
    }, [debouncedSearch]);

    // Notify parent when filters change
    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    const handleClearFilters = () => {
        setSearchInput('');
        setFilters({
            search: '',
            categoryId: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            hasPromotion: false,
            sortBy: 'createdAt',
            sortOrder: 'DESC',
        });
    };

    const toggleSortOrder = () => {
        setFilters(prev => ({
            ...prev,
            sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
        }));
    };

    return (
        <Card
            title="Bộ lọc sản phẩm"
            style={{ marginBottom: 24 }}
            extra={
                <Button
                    icon={<ClearOutlined />}
                    onClick={handleClearFilters}
                    type="link"
                >
                    Xóa bộ lọc
                </Button>
            }
        >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* Search */}
                <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                        Tìm kiếm
                    </label>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Nhập tên sản phẩm..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        allowClear
                        size="large"
                    />
                    {debouncedSearch !== searchInput && (
                        <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                            Đang tìm kiếm...
                        </div>
                    )}
                </div>

                {/* Category */}
                <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                        Danh mục
                    </label>
                    <Select
                        placeholder="Chọn danh mục"
                        value={filters.categoryId}
                        onChange={(value) => setFilters(prev => ({ ...prev, categoryId: value }))}
                        allowClear
                        style={{ width: '100%' }}
                        size="large"
                    >
                        {categories.map(cat => (
                            <Option key={cat.id} value={cat.id}>
                                {cat.name}
                            </Option>
                        ))}
                    </Select>
                </div>

                {/* Price Range */}
                <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                        Khoảng giá
                    </label>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Input
                                type="number"
                                placeholder="Giá tối thiểu"
                                value={filters.minPrice}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    minPrice: e.target.value ? Number(e.target.value) : undefined
                                }))}
                                prefix="₫"
                                size="large"
                            />
                        </Col>
                        <Col span={12}>
                            <Input
                                type="number"
                                placeholder="Giá tối đa"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    maxPrice: e.target.value ? Number(e.target.value) : undefined
                                }))}
                                prefix="₫"
                                size="large"
                            />
                        </Col>
                    </Row>
                </div>

                {/* Promotion Filter */}
                <div>
                    <Checkbox
                        checked={filters.hasPromotion}
                        onChange={(e) => setFilters(prev => ({ ...prev, hasPromotion: e.target.checked }))}
                    >
                        <span style={{ fontWeight: 500 }}>Chỉ hiển thị sản phẩm khuyến mãi</span>
                    </Checkbox>
                </div>

                {/* Sort Options */}
                <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                        Sắp xếp theo
                    </label>
                    <Row gutter={16}>
                        <Col span={18}>
                            <Select
                                value={filters.sortBy}
                                onChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                                style={{ width: '100%' }}
                                size="large"
                            >
                                <Option value="createdAt">Mới nhất</Option>
                                <Option value="price">Giá</Option>
                                <Option value="views">Lượt xem</Option>
                            </Select>
                        </Col>
                        <Col span={6}>
                            <Button
                                icon={filters.sortOrder === 'ASC' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                                onClick={toggleSortOrder}
                                size="large"
                                style={{ width: '100%' }}
                                title={filters.sortOrder === 'ASC' ? 'Tăng dần' : 'Giảm dần'}
                            >
                                {filters.sortOrder === 'ASC' ? 'A-Z' : 'Z-A'}
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Space>
        </Card>
    );
};
