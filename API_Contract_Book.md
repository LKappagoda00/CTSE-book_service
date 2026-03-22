# Book Service - API Contract (OpenAPI/Swagger Format)

## Base URL
`/api/books`

## Endpoints

### 1. Get All Books
**GET** `/`
- **Description:** Retrieves the entire catalog of available books.
- **Responses:**
  - `200 OK`: Returns an array of book objects.

### 2. Get Book by ID
**GET** `/{id}`
- **Description:** Retrieves detailed information for a specific book.
- **Responses:**
  - `200 OK`: Returns a single book object.
  - `404 Not Found`: Book does not exist.

### 3. Create a New Book (Admin)
**POST** `/`
- **Description:** Adds a new book to the inventory.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "price": 15.99,
    "stock": 50
  }
  ```
- **Responses:**
  - `201 Created`: Book successfully added.
  - `403 Forbidden`: Action requires admin privileges.

### 4. Update a Book (Admin)
**PUT** `/{id}`
- **Description:** Modifies existing book details (price, stock, etc.).
- **Headers:** `Authorization: Bearer <token>`
- **Responses:**
  - `200 OK`: Book updated successfully.

### 5. Delete a Book (Admin)
**DELETE** `/{id}`
- **Description:** Removes a book from the catalog.
- **Headers:** `Authorization: Bearer <token>`
- **Responses:**
  - `200 OK`: Book removed successfully.
