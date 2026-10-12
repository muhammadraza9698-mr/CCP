import useSWR from 'swr';
import { fetcher, endpoints } from './config';

// Products hooks
export const useProducts = () => {
    const { data, error, isLoading, mutate } = useSWR(endpoints.products, fetcher);

    return {
        products: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};

export const useProduct = (id) => {
    const { data, error, isLoading } = useSWR(
        id ? endpoints.product(id) : null,
        fetcher
    );

    return {
        product: data,
        isLoading,
        isError: error,
    };
};

// Cart hooks
export const useCart = () => {
    const { data, error, isLoading, mutate } = useSWR(endpoints.cart, fetcher, {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
    });

    return {
        cart: data,
        isLoading,
        isError: error,
        mutate,
    };
};

// Orders hooks
export const useMyOrders = () => {
    const { data, error, isLoading, mutate } = useSWR(
        endpoints.myOrders,
        fetcher
    );

    return {
        orders: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};

export const useOrder = (id) => {
    const { data, error, isLoading } = useSWR(
        id ? endpoints.order(id) : null,
        fetcher
    );

    return {
        order: data,
        isLoading,
        isError: error,
    };
};

// Admin hooks
export const useAllOrders = () => {
    const { data, error, isLoading, mutate } = useSWR(endpoints.orders, fetcher);

    return {
        orders: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};
