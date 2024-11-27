export class UserResponseDTO {
    id: number;
    name: string;
    picture: string;
    linktree: string | null;
    isAuthor?: boolean = false;
  
    constructor(
      id: number,
      name: string,
      picture: string,
      linktree: string | null,
      isAuthor?: boolean,
    ) {
      this.id = id;
      this.name = name;
      this.picture = picture;
      this.linktree = linktree;
      this.isAuthor = isAuthor ?? false;
    }
  }
  