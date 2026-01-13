export const DEFAULT_PAGE_SIZE = 5;
export const DEFAULT_CURRENT_PAGE = 1;
export const AUTHORIZATION_HEADER = 'Authentication';
export const AUTHORIZATION_BEARER = 'Bearer';
export const AUTHORIZATION_BASIC = 'Basic';
export const FILL_OUT_THIS_FILED_MESSAGE = 'Please fill out this field';
export const DATE_FORMAT = 'dd/MM/yyyy';
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export enum PaymentMethod {
  COD = 'COD',
  VNPAY = 'VNPAY',
}
export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}
export enum DeliveryStatus {
  ORDERED = 'ORDERED', // đã đặt hàng
  CONFIRMED = 'CONFIRMED', // đã xác nhận đơn hàng
  PREPARING = 'PREPARING', // đang chuẩn bị hàng
  SHIPPING = 'SHIPPING', // đang vận chuyển
  DELIVERED = 'DELIVERED', // giao hàng thành công
}
export enum VnPayResponseCode {
  SUCCESS = '00',
  // Giao dịch thành công

  SUCCESS_SUSPECT = '07',
  // Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).

  FAILED_NOT_REGISTERED_INTERNET_BANKING = '09',
  // Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.

  FAILED_AUTHENTICATION_EXCEEDED = '10',
  // Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần

  FAILED_PAYMENT_TIMEOUT = '11',
  // Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.

  FAILED_ACCOUNT_LOCKED = '12',
  // Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.

  FAILED_INVALID_OTP = '13',
  // Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.

  FAILED_CUSTOMER_CANCELLED = '24',
  // Giao dịch không thành công do: Khách hàng hủy giao dịch

  FAILED_INSUFFICIENT_BALANCE = '51',
  // Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.

  FAILED_DAILY_LIMIT_EXCEEDED = '65',
  // Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.

  FAILED_BANK_MAINTENANCE = '75',
  // Ngân hàng thanh toán đang bảo trì.

  FAILED_WRONG_PAYMENT_PASSWORD_EXCEEDED = '79',
  // Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch

  FAILED_UNKNOWN_ERROR = '99',
  // Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)
}
