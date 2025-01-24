export type UserProfile = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  isAdmin: boolean | null;
  isCustomer: boolean | null;
};
