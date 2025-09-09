import OrderFactory from "@src/domain/checkout/factory/order.factory";

describe("Order factory unit tests", () => {
  it("should create an order", () => {
    const orderProps = {
      customerId: "123",
      items: [
        {
          productId: "p1",
          productName: "Product 1",
          quantity: 2,
          price: 50,
        },
        {
          productId: "p2",
          productName: "Product 2",
          quantity: 1,
          price: 100,
        },
      ],
    };

    const order = OrderFactory.create(orderProps);

    expect(order.id).toBeDefined();
    expect(order.customerId).toBe(orderProps.customerId);
    expect(order.items.length).toBe(2);
    expect(order.total).toBe(200);
    expect(order.items[0].id).toBeDefined();
    expect(order.items[0].productId).toBe("p1");
    expect(order.items[0].name).toBe("Product 1");
    expect(order.items[0].quantity).toBe(2);
    expect(order.items[0].price).toBe(50);
    expect(order.items[1].id).toBeDefined();
    expect(order.items[1].productId).toBe("p2");
    expect(order.items[1].name).toBe("Product 2");
    expect(order.items[1].quantity).toBe(1);
    expect(order.items[1].price).toBe(100);
  });
});
