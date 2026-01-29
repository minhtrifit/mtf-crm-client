export const WEBSITE_ROUTE = {
  HOME: '/',
  LOGIN: '/xac-thuc/dang-nhap',
  REGISTER: '/xac-thuc/dang-ky',
  FORBIDDEN: '/xac-thuc/khong-co-quyen-truy-cap',
  PRODUCTS: '/san-pham',
  PRODUCT: '/san-pham/:slug',
  CATEGORY: '/danh-muc/:slug',
  CHECKOUT: '/thanh-toan',
  PROFILE: '/ho-so',
  ORDERS: '/ho-so/don-hang',
  SEARCH: '/tim-kiem',
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

  PAYMENT: 'payment',
  PAYMENT_ADD: 'add',
  PAYMENT_DETAIL: 'detail/:id',
  PAYMENT_EDIT: 'edit/:id',

  USER: 'user',
  USER_ADD: 'add',
  USER_DETAIL: 'detail/:id',
  USER_EDIT: 'edit/:id',

  WEBSITE_TEMPLATE: 'website-template',
  WEBSITE_TEMPLATE_ADD: 'add',
  WEBSITE_TEMPLATE_DETAIL: 'detail/:id',
  WEBSITE_TEMPLATE_EDIT: 'edit/:id',
};
