## Problem Statement

We are developing a printer management system with the following features:

### Current Features

1. **Printer Types**:
   - **Network Printer**: Supports multiple connections from different computers. Documents can be added to a print queue and printed sequentially.
   - **USB Printer**: Supports a single connection from one computer at a time. Documents are printed immediately upon receipt.

2. **Functional Requirements**:
   - **Add Printers**: Ability to add both Network and USB printers to the system.
   - **Connect to Printer**: Connect computers to the printers. Network printers can connect multiple computers, while USB printers can connect only one computer at a time.
   - **Disconnect from Printer**: Disconnect computers from the printers. Network printers handle disconnections from specific computers, while USB printers handle disconnection for the currently connected computer.
   - **Print Documents**: Print documents on the connected printer. Network printers manage a queue for printing, while USB printers print documents immediately.

### Expected Solution

```typescript
Network Printer connected to computer Computer1.
USB Printer connected to computer Computer2.
Network Printer connected to computer Computer3.
Printing document from computer Computer2: USB Document X
Finished printing document from computer Computer2: USB Document X
Printing document from computer Computer2: USB Document Y
Finished printing document from computer Computer2: USB Document Y
Printing document from computer Computer2: USB Document Z
Finished printing document from computer Computer2: USB Document Z
USB Printer disconnected from computer Computer2.
Adding document to print queue: Document 1
Printing document: Document 1
Adding document to print queue: Document 2
Adding document to print queue: Document 3
Adding document to print queue: Document 4
Finished printing document: Document 1
Printing document: Document 2
Finished printing document: Document 2
Printing document: Document 3
Finished printing document: Document 3
Printing document: Document 4
Finished printing document: Document 4
Network Printer disconnected from computer Computer1.
Network Printer disconnected from computer Computer3.
```

