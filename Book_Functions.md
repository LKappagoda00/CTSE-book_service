# Book Service - Core Functions & Cloud Role

## Overview
The **Book Service** serves as the primary catalog and inventory management system for the online bookstore. This microservice operates completely independently, maintaining the source of truth for all book-related data, prices, and stock levels.

## Core Functions
1. **Catalog Management:** Displays a comprehensive list of books for the frontend application.
2. **Inventory Tracking:** Keeps real-time track of how many copies are available.
3. **Integration Point with Order Service:** When an order is placed, the **Order Service** makes an HTTP request to the Book Service to fetch the precise price of the requested book and to ensure there is adequate stock to fulfill the order. This is a crucial inter-service communication pipeline.
4. **Administrative Controls:** Allows bookstore administrators to execute CRUD operations safely on the database.

## DevOps & Cloud Implementation
- **Database:** Connects to an isolated instance/table (Database-per-Service pattern) to prevent tight coupling.
- **Containerization:** Packaged securely via `Dockerfile`, ready to be pushed to a Container Registry.
- **DevSecOps:** Incorporates pipeline-based SAST (SonarCloud/Snyk). API endpoints that mutate data are heavily guarded by Identity and Access Management checks.
