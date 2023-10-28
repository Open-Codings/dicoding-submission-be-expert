const MakeComment = require('../MakeComment');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Bagus'
    };

    // Action and Assert
    expect(() => new MakeComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error then payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: [],
      content: 123,
      owner: {},
    };

    // Action and Assert
    expect(() => new MakeComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create makeComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'Bagus',
      owner: 'user-123',
    };

    // Action
    const { threadId, content, owner } = new MakeComment(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
