export interface Store {
  id: string;
  name: string;
  address: string;
  email: string;
  hotline: string;
  taxCode: string;
  image: string | null;
  mapLocation: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStorePayload {
  name: string;
  address: string;
  email: string;
  hotline: string;
  taxCode: string;
  image?: string | null;
  mapLocation?: string | null;
}

export interface UpdateStorePayload {
  name?: string;
  address?: string;
  email?: string;
  hotline?: string;
  taxCode?: string;
  image?: string | null;
  mapLocation?: string | null;
  isActive?: boolean;
}
