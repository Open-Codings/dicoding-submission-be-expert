const MakeComment = require('../../Domains/comments/entities/MakeComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const makeComment = new MakeComment(useCasePayload);
    await this._threadRepository.checkAvailabilityThread(makeComment.threadId)
    return this._commentRepository.addComment(makeComment);
  }
}

module.exports = AddCommentUseCase;
