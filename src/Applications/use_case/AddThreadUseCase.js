const MakeThread = require('../../Domains/threads/entities/MakeThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const makeThread = new MakeThread(useCasePayload);
    return this._threadRepository.addThread(makeThread);
  }
}

module.exports = AddThreadUseCase;
