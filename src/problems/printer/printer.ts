enum PrinterType {
    NETWORK = 'NETWORK',
    USB = 'USB',
}

interface IPrinter {
    connect(computerId: string): boolean;
    disconnect(computerId?: string): boolean;
    print(document: string): void;
}

// Printer Strategy Interface
interface IPrinterStrategy {
    print(document: string): void;
}

// Network Printer Strategy with Advanced Queue Management
class NetworkPrinterStrategy implements IPrinterStrategy {
    private printer: NetworkPrinter;

    constructor(printer: NetworkPrinter) {
        this.printer = printer;
    }

    print(document: string): void {
        this.printer.addDocumentToQueue(document);
    }
}

// USB Printer Strategy with Immediate Printing
class UsbPrinterStrategy implements IPrinterStrategy {
    private printer: UsbPrinter;

    constructor(printer: UsbPrinter) {
        this.printer = printer;
    }

    print(document: string): void {
        this.printer.print(document);
    }
}

class NetworkPrinter implements IPrinter {
    private connectedComputers: Set<string> = new Set();
    private documentQueue: string[] = [];
    private isPrinting = false;

    print(document: string): void {
        // Queue management is now handled by the strategy
        console.log(`Adding document to print queue: ${document}`);
        this.documentQueue.push(document);
        this.processQueue();
    }

    // Added method to handle queue management
    addDocumentToQueue(document: string) {
        this.print(document);
    }

    private processQueue() {
        if (this.isPrinting || this.documentQueue.length === 0) {
            return;
        }

        this.isPrinting = true;

        const document = this.documentQueue.shift();
        if (document) {
            console.log(`Printing document: ${document}`);

            setTimeout(() => {
                console.log(`Finished printing document: ${document}`);
                this.isPrinting = false;
                this.processQueue();
            }, 1000); // Simulate 1 second printing time
        }
    }

    connect(computerId: string): boolean {
        this.connectedComputers.add(computerId);
        console.log(`Network Printer connected to computer ${computerId}.`);
        return true;
    }

    disconnect(computerId: string): boolean {
        this.connectedComputers.delete(computerId);
        console.log(`Network Printer disconnected from computer ${computerId}.`);
        return true;
    }
}

class UsbPrinter implements IPrinter {
    private connectedComputerId: string | null = null;

    print(document: string): void {
        if (this.connectedComputerId === null) {
            throw new Error("USB Printer is not connected to any computer.");
        }
        console.log(`Printing document from computer ${this.connectedComputerId}: ${document}`);
        // Simulate printing
        console.log(`Finished printing document from computer ${this.connectedComputerId}: ${document}`);
    }

    connect(computerId: string): boolean {
        if (this.connectedComputerId !== null) {
            throw new Error("USB Printer is already connected to another computer.");
        }
        this.connectedComputerId = computerId;
        console.log(`USB Printer connected to computer ${computerId}.`);
        return true;
    }

    disconnect(computerId?: string): boolean {
        if (this.connectedComputerId === null) {
            throw new Error("USB Printer is not connected to any computer.");
        }
        if (computerId && computerId !== this.connectedComputerId) {
            throw new Error(`Attempting to disconnect from a different computer: ${computerId}`);
        }
        console.log(`USB Printer disconnected from computer ${this.connectedComputerId}.`);
        this.connectedComputerId = null;
        return true;
    }
}

// Command Interfaces
interface ICommand {
    execute(): void;
}

class PrintCommand implements ICommand {
    private printerStrategy: IPrinterStrategy;
    private document: string;

    constructor(printerStrategy: IPrinterStrategy, document: string) {
        this.printerStrategy = printerStrategy;
        this.document = document;
    }

    execute(): void {
        this.printerStrategy.print(this.document);
    }
}

class ConnectCommand implements ICommand {
    private printer: IPrinter;
    private computerId: string;

    constructor(printer: IPrinter, computerId: string) {
        this.printer = printer;
        this.computerId = computerId;
    }

    execute(): void {
        this.printer.connect(this.computerId);
    }
}

class DisconnectCommand implements ICommand {
    private printer: IPrinter;
    private computerId?: string;

    constructor(printer: IPrinter, computerId?: string) {
        this.printer = printer;
        this.computerId = computerId;
    }

    execute(): void {
        this.printer.disconnect(this.computerId);
    }
}

// Factory for creating Printers
class PrinterFactory {
    static createPrinter(type: PrinterType): IPrinter {
        switch (type) {
            case PrinterType.NETWORK:
                return new NetworkPrinter();
            case PrinterType.USB:
                return new UsbPrinter();
            default:
                throw new Error("Unsupported printer type");
        }
    }
}

// Singleton Printer Manager
class PrinterManager {
    private static instance: PrinterManager;
    private printers: Map<PrinterType, IPrinter> = new Map();

    private constructor() {}

    public static getInstance(): PrinterManager {
        if (!PrinterManager.instance) {
            PrinterManager.instance = new PrinterManager();
        }
        return PrinterManager.instance;
    }

    public addPrinter(type: PrinterType): void {
        const printer = PrinterFactory.createPrinter(type);
        this.printers.set(type, printer);
    }

    public connectPrinter(type: PrinterType, computerId?: string): void {
        const printer = this.printers.get(type);
        if (!printer) {
            throw new Error("Printer not found.");
        }

        const command = new ConnectCommand(printer, computerId || "");
        command.execute();
    }

    public disconnectPrinter(type: PrinterType, computerId?: string): void {
        const printer = this.printers.get(type);
        if (!printer) {
            throw new Error("Printer not found.");
        }

        const command = new DisconnectCommand(printer, computerId);
        command.execute();
    }

    public printDocument(type: PrinterType, document: string): void {
        const printer = this.printers.get(type);
        if (!printer) {
            throw new Error("Printer not found.");
        }

        let strategy: IPrinterStrategy;
        if (printer instanceof NetworkPrinter) {
            strategy = new NetworkPrinterStrategy(printer);
        } else if (printer instanceof UsbPrinter) {
            strategy = new UsbPrinterStrategy(printer);
        } else {
            throw new Error("Unsupported printer type.");
        }

        const command = new PrintCommand(strategy, document);
        command.execute();
    }
}

// Usage Example
const printerManager = PrinterManager.getInstance();

printerManager.addPrinter(PrinterType.NETWORK);
printerManager.addPrinter(PrinterType.USB);

printerManager.connectPrinter(PrinterType.NETWORK, "Computer1");
printerManager.connectPrinter(PrinterType.USB, "Computer2");
printerManager.connectPrinter(PrinterType.NETWORK, "Computer3");

printerManager.printDocument(PrinterType.USB, "USB Document X");
printerManager.printDocument(PrinterType.USB, "USB Document Y");
printerManager.printDocument(PrinterType.USB, "USB Document Z");

printerManager.disconnectPrinter(PrinterType.USB);

printerManager.printDocument(PrinterType.NETWORK, "Document 1");
printerManager.printDocument(PrinterType.NETWORK, "Document 2");
printerManager.printDocument(PrinterType.NETWORK, "Document 3");
printerManager.printDocument(PrinterType.NETWORK, "Document 4");

setTimeout(() => {
    printerManager.disconnectPrinter(PrinterType.NETWORK, "Computer1");
    printerManager.disconnectPrinter(PrinterType.NETWORK, "Computer3");
}, 8000);

