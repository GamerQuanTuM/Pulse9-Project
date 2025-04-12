interface Forum {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  posts?: Post[];
  authorId: string;
  author?: Author;
}
