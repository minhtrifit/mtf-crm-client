import { Product } from './product';
import { MediaType } from '@/+core/constants/commons.constant';

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

export interface TemplateMediaType {
  id: string;
  type: MediaType;
  url: string;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  primaryColor: string;
  logoUrl: string;
  bannersUrl: string[];
  email: string;
  phone: string;
  footerDescription: string;
  isActibe: boolean;
  medias: TemplateMediaType[];
  sections: SectionType[];
}

export interface CreateWebsiteTemplatePayload {
  name: string;
  primaryColor: string;
  logoUrl: string;
  bannersUrl: string[];
  email: string;
  phone: string;
  footerDescription: string;
  isActive: boolean;
  sections: SectionType[];
}

export interface UpdateWebsiteTemplatePayload {
  name?: string;
  primaryColor?: string;
  logoUrl?: string;
  bannersUrl?: string[];
  email?: string;
  phone?: string;
  footerDescription?: string;
  isActive: boolean;
}
