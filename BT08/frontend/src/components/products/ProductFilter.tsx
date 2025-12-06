import React from 'react';
import { Card, Input, Select, Space, Typography, Divider, Button, Slider } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { useGetCategoriesQuery } from '../../store/api';

const { Title } = Typography;

export interface FilterValues {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
}

interface ProductFilterProps {
    filters: FilterValues;
    onFilterChange: (filters: FilterValues) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({ filters, onFilterChange }) => {
    const { data: categories = [] } = useGetCategoriesQuery();
    const [localFilters, setLocalFilters] = React.useState<FilterValues>(filters);

    React.useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleApplyFilters = () => {
        onFilterChange(localFilters);
    };

    const handleClearFilters = () => {
        const empty: FilterValues = {};
        setLocalFilters(empty);
        onFilterChange(empty);
    };

    return (
        <Card title={<><FilterOutlined /> Filters</>}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Search */}
                <div>
                    <Title level={5}>Search</Title>
                    <Input
                        placeholder="Search products..."
                        prefix={<SearchOutlined />}
                        value={localFilters.search || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                        onPressEnter={handleApplyFilters}
                    />
                </div>

                <Divider />

                {/* Category */}
                <div>
                    <Title level={5}>Category</Title>
                    <Select
                        placeholder="All Categories"
                        style={{ width: '100%' }}
                        value={localFilters.categoryId}
                        onChange={(value) => setLocalFilters({ ...localFilters, categoryId: value })}
                        allowClear
                    >
                        {categories.map((cat) => (
                            <Select.Option key={cat.id} value={cat.id}>
                                {cat.name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                <Divider />

                {/* Price Range */}
                <div>
                    <Title level={5}>Price Range</Title>
                    <Slider
                        range
                        min={0}
                        max={1000}
                        step={10}
                        value={[localFilters.minPrice || 0, localFilters.maxPrice || 1000]}
                        onChange={(value) => setLocalFilters({
                            ...localFilters,
                            minPrice: value[0],
                            maxPrice: value[1]
                        })}
                        tooltip={{ formatter: (value) => `$${value}` }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>${localFilters.minPrice || 0}</span>
                        <span>${localFilters.maxPrice || 1000}</span>
                    </div>
                </div>

                <Divider />

                {/* Sort */}
                <div>
                    <Title level={5}>Sort By</Title>
                    <Select
                        placeholder="Default"
                        style={{ width: '100%' }}
                        value={localFilters.sortBy}
                        onChange={(value) => setLocalFilters({ ...localFilters, sortBy: value })}
                        allowClear
                    >
                        <Select.Option value="PRICE_ASC">Price: Low to High</Select.Option>
                        <Select.Option value="PRICE_DESC">Price: High to Low</Select.Option>
                        <Select.Option value="NAME_ASC">Name: A to Z</Select.Option>
                        <Select.Option value="NAME_DESC">Name: Z to A</Select.Option>
                        <Select.Option value="NEWEST">Newest First</Select.Option>
                    </Select>
                </div>

                <Divider />

                {/* Action Buttons */}
                <Space style={{ width: '100%' }}>
                    <Button type="primary" icon={<FilterOutlined />} onClick={handleApplyFilters} block>
                        Apply
                    </Button>
                    <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
                        Clear
                    </Button>
                </Space>
            </Space>
        </Card>
    );
};

export default ProductFilter;
