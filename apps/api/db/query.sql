-- name: ListMessages :many
SELECT id, content, created_at
FROM messages
ORDER BY id DESC
LIMIT 50;

-- name: CreateMessage :one
INSERT INTO messages (content)
VALUES ($1)
RETURNING id, content, created_at;
