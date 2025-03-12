import Address from "../../../src/domain/entity/address";
import Customer from "../../../src/domain/entity/customer";

describe("Customer unit testes", () => {
  const address = new Address("Main Street", 123, "12345", "Springfield");

  it("should get 1 as result", () => {
    const result = 1;
    expect(result).toBe(1);
  });

  it("should throw an error when ID is not provided", () => {
    const customer = new Customer("", "John Doe");

    expect(() => customer.validate()).toThrow("ID is required");
  });

  it("should throw an error when name is not provided", () => {
    const customer = new Customer("1", "");

    expect(() => customer.validate()).toThrow("Name is required");
  });

  it("should change name", () => {
    const customer = new Customer("1", "John Doe");

    customer.changeName("Jane Doe");

    expect(customer.name).toBe("Jane Doe");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "John Doe");
    customer.changeAddress(address);
    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "John Doe");
    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should throw an error when activating a customer without address", () => {
    const customer = new Customer("1", "John Doe");

    expect(() => customer.activate()).toThrow(
      "Address is mandatory to activate a customer"
    );
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "John Doe");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(100);

    expect(customer.rewardPoints).toBe(100);

    customer.addRewardPoints(50);
    expect(customer.rewardPoints).toBe(150);
  });
});
