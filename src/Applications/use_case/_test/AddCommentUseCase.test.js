const MakeComment = require('../../../Domains/comments/entities/MakeComment');
const MadeComment = require('../../../Domains/comments/entities/MadeComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'Bagus',
      owner: 'user-123',
    };

    const mockMadeComment = new MadeComment({
      id: 'comment-123',
      content: 'Bagus',
      owner: 'user-123',
    });

    // creating dependencies of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockMadeComment));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const madeComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(madeComment).toStrictEqual(
      new MadeComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    );
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new MakeComment({
        threadId: useCasePayload.threadId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    );
  });
});
