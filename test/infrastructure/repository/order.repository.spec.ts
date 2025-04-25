import Address from "@src/domain/entity/address";
import Customer from "@src/domain/entity/customer";
import Order from "@src/domain/entity/order";
import OrderItem from "@src/domain/entity/order_item";
import Product from "@src/domain/entity/product";
import CustomerModel from "@src/infrastructure/db/sequelize/model/customer.model";
import OrderItemModel from "@src/infrastructure/db/sequelize/model/order-item.model";
import OrderModel from "@src/infrastructure/db/sequelize/model/order.model";
import ProductModel from "@src/infrastructure/db/sequelize/model/product.model";
import CustomerRepository from "@src/infrastructure/repository/customer.repository";
import OrderRepository from "@src/infrastructure/repository/order.repository";
import ProductRepository from "@src/infrastructure/repository/product.repository";
import { Sequelize } from "sequelize-typescript";

describe("Order repository tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a order", async () => {
    const customerRepository = new CustomerRepository();
    const cutomer = new Customer("123", "John Doe");
    const address = new Address("Street 1", 123, "City", "State");
    cutomer.changeAddress(address);
    await customerRepository.create(cutomer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel).toBeDefined();
    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      total: order.total,
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          product_id: orderItem.productId,
          order_id: order.id,
          quantity: orderItem.quantity,
        },
      ],
    });
  });

  it("should update a order", async () => {
    const customerRepository = new CustomerRepository();
    const cutomer = new Customer("123", "John Doe");
    const address = new Address("Street 1", 123, "City", "State");
    cutomer.changeAddress(address);
    await customerRepository.create(cutomer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    order.changeCustomerId("456");
    order.addItems(
      new OrderItem("2", product.name, product.price, product.id, 3)
    );
    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel).toBeDefined();
    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: "456",
      total: 500,
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          product_id: orderItem.productId,
          order_id: order.id,
          quantity: orderItem.quantity,
        },
        {
          id: "2",
          name: product.name,
          price: product.price,
          product_id: product.id,
          order_id: order.id,
          quantity: 3,
        },
      ],
    });
  });
});
