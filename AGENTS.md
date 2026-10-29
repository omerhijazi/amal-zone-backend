# REST API Design Guidelines & Standards

All endpoints developed for the **Amal Zone** backend must strictly follow these REST conventions.

---

## 1. Resource Naming & URI Hierarchy

- **Nouns over Verbs:** Use resource nouns, never action verbs in URIs (e.g., `/api/customer/cart/items`, NOT `/api/customer/addToCart`).
- **Plural Collections:** Collections of resources should be plural (e.g., `/products`, `/orders`, `/categories`).
- **Singletons:** Singular nouns are used only when a resource represents a unique singleton for the context/user (e.g., `/api/customer/cart`).
- **Sub-resources for Relationships:** Use nested paths to represent child or dependent entities:
  - Parent resource: `/api/customer/cart`
  - Sub-resource collection: `/api/customer/cart/items`
  - Individual sub-resource: `/api/customer/cart/items/:itemId`

---

## 2. HTTP Methods & Semantics

| Method | Purpose | Idempotent | Request Body | Standard Status Code |
| :--- | :--- | :--- | :--- | :--- |
| **`GET`** | Retrieve a resource or collection | Yes | None | `200 OK` |
| **`POST`** | Create a sub-resource or trigger state creation | No | Yes | `201 Created` (if strictly new resource), `200 OK` (if upserting representation) |
| **`PATCH`**| Partially update a resource (e.g., quantity, status) | Yes | Yes | `200 OK` |
| **`PUT`**  | Replace a resource completely | Yes | Yes | `200 OK` |
| **`DELETE`**| Remove a resource or clear a collection | Yes | None | `200 OK` (with returned state) or `204 No Content` |

---

## 3. Cart Resource Standard

```http
# The Cart
GET    /api/customer/cart                # View customer's cart (200 OK)
DELETE /api/customer/cart                # Clear all items from cart (200 OK)

# Cart Items Sub-resource
POST   /api/customer/cart/items          # Add item to cart / upsert (200 OK)
PATCH  /api/customer/cart/items/:itemId  # Update specific item quantity (200 OK)
DELETE /api/customer/cart/items/:itemId  # Remove specific item from cart (200 OK)
```

---

## 4. Wishlist Resource Standard

```http
# The Wishlist
GET    /api/customer/wishlist                    # View customer's wishlist (200 OK)
DELETE /api/customer/wishlist                    # Clear all items from wishlist (200 OK)

# Wishlist Products Sub-resource
POST   /api/customer/wishlist/products           # Add product to wishlist (200 OK)
DELETE /api/customer/wishlist/products/:productId # Remove product from wishlist (200 OK)
```

---

## 5. Orders & Checkout Standard

```http
# Checkout / Order Creation
POST   /api/customer/orders/checkout             # Checkout selected cart items into an order (201 Created)
```

---

## 6. DTOs & Validation

- Every input body must have a dedicated DTO with `class-validator` rules.
- Add `@ApiProperty` / `@ApiPropertyOptional` with realistic descriptions and examples to all DTO fields for comprehensive Swagger documentation.
- Use explicit types and constraints (e.g., `@IsInt()`, `@Min()`, `@IsEmail()`).
