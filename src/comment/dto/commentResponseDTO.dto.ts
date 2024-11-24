export class CommentResponseDTO {
  id: number;
  commentText: string;
  userId: number;
  userName: string;
  isAuthor?: boolean = false; 

  constructor(
    id: number,
    commentText: string,
    userId: number,
    userName: string,
    isAuthor?: boolean,
  ) {
    this.id = id;
    this.commentText = commentText;
    this.userId = userId;
    this.userName = userName;
    this.isAuthor = isAuthor ?? false;
  }
}
