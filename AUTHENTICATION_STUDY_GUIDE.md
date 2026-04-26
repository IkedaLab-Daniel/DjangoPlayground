# Authentication Study Guide (Beginner Friendly)

This file explains how the authentication system in this project is designed so students can study a clean, well-architected approach.

## 1. What This Project Uses

- Django as the web framework
- Django REST Framework (DRF) for APIs
- Djoser for user management endpoints
- SimpleJWT for JWT access and refresh tokens
- A custom user model for government-specific fields

This is a good learning setup because each tool has a clear responsibility.

## 2. High-Level Architecture

```text
Client (Web/Mobile/Postman)
        |
        | HTTP JSON requests
        v
Django URL Router
        |
        +--> Djoser Auth Endpoints (/api/auth/...)
        |
        +--> Protected Gov Endpoints (/api/gov/...)
                 |
                 v
            DRF Permission + JWT Authentication
                 |
                 v
            Custom User Model (GovernmentUser)
```

## 3. Project Files to Study First

- `authPractice/settings.py`
  - DRF auth classes
  - JWT settings
  - Djoser settings
  - `AUTH_USER_MODEL`
- `authPractice/urls.py`
  - Route composition for `/api/auth/` and `/api/gov/`
- `tokenbase/models.py`
  - Custom user model with domain-specific fields
- `tokenbase/serializers.py`
  - Djoser serializers customized for `GovernmentUser`
- `tokenbase/views.py`
  - Protected APIs and authorization logic
- `tokenbase/urls.py`
  - Endpoint paths for gov resources

## 4. Why a Custom User Model?

`GovernmentUser` extends `AbstractUser` and adds domain fields:

- `government_id` (unique ID)
- `agency_name`
- `security_clearance` (`PUBLIC`, `CONFIDENTIAL`, `SECRET`, `TOP_SECRET`)
- `mfa_verified` (extra security gate)
- `last_security_training`

This is better than keeping everything in profile tables when authentication/authorization decisions need these fields directly.

## 5. Endpoint Groups

### 5.1 Auth Endpoints (Djoser + JWT)

Base: `/api/auth/`

Common routes:

- `POST /api/auth/users/` (register)
- `GET /api/auth/users/me/` (current user)
- `POST /api/auth/jwt/create/` (login, get access+refresh)
- `POST /api/auth/jwt/refresh/` (refresh access token)
- `POST /api/auth/jwt/verify/` (verify token)

### 5.2 Government Protected Endpoints

Base: `/api/gov/`

- `GET /api/gov/portal/`
  - Requires valid JWT
  - Returns basic authenticated profile data

- `GET /api/gov/classified-briefing/`
  - Requires valid JWT
  - Requires `mfa_verified = true`
  - Requires clearance in `{SECRET, TOP_SECRET}`
  - Otherwise returns HTTP `403`

## 6. Authentication Flow (Step by Step)

1. User registers with `/api/auth/users/`.
2. User logs in with `/api/auth/jwt/create/`.
3. Server returns:
   - access token (short-lived)
   - refresh token (longer-lived)
4. Client sends access token in header:
   - `Authorization: Bearer <access_token>`
5. DRF JWT authentication validates token and attaches `request.user`.
6. View-level rules check user state (for example MFA + clearance).

## 7. Example Requests

## Register

```bash
curl -X POST http://127.0.0.1:8000/api/auth/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "govstudent1",
    "email": "govstudent1@example.gov",
    "password": "StrongPass!123",
    "re_password": "StrongPass!123",
    "government_id": "GOV-1001",
    "agency_name": "Department of Digital Services",
    "security_clearance": "SECRET"
  }'
```

## Login (JWT Create)

```bash
curl -X POST http://127.0.0.1:8000/api/auth/jwt/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "govstudent1",
    "password": "StrongPass!123"
  }'
```

## Access Protected Portal

```bash
curl http://127.0.0.1:8000/api/gov/portal/ \
  -H "Authorization: Bearer <access_token>"
```

## Access Classified Briefing

```bash
curl http://127.0.0.1:8000/api/gov/classified-briefing/ \
  -H "Authorization: Bearer <access_token>"
```

If MFA is false or clearance is too low, this endpoint correctly returns `403 Forbidden`.

## 8. Security Choices in This Codebase

From `SIMPLE_JWT` in settings:

- Access token lifetime: 5 minutes
- Refresh token lifetime: 12 hours
- Refresh rotation enabled
- Blacklist after rotation enabled
- Update last login enabled

Why this is good:

- Short access tokens reduce risk if stolen
- Refresh rotation helps prevent replay attacks
- Blacklist support helps revoke rotated/old refresh tokens

## 9. Well-Architected Principles Demonstrated

1. Separation of concerns
   - Routing, auth config, model, serializer, and business rules are separated.
2. Principle of least privilege
   - Users only access protected resources after authentication.
3. Defense in depth
   - Token auth plus extra domain checks (MFA + clearance).
4. Explicit domain modeling
   - Security concepts are stored directly in the user model.
5. Extensibility
   - Easy to add role checks, audit logs, and real MFA flows later.

## 10. How to Run This Project

```bash
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Server URL:

- `http://127.0.0.1:8000/`

## 11. Production Hardening Checklist

Before deploying to production, improve the following:

- Move `SECRET_KEY` to environment variables
- Set `DEBUG = False`
- Restrict `ALLOWED_HOSTS`
- Enforce HTTPS
- Add secure cookie and proxy settings
- Add brute-force/rate-limiting controls
- Implement real MFA challenge and verification flow
- Add audit logging for sensitive endpoint access
- Add automated tests for auth and authorization paths

## 12. Suggested Student Exercises

1. Add a new endpoint that only `TOP_SECRET` can access.
2. Add a custom JWT claim for `security_clearance`.
3. Write unit tests for `portal` and `classified-briefing` authorization.
4. Add account lockout after repeated failed login attempts.
5. Add an endpoint to toggle MFA after a simulated OTP validation.

---

If you are new to auth systems, study this order:

1. `tokenbase/models.py`
2. `authPractice/settings.py`
3. `authPractice/urls.py`
4. `tokenbase/views.py`
5. Then test with curl/Postman.