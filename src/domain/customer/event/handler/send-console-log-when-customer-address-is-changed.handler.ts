import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class SendConsoleLogWhenCustomerAddressIsChangedHandler
  implements EventHandlerInterface<CustomerAddressChangedEvent>
{
  handle(event: CustomerAddressChangedEvent): void {
    console.log(
      `Endereço do cliente '${event.eventData.customerId}' alterado. ${event.dateTimeOccurred}`
    );

    console.log(
      `Endereço antigo: ${JSON.stringify(event.eventData.oldAddress)}`
    );
    console.log(`Novo endereço: ${JSON.stringify(event.eventData.newAddress)}`);
  }
}
