export default class OrderItem {
  private _id: string;
  private _productdId: string;
  private _name: string;
  private _price: number;
  private _quantity: number;

  constructor(
    id: string,
    name: string,
    price: number,
    productId: string,
    quantity: number
  ) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._productdId = productId;
    this._quantity = quantity;
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get productId(): string {
    return this._productdId;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price * this._quantity;
  }

  get quantity(): number {
    return this._quantity;
  }

  set price(value: number) {
    this._price = value;
    this.validate();
  }

  set quantity(value: number) {
    this._quantity = value;
    this.validate();
  }

  validate() {
    if (!this._id?.trim()) {
      throw new Error("ID is required");
    }
    if (!this._name?.trim()) {
      throw new Error("Name is required");
    }
    if (this._price < 0) {
      throw new Error("Price must be greater than zero");
    }
    if (this._quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }
  }

  orderItemTotal(): number {
    return this._price * this._quantity;
  }
}
