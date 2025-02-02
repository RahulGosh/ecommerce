import React, { createContext, useState, ReactNode, useEffect } from "react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
}

interface SearchContextType {
  search: string;
  setSearch: (query: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);

interface SearchContextProviderProps {
  children: ReactNode;
}

export const SearchContextProvider: React.FC<SearchContextProviderProps> = ({
  children,
}) => {
  const [search, setSearch] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem._id === item._id && cartItem.size === item.size
      );
      console.log(cartItems, "cartItems");
      console.log(existingItem, "existingItems");
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem._id === item._id && cartItem.size === item.size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      console.log(prevCart, "prevCart");
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  

  useEffect(() => {
    console.log("Cart items:", cartItems);
  }, [cartItems]);

  const value = {
    search, // Corrected to match the variable name
    setSearch, // Corrected to match the function name
    showSearch,
    setShowSearch,
    cart: cartItems,
    addToCart,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
