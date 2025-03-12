import Product from "../../../src/domain/entity/product";

describe("Product unit tests", () => {
  it("should throw an error when ID is not provided", () => {
    expect(() => new Product("", "Product 1", 100)).toThrow("ID is required");
  });

  it("should throw an error when name is not provided", () => {
    expect(() => new Product("1", "", 100)).toThrow("Name is required");
  });

  it("should throw an error when price is less than zero", () => {
    expect(() => new Product("1", "Price", -1)).toThrow(
      "Price must be greater than zero"
    );
  });

  it("should create a product", () => {
    const product = new Product("1", "Product 1", 100);

    expect(product).toBeDefined();
  });

  it("should change name", () => {
    const product = new Product("1", "Product 1", 100);
    product.changeName("Product 2");

    expect(product.name).toBe("Product 2");
  });

  it("should change price", () => {
    const product = new Product("1", "Product 1", 100);
    product.changePrice(200);

    expect(product.price).toBe(200);
  });
});
