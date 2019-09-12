import { URL } from "async-react-router2";
import * as timeago from "timeago.js";
import { ItemAttributesInterface } from "../attributes/ItemAttributes";

export class Item {
  readonly by: string;
  readonly descendants: number;
  readonly id: number;
  readonly score: number;
  readonly time: number;
  readonly title: string;
  readonly type: string;
  readonly url: string;
  readonly kids?: any;

  constructor(attributes: ItemAttributesInterface) {
    this.by = attributes.by;
    this.descendants = attributes.descendants;
    this.id = attributes.id;
    this.score = attributes.score;
    this.time = attributes.time;
    this.title = attributes.title;
    this.type = attributes.type;
    this.url = attributes.url;
    this.kids = attributes.kids;
  }

  getUrl() {
    if (this.url) {
      return this.url;
    }

    return URL.name("ItemPage", { itemId: this.id });
  }

  getTimeAgo() {
    return timeago.format(this.time * 1000);
  }
}
