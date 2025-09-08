import Address from "../../../src/domain/entity/address";
import Customer from "../../../src/domain/entity/customer";
import EventDispatcher from "../../../src/domain/event/@shared/event-dispatcher";
import CustomerAddressChangedEvent from "../../../src/domain/event/customer/customer-address-changed.event";
import CustomerCreatedEvent from "../../../src/domain/event/customer/customer-created.event";
import SendConsoleLog1WhenCustomerIsCreatedHandler from "../../../src/domain/event/customer/handler/send-console-log-1-when-customer-is-created.handler";
import SendConsoleLog2WhenCustomerIsCreatedHandler from "../../../src/domain/event/customer/handler/send-console-log-2-when-customer-is-created.handler";
import SendConsoleLogWhenCustomerAddressIsChangedHandler from "../../../src/domain/event/customer/handler/send-console-log-when-customer-address-is-changed.handler";

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

  describe("Event handling tests", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log").mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it("should register event handlers and dispatch CustomerCreatedEvent when creating a new customer", () => {
      const customer = new Customer("1", "John Doe");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Esse é o primeiro console.log do evento: CustomerCreated"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Esse é o segundo console.log do evento: CustomerCreated"
      );
      expect(consoleSpy).toHaveBeenCalledTimes(2);
    });

    it("should dispatch CustomerAddressChangedEvent when changing customer address", () => {
      const customer = new Customer("1", "John Doe");
      const oldAddress = new Address("Old Street", 123, "12345", "Old City");
      const newAddress = new Address("New Street", 456, "67890", "New City");

      customer.changeAddress(oldAddress);

      consoleSpy.mockClear();

      customer.changeAddress(newAddress);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Endereço do cliente '1' alterado.")
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Endereço antigo:")
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Novo endereço:")
      );
      expect(consoleSpy).toHaveBeenCalledTimes(3);
    });

    it("should verify that event dispatcher is properly configured with all handlers", () => {
      const customer = new Customer("1", "John Doe");

      const eventDispatcher = (customer as any)
        ._eventDispatcher as EventDispatcher;
      const eventHandlers = eventDispatcher.getEventHandlers;

      expect(eventHandlers[CustomerCreatedEvent.name]).toBeDefined();
      expect(eventHandlers[CustomerCreatedEvent.name]).toHaveLength(2);
      expect(eventHandlers[CustomerCreatedEvent.name][0]).toBeInstanceOf(
        SendConsoleLog1WhenCustomerIsCreatedHandler
      );
      expect(eventHandlers[CustomerCreatedEvent.name][1]).toBeInstanceOf(
        SendConsoleLog2WhenCustomerIsCreatedHandler
      );

      expect(eventHandlers[CustomerAddressChangedEvent.name]).toBeDefined();
      expect(eventHandlers[CustomerAddressChangedEvent.name]).toHaveLength(1);
      expect(eventHandlers[CustomerAddressChangedEvent.name][0]).toBeInstanceOf(
        SendConsoleLogWhenCustomerAddressIsChangedHandler
      );
    });

    it("should include correct event data when dispatching CustomerCreatedEvent", () => {
      let capturedEvent: any = null;

      const originalNotify = EventDispatcher.prototype.notify;
      EventDispatcher.prototype.notify = function (event: any) {
        capturedEvent = event;
        originalNotify.call(this, event);
      };

      const customer = new Customer("1", "John Doe");

      expect(capturedEvent).toBeDefined();
      expect(capturedEvent.eventData).toBe(customer);
      expect(capturedEvent.dateTimeOccurred).toBeInstanceOf(Date);
      expect(capturedEvent.constructor.name).toBe("CustomerCreatedEvent");

      EventDispatcher.prototype.notify = originalNotify;
    });

    it("should include correct event data when dispatching CustomerAddressChangedEvent", () => {
      const customer = new Customer("1", "John Doe");
      const oldAddress = new Address("Old Street", 123, "12345", "Old City");
      const newAddress = new Address("New Street", 456, "67890", "New City");

      customer.changeAddress(oldAddress);

      const eventDispatcher = (customer as any)
        ._eventDispatcher as EventDispatcher;
      const notifySpy = jest.spyOn(eventDispatcher, "notify");

      customer.changeAddress(newAddress);

      expect(notifySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          eventData: expect.objectContaining({
            customerId: "1",
            oldAddress: oldAddress,
            newAddress: newAddress,
          }),
          dateTimeOccurred: expect.any(Date),
        })
      );

      notifySpy.mockRestore();
    });

    it("should handle multiple address changes with correct event data", () => {
      const customer = new Customer("1", "John Doe");
      const address1 = new Address("Street 1", 123, "12345", "City 1");
      const address2 = new Address("Street 2", 456, "67890", "City 2");
      const address3 = new Address("Street 3", 789, "11111", "City 3");

      consoleSpy.mockClear();

      customer.changeAddress(address1);
      customer.changeAddress(address2);
      customer.changeAddress(address3);

      expect(consoleSpy).toHaveBeenCalledTimes(9);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Endereço do cliente '1' alterado.")
      );
    });
  });
});
