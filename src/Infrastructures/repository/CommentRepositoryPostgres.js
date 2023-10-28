const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const MadeComment = require('../../Domains/comments/entities/MadeComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(makeComment) {
    const { threadId, content, owner } = makeComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, content, owner, date],
    };

    const result = await this._pool.query(query);

    return new MadeComment({ ...result.rows[0] });
  }

  async checkAvailabilityCommentInAThread(id, threadId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [id, threadId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError('Comment tidak ditemukan didatabase');
    }
  }

  async verifCommentOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    let resultOwner = result.rows[0].owner;
    if (resultOwner != owner) {
      throw new AuthorizationError('Owner dari comment tidak sesuai');
    }
  }

  async delCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = 1 WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getCommentsInAThread(id) {
    const query = {
      text: `
        SELECT c.id, u.username, c.date, c.content, c.is_deleted
          FROM comments AS c
          LEFT JOIN users AS u
            ON c.owner = u.id
        WHERE c.thread_id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
