export interface Customer {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
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
