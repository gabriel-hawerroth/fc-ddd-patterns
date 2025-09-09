import Customer from "@src/domain/customer/entity/customer";
import CustomerFactory from "@src/domain/customer/factory/customer.factory";
import Address from "@src/domain/customer/value-object/address";

describe("Customer factory unit tests", () => {
  it("should create a customer", () => {
    const customer = CustomerFactory.create("John Doe");
    expect(customer).toBeInstanceOf(Customer);
    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John Doe");
    expect(customer.address).toBeUndefined();
  });

  it("should create a customer with an address", () => {
    const address = new Address("Street 1", 123, "9999", "São Paulo");
    const customer = CustomerFactory.createCustomerWithAddress(
      "John Doe",
      address
    );
    expect(customer).toBeInstanceOf(Customer);
    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John Doe");
    expect(customer.address).toEqual(address);
  });
});
