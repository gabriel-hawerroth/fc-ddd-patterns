import Product from "@src/domain/product/entity/product";
import ProductB from "@src/domain/product/entity/product-b";
import ProductFactory from "@src/domain/product/factory/product.factory";

describe("Product Factory unit tests", () => {
  it("should create a product type a", () => {
    const product = ProductFactory.create("a", "Product A", 100);

    expect(product.id).toBeDefined();
    expect(product.name).toBe("Product A");
    expect(product.price).toBe(100);

    expect(product).toBeInstanceOf(Product);
  });

  it("should create a product type b", () => {
    const product = ProductFactory.create("b", "Product B", 100);

    expect(product.id).toBeDefined();
    expect(product.name).toBe("Product B");
    expect(product.price).toBe(200);

    expect(product).toBeInstanceOf(ProductB);
  });

  it("should throw an error when product type is invalid", () => {
    expect(() => {
      ProductFactory.create("c", "Product C", 100);
    }).toThrow("Invalid product type");
  });
});
