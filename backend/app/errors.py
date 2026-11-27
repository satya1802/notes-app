"""Error codes: one constant per failure a route in this app can return.

Each pairs the HTTP status with the exact message the client sees, so a route
declares its error responses from here and raises the same pair, and no two
places can drift apart on what a failure says.
"""

from fastapi import status

# AC-002 / NFR-003: wrong email, wrong password or no such account all look the
# same to the caller, so the message never says which one it was.
AUTH_INVALID_CREDENTIALS = (status.HTTP_401_UNAUTHORIZED, "The email or password is incorrect.")

# AC-007 / AC-008 / NFR-002: a missing, revoked or inactivity-expired session token all
# end the same way: the caller must sign in again.
AUTH_SESSION_EXPIRED = (
    status.HTTP_401_UNAUTHORIZED,
    "Your session has expired. Sign in again.",
)
