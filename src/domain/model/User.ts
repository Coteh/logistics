import { UserType } from '../type/UserType';
import Model from './Model';

/**
 * Model that represents a user
 */
export default class User extends Model {
  public id: number;
  public type: UserType;
  public name: string;

  constructor(id: number, type: UserType, name?: string) {
    super();
    this.id = id;
    this.type = type;
    this.name = name || 'default';
  }
}
