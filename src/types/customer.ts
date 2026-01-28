export interface Customer {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCustomerPayload {
  fullName: string;
  phone: string;
  email: string;
  address: string;
}
