import Address from "./address";

export default class Customer {
  _id: string;
  _name: string;
  _address: Address;
  _active: boolean = false;

  constructor(id: string, name: string, address: Address) {
    this._id = id;
    this._name = name;
    this._address = address;
  }

  validate() {
    if (this._id.trim().length === 0) {
      throw new Error("ID is required");
    }
    if (this._name.trim().length === 0) {
      throw new Error("Name is required");
    }
  }

  activate() {
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }
}
