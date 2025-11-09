# Glossary - The Lil Gift Corner

**Document Version**: 1.0  
**Last Updated**: January 2025

---

This glossary defines key terms, abbreviations, and concepts used throughout The Lil Gift Corner project documentation and codebase.

---

## Table of Contents

- [General Terms](#general-terms)
- [Technical Terms](#technical-terms)
- [Frontend Technologies](#frontend-technologies)
- [Backend Technologies](#backend-technologies)
- [Database Terms](#database-terms)
- [E-Commerce Terms](#e-commerce-terms)
- [Architecture & Design Patterns](#architecture--design-patterns)
- [Security Terms](#security-terms)
- [Development & Operations](#development--operations)
- [Business & Product Terms](#business--product-terms)
- [Abbreviations & Acronyms](#abbreviations--acronyms)

---

## General Terms

### Application
The complete software system including frontend, backend, and database components that make up The Lil Gift Corner e-commerce platform.

### Codebase
The collection of all source code, configuration files, and related assets that comprise the application.

### Environment
A specific deployment context such as development, staging, or production, each with its own configuration and data.

### Full-Stack
Refers to development covering both frontend (client-side) and backend (server-side) aspects of the application.

### Project
The Lil Gift Corner e-commerce platform as a whole, including code, documentation, and related assets.

### Repository
A version-controlled storage location for the project code, typically hosted on GitHub.

---

## Technical Terms

### API (Application Programming Interface)
A set of defined methods and protocols that allow different software components to communicate. In this project, the REST API enables the frontend to interact with the backend.

### Async/Asynchronous
Programming paradigm where operations can run independently without blocking other operations. Used extensively in the FastAPI backend with Motor driver.

### Client
The user-facing part of the application (web browser) that makes requests to the server.

### Endpoint
A specific URL path in the API that performs a particular function (e.g., `/api/products`).

### JSON (JavaScript Object Notation)
A lightweight data format used for transmitting data between the frontend and backend.

### Server
The backend application that processes requests, executes business logic, and manages data.

### Session
A temporary interaction period between a user and the application, often tracked via session IDs.

### UUID (Universally Unique Identifier)
A 128-bit identifier used as unique IDs for database records (e.g., product IDs, user IDs).

---

## Frontend Technologies

### React
A JavaScript library for building user interfaces using component-based architecture. Version 19.0.0 used in this project.

### Component
A reusable piece of UI in React that encapsulates structure, styling, and behavior.

### Hook
A React feature that allows using state and other React features in functional components (e.g., `useState`, `useEffect`).

### JSX (JavaScript XML)
A syntax extension for JavaScript that allows writing HTML-like code within JavaScript, used in React components.

### Props
Short for "properties" - data passed from parent components to child components in React.

### State
Data that changes over time in a React component, triggering re-renders when updated.

### React Router
A library for handling client-side routing in React applications (v7.5.1 in this project).

### SPA (Single Page Application)
A web application that loads a single HTML page and dynamically updates content without full page reloads.

### TailwindCSS
A utility-first CSS framework for rapidly building custom user interfaces (v3.4.17).

### Shadcn UI
A collection of accessible, customizable UI components built on Radix UI primitives.

### Radix UI
A library of unstyled, accessible UI primitives for building high-quality design systems.

### Axios
A promise-based HTTP client for making API requests from the browser (v1.8.4).

### CRACO (Create React App Configuration Override)
A tool for customizing Create React App configuration without ejecting.

---

## Backend Technologies

### FastAPI
A modern, fast (high-performance) web framework for building APIs with Python 3.11+ (v0.110.1).

### Python
The programming language used for backend development (version 3.11+).

### Uvicorn
A lightning-fast ASGI server implementation used to run the FastAPI application (v0.25.0).

### ASGI (Asynchronous Server Gateway Interface)
A standard interface between async-capable Python web servers and applications.

### Motor
An async Python driver for MongoDB, enabling non-blocking database operations (v3.3.1).

### Pydantic
A data validation library using Python type hints, used for request/response validation (v2.12.4).

### PyJWT
A Python library for encoding and decoding JSON Web Tokens (v2.10.1).

### Bcrypt
A password hashing function used for secure password storage.

### Passlib
A password hashing library that provides support for bcrypt and other algorithms (v4.1.3).

### emergentintegrations
A library for simplified Stripe integration (v0.1.0).

### Middleware
Software that sits between the HTTP request and route handler, performing functions like logging, CORS, error handling.

### Route Handler
A function that processes HTTP requests for a specific endpoint.

### Dependency Injection
A design pattern where dependencies are provided to a component rather than created within it.

---

## Database Terms

### MongoDB
A NoSQL document-oriented database used for storing application data.

### NoSQL
A category of databases that don't use traditional relational tables, instead using flexible document structures.

### Collection
A grouping of MongoDB documents, similar to a table in relational databases.

### Document
A single record in MongoDB, stored in BSON format (similar to JSON).

### BSON (Binary JSON)
A binary representation of JSON-like documents used by MongoDB.

### Index
A database structure that improves query performance by creating ordered references to data.

### Query
A request to retrieve, insert, update, or delete data from the database.

### Projection
Specifying which fields to include or exclude in query results to reduce data transfer.

### MongoDB Atlas
MongoDB's cloud-hosted database service (Database-as-a-Service).

### Aggregation
A pipeline of operations that process documents and return computed results (e.g., counting, grouping).

### Schema
The structure and organization of data in the database, though MongoDB is schema-flexible.

---

## E-Commerce Terms

### SKU (Stock Keeping Unit)
A unique identifier for each distinct product variant.

### Cart/Shopping Cart
A temporary collection of items a customer intends to purchase.

### Checkout
The process of completing a purchase, including payment and order confirmation.

### Order
A completed purchase transaction including customer information, items, and payment details.

### Product
An item available for purchase in the store.

### Category
A classification system for organizing products (e.g., "Gift Boxes", "Wedding Favors").

### Tag
A keyword or label associated with products for search and filtering (e.g., "cute", "aesthetic").

### Inventory
The quantity of products available for sale.

### Stock Status
Indicates whether a product is available for purchase (in stock vs. out of stock).

### Coupon/Discount Code
A code that provides a discount on purchases.

### Wishlist
A list of products a user saves for potential future purchase.

### Review
Customer feedback and rating for a product.

### Custom Gift Request
A form where customers can request personalized or bulk gift orders.

---

## Architecture & Design Patterns

### Three-Tier Architecture
An architecture pattern with separate presentation (UI), application (logic), and data (storage) layers.

### Layered Architecture
Organizing code into horizontal layers with specific responsibilities.

### MVC (Model-View-Controller)
A design pattern separating data (Model), UI (View), and logic (Controller).

### Repository Pattern
Abstracts data access logic into repository classes for better separation of concerns.

### Service Layer Pattern
Encapsulates business logic in service classes separate from controllers and data access.

### Microservices
An architectural style where an application is composed of small, independent services.

### Monolithic Architecture
An architectural style where all components are part of a single application (current architecture).

### RESTful
An architectural style for APIs using HTTP methods and standard conventions.

### Stateless
An architecture where the server doesn't store client state between requests.

### Separation of Concerns
A principle of organizing code so different aspects are handled by different modules.

---

## Security Terms

### Authentication
The process of verifying a user's identity (login).

### Authorization
The process of determining what actions an authenticated user can perform.

### JWT (JSON Web Token)
A compact, URL-safe token format used for authentication, containing user information and signature.

### Token
A piece of data used to authenticate requests after initial login.

### Password Hash
A one-way cryptographic transformation of a password for secure storage.

### Salt
Random data added to passwords before hashing to prevent rainbow table attacks.

### CORS (Cross-Origin Resource Sharing)
A security mechanism that allows or restricts requests from different domains.

### HTTPS (HTTP Secure)
HTTP protocol over TLS/SSL for encrypted communication.

### XSS (Cross-Site Scripting)
A security vulnerability where malicious scripts are injected into trusted websites.

### SQL Injection
A security vulnerability where malicious SQL code is inserted into queries (MongoDB uses NoSQL, less vulnerable).

### CSRF (Cross-Site Request Forgery)
An attack that tricks users into executing unwanted actions on authenticated sessions.

### Role-Based Access Control (RBAC)
A security model where permissions are assigned based on user roles (customer vs. admin).

### PCI Compliance
Payment Card Industry security standards for handling credit card information (handled by Stripe).

---

## Development & Operations

### CI/CD (Continuous Integration/Continuous Deployment)
Practices for automating code testing and deployment.

### DevOps
Practices combining software development and IT operations for faster delivery.

### Environment Variables
Configuration values stored outside the code (e.g., database URLs, API keys).

### .env File
A file containing environment variables for local development.

### Git
A version control system for tracking code changes.

### GitHub
A web-based platform for hosting Git repositories.

### Branch
A parallel version of code in Git for developing features independently.

### Commit
A saved snapshot of code changes in Git.

### Pull Request (PR)
A request to merge code changes from one branch to another, often with code review.

### Deployment
The process of releasing code to a production environment.

### Production
The live environment where real users access the application.

### Staging
A pre-production environment for testing before deployment.

### Development
The local environment where developers write and test code.

### Build
The process of compiling and preparing code for deployment.

### Hot Reload
Automatic reloading of code changes during development without full restart.

### Linting
Automated checking of code for style and potential errors.

### Dependency
External library or package required by the application.

### Package Manager
A tool for managing project dependencies (Yarn for frontend, pip for backend).

### Docker
A platform for containerizing applications (not currently used but could be).

### Kubernetes
A container orchestration platform (not currently used but could be).

---

## Business & Product Terms

### MVP (Minimum Viable Product)
The simplest version of a product with core features needed to launch.

### Boutique
A small, specialized retail store with unique products.

### SKU (already defined in E-Commerce)
Stock Keeping Unit.

### B2C (Business-to-Consumer)
Business model where companies sell directly to consumers.

### B2B (Business-to-Business)
Business model where companies sell to other businesses.

### Conversion Rate
Percentage of visitors who complete a desired action (e.g., make a purchase).

### Cart Abandonment
When users add items to cart but don't complete checkout.

### Customer Acquisition Cost (CAC)
Cost of acquiring a new customer.

### Lifetime Value (LTV)
Total revenue expected from a customer over their relationship with the business.

### ROI (Return on Investment)
Measure of profitability calculated as (Revenue - Cost) / Cost.

### Churn Rate
Percentage of customers who stop using the service.

---

## Abbreviations & Acronyms

### API
Application Programming Interface

### ASGI
Asynchronous Server Gateway Interface

### BSON
Binary JSON

### CAC
Customer Acquisition Cost

### CDN
Content Delivery Network

### CI/CD
Continuous Integration/Continuous Deployment

### CORS
Cross-Origin Resource Sharing

### CRACO
Create React App Configuration Override

### CRUD
Create, Read, Update, Delete (basic database operations)

### CSRF
Cross-Site Request Forgery

### CSS
Cascading Style Sheets

### DRY
Don't Repeat Yourself (coding principle)

### E2E
End-to-End (testing)

### HTML
HyperText Markup Language

### HTTP
HyperText Transfer Protocol

### HTTPS
HTTP Secure

### ID
Identifier

### INR
Indian Rupees (currency)

### JSON
JavaScript Object Notation

### JSX
JavaScript XML

### JWT
JSON Web Token

### LTV
Lifetime Value

### MVC
Model-View-Controller

### MVP
Minimum Viable Product

### NoSQL
Not Only SQL

### ORM
Object-Relational Mapping

### PCI DSS
Payment Card Industry Data Security Standard

### PR
Pull Request

### QA
Quality Assurance

### RBAC
Role-Based Access Control

### REST
Representational State Transfer

### ROI
Return on Investment

### SEO
Search Engine Optimization

### SKU
Stock Keeping Unit

### SPA
Single Page Application

### SQL
Structured Query Language

### SSL
Secure Sockets Layer

### TLS
Transport Layer Security

### UI
User Interface

### URL
Uniform Resource Locator

### UX
User Experience

### UUID
Universally Unique Identifier

### WCAG
Web Content Accessibility Guidelines

### XSS
Cross-Site Scripting

### YAML
YAML Ain't Markup Language

---

## Project-Specific Terms

### The Lil Gift Corner
The name of the e-commerce platform and business.

### Admin Dashboard
The administrative interface for managing products, orders, and customers.

### Shadcn Component
One of the 49 pre-built UI components from the Shadcn UI library used in the project.

### Session ID
A unique identifier for a user's shopping session, used to track cart items for guest users.

### Order Tracking
A feature that allows customers to view the status of their orders.

### Custom Gift Request
A form feature allowing customers to request personalized bulk orders.

### Emergent Integrations
The library used for Stripe payment integration.

### Stripe Checkout
Stripe's hosted payment page for securely collecting payment information.

### lilgiftcorner_db
The default MongoDB database name used in development.

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Next Review**: June 2025

---

[← Back to README](README.md)
