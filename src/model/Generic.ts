export interface Item {
  /**
   * @primary
   */
  id: string;
  createdBy: string;
  createdOn: Date;
  updatedBy: string;
  updatedOn: Date;
}

export interface Restricted {
  scope?: string;
  validFrom?: Date;
  validTo?: Date;
  hidden?: boolean;
  locked?: boolean;
}
