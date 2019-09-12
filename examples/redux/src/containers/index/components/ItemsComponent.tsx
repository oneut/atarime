import * as React from "react";
import { Link, URL } from "async-react-router2";
import { Item } from "../../../models/Item";
import { ActionsInterface } from "../configureModule";
import { ItemComponent } from "./ItemComponent";

interface Props {
  items: Item[];
  actions: ActionsInterface;
}

export function ItemsComponent(props: Props) {
  const items = props.items;

  const itemComponents = items.map((item) => (
    <ItemComponent key={item.id} item={item} />
  ));

  return (
    <div>
      <ul className="list-unstyled">{itemComponents}</ul>
      <h3>
        <Link to={URL.name("NewsPage", { page: 2 })}>more</Link>
      </h3>
    </div>
  );
}
