import Customer from "@src/domain/customer/entity/customer";
import Address from "@src/domain/customer/value-object/address";
import { v4 as uuid } from "uuid";

export default class CustomerFactory {
  public static create(name: string): Customer {
    return new Customer(uuid(), name);
  }

  public static createCustomerWithAddress(
    name: string,
    address: Address
  ): Customer {
    const customer = new Customer(uuid(), name);
    customer.changeAddress(address);
    return customer;
  }
}
