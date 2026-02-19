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
  FAQ: '/cau-hoi-thuong-gap',
  POLICYS: '/chinh-sach-va-dieu-khoan',
  DETAIL_POLICY: '/chinh-sach-va-dieu-khoan/:slug',
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

  STORE: 'store',
  STORE_ADD: 'add',
  STORE_DETAIL: 'detail/:id',
  STORE_EDIT: 'edit/:id',

  ORDER: 'order',
  ORDER_ADD: 'add',
  ORDER_DETAIL: 'detail/:id',
  ORDER_EDIT: 'edit/:id',

  PAYMENT: 'payment',
  PAYMENT_ADD: 'add',
  PAYMENT_DETAIL: 'detail/:id',
  PAYMENT_EDIT: 'edit/:id',

  REVIEW: 'review',
  REVIEW_ADD: 'add',
  REVIEW_DETAIL: 'detail/:id',
  REVIEW_EDIT: 'edit/:id',

  USER: 'user',
  USER_ADD: 'add',
  USER_DETAIL: 'detail/:id',
  USER_EDIT: 'edit/:id',

  WEBSITE_TEMPLATE: 'website-template',
  WEBSITE_TEMPLATE_ADD: 'add',
  WEBSITE_TEMPLATE_DETAIL: 'detail/:id',
  WEBSITE_TEMPLATE_EDIT: 'edit/:id',

  FAQ: 'faq',
  FAQ_ADD: 'add',
  FAQ_DETAIL: 'detail/:id',
  FAQ_EDIT: 'edit/:id',

  POLICY: 'policy',
  POLICY_ADD: 'add',
  POLICY_DETAIL: 'detail/:id',
  POLICY_EDIT: 'edit/:id',
};
