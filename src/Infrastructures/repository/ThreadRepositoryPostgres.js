const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const DetailThread = require('../../Domains/threads/entities/DetailThread');
const MadeThread = require('../../Domains/threads/entities/MadeThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(makeThread) {
    const { title, body, owner } = makeThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);

    return new MadeThread({ ...result.rows[0] });
  }

  async checkAvailabilityThread(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError('Thread tidak ditemukan di database');
    }
  }

  async getDetailThread(id) {
    const query = {
      text: `
        SELECT t.id, t.title, t.body, t.date, u.username
          FROM threads AS t LEFT 
          JOIN users AS u
            ON t.owner = u.id
        WHERE t.id = $1
        `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError('Thread tidak ditemukan di database');
    }

    return new DetailThread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
