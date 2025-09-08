import Order from "@src/domain/checkout/entity/order";
import OrderItem from "@src/domain/checkout/entity/order_item";
import Address from "@src/domain/customer/value-object/address";
import Customer from "@src/domain/entity/customer";
import Product from "@src/domain/product/entity/product";
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

  const customerRepository = new CustomerRepository();
  const productRepository = new ProductRepository();
  const orderRepository = new OrderRepository();

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
    const cutomer = new Customer("123", "John Doe");
    const address = new Address("Street 1", 123, "City", "State");
    cutomer.changeAddress(address);
    await customerRepository.create(cutomer);

    const product = new Product("123", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("111", "123", [orderItem]);

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
    const cutomer = new Customer("123", "John Doe");
    const address = new Address("Street 1", 123, "City", "State");
    cutomer.changeAddress(address);
    await customerRepository.create(cutomer);

    const cutomer2 = new Customer("456", "Jane Doe");
    cutomer2.changeAddress(address);
    await customerRepository.create(cutomer2);

    const product = new Product("123", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("222", "123", [orderItem]);

    await orderRepository.create(order);

    order.changeCustomerId("456");
    order.addItems(
      new OrderItem("2", product.name, product.price, product.id, 3)
    );
    await orderRepository.update(order);

    const orderModel = await OrderModel.findByPk(order.id, {
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

  it("should find a order", async () => {
    const cutomer = new Customer("123", "John Doe");
    const address = new Address("Street 1", 123, "City", "State");
    cutomer.changeAddress(address);
    await customerRepository.create(cutomer);

    const product = new Product("123", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("333", "123", [orderItem]);
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find(order.id);

    expect(foundOrder).toBeDefined();
    expect(foundOrder).toStrictEqual(order);
  });

  it("should find all orders", async () => {
    const cutomer = new Customer("123", "John Doe");
    const address = new Address("Street 1", 123, "City", "State");
    cutomer.changeAddress(address);
    await customerRepository.create(cutomer);

    const product = new Product("123", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("444", "123", [orderItem]);
    await orderRepository.create(order);

    const orderItem2 = new OrderItem(
      "2",
      product.name,
      product.price,
      product.id,
      3
    );
    const order2 = new Order("555", "123", [orderItem2]);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders[0]).toStrictEqual(order);
    expect(orders[1]).toStrictEqual(order2);
  });
});
