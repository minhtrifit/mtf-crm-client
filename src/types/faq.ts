export interface Faq {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFaqPayload {
  title: string;
  content: string;
}

export interface UpdateFaqPayload {
  title?: string;
  content?: string;
}
