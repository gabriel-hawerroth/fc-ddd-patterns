import { v4 as uuid } from "uuid";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";

interface OrderProps {
  customerId: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
}

export default class OrderFactory {
  public static create(orderProps: OrderProps): Order {
    const items = orderProps.items.map(
      (item) =>
        new OrderItem(
          uuid(),
          item.productName,
          item.price,
          item.productId,
          item.quantity
        )
    );

    return new Order(uuid(), orderProps.customerId, items);
  }
}
