const DetailComment = require('../../Domains/comments/entities/DetailComment');

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(id) {
    const thread = await this._threadRepository.getDetailThread(id);
    const comments = await this._commentRepository.getCommentsInAThread(id);

    return {
      ...thread,
      comments: comments.map((comment) => {
        if (comment.is_deleted == 1)
          return new DetailComment({ ...comment, content: '**komentar telah dihapus**' });
        return new DetailComment({ ...comment });
      }),
    };
  }
}

module.exports = GetDetailThreadUseCase;
