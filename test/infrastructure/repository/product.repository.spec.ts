import { Sequelize } from "sequelize-typescript";
import Product from "../../../src/domain/entity/product";
import ProductModel from "../../../src/infrastructure/db/sequelize/model/product.model";
import ProductRepository from "../../../src/infrastructure/repository/product.repository";

describe("Product repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findByPk("1");

    expect(productModel?.toJSON()).toStrictEqual({
      id: "1",
      name: "Product 1",
      price: 100,
    });
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);

    await productRepository.create(product);

    product.changeName("Product 2");
    product.changePrice(200);

    await productRepository.update(product);

    const productModel = await ProductModel.findByPk("1");

    expect(productModel?.toJSON()).toStrictEqual({
      id: "1",
      name: "Product 2",
      price: 200,
    });
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);

    await productRepository.create(product);

    const foundProduct = await productRepository.find("1");

    expect(foundProduct).toStrictEqual(product);
  });

  it("should find all products", async () => {
    const productRepository = new ProductRepository();

    const product1 = new Product("1", "Product 1", 100);
    await productRepository.create(product1);

    const product2 = new Product("2", "Product 2", 200);
    await productRepository.create(product2);

    const products = await productRepository.findAll();

    expect(products).toStrictEqual([product1, product2]);
  });
});
