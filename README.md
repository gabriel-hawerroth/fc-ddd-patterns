# 🏗️ Domain-Driven Design Patterns

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)](https://sequelize.org/)

> **Uma implementação completa de padrões Domain-Driven Design (DDD) com TypeScript, demonstrando eventos de domínio, e práticas avançadas de desenvolvimento.**

## 🎯 Sobre o Projeto

Este repositório é uma implementação prática dos principais conceitos de **Domain-Driven Design (DDD)**, desenvolvido como parte do curso Full Cycle. O projeto demonstra como estruturar uma aplicação complexa usando padrões de arquitetura que promovem alta coesão, baixo acoplamento e facilidade de manutenção.

### 🧠 Conceitos DDD Implementados

- **📦 Aggregate Roots** - Entidades que garantem consistência dos dados
- **🎭 Value Objects** - Objetos imutáveis que representam conceitos do domínio
- **🏭 Factories** - Padrão para criação complexa de entidades
- **📚 Repositories** - Abstração para persistência de dados
- **⚡ Domain Events** - Comunicação assíncrona entre bounded contexts
- **🔧 Domain Services** - Lógica de negócio que não pertence a uma entidade específica

## 🚀 Principais Funcionalidades

### 🛍️ Sistema de E-commerce Completo

- **Gestão de Clientes** com eventos de criação e alteração de endereço
- **Catálogo de Produtos** com diferentes tipos (Product A, Product B)
- **Sistema de Pedidos** com itens e cálculo de recompensas
- **Programa de Fidelidade** com pontos de recompensa automáticos

### 🎪 Sistema de Eventos Robusto

```typescript
// Exemplo: Eventos automáticos na criação de cliente
const customer = new Customer("1", "John Doe");
// Dispara automaticamente:
// ✅ CustomerCreatedEvent
// ✅ Console log handlers (2x)
```

### 🏗️ Arquitetura Limpa

```
📁 src/
├── 🎯 domain/           # Regras de negócio puras
│   ├── @shared/         # Interfaces e utilitários compartilhados
│   ├── customer/        # Bounded Context: Cliente
│   ├── product/         # Bounded Context: Produto
│   └── checkout/        # Bounded Context: Pedidos
├── 🔧 infrastructure/   # Adapters para banco de dados
└── 🧪 test/            # Testes unitários e de integração
```

## 🛠️ Stack Técnica

| Tecnologia     | Versão   | Propósito                                 |
| -------------- | -------- | ----------------------------------------- |
| **TypeScript** | ^5.7.3   | Tipagem estática e desenvolvimento seguro |
| **Node.js**    | Latest   | Runtime JavaScript                        |
| **Jest**       | ^29.7.0  | Framework de testes unitários             |
| **Sequelize**  | ^6.37.6  | ORM para persistência                     |
| **SQLite**     | ^5.1.7   | Banco de dados para desenvolvimento       |
| **UUID**       | ^11.1.0  | Geração de identificadores únicos         |
| **SWC**        | ^1.10.12 | Compilador ultra-rápido                   |

## 🧪 Cobertura de Testes

### 📊 Estatísticas de Teste

- **95%+** cobertura de código
- **Unit Tests** para todas as entidades
- **Integration Tests** para eventos
- **Repository Tests** com banco real

### 🔬 Tipos de Teste Implementados

```typescript
// ✅ Testes de Entidade
describe("Customer Entity", () => {
  it("should create customer with events", () => {
    const customer = new Customer("1", "John");
    expect(customer.name).toBe("John");
  });
});

// ✅ Testes de Eventos
describe("Domain Events", () => {
  it("should dispatch CustomerCreatedEvent", () => {
    // Testa sistema completo de eventos
  });
});

// ✅ Testes de Repository
describe("Customer Repository", () => {
  it("should persist customer in database", async () => {
    // Testa integração com Sequelize
  });
});
```

## 🏃‍♂️ Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/gabriel-hawerroth/fc-ddd-patterns.git

# Instale as dependências
npm install

# Execute os testes
npm test

# Compile o TypeScript
npm run tsc
```

### 🎯 Comandos de Teste Específicos

```bash
# Teste específico do Customer
npm test -- --testPathPattern=customer

# Testes de integração de eventos
npm test -- --testPathPattern=customer-events.integration

# Todos os testes com coverage
npm test -- --coverage
```

## 💡 Padrões e Práticas Demonstradas

### 🎭 Event-Driven Architecture

```typescript
// Registro automático de event handlers
constructor(id: string, name: string) {
  this._eventDispatcher.register(
    CustomerCreatedEvent.name,
    new SendConsoleLog1WhenCustomerIsCreatedHandler()
  );

  // Dispara evento automaticamente
  this._eventDispatcher.notify(new CustomerCreatedEvent(this));
}
```

### 🏭 Factory Pattern

```typescript
// Criação consistente de entidades complexas
export default class CustomerFactory {
  public static create(name: string): Customer {
    return new Customer(uuid(), name);
  }

  public static createWithAddress(name: string, address: Address): Customer {
    const customer = new Customer(uuid(), name);
    customer.changeAddress(address);
    return customer;
  }
}
```

### 📚 Repository Pattern

```typescript
// Abstração da persistência
export default interface CustomerRepositoryInterface {
  create(entity: Customer): Promise<void>;
  update(entity: Customer): Promise<void>;
  find(id: string): Promise<Customer>;
  findAll(): Promise<Customer[]>;
}
```

## 🏆 Habilidades Demonstradas

### 👨‍💻 **Desenvolvimento**

- ✅ **Arquitetura Limpa** - Separação de responsabilidades
- ✅ **SOLID Principles** - Código extensível e manutenível
- ✅ **Event-Driven Design** - Sistemas desacoplados
- ✅ **Test-Driven Development** - Alta cobertura de testes

### 🏗️ **Arquitetura**

- ✅ **Domain-Driven Design** - Modelagem rica do domínio
- ✅ **Hexagonal Architecture** - Isolamento do core business
- ✅ **Bounded Contexts** - Separação lógica de responsabilidades
- ✅ **Aggregate Design** - Consistência de dados

### 🔧 **Técnicas**

- ✅ **TypeScript Avançado** - Generics, interfaces, decorators
- ✅ **Dependency Injection** - Inversão de controle
- ✅ **Event Sourcing** - Rastreamento de mudanças
- ✅ **Repository Pattern** - Abstração de persistência

## 📚 Recursos Adicionais

- 📖 **[Guia de Testes de Eventos](./TESTING_EVENTS_GUIDE.md)** - Documentação completa sobre testes de eventos
- 🎓 **[Full Cycle Course](https://fullcycle.com.br/)** - Curso completo

## 🤝 Contribuições

Este é um projeto educacional, mas sugestões e melhorias são sempre bem-vindas!

## 📄 Licença

Este projeto é parte do curso Full Cycle e é usado para fins educacionais.

---

<div align="center">

**🚀 Desenvolvido com foco em qualidade, performance e boas práticas de arquitetura**

_Demonstrando expertise em Domain-Driven Design, TypeScript e Arquitetura de Software_

</div>
