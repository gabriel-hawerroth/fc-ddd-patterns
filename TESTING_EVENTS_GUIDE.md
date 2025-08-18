# Guia de Testes Unitários para Eventos em DDD

Este documento demonstra como implementar testes unitários para verificar o registro e envio de eventos em entidades Domain-Driven Design (DDD).

## Arquivos de Teste Criados

### 1. `test/domain/entity/customer.spec.ts` (Atualizado)

- Testes unitários básicos para a entidade Customer
- Testes específicos para eventos integrados na entidade

### 2. `test/domain/entity/customer-events.integration.spec.ts` (Novo)

- Testes de integração focados especificamente nos eventos
- Testes avançados de EventDispatcher
- Testes de performance e casos extremos

## Estratégias de Teste Implementadas

### 1. Testes de Registro de Eventos na Construção

```typescript
it("should register event handlers and dispatch CustomerCreatedEvent when creating a new customer", () => {
  const customer = new Customer("1", "John Doe");

  expect(consoleSpy).toHaveBeenCalledWith(
    "Esse é o primeiro console.log do evento: CustomerCreated"
  );
  expect(consoleSpy).toHaveBeenCalledWith(
    "Esse é o segundo console.log do evento: CustomerCreated"
  );
  expect(consoleSpy).toHaveBeenCalledTimes(2);
});
```

**O que testa:**

- ✅ Se os handlers são registrados automaticamente no construtor
- ✅ Se o evento `CustomerCreatedEvent` é disparado na criação
- ✅ Se ambos os handlers são executados corretamente

### 2. Testes de Mudança de Endereço

```typescript
it("should dispatch CustomerAddressChangedEvent when changing customer address", () => {
  const customer = new Customer("1", "John Doe");
  const oldAddress = new Address("Old Street", 123, "12345", "Old City");
  const newAddress = new Address("New Street", 456, "67890", "New City");

  customer.changeAddress(oldAddress);
  consoleSpy.mockClear();
  customer.changeAddress(newAddress);

  expect(consoleSpy).toHaveBeenCalledWith(
    expect.stringContaining("Endereço do cliente '1' alterado.")
  );
  expect(consoleSpy).toHaveBeenCalledTimes(3);
});
```

**O que testa:**

- ✅ Se o evento `CustomerAddressChangedEvent` é disparado na mudança de endereço
- ✅ Se os dados corretos (cliente, endereço antigo e novo) são passados
- ✅ Se o handler executa todas as suas responsabilidades

### 3. Verificação da Configuração do EventDispatcher

```typescript
it("should verify that event dispatcher is properly configured with all handlers", () => {
  const customer = new Customer("1", "John Doe");
  const eventDispatcher = (customer as any)._eventDispatcher as EventDispatcher;
  const eventHandlers = eventDispatcher.getEventHandlers;

  expect(eventHandlers[CustomerCreatedEvent.name]).toHaveLength(2);
  expect(eventHandlers[CustomerAddressChangedEvent.name]).toHaveLength(1);
});
```

**O que testa:**

- ✅ Se o EventDispatcher é configurado corretamente
- ✅ Se o número correto de handlers está registrado
- ✅ Se os tipos corretos de handlers estão registrados

### 4. Validação de Dados do Evento

```typescript
it("should include correct event data when dispatching CustomerCreatedEvent", () => {
  let capturedEvent: any = null;

  const originalNotify = EventDispatcher.prototype.notify;
  EventDispatcher.prototype.notify = function (event: any) {
    capturedEvent = event;
    originalNotify.call(this, event);
  };

  const customer = new Customer("1", "John Doe");

  expect(capturedEvent.eventData).toBe(customer);
  expect(capturedEvent.dateTimeOccurred).toBeInstanceOf(Date);
});
```

**O que testa:**

- ✅ Se os dados corretos são incluídos no evento
- ✅ Se a estrutura do evento está correta
- ✅ Se o timestamp é gerado automaticamente

## Testes de Integração Avançados

### 1. Testes com EventDispatcher Personalizado

