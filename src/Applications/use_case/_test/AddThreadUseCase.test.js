const MakeThread = require('../../../Domains/threads/entities/MakeThread');
const MadeThread = require('../../../Domains/threads/entities/MadeThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Belajar TDD dengan Hapi',
      body: 'Belajar TDD dengan Hapi besama Dicoding Indonesia',
      owner: 'user-123',
    };

    const mockMadeThread = new MadeThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    // creating dependencies of use case
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockMadeThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const madeThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(madeThread).toStrictEqual(
      new MadeThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: useCasePayload.owner,
      }),
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new MakeThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      }),
    );
  });
});
