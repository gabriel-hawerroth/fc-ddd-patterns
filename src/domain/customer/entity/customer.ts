import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerAddressChangedEvent, {
  CustomerAddressChangedEventData,
} from "../event/customer-address-changed.event";
import CustomerCreatedEvent from "../event/customer-created.event";
import SendConsoleLog1WhenCustomerIsCreatedHandler from "../event/handler/send-console-log-1-when-customer-is-created.handler";
import SendConsoleLog2WhenCustomerIsCreatedHandler from "../event/handler/send-console-log-2-when-customer-is-created.handler";
import SendConsoleLogWhenCustomerAddressIsChangedHandler from "../event/handler/send-console-log-when-customer-address-is-changed.handler";
import Address from "../value-object/address";

export default class Customer {
  private _id: string;
  private _name: string;
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  private _eventDispatcher: EventDispatcher;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;

    this._eventDispatcher = new EventDispatcher();
    this._eventDispatcher.register(
      CustomerCreatedEvent.name,
      new SendConsoleLog1WhenCustomerIsCreatedHandler()
    );
    this._eventDispatcher.register(
      CustomerCreatedEvent.name,
      new SendConsoleLog2WhenCustomerIsCreatedHandler()
    );
    this._eventDispatcher.register(
      CustomerAddressChangedEvent.name,
      new SendConsoleLogWhenCustomerAddressIsChangedHandler()
    );

    this._eventDispatcher.notify(new CustomerCreatedEvent(this));
  }

  validate() {
    if (this._id?.trim().length === 0) {
      throw new Error("ID is required");
    }
    if (this._name?.trim().length === 0) {
      throw new Error("Name is required");
    }
  }

  changeAddress(address: Address) {
    const eventData = new CustomerAddressChangedEventData();
    eventData.customerId = this._id;
    eventData.oldAddress = this._address;
    eventData.newAddress = address;

    this._eventDispatcher.notify(new CustomerAddressChangedEvent(eventData));

    this._address = address;
  }

  activate() {
    if (!this._address)
      throw new Error("Address is mandatory to activate a customer");

    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  changeName(name: string) {
    this._name = name;
  }

  isActive() {
    return this._active;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get address() {
    return this._address;
  }

  get rewardPoints() {
    return this._rewardPoints;
  }
}
