# BT08 Frontend - New Features Usage Guide

## Overview

BT08 frontend includes 5 new components to enhance the shopping cart experience:

1. **F favoriteButton** - Toggle favorite products
2. **ProductStats** - Display product analytics
3. **SimilarProducts** - Show related products
4. **ViewedProducts** - Display recently viewed products
5. **CommentSection** - Product reviews and ratings

## Installation

```bash
cd frontend
npm install
```

This will install the new dependency `dayjs` required for the CommentSection component.

## Component Usage

### 1. FavoriteButton

Toggle favorite status for a product:

```tsx
import { FavoriteButton } from "./components/FavoriteButton";

<FavoriteButton
  productId={123}
  isFavorite={true}
  userId={1}
  onToggle={() => refetch()} // Refresh data after toggle
  size="middle" // 'small' | 'middle' | 'large'
/>;
```

### 2. ProductStats

Display purchase count, comment count, and average rating:

```tsx
import { ProductStats } from "./components/ProductStats";

<ProductStats
  purchaseCount={45}
  commentCount={12}
  averageRating={4.5}
  size="default" // 'small' | 'default'
/>;
```

### 3. SimilarProducts

Show products in the same category:

```tsx
import { SimilarProducts } from "./components/SimilarProducts";

<SimilarProducts productId={123} userId={1} limit={6} />;
```

### 4. ViewedProducts

Display user's recently viewed products:

```tsx
import { ViewedProducts } from "./components/ViewedProducts";

<ViewedProducts userId={1} limit={10} />;
```

### 5. CommentSection

Full-featured comment system with ratings:

```tsx
import { CommentSection } from "./components/CommentSection";

<CommentSection
  productId={123}
  userId={1}
  averageRating={4.5}
  commentCount={12}
/>;
```

## GraphQL Integration

All components use the following GraphQL operations:

### Queries

- `GET_PRODUCTS` - Enhanced with isFavorite, purchaseCount, commentCount, averageRating
- `GET_FAVORITES` - Get user's favorite products
- `GET_VIEWED_PRODUCTS` - Get recently viewed products
- `GET_SIMILAR_PRODUCTS` - Get products in same category
- `GET_COMMENTS` - Get all comments for a product

### Mutations

- `ADD_FAVORITE` - Mark product as favorite
- `REMOVE_FAVORITE` - Remove from favorites
- `TRACK_PRODUCT_VIEW` - Record product view
- `ADD_COMMENT` - Add new comment
- `UPDATE_COMMENT` - Update existing comment
- `DELETE_COMMENT` - Delete comment

## Complete Example

See `ProductDetailExample.tsx` for a complete integration example:

```tsx
import { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { TRACK_PRODUCT_VIEW } from "./graphql/mutations";
import FavoriteButton from "./components/FavoriteButton";
import ProductStats from "./components/ProductStats";
import SimilarProducts from "./components/SimilarProducts";
import CommentSection from "./components/CommentSection";

const ProductDetail = ({ productId, userId }) => {
  const [trackView] = useMutation(TRACK_PRODUCT_VIEW);

  // Track view on mount
  useEffect(() => {
    trackView({ variables: { userId, productId } });
  }, [productId, userId]);

  return (
    <div>
      {/* Product info */}
      <FavoriteButton
        productId={productId}
        isFavorite={false}
        userId={userId}
      />
      <ProductStats purchaseCount={10} commentCount={5} averageRating={4.2} />

      {/* Similar products */}
      <SimilarProducts productId={productId} userId={userId} />

      {/* Comments */}
      <CommentSection
        productId={productId}
        userId={userId}
        averageRating={4.2}
        commentCount={5}
      />
    </div>
  );
};
```

## Features

### Favorites

- Heart icon button (filled when favorited)
- Instant feedback with success/error messages
- Automatic refetch support

### Product Stats

- Icons for purchase count, comments, rating
- Tooltips for better UX
- Optional average rating display

### Similar Products

- Responsive grid layout (up to 6 products)
- Favorite button on each product
- Product stats on cards

### Recently Viewed

- Automatically updated when viewing products
- Deduplicates views (shows each product once)
- Chronological order (most recent first)

### Comments

- Star rating (1-5)
- Add/Edit/Delete comments
- User information display
- Relative timestamps ("2 hours ago")
- Edit indicator for modified comments
- Owner-only edit/delete

## Running the App

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## Dependencies

- `@apollo/client` - GraphQL client
- `antd` - UI components
- `dayjs` - Date formatting
- `react-router-dom` - Routing
- `graphql` - GraphQL support

## Notes

- All components require a userId to function properly
- Login is checked before allowing favorites/comments
- GraphQL backend must be running at the configured endpoint
- Components are fully responsive
- All mutations include error handling with user messages
