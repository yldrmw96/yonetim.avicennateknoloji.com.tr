

/**
 * @params title: string, lang_id: string, excerpt: string, status: string, slug: string, slug_uid: string, ownership_id: string, content: string, created_at: string, updated_at: string, published_at: string.
 */

export const insertPostQuery = `INSERT INTO posts (title, lang_id, excerpt, status, slug, slug_uid, ownership_id, content, created_at, updated_at, published_at) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)`