export class CommentResponseDTO {
  id: number;
  commentText: string;
  userId: number;
  userName: string;
  authorPicture: string;
  isAuthor?: boolean = false; 

  constructor(
    id: number,
    commentText: string,
    userId: number,
    userName: string,
    authorPicture: string,
    isAuthor?: boolean,
  ) {
    this.id = id;
    this.commentText = commentText;
    this.userId = userId;
    this.userName = userName;
    this.authorPicture = authorPicture;
    this.isAuthor = isAuthor ?? false;
  }
}
