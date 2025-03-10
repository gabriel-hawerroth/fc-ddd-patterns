import Address from "./address";

export default class Customer {
  private _id: string;
  private _name: string;
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
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
