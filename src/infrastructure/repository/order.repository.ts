import Order from "@domain/entity/order";
import OrderRepositoryInterface from "@domain/repository/order-repository.interface";
import OrderItemModel from "@infrastructure/db/sequelize/model/order-item.model";
import OrderModel from "@infrastructure/db/sequelize/model/order.model";

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
        items: entity.items.map((item) => ({
          id: item.id,
          product_id: item.productId,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
        })),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  find(id: string): Promise<Order> {
    throw new Error("Method not implemented.");
  }

  findAll(): Promise<Order[]> {
    throw new Error("Method not implemented.");
  }
}
