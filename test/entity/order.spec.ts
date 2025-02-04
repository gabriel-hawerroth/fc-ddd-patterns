import Order from "../../src/entity/order";
import OrderItem from "../../src/entity/order_item";

describe("Order unit testes", () => {
  const item = new OrderItem("1", "Product 1", 10, "p1", 1);
  const item2 = new OrderItem("2", "Product 2", 20, "p2", 1);
  const item3 = new OrderItem("3", "Product 3", 30, "p3", 1);

  it("should throw an error when ID is not provided", () => {
    expect(() => new Order("", "1", [item])).toThrow("ID is required");
  });

  it("should throw an error when customerID is not provided", () => {
    expect(() => new Order("1", "", [item])).toThrow("Customer ID is required");
  });

  it("should throw an error when items are not provided", () => {
    expect(() => new Order("1", "1", [])).toThrow("Items are required");
  });

  it("should calculate total", () => {
    item.price = 10;
    item2.price = 20;
    item3.price = 30;

    const order = new Order("1", "1", [item, item2, item3]);

    expect(order.total).toBe(60);
  });

  it("should check if quantity is greater than zero", () => {
    expect(() => (item.quantity = 0)).toThrow(
      "Quantity must be greater than zero"
    );
  });
});
