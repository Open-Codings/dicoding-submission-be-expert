const RemoveComment = require('../RemoveComment');

describe('a RemoveComment entities', () => {
  it('should throw error when payload did not contain needed property', async () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      threadId: 'thread-123',
    };

    // Action & Assert
    expect(() => new RemoveComment(payload)).toThrowError(
      'REMOVE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data specification', async () => {
    // Arrange
    const payload = {
      id: 123,
      threadId: [],
      owner: {},
    };

    // Action & Assert
    expect(() => new RemoveComment(payload)).toThrowError(
      'REMOVE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create removeComment object correctly', async () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const removeComment = new RemoveComment(payload)

    // Assert
    expect(removeComment.id).toEqual(payload.id)
    expect(removeComment.threadId).toEqual(payload.threadId)
    expect(removeComment.owner).toEqual(payload.owner)
  });
});
