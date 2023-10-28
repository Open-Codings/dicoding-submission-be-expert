const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const MakeComment = require('../../../Domains/comments/entities/MakeComment');
const MadeComment = require('../../../Domains/comments/entities/MadeComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist make thread and return made comment correctly', async () => {
      // Arrange
      const makeComment = new MakeComment({
        threadId: 'thread-123',
        content: 'Bagus',
        owner: 'user-123',
      });

      // make the requirements
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(makeComment);

      // Assert
      const comment =
        await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return made comment correctly', async () => {
      // Arrange
      const makeComment = new MakeComment({
        threadId: 'thread-123',
        content: 'Bagus',
        owner: 'user-123',
      });

      // make the requirements
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const madeComment =
        await commentRepositoryPostgres.addComment(makeComment);

      // Assert
      expect(madeComment).toStrictEqual(
        new MadeComment({
          id: 'comment-123',
          content: 'Bagus',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('checkAvailabilityCommentInAThread', () => {
    it('should return NotFoundError when the payload not matched', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, '');

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkAvailabilityCommentInAThread(
          'comment-123',
          'thread-abc',
        ),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not return NotFoundError when the payload not matched', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, '');

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkAvailabilityCommentInAThread(
          'comment-123',
          'thread-123',
        ),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifCommentOwner function', () => {
    it('should return Authorization error when owner not matched', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, '');

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifCommentOwner(
          'comment-123',
          'user-abc',
        ),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not return Authorization error when owner not matched', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, '');

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifCommentOwner(
          'comment-123',
          'user-123',
        ),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('delCommentById function', () => {
    it('shoud delete the comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, '');

      // Action & Assert
      await expect(
        commentRepositoryPostgres.delCommentById(
          'comment-123',
        ),
      ).resolves.not.toThrowError(AuthorizationError);
    })
  })

  describe('getCommentsInAThread function', () => {
    it('should return array with one item', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, '');

      // Action
      const comments = await commentRepositoryPostgres.getCommentsInAThread('thread-123')

      // Assert
      expect(comments).toBeInstanceOf(Array)
      expect(comments).toHaveLength(1)
    })
  })
});
