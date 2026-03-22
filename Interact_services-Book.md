# Book Service - Interactions & Use Cases

## 🎯 Core Use Cases
1. **Catalog Browsing:** Allows users to view all available books, metadata, and prices.
2. **Inventory Management:** Centralized system to track how many copies of a specific book are in stock.
3. **Catalog Administration:** Enables authenticated administrators to add new books or update pricing seamlessly.

## 🤝 Interacting Services

### 1. Interacts with: Order Service
**Type of Interaction:** Incoming Synchronous REST Call & Stock Deduction.
- **Why (Rationale):** The Book Service acts as the single source of truth for pricing and availability. The Order service **must** communicate with the Book service before confirming an order to prevent selling out-of-stock items or relying on outdated prices sent from the client-side.
- **Use Case Example (Price & Stock Verification):** When a user places an order for "The Great Gatsby", the Order Service sends a request to the Book Service (`GET /api/books/:id`) to check if `stock > 0` and to retrieve the actual server-side price.
- **Use Case Example (Inventory Update):** Once an order is successfully approved and paid, the Order Service (or Payment Service) informs the Book Service to deduct the purchased quantity from the inventory (`PUT /api/books/:id/stock`).

### 2. Interacts with: User Service
**Type of Interaction:** Authorization Verification.
- **Why (Rationale):** While public users can browse the catalog, modifying the catalog (adding/deleting books) requires admin privileges. The Book Service extracts the JWT (signed by the User Service) to verify the `role: "admin"` claim.