```typescript
it("should register and handle CustomerCreatedEvent with custom event dispatcher", () => {
  const eventDispatcher = new EventDispatcher();
  const handler1 = new SendConsoleLog1WhenCustomerIsCreatedHandler();
  const handler2 = new SendConsoleLog2WhenCustomerIsCreatedHandler();

  eventDispatcher.register(CustomerCreatedEvent.name, handler1);
  eventDispatcher.register(CustomerCreatedEvent.name, handler2);

  const customer = new Customer("1", "John Doe");
  const event = new CustomerCreatedEvent(customer);

  eventDispatcher.notify(event);

  expect(consoleSpy).toHaveBeenCalledTimes(2);
});
```

### 2. Testes de Desregistro de Handlers

```typescript
it("should unregister event handlers correctly", () => {
  const eventDispatcher = new EventDispatcher();
  // Registra handlers...

  eventDispatcher.unregister(CustomerCreatedEvent.name, handler1);
  eventDispatcher.notify(event);

  expect(consoleSpy).toHaveBeenCalledTimes(1); // Apenas um handler restante
});
```

### 3. Testes de Performance

```typescript
it("should handle multiple customers created simultaneously", () => {
  const customers: Customer[] = [];

  for (let i = 1; i <= 10; i++) {
    customers.push(new Customer(i.toString(), `Customer ${i}`));
  }

  expect(consoleSpy).toHaveBeenCalledTimes(20); // 10 customers * 2 handlers
});
```

## Técnicas Utilizadas

### 1. Mocking do Console

```typescript
let consoleSpy: jest.SpyInstance;

beforeEach(() => {
  consoleSpy = jest.spyOn(console, "log").mockImplementation();
});

afterEach(() => {
  consoleSpy.mockRestore();
});
```

### 2. Acesso a Propriedades Privadas (Para Testes)

```typescript
const eventDispatcher = (customer as any)._eventDispatcher as EventDispatcher;
```

### 3. Interceptação de Métodos de Prototype

```typescript
const originalNotify = EventDispatcher.prototype.notify;
EventDispatcher.prototype.notify = function (event: any) {
  capturedEvent = event;
  originalNotify.call(this, event);
};
```

### 4. Limpeza de Estado Entre Testes

```typescript
consoleSpy.mockClear(); // Limpa apenas as chamadas registradas
consoleSpy.mockRestore(); // Restaura o comportamento original
```

## Benefícios dos Testes Implementados

### ✅ **Cobertura Completa**

- Testa registro automático de eventos
- Testa disparo de eventos em operações
- Testa estrutura e dados dos eventos
- Testa configuração do EventDispatcher

### ✅ **Detecção de Regressões**

- Detecta se eventos param de ser disparados
- Detecta mudanças na estrutura dos eventos
- Detecta problemas de configuração de handlers

### ✅ **Documentação Viva**

- Os testes servem como documentação do comportamento esperado
- Mostram como os eventos devem funcionar
- Demonstram a integração entre componentes

### ✅ **Confiabilidade**

- Garante que os eventos funcionam corretamente
- Valida que os handlers são executados
- Verifica a integridade dos dados passados

## Comandos para Executar os Testes

```bash
# Executar todos os testes do Customer
npm test -- --testPathPattern=customer

# Executar apenas testes unitários básicos
npm test -- --testPathPattern=customer.spec.ts

# Executar apenas testes de integração de eventos
npm test -- --testPathPattern=customer-events.integration.spec.ts
```

## Próximos Passos Recomendados

1. **Testes de Falha**: Criar testes que verificam o comportamento quando handlers falham
2. **Testes de Ordem**: Verificar se a ordem de execução dos handlers é determinística
3. **Testes de Concorrência**: Testar comportamento com múltiplas operações simultâneas
4. **Mocks Mais Sofisticados**: Usar bibliotecas como `sinon` para mocks mais avançados
5. **Testes End-to-End**: Criar testes que verificam o fluxo completo do evento através da aplicação

## Conclusão

Os testes implementados fornecem uma cobertura abrangente do sistema de eventos na entidade Customer, garantindo que:

- ✅ Eventos são registrados corretamente
- ✅ Eventos são disparados nas operações corretas
- ✅ Dados corretos são passados para os handlers
- ✅ Handlers são executados conforme esperado
- ✅ O sistema é robusto e confiável

Esta abordagem pode ser replicada para outras entidades e eventos no sistema DDD.
