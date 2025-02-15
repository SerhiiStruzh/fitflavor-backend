export class PostResponseDTO {
    id: number;
    title: string;
    body: string;
    username: string;
    userId: number;
    likesAmount: number;
    commentsAmount: number
    authorPicture: string;
    isLiked?: boolean = false;
    isAuthor?: boolean = false;
  
    constructor(
      id: number,
      title: string,
      body: string,
      username: string,
      userId: number,
      likesAmount: number,
      commentsAmount: number,
      authorPicture: string,
      isLiked?: boolean,
      isAuthor?: boolean,
    ) {
      this.id = id;
      this.title = title;
      this.body = body;
      this.username = username;
      this.userId = userId;
      this.likesAmount = likesAmount;
      this.commentsAmount = commentsAmount;
      this.authorPicture = authorPicture;
      this.isLiked = isLiked ?? false;
      this.isAuthor = isAuthor ?? false;
    }
  }
  