import { Item } from './';

export interface User extends Item {
  firstName: string;
  lastName: string;
  email: string;
  scopes: string[];
  active: boolean;
}
