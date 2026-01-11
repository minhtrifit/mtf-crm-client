export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  imageUrl: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  imageUrl?: string;
  isActive?: boolean;
}
