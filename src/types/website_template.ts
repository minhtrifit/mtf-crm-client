export interface WebsiteTemplate {
  id: string;
  name: string;
  primaryColor: string;
  logoUrl: string;
  isActibe: boolean;
}

export interface CreateWebsiteTemplatePayload {
  name: string;
  primaryColor: string;
  logoUrl: string;
  isActive: boolean;
}
