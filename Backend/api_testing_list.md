# Backend API Endpoints (Testing Reference)

Base URL: `http://localhost:5001/api`

## Authentication (`/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/auth/send-otp` | Send OTP to phone | No |
| POST | `/auth/verify-otp` | Verify OTP and login | No |
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login with email/password | No |
| POST | `/auth/forgot-password` | Request password reset | No |

## Product Management (`/products`)
| Method | Endpoint | Description | Required Roles |
| :--- | :--- | :--- | :--- |
| GET | `/products/` | Get all products (paginated) | No |
| GET | `/products/featured` | Get featured products | No |
| GET | `/products/trending` | Get trending products | No |
| POST | `/products/add` | Add a new product (Multipart) | superadmin, admin, manager |
| PUT | `/products/update/:id` | Update product (Multipart) | superadmin, admin, manager |
| DELETE| `/products/delete/:id` | Delete a product | superadmin, admin |

## Admin Management (`/admin`)
| Method | Endpoint | Description | Required Roles |
| :--- | :--- | :--- | :--- |
| GET | `/admin/users` | List all users | superadmin, admin |
| GET | `/admin/roles` | List all available roles | superadmin, admin |
| PUT | `/admin/update-role` | Update user's role | superadmin, admin |
| DELETE| `/admin/delete-user/:id` | Delete a user | superadmin, admin |
| GET | `/admin/categories` | List all categories | superadmin, admin, manager |
| POST | `/admin/categories/add` | Add category (Multipart) | superadmin, admin |
| PUT | `/admin/categories/update/:id` | Update category (Multipart) | superadmin, admin |
| DELETE| `/categories/delete/:id` | Delete a category | superadmin, admin |
| GET | `/admin/orders` | List all orders | superadmin, admin, manager |
| PUT | `/admin/orders/update-status` | Update order status | superadmin, admin, manager |

## Other
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/health` | Server health check | No |

---
**Note on Multipart Requests:**
For endpoints marked as **Multipart**, use `multipart/form-data`.
- Product Images: `product_image_file`, `image2_file`, `image3_file`
- Category Images: `category_image_file`, `banner_image_file`
