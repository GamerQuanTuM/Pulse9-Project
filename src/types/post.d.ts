interface Post {
  id: string;
  title: string;
  content: string;
  forumId: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: Author; 
  forum?: Forum;
}
