-- name: ListMessages :many
SELECT id, content, created_at
FROM messages
ORDER BY id DESC
LIMIT 50;

-- name: CreateMessage :one
INSERT INTO messages (content)
VALUES ($1)
RETURNING id, content, created_at;

-- name: CreateUser :one
INSERT INTO users (name, email, password_hash, role)
VALUES ($1, $2, $3, $4)
RETURNING id, name, email, role, created_at, updated_at;

-- name: GetUserByEmail :one
SELECT id, name, email, password_hash, role, created_at, updated_at
FROM users
WHERE email = $1;

-- name: GetUserByID :one
SELECT id, name, email, role, created_at, updated_at
FROM users
WHERE id = $1;

-- name: UpdateUserName :one
UPDATE users
SET name = $2, updated_at = now()
WHERE id = $1
RETURNING id, name, email, role, created_at, updated_at;

-- name: CountUsers :one
SELECT count(*) FROM users;

-- name: ListUsers :many
SELECT id, name, email, role, created_at
FROM users
ORDER BY created_at DESC
LIMIT 200;

-- name: CreateSession :exec
INSERT INTO sessions (id, user_id, expires_at)
VALUES ($1, $2, $3);

-- name: GetSession :one
SELECT s.id, s.user_id, s.expires_at,
       u.name, u.email, u.role, u.created_at AS user_created_at
FROM sessions s
JOIN users u ON u.id = s.user_id
WHERE s.id = $1 AND s.expires_at > now();

-- name: DeleteSession :exec
DELETE FROM sessions WHERE id = $1;

-- name: DeleteExpiredSessions :exec
DELETE FROM sessions WHERE expires_at < now();
