const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUSeCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };

    const mockDetailThread = {
      id: 'thread-123',
      title: 'Belajar TDD dengan Hapi',
      body: 'Belajar TDD dengan Hapi besama Dicoding Indonesia',
      date: '2021-08-08T07:19:09.775Z',
      username: 'bayprime',
    };

    const mockDetailComment = {
      id: 'comment-123',
      username: 'lucky',
      date: '2021-08-08T07:22:33.555Z',
      content: 'Bagus',
    };
    // creating dependencies of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.getDetailThread = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new DetailThread(mockDetailThread)),
      );
    mockCommentRepository.getCommentsInAThread = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([new DetailComment(mockDetailComment)]),
      );

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toEqual({
      ...mockDetailThread,
      comments: [mockDetailComment],
    });
  });

  it('should orchestrating the get thread detail action correctly with deleted comment', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };

    const mockDetailThread = {
      id: 'thread-123',
      title: 'Belajar TDD dengan Hapi',
      body: 'Belajar TDD dengan Hapi besama Dicoding Indonesia',
      date: '2021-08-08T07:19:09.775Z',
      username: 'bayprime',
    };

    const mockDetailComment = {
      id: 'comment-123',
      username: 'lucky',
      date: '2021-08-08T07:22:33.555Z',
      content: 'Bagus',
      is_deleted: 1,
    };
    // creating dependencies of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.getDetailThread = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new DetailThread(mockDetailThread)),
      );
    mockCommentRepository.getCommentsInAThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve([mockDetailComment]));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toEqual({
      ...mockDetailThread,
      comments: [
        {
          id: 'comment-123',
          username: 'lucky',
          date: '2021-08-08T07:22:33.555Z',
          content: '**komentar telah dihapus**',
        },
      ],
    });
  });
});
