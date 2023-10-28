const DetailComment = require('../DetailComment')

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'bayprime',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: {},
      date: [],
      content: 456,
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create detailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'bayprime',
      date: '2021-08-08T07:22:33.555Z',
      content: 'Bagus',
    };

    // Action
    const detailCommnet = new DetailComment(payload);

    // Assert
    expect(detailCommnet.id).toEqual(payload.id);
    expect(detailCommnet.username).toEqual(payload.username);
    expect(detailCommnet.date).toEqual(payload.date);
    expect(detailCommnet.content).toEqual(payload.content);
  });
});
