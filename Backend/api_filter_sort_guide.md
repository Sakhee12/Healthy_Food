# API Filter & Sort Reference Guide

This guide details the query parameters available for filtering, sorting, and paginating the Product and Category APIs.

---

## 📦 Product API
**Endpoint:** `GET /api/products`

### Filtering Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `search` | String | Search by product name (Partial match) |
| `category` | Number | Filter by Category ID |
| `brand` | String | Filter by brand name |
| `minPrice` | Number | Minimum price limit |
| `maxPrice` | Number | Maximum price limit |
| `rating` | Number | Minimum rating (e.g., `4` for 4 stars and above) |

### Sorting Parameters
Use the `sort` key with one of the following values:
| Value | Description |
| :--- | :--- |
| `price_asc` | Price: Low to High |
| `price_desc` | Price: High to Low |
| `rating` | Highest Rated First |
| `newest` | Latest Products First |
| `discount` | Highest Discount First |
| (default) | Sorted by ID (Descending) |

### Pagination Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | Number | `1` | The page number to retrieve |
| `limit` | Number | `12` | Number of items per page |

---

## 📂 Category API
**Endpoint:** `GET /api/admin/categories`

### Filtering Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `category_name`| String | Search by category name (Partial match) |
| `name` | String | Alias for `category_name` |
| `status` | Number | Filter by status (`1` for active, `0` for inactive) |
| `parent_id` | Number | Filter by parent category ID |

### Sorting
Categories are automatically sorted by:
1. `display_order` (Ascending)
2. `created_at` (Descending)

---

## 💡 Usage Example
**Get top-rated fruits in page 2:**
`GET /api/products?category=5&rating=4&sort=rating&page=2&limit=10`
