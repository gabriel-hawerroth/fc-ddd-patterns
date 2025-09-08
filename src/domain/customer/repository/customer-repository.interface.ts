import RepositoryInterface from "@src/domain/@shared/repository/repository-interface";
import Customer from "../entity/customer";

export default interface CustomerRepositoryInterface
  extends RepositoryInterface<Customer> {}
