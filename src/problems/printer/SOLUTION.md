## Printer Management System

### Explanation

This code defines a printer management system using the Strategy and Command design patterns. The system supports two types of printers: Network and USB. It includes the following components:

1. **Enums and Interfaces:**
   - `PrinterType`: Enum to specify printer types.
   - `IPrinter`: Interface defining common printer operations (`connect`, `disconnect`, `print`).
   - `IPrinterStrategy`: Interface for different printing strategies.

2. **Strategies:**
   - `NetworkPrinterStrategy`: Manages document queue and prints documents from a network printer.
   - `UsbPrinterStrategy`: Prints documents immediately from a USB printer.

3. **Printer Implementations:**
   - `NetworkPrinter`: Implements queue management and connects/disconnects from multiple computers.
   - `UsbPrinter`: Connects/disconnects to a single computer and prints documents immediately.

4. **Commands:**
   - `ICommand`: Interface for commands.
   - `PrintCommand`: Executes the print operation using a strategy.
   - `ConnectCommand`: Connects a printer to a computer.
   - `DisconnectCommand`: Disconnects a printer from a computer.

5. **Factory and Singleton Manager:**
   - `PrinterFactory`: Creates printers based on type.
   - `PrinterManager`: Manages printers, performs connections/disconnections, and prints documents. It follows the Singleton pattern to ensure only one instance manages printers.

6. **Usage Example:**
   - Demonstrates how to create printers, connect/disconnect them, and print documents using the `PrinterManager`.

### Mermaid.js Diagram

```mermaid
classDiagram
    class PrinterType {
        <<enumeration>>
        NETWORK
        USB
    }

    class IPrinter {
        <<interface>>
        +connect(computerId: string): boolean
        +disconnect(computerId?: string): boolean
        +print(document: string): void
    }

    class IPrinterStrategy {
        <<interface>>
        +print(document: string): void
    }

    class NetworkPrinterStrategy {
        -printer: NetworkPrinter
        +print(document: string): void
    }

    class UsbPrinterStrategy {
        -printer: UsbPrinter
        +print(document: string): void
    }

    class NetworkPrinter {
        -connectedComputers: Set<string>
        -documentQueue: string[]
        -isPrinting: boolean
        +print(document: string): void
        +addDocumentToQueue(document: string): void
        -processQueue(): void
        +connect(computerId: string): boolean
        +disconnect(computerId: string): boolean
    }

    class UsbPrinter {
        -connectedComputerId: string | null
        +print(document: string): void
        +connect(computerId: string): boolean
        +disconnect(computerId?: string): boolean
    }

    class ICommand {
        <<interface>>
        +execute(): void
    }

    class PrintCommand {
        -printerStrategy: IPrinterStrategy
        -document: string
        +execute(): void
    }

    class ConnectCommand {
        -printer: IPrinter
        -computerId: string
        +execute(): void
    }

    class DisconnectCommand {
        -printer: IPrinter
        -computerId?: string
        +execute(): void
    }

    class PrinterFactory {
        +createPrinter(type: PrinterType): IPrinter
    }

    class PrinterManager {
        -printers: Map<PrinterType, IPrinter>
        -instance: PrinterManager
        +getInstance(): PrinterManager
        +addPrinter(type: PrinterType): void
        +connectPrinter(type: PrinterType, computerId?: string): void
        +disconnectPrinter(type: PrinterType, computerId?: string): void
        +printDocument(type: PrinterType, document: string): void
    }

    PrinterType --|> IPrinter
    IPrinterStrategy <|-- NetworkPrinterStrategy
    IPrinterStrategy <|-- UsbPrinterStrategy
    IPrinter <|-- NetworkPrinter
    IPrinter <|-- UsbPrinter
    ICommand <|-- PrintCommand
    ICommand <|-- ConnectCommand
    ICommand <|-- DisconnectCommand
    PrinterFactory ..> IPrinter
    PrinterManager ..> IPrinter
    PrinterManager ..> ICommand
    NetworkPrinterStrategy --> NetworkPrinter
    UsbPrinterStrategy --> UsbPrinter
    PrintCommand --> IPrinterStrategy
    ConnectCommand --> IPrinter
    DisconnectCommand --> IPrinter
