"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { Cart, CartItem, Props } from "@credi/models";
import { fetcher, socket } from "@credi/utils";
import { Spin } from "antd";
import { createContext, useEffect, useState } from "react";
import useSWR from "swr";

export const DataContext = createContext<Cart>({ userId: "", items: [] });

const DataCartProvider = ({ children, userId }: Props) => {
  const [cart, setCart] = useState<Cart>({ userId, items: [] });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
      method: "POST",
      body: JSON.stringify({
        userId,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((value) => {
        return value.json();
      })
      .then((value: Cart) => {
        setCart(value);
      });
  }, [userId]);

  useEffect(() => {
    socket.on(`cart-add-${userId}`, (item: CartItem) => {
      setCart({
        ...cart,
        items: [...cart.items, item],
      });
    });

    socket.on(`cart-reset-${userId}`, (cart: Cart) => {
      setCart({
        ...cart,
      });
    });

    socket.on(`cart-update-${userId}`, (updatedItem: CartItem) => {
      const updateItems = cart.items.map((item) => {
        if (item.productId === updatedItem.productId) {
          return {
            ...item,
            ...updatedItem,
          };
        }
        return item;
      });
      setCart({
        ...cart,
        items: updateItems,
      });
    });

    socket.on(`cart-remove-${userId}`, (productId: string) => {
      const newCart = {
        ...cart,
        items: cart.items.filter((item) => item.productId !== productId),
      };
      setCart(newCart);
    });
  }, [userId, cart]);

  return <DataContext.Provider value={cart!}>{children}</DataContext.Provider>;
};

export default DataCartProvider;
