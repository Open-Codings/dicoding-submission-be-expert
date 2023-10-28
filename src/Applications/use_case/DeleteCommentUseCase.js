const RemoveComment = require('../../Domains/comments/entities/RemoveComment');

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const removeComment = new RemoveComment(useCasePayload);
    await this._commentRepository.checkAvailabilityCommentInAThread(
      removeComment.id,
      removeComment.threadId,
    );
    await this._commentRepository.verifCommentOwner(
      removeComment.id,
      removeComment.owner,
    );
    await this._commentRepository.delCommentById(removeComment.id);
  }
}

module.exports = DeleteCommentUseCase;
