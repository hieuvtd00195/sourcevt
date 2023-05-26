export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatar: string | null;
  mobile: string;
  roles: [];
}
