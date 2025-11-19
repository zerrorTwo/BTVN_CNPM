import React, { useState } from "react";
import { ShopLayout } from "../components/ShopLayout";
import ProductList from "../components/ProductList";

const ProductsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");

    const handleSearch = (value: string) => {
        setSearchQuery(value);
    };

    return (
        <ShopLayout onSearch={handleSearch}>
            <ProductList searchQuery={searchQuery} />
        </ShopLayout>
    );
};

export default ProductsPage;
