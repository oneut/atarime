import * as timeago from "timeago.js";
import { CommentAttributesInterface } from "../attributes/CommentAttributes";

export class Comment {
  readonly by: string;
  readonly id: number;
  readonly parent: number;
  readonly text: string;
  readonly time: number;
  readonly type: string;
  readonly kids: Comment[];

  constructor(commentAttributes: CommentAttributesInterface) {
    this.by = commentAttributes.by;
    this.id = commentAttributes.id;
    this.parent = commentAttributes.parent;
    this.text = commentAttributes.text;
    this.time = commentAttributes.time;
    this.type = commentAttributes.type;
    this.kids = commentAttributes.kids.map((comment) => new Comment(comment));
  }

  getTimeAgo() {
    return timeago.format(this.time);
  }
}
