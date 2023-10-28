const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.checkAvailabilityCommentInAThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.delCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockCommentRepository.checkAvailabilityCommentInAThread,
    ).toBeCalledWith(useCasePayload.id, useCasePayload.threadId);
    expect(mockCommentRepository.verifCommentOwner).toBeCalledWith(
      useCasePayload.id,
      useCasePayload.owner,
    );
    expect(mockCommentRepository.delCommentById(useCasePayload.id));
  });
});
