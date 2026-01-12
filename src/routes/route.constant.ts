export const WEBSITE_ROUTE = {
  HOME: '/',
  LOGIN: '/xac-thuc/dang-nhap',
  REGISTER: '/xac-thuc/dang-ky',
  FORBIDDEN: '/xac-thuc/khong-co-quyen-truy-cap',
  PRODUCTS: '/san-pham',
  PRODUCT: '/san-pham/:slug',
  CATEGORY: '/danh-muc/:slug',
  CHECKOUT: '/thanh-toan',
};

export const ADMIN_ROUTE = {
  HOME: '/admin',

  CATEGORY: 'category',
  CATEGORY_ADD: 'add',
  CATEGORY_DETAIL: 'detail/:id',
  CATEGORY_EDIT: 'edit/:id',

  PRODUCT: 'product',
  PRODUCT_ADD: 'add',
  PRODUCT_DETAIL: 'detail/:id',
  PRODUCT_EDIT: 'edit/:id',

  ORDER: 'order',
  ORDER_ADD: 'add',
  ORDER_DETAIL: 'detail/:id',
  ORDER_EDIT: 'edit/:id',

  USER: 'user',
  USER_ADD: 'add',
  USER_DETAIL: 'detail/:id',
  USER_EDIT: 'edit/:id',

  CUSTOMER: 'customer',
  CUSTOMER_ADD: 'add',
  CUSTOMER_DETAIL: 'detail/:id',
  CUSTOMER_EDIT: 'edit/:id',
};
