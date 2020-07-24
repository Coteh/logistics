import { UserType } from '../type/UserType';
import Model from './Model';

export default class User extends Model {
  public id: number;
  public type: UserType;

  constructor(id: number, type: UserType) {
    super();
    this.id = id;
    this.type = type;
  }
}
