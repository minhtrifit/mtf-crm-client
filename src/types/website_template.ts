import { Product } from './product';

export interface SectionItemType {
  id: string;
  productId: string;
  product: Product;
  position: number;
}

export interface SectionType {
  id: string;
  title: string;
  position: number;
  items: SectionItemType[];
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  primaryColor: string;
  logoUrl: string;
  bannersUrl: string[];
  isActibe: boolean;

  sections: SectionType[];
}

export interface CreateWebsiteTemplatePayload {
  name: string;
  primaryColor: string;
  logoUrl: string;
  bannersUrl: string[];
  isActive: boolean;
  sections: SectionType[];
}

export interface UpdateWebsiteTemplatePayload {
  name?: string;
  primaryColor?: string;
  logoUrl?: string;
  bannersUrl?: string[];
  isActive: boolean;
}
