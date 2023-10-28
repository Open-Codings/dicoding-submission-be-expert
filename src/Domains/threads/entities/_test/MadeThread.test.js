const MadeThread = require('../MadeThread');

describe('a MadeThread entities', () => {
  it('should throw error when payload did not countain needed property', () => {
    // Arrange
    const payload = {
      title: 'Belajar TDD dengan Hapi',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new MadeThread(payload)).toThrowError(
      'MADE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: [],
      owner: {},
    };

    // Action and Assert
    expect(() => new MadeThread(payload)).toThrowError(
      'MADE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create madeThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Belajar TDD dengan Hapi',
      owner: 'user-123',
    };

    // Action
    const madeThread = new MadeThread(payload);

    // Assert
    expect(madeThread.id).toEqual(payload.id);
    expect(madeThread.title).toEqual(payload.title);
    expect(madeThread.owner).toEqual(payload.owner);
  });
});
