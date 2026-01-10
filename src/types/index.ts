export interface PagingType {
  current_page: number;
  total_item: number;
  total_page: number;
  total: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}
