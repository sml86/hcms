import { User } from './';

export interface UserResult {
  /**
   * id
   * @type VARCHAR(256)
   */
  id: string;
  /**
   * created_by
   * @type VARCHAR(256)
   */
  created_by: string;
  /**
   * created_on
   * @type TIMESTAMP
   */
  created_on: string;
  /**
   * updated_by
   * @type VARCHAR(256)
   */
  updated_by: string;
  /**
   * updated_on
   * @type TIMESTAMP
   */
  updated_on: string;
  /**
   * first_name
   * @type VARCHAR(256)
   */
  first_name: string;
  /**
   * last_name
   * @type VARCHAR(256)
   */
  last_name: string;
  /**
   * email
   * @type VARCHAR(256)
   */
  email: string;
  /**
   * password
   * @type VARCHAR(256)
   */
  password: string;
  /**
   * active
   * @type INT(1)
   */
  active: number;
  /**
   * scopes
   * @type VARCHAR(256)
   */
  scopes: string;
}

export function transformUserResult(result: UserResult): User {
  return {
    id: result.id,
    createdBy: result.created_by,
    createdOn: new Date(result.created_on),
    updatedBy: result.updated_by,
    updatedOn: new Date(result.updated_on),
    firstName: result.first_name,
    lastName: result.last_name,
    email: result.email,
    scopes: result.scopes.split(' ').map((scope) => scope.trim()),
    active: !!result.active,
  };
}

export const schema = 'public';

export const userFields: string[] = ['id', 'created_by', 'created_on', 'updated_by', 'updated_on', 'first_name', 'last_name', 'email', 'active', 'scopes'];

export type UserResultSet = UserResult[];

export type UserInsert = [string, string, string, string, boolean];

export const selectUserSql: string = `SELECT ${userFields.join(',')} FROM ${schema}.user`;

export const insertUserSql: string = 'INSERT INTO user (first_name, last_name, email, password, active) VALUES (?, ?, ?, ?, ?)';
