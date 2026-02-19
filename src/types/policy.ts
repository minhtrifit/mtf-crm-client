export interface Policy {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePolicyPayload {
  title: string;
  slug: string;
  content: string;
}

export interface UpdatePolicyPayload {
  title?: string;
  slug?: string;
  content?: string;
}
