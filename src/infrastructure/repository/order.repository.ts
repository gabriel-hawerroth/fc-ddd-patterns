import OrderItemModel from "@infrastructure/db/sequelize/model/order-item.model";
import OrderModel from "@infrastructure/db/sequelize/model/order.model";
import Order from "@src/domain/checkout/entity/order";
import OrderItem from "@src/domain/checkout/entity/order_item";
import OrderRepositoryInterface from "@src/domain/checkout/repository/order-repository.interface";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total,
        items: entity.items.map((item) => ({
          id: item.id,
          product_id: item.productId,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total,
      },
      {
        where: {
          id: entity.id,
        },
      }
    ).then(async () => {
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
      });

      const items = entity.items.map((item) => ({
        id: item.id,
        product_id: item.productId,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        order_id: entity.id,
      }));

      await OrderItemModel.bulkCreate(items);
    });
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: [{ model: OrderItemModel }],
    });
    if (!orderModel) throw new Error("Order not found");
    const items = orderModel.items.map(
      (itemModel) =>
        new OrderItem(
          itemModel.id,
          itemModel.name,
          itemModel.price,
          itemModel.product_id,
          itemModel.quantity
        )
    );
    return new Order(orderModel.id, orderModel.customer_id, items);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });
    return orderModels.map((orderModel) => {
      const items = orderModel.items.map(
        (itemModel) =>
          new OrderItem(
            itemModel.id,
            itemModel.name,
            itemModel.price,
            itemModel.product_id,
            itemModel.quantity
          )
      );
      return new Order(orderModel.id, orderModel.customer_id, items);
    });
  }
}
