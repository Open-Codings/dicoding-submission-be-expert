const MakeThread = require('../MakeThread');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: [],
    };

    // Action and Assert
    expect(() => new MakeThread(payload)).toThrowError(
      'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error then payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: [],
      owner: {},
    };

    // Action and Assert
    expect(() => new MakeThread(payload)).toThrowError(
      'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should throw error when title contains more than 50 character', () => {
    // Arrange
    const payload = {
      title:
        'Belajar TDD dengan HapiBelajar TDD dengan HapiBelajar TDD dengan HapiBelajar TDD dengan Hapi',
      body: 'Belajar TDD dengan Hapi',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new MakeThread(payload)).toThrowError(
      'ADD_THREAD.TITLE_LIMIT_CHAR',
    );
  });

  it('should create makeComment object correctly', () => {
    // Arrange
    const payload = {
      title: 'Belajar TDD dengan Hapi',
      body: 'Belajar TDD dengan Hapi besama Dicoding Indonesia',
      owner: 'user-123',
    };

    // Action
    const { title, body, owner } = new MakeThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
