import { Product } from './product';

export interface TotalType {
  total_orders: number;
  total_revenue: number;
  total_users: number;
}

export interface OverviewTotalType extends TotalType {
  total_products: number;
}

export enum ViewType {
  YEAR = 'year',
  QUARTER = 'quarter',
}

export interface OverviewType {
  overview: {
    total_products: number;
    total_orders: number;
    total_users: number;
    total_revenue: number;
  };

  chart:
    | {
        year: number;
        data: {
          month: string; // "1" -> "12"
          orders: number;
          users: number;
          revenue: number;
        }[];
      }
    | {
        year: number;
        quarter: 1 | 2 | 3 | 4;
        data: {
          label: 'Q1' | 'Q2' | 'Q3' | 'Q4';
          orders: number;
          users: number;
          revenue: number;
        };
      };
}

export interface OvertYearChartType {
  year: number;
  data: {
    month: string; // "1" -> "12"
    orders: number;
    users: number;
    revenue: number;
  }[];
}

export interface OvertQuarterChartType {
  year: number;
  quarter: 1 | 2 | 3 | 4;
  data: {
    label: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    orders: number;
    users: number;
    revenue: number;
  };
}

export interface DeliveryStatusType {
  ordered: number;
  confirmed: number;
  preparing: number;
  shipping: number;
  delivered: number;
}

export enum TopSellingType {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export interface TopSellingProductType {
  product: Product;
  soldQuantity: number;
}
