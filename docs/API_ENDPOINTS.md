# Discovr API Documentation

This document lists all the API endpoints used in the Discovr platform. All endpoints are relative to the base URL: `https://discovr-backend.onrender.com`.

## 🔐 Authentication & Profile (General)
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/auth/signup` | POST | Creates a new Firebase user and MongoDB record. |
| `/auth/login` | POST | Logs in a user and ensures their record exists in MongoDB. |
| `/auth/change-password` | POST | Updates the user's password. |
| `/auth/forgot-password` | POST | Sends a password reset email. |
| `/auth/verify-reset-token` | GET | Validates a password reset token. |
| `/auth/reset-password` | POST | Resets password using a validated token. |
| `/api/profile` | GET, PUT, DELETE | Manage basic user profile data and account deletion. |
| `/api/profile/avatar` | POST | Uploads a user profile picture. |
| `/api/profile/notifications` | PUT | Updates email notification preferences. |
| `/api/waitlist/join` | POST | Public endpoint for waitlist signup. |

---

## 📢 Notifications
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/notifications` | GET | Fetches all user notifications. |
| `/api/notifications/unread-count`| GET | Returns count of unread notifications. |
| `/api/notifications/{id}/read` | PUT | Marks a specific notification as read. |
| `/api/notifications/{id}` | DELETE | Deletes a notification. |

---

## 🏢 Brand Dashboard
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/brand/profile` | GET | Fetches brand-specific profile data. |
| `/brand/campaigns` | GET, POST, PUT | Manage brand campaigns (List, Create, Update). |
| `/brand/campaigns/brief` | POST | Uploads campaign brief (FormData). |
| `/brand/campaigns/creators` | GET | Fetches creators invited/interested in a campaign. |
| `/brand/campaigns/creators/upload`| POST | Uploads a sheet of creators for a campaign. |
| `/brand/campaigns/creators/respond`| POST | Updates creator statuses (Negotiate/Accept/Reject). |
| `/brand/campaigns/creators/submit` | POST | Finalizes the selection of creators. |
| `/brand/campaigns/bids` | GET | Fetches all bids for a specific campaign. |
| `/brand/campaigns/finalize-amounts`| POST | Sets final payment amounts for creators. |
| `/brand/campaigns/scripts` | GET | Fetches scripts submitted by creators. |
| `/brand/campaigns/review-script` | POST | Approves or requests revisions for scripts. |
| `/brand/campaigns/content` | GET | Fetches video content submitted by creators. |
| `/brand/campaigns/review-content` | POST | Approves or requests revisions for content. |

---

## 🎨 Creator Dashboard
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/creator/campaigns` | GET | Fetches all campaigns available to/linked by the creator. |
| `/creator/campaigns/link` | POST | Links a campaign using a secure token. |
| `/creator/campaigns/brief` | GET | Fetches detailed brief for a specific campaign. |
| `/creator/campaigns/bid` | POST | Submits an initial bid amount for a campaign. |
| `/creator/campaigns/bid/respond` | POST | Responds to a brand's counter-offer (Accept/Reject). |
| `/creator/campaigns/bid-status` | GET | Checks the current status of a bid/negotiation. |
| `/creator/campaigns/script` | POST | Submits a video script for brand review. |
| `/creator/campaigns/content` | POST | Uploads final video content. |
| `/creator/campaigns/go-live` | POST | Submits the live social media link for the content. |

---

## 🛠 Admin Dashboard
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/admin/waitlist/list` | GET | Fetches all waitlist signups. |
| `/admin/brands/list` | GET | Fetches all registered brands. |
| `/admin/brands` | POST | Creates a new brand entity. |
| `/admin/brands/update` | POST | Updates brand details. |
| `/admin/brands/delete` | POST | Removes a brand. |
| `/admin/brands/owners` | POST | Creates a Brand Owner user. |
| `/admin/brands/owners/update` | POST | Updates Brand Owner details. |
| `/admin/brands/employees/assign` | POST | Assigns employees to a brand. |
| `/admin/brands/users/list` | GET | Lists all users associated with a brand. |
| `/admin/campaigns` | GET | Fetches all campaigns across the platform. |
| `/admin/campaigns/creators` | GET | Admin view of creators for any campaign. |
| `/admin/campaigns/creators/upload`| POST | Admin upload of creator sheets. |
| `/admin/campaigns/creators/notify-brief`| POST| Triggers notifications for the brief. |
| `/admin/campaigns/creators/notify-registration`| POST| Triggers registration notifications for creators. |
| `/admin/campaigns/finalize-creators`| POST | Finalizes synchronization between systems. |
| `/admin/campaigns/payments` | GET | Fetches payments for a specific campaign. |
| `/admin/campaigns/all-payments` | GET | Fetches all payments system-wide. |
| `/admin/campaigns/process-payment` | POST | Marks a payment as processed. |
| `/api/stats` | GET | System-wide performance statistics. |
