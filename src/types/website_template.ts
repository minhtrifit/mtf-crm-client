export interface SectionItemType {
  id: string;
  productId: string;
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
  isActibe: boolean;

  sections: SectionType[];
}

export interface CreateWebsiteTemplatePayload {
  name: string;
  primaryColor: string;
  logoUrl: string;
  isActive: boolean;
  sections: SectionType[];
}

export interface UpdateWebsiteTemplatePayload {
  name?: string;
  primaryColor?: string;
  logoUrl?: string;
  isActive: boolean;
}
