export { Input } from "./components/base/Input";
export { Button } from "./components/base/Button";
export { Modal } from "./components/base/Modal";
export { Card } from "./components/base/Card";

export { Header } from "./components/layout/Header";
export { Footer } from "./components/layout/Footer";

export { CartItem } from "./components/cart/CartItem";
export { CartSummary } from "./components/cart/CartSummary";
export { CartModal } from "./components/cart/CartModal";
export { AddToCartButton } from "./components/cart/AddToCartButton";

export { ProductCard } from "./components/products/ProductCard";
export { ProductFilter } from "./components/products/ProductFilter";
export type { FilterValues } from "./components/products/ProductFilter";

export { ProductsPage } from "./pages/ProductsPage";

export { GET_CART, GET_PRODUCTS } from "./graphql/queries";
export {
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_CART_ITEM,
  REMOVE_MULTIPLE_ITEMS,
  SELECT_ITEMS_FOR_CHECKOUT,
  CLEAR_CART,
} from "./graphql/mutations";

export type { Product, CartItem as CartItemType, Cart } from "./types";

import "./styles/index.css";
