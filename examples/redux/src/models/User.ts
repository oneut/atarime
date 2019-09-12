import { UserAttributesInterface } from "../attributes/UserAttributes";

interface ItemType {
  id: string;
  karma: number;
  created: number;
}

export class User implements ItemType {
  readonly id: string;
  readonly karma: number;
  readonly created: number;

  constructor(user: UserAttributesInterface) {
    this.id = user.id;
    this.karma = user.karma;
    this.created = user.created;
  }
}
