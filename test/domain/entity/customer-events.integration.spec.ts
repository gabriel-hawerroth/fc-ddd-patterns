import Address from "../../../src/domain/entity/address";
import Customer from "../../../src/domain/entity/customer";
import EventDispatcher from "../../../src/domain/event/@shared/event-dispatcher";
import CustomerAddressChangedEvent from "../../../src/domain/event/customer/customer-address-changed.event";
import CustomerCreatedEvent from "../../../src/domain/event/customer/customer-created.event";
import SendConsoleLog1WhenCustomerIsCreatedHandler from "../../../src/domain/event/customer/handler/send-console-log-1-when-customer-is-created.handler";
import SendConsoleLog2WhenCustomerIsCreatedHandler from "../../../src/domain/event/customer/handler/send-console-log-2-when-customer-is-created.handler";
import SendConsoleLogWhenCustomerAddressIsChangedHandler from "../../../src/domain/event/customer/handler/send-console-log-when-customer-address-is-changed.handler";

describe("Customer Events Integration Tests", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("Event Registration and Handling", () => {
    it("should register and handle CustomerCreatedEvent with custom event dispatcher", () => {
      // Arrange
      const eventDispatcher = new EventDispatcher();
      const handler1 = new SendConsoleLog1WhenCustomerIsCreatedHandler();
      const handler2 = new SendConsoleLog2WhenCustomerIsCreatedHandler();

      eventDispatcher.register(CustomerCreatedEvent.name, handler1);
      eventDispatcher.register(CustomerCreatedEvent.name, handler2);

      // Create customer first to avoid interference from constructor events
      const customer = new Customer("1", "John Doe");
      const event = new CustomerCreatedEvent(customer);

      // Clear any constructor-triggered console calls
      consoleSpy.mockClear();

      // Act
      eventDispatcher.notify(event);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        "Esse é o primeiro console.log do evento: CustomerCreated"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Esse é o segundo console.log do evento: CustomerCreated"
      );
      expect(consoleSpy).toHaveBeenCalledTimes(2);
    });

    it("should register and handle CustomerAddressChangedEvent with custom event dispatcher", () => {
      // Arrange
      const eventDispatcher = new EventDispatcher();
      const handler = new SendConsoleLogWhenCustomerAddressIsChangedHandler();

      eventDispatcher.register(CustomerAddressChangedEvent.name, handler);

      const oldAddress = new Address("Old Street", 123, "12345", "Old City");
      const newAddress = new Address("New Street", 456, "67890", "New City");

      const eventData = {
        customerId: "1",
        oldAddress: oldAddress,
        newAddress: newAddress,
      };

      const event = new CustomerAddressChangedEvent(eventData);

      // Act
      eventDispatcher.notify(event);

      // Assert
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

    it("should handle multiple events in sequence", () => {
      // Arrange
      const eventDispatcher = new EventDispatcher();
      const createdHandler1 = new SendConsoleLog1WhenCustomerIsCreatedHandler();
      const createdHandler2 = new SendConsoleLog2WhenCustomerIsCreatedHandler();
      const addressChangedHandler =
        new SendConsoleLogWhenCustomerAddressIsChangedHandler();

      eventDispatcher.register(CustomerCreatedEvent.name, createdHandler1);
      eventDispatcher.register(CustomerCreatedEvent.name, createdHandler2);
      eventDispatcher.register(
        CustomerAddressChangedEvent.name,
        addressChangedHandler
      );

      const customer = new Customer("1", "John Doe");
      const address = new Address("Main Street", 123, "12345", "Springfield");

      // Clear constructor events
      consoleSpy.mockClear();

      // Act
      const createdEvent = new CustomerCreatedEvent(customer);
      eventDispatcher.notify(createdEvent);

      const addressChangedEvent = new CustomerAddressChangedEvent({
        customerId: "1",
        oldAddress: undefined as any,
        newAddress: address,
      });
      eventDispatcher.notify(addressChangedEvent);

      // Assert
      expect(consoleSpy).toHaveBeenCalledTimes(5); // 2 for created + 3 for address changed
    });

    it("should unregister event handlers correctly", () => {
      // Arrange
      const eventDispatcher = new EventDispatcher();
      const handler1 = new SendConsoleLog1WhenCustomerIsCreatedHandler();
      const handler2 = new SendConsoleLog2WhenCustomerIsCreatedHandler();

      eventDispatcher.register(CustomerCreatedEvent.name, handler1);
      eventDispatcher.register(CustomerCreatedEvent.name, handler2);

      const customer = new Customer("1", "John Doe");
      const event = new CustomerCreatedEvent(customer);

      // Clear constructor events
      consoleSpy.mockClear();

      // Act - First notification with both handlers
      eventDispatcher.notify(event);
      expect(consoleSpy).toHaveBeenCalledTimes(2);

      // Unregister one handler
      consoleSpy.mockClear();
      eventDispatcher.unregister(CustomerCreatedEvent.name, handler1);
      eventDispatcher.notify(event);

      // Assert - Should only call the remaining handler
      expect(consoleSpy).toHaveBeenCalledWith(
        "Esse é o segundo console.log do evento: CustomerCreated"
      );
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    it("should unregister all handlers correctly", () => {
      // Arrange
      const eventDispatcher = new EventDispatcher();
      const handler1 = new SendConsoleLog1WhenCustomerIsCreatedHandler();
      const handler2 = new SendConsoleLog2WhenCustomerIsCreatedHandler();

      eventDispatcher.register(CustomerCreatedEvent.name, handler1);
      eventDispatcher.register(CustomerCreatedEvent.name, handler2);

      const customer = new Customer("1", "John Doe");
      const event = new CustomerCreatedEvent(customer);

      // Clear constructor events
      consoleSpy.mockClear();

      // Act
      eventDispatcher.unregisterAll();
      eventDispatcher.notify(event);

      // Assert - No handlers should be called
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe("Event Data Validation", () => {
    it("should validate CustomerCreatedEvent data structure", () => {
      // Arrange
      const customer = new Customer("1", "John Doe");
      const event = new CustomerCreatedEvent(customer);

      // Assert
      expect(event.eventData).toBe(customer);
      expect(event.dateTimeOccurred).toBeInstanceOf(Date);
      expect(event.constructor.name).toBe("CustomerCreatedEvent");
    });

    it("should validate CustomerAddressChangedEvent data structure", () => {
      // Arrange
      const oldAddress = new Address("Old Street", 123, "12345", "Old City");
      const newAddress = new Address("New Street", 456, "67890", "New City");

      const eventData = {
        customerId: "1",
        oldAddress: oldAddress,
        newAddress: newAddress,
      };

      const event = new CustomerAddressChangedEvent(eventData);

      // Assert
      expect(event.eventData.customerId).toBe("1");
      expect(event.eventData.oldAddress).toBe(oldAddress);
      expect(event.eventData.newAddress).toBe(newAddress);
      expect(event.dateTimeOccurred).toBeInstanceOf(Date);
      expect(event.constructor.name).toBe("CustomerAddressChangedEvent");
    });

    it("should handle CustomerAddressChangedEvent with undefined old address", () => {
      // Arrange
      const newAddress = new Address("New Street", 456, "67890", "New City");

      const eventData = {
        customerId: "1",
        oldAddress: undefined as any,
        newAddress: newAddress,
      };

      const event = new CustomerAddressChangedEvent(eventData);
      const handler = new SendConsoleLogWhenCustomerAddressIsChangedHandler();

      // Act
      handler.handle(event);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Endereço do cliente '1' alterado.")
      );
      expect(consoleSpy).toHaveBeenCalledWith("Endereço antigo: undefined");
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Novo endereço:")
      );
    });
  });

  describe("Performance and Edge Cases", () => {
    it("should handle multiple customers created simultaneously", () => {
      // Arrange
      const customers: Customer[] = [];
      const expectedCalls = 10 * 2; // 10 customers * 2 handlers each

      // Act
      for (let i = 1; i <= 10; i++) {
        customers.push(new Customer(i.toString(), `Customer ${i}`));
      }

      // Assert
      expect(consoleSpy).toHaveBeenCalledTimes(expectedCalls);
      expect(customers).toHaveLength(10);
    });

    it("should handle rapid address changes", () => {
      // Arrange
      const customer = new Customer("1", "John Doe");
      const addresses = [
        new Address("Street 1", 123, "12345", "City 1"),
        new Address("Street 2", 456, "67890", "City 2"),
        new Address("Street 3", 789, "11111", "City 3"),
        new Address("Street 4", 101, "22222", "City 4"),
        new Address("Street 5", 112, "33333", "City 5"),
      ];

      consoleSpy.mockClear();

      // Act
      addresses.forEach((address) => {
        customer.changeAddress(address);
      });

      // Assert - Each address change should trigger 3 console logs
      expect(consoleSpy).toHaveBeenCalledTimes(addresses.length * 3);
    });

    it("should maintain event handler state across multiple notifications", () => {
      // Arrange
      const eventDispatcher = new EventDispatcher();
      const handler = new SendConsoleLog1WhenCustomerIsCreatedHandler();

      eventDispatcher.register(CustomerCreatedEvent.name, handler);

      // Act & Assert
      for (let i = 1; i <= 5; i++) {
        const customer = new Customer(i.toString(), `Customer ${i}`);
        const event = new CustomerCreatedEvent(customer);

        consoleSpy.mockClear();
        eventDispatcher.notify(event);

        expect(consoleSpy).toHaveBeenCalledWith(
          "Esse é o primeiro console.log do evento: CustomerCreated"
        );
        expect(consoleSpy).toHaveBeenCalledTimes(1);
      }
    });
  });
});
