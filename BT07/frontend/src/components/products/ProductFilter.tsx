import React, { useState } from 'react';
import { Card, Input, Slider, Select, Space, Typography, Divider, Button } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import './ProductFilter.css';

const { Title } = Typography;
const { Option } = Select;

export interface FilterValues {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
}

interface ProductFilterProps {
    onFilterChange: (filters: FilterValues) => void;
    categories?: Array<{ id: number; name: string }>;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
    onFilterChange,
    categories = []
}) => {
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<number | undefined>();
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [sortBy, setSortBy] = useState<string | undefined>();

    const handleApplyFilters = () => {
        onFilterChange({
            search: search || undefined,
            categoryId,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            sortBy,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setCategoryId(undefined);
        setPriceRange([0, 1000]);
        setSortBy(undefined);
        onFilterChange({});
    };

    return (
        <Card className="product-filter" title={<><FilterOutlined /> Filters</>}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Search */}
                <div>
                    <Title level={5}>Search</Title>
                    <Input
                        placeholder="Search products..."
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                        value={categoryId}
                        onChange={setCategoryId}
                        allowClear
                    >
                        {categories.map((cat) => (
                            <Option key={cat.id} value={cat.id}>
                                {cat.name}
                            </Option>
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
                        value={priceRange}
                        onChange={(value) => setPriceRange(value as [number, number])}
                        tipFormatter={(value) => `$${value}`}
                    />
                    <div className="price-range-labels">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </div>

                <Divider />

                {/* Sort */}
                <div>
                    <Title level={5}>Sort By</Title>
                    <Select
                        placeholder="Default"
                        style={{ width: '100%' }}
                        value={sortBy}
                        onChange={setSortBy}
                        allowClear
                    >
                        <Option value="PRICE_ASC">Price: Low to High</Option>
                        <Option value="PRICE_DESC">Price: High to Low</Option>
                        <Option value="NAME_ASC">Name: A to Z</Option>
                        <Option value="NAME_DESC">Name: Z to A</Option>
                        <Option value="NEWEST">Newest First</Option>
                    </Select>
                </div>

                <Divider />

                {/* Action Buttons */}
                <Space style={{ width: '100%' }}>
                    <Button type="primary" icon={<FilterOutlined />} onClick={handleApplyFilters} block>
                        Apply Filters
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
