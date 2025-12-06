import React from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useAddFavoriteMutation, useRemoveFavoriteMutation } from '../store/api';

interface FavoriteButtonProps {
    productId: number;
    isFavorite: boolean;
    userId?: number;
    size?: 'small' | 'middle' | 'large';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    productId,
    isFavorite,
    userId,
    size = 'middle',
}) => {
    const [addFavorite, { isLoading: adding }] = useAddFavoriteMutation();
    const [removeFavorite, { isLoading: removing }] = useRemoveFavoriteMutation();

    const handleToggle = async () => {
        if (!userId) {
            message.warning('Please login to add favorites');
            return;
        }

        try {
            if (isFavorite) {
                await removeFavorite({ userId, productId }).unwrap();
                message.success('Removed from favorites');
            } else {
                await addFavorite({ userId, productId }).unwrap();
                message.success('Added to favorites');
            }
        } catch (error: any) {
            message.error(error?.data?.error || 'Failed to update favorites');
        }
    };

    return (
        <Button
            type={isFavorite ? 'primary' : 'default'}
            icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
            onClick={handleToggle}
            loading={adding || removing}
            size={size}
            danger={isFavorite}
        />
    );
};

export default FavoriteButton;
