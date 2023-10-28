const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const MakeThread = require('../../../Domains/threads/entities/MakeThread');
const MadeThread = require('../../../Domains/threads/entities/MadeThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist make thread and return made thread correctly', async () => {
      // Arrange
      const makeThread = new MakeThread({
        title: 'Belajar TDD dengan Hapi',
        body: 'Belajar TDD dengan Hapi besama Dicoding Indonesia',
        owner: 'user-123',
      });

      // make the requirements
      await UsersTableTestHelper.addUser({});

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await threadRepositoryPostgres.addThread(makeThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return made thread correctly', async () => {
      // Arrange
      const makeThread = new MakeThread({
        title: 'Belajar TDD dengan Hapi',
        body: 'Belajar TDD dengan Hapi besama Dicoding Indonesia',
        owner: 'user-123',
      });

      // make the requirements
      await UsersTableTestHelper.addUser({});

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const madeThread = await threadRepositoryPostgres.addThread(makeThread);

      // Assert
      expect(madeThread).toStrictEqual(
        new MadeThread({
          id: 'thread-123',
          title: 'Belajar TDD dengan Hapi',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('checkAvailabilityThread', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, '');

      // Action & Assert
      await expect(
        threadRepositoryPostgres.checkAvailabilityThread('t-abc'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, '');

      // Action & Assert
      await expect(
        threadRepositoryPostgres.checkAvailabilityThread('thread-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getDetailThread', () => {
    it('should return NotFoundError when the id is incorrect', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        date: '2021-08-08T07:19:09.775Z',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, '');

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getDetailThread('thread-456'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return DetailThread object correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        date: '2021-08-08T07:19:09.775Z',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, '');

      // Action
      const detailThread =
        await threadRepositoryPostgres.getDetailThread('thread-123');

      // Assert
      expect(detailThread).toEqual(
        new DetailThread({
          id: 'thread-123',
          title: 'Belajar TDD dengan Hapi',
          body: 'Belajar TDD dengan Hapi besama Dicoding Indonesia',
          date: '2021-08-08T07:19:09.775Z',
          username: 'lucky',
        }),
      );
    });
  });
});
