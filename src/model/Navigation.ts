import { Item, Restricted } from './Generic';

export interface Navigation extends Item, Restricted {
  title: string;
  subtitle?: string;
  path?: string;
  url?: string;
  action?: string;
  icon?: string;
  /**
   * @key
   */
  parent?: string;
}
