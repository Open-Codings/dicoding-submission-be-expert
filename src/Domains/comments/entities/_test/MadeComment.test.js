const MadeComment = require('../MadeComment');

describe('a MadeComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Bagus'
    };

    // Action and Assert
    expect(() => new MadeComment(payload)).toThrowError(
      'MADE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: [],
      owner: {},
    };

    // Action and Assert
    expect(() => new MadeComment(payload)).toThrowError(
      'MADE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create madeComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Bagus',
      owner: 'user-123',
    };

    // Action
    const madeCommnet = new MadeComment(payload);

    // Assert
    expect(madeCommnet.id).toEqual(payload.id);
    expect(madeCommnet.content).toEqual(payload.content);
    expect(madeCommnet.owner).toEqual(payload.owner);
  });
});
