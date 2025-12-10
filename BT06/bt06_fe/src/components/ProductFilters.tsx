import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Button, Row, Col, Space } from 'antd';
import { SearchOutlined, ClearOutlined, SortAscendingOutlined, SortDescendingOutlined, FilterOutlined } from '@ant-design/icons';
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
    initialFilters?: ProductFilterValues;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange, initialFilters }) => {
    const [searchInput, setSearchInput] = useState(initialFilters?.search || '');
    const [categories, setCategories] = useState<any[]>([]);

    // Local state for all filters (not applied yet)
    const [localFilters, setLocalFilters] = useState<ProductFilterValues>(initialFilters || {
        search: '',
        categoryId: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        hasPromotion: false,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
    });

    // Applied filters (sent to parent)
    const [appliedFilters, setAppliedFilters] = useState<ProductFilterValues>(localFilters);

    // Update filters when initialFilters change (from URL params)
    useEffect(() => {
        if (initialFilters) {
            setLocalFilters(initialFilters);
            setAppliedFilters(initialFilters);
            setSearchInput(initialFilters.search || '');
        }
    }, [initialFilters]);

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

    // Notify parent when applied filters change
    useEffect(() => {
        onFilterChange(appliedFilters);
    }, [appliedFilters, onFilterChange]);

    const handleApplyFilters = () => {
        setAppliedFilters({ ...localFilters, search: searchInput });
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleApplyFilters();
        }
    };

    const handleClearFilters = () => {
        const defaultFilters = {
            search: '',
            categoryId: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            hasPromotion: false,
            sortBy: 'createdAt' as const,
            sortOrder: 'DESC' as const,
        };
        setSearchInput('');
        setLocalFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
    };

    const toggleSortOrder = () => {
        setLocalFilters(prev => ({
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
                        onKeyPress={handleSearchKeyPress}
                        allowClear
                        size="large"
                    />
                </div>

                {/* Category */}
                <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                        Danh mục
                    </label>
                    <Select
                        placeholder="Chọn danh mục"
                        value={localFilters.categoryId}
                        onChange={(value) => setLocalFilters(prev => ({ ...prev, categoryId: value }))}
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
                                value={localFilters.minPrice}
                                onChange={(e) => setLocalFilters(prev => ({
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
                                value={localFilters.maxPrice}
                                onChange={(e) => setLocalFilters(prev => ({
                                    ...prev,
                                    maxPrice: e.target.value ? Number(e.target.value) : undefined
                                }))}
                                prefix="₫"
                                size="large"
                            />
                        </Col>
                    </Row>
                </div>

                {/* Sort Options */}
                <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                        Sắp xếp theo
                    </label>
                    <Row gutter={16}>
                        <Col span={18}>
                            <Select
                                value={localFilters.sortBy}
                                onChange={(value) => setLocalFilters(prev => ({ ...prev, sortBy: value }))}
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
                                icon={localFilters.sortOrder === 'ASC' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                                onClick={toggleSortOrder}
                                size="large"
                                style={{ width: '100%' }}
                                title={localFilters.sortOrder === 'ASC' ? 'Tăng dần' : 'Giảm dần'}
                            >
                                {localFilters.sortOrder === 'ASC' ? 'A-Z' : 'Z-A'}
                            </Button>
                        </Col>
                    </Row>
                </div>

                {/* Apply Button */}
                <Button
                    type="primary"
                    size="large"
                    icon={<FilterOutlined />}
                    onClick={handleApplyFilters}
                    block
                    style={{ marginTop: 8 }}
                >
                    Áp dụng bộ lọc
                </Button>
            </Space>
        </Card>
    );
};
