const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId } = request.params;
    const reqPayload = {
      threadId,
      ...request.payload,
      owner: userId,
    };

    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name,
    );
    const addedComment = await addCommentUseCase.execute(reqPayload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const reqPayload = {
      id: commentId,
      threadId,
      owner: userId,
    };

    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name,
    );
    await deleteCommentUseCase.execute(reqPayload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
