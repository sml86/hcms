import { Navigation } from './Navigation';

export interface NavigationResult {
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
   * scope
   * @type VARCHAR(256)
   */
  scope: string | null;
  /**
   * valid_from
   * @type TIMESTAMP
   */
  valid_from: string | null;
  /**
   * valid_to
   * @type VARCHAR(256)
   */
  valid_to: string | null;
  /**
   * hidden
   * @type INT(1)
   */
  hidden: number | null;
  /**
   * locked
   * @type INT(1)
   */
  locked: number | null;
  /**
   * title
   * @type VARCHAR(256)
   */
  title: string;
  /**
   * subtitle
   * @type VARCHAR(256)
   */
  subtitle: string | null;
  /**
   * path
   * @type VARCHAR(256)
   */
  path: string | null;
  /**
   * url
   * @type VARCHAR(256)
   */
  url: string | null;
  /**
   * action
   * @type VARCHAR(256)
   */
  action: string | null;
  /**
   * icon
   * @type VARCHAR(256)
   */
  icon: string | null;
  /**
   * parent
   * @type VARCHAR(256)
   */
  parent: string | null;
}

export function transformNavigationResult(result: NavigationResult): Navigation {
  return {
    id: result.id,
    createdBy: result.created_by,
    createdOn: new Date(result.created_on),
    updatedBy: result.updated_by,
    updatedOn: new Date(result.updated_on),
    scope: result.scope ?? undefined,
    validFrom: result.valid_from ? new Date(result.valid_from) : undefined,
    validTo: result.valid_to ? new Date(result.valid_to) : undefined,
    hidden: !!result.hidden,
    locked: !!result.locked,
    title: result.title,
    subtitle: result.subtitle ?? undefined,
    path: result.path ?? undefined,
    url: result.url ?? undefined,
    action: result.action ?? undefined,
    icon: result.icon ?? undefined,
    parent: result.parent ?? undefined,
  };
}

export const navigationFields: string[] = ['id', 'created_by', 'created_on', 'updated_by', 'updated_on', 'scope', 'valid_from', 'valid_to', 'hidden', 'locked', 'title', 'subtitle', 'path', 'url', 'action', 'icon', 'parent'];

export type NavigationResultSet = NavigationResult[];

export type NavigationInsert = [string, string, string, string, string, string, string];

export const selectNavigationSql: string = `SELECT ${navigationFields.join(',')} FROM navigation`;

export const insertNavigationSql: string = `INSERT INTO navigation (${navigationFields.join(',')}) VALUES (${navigationFields.map(() => '?').join(',')}`;
