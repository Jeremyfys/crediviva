export interface Cart {
  userId: string;
  items: CartItem[];
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}
