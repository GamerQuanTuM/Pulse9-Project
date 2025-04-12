interface Author {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  posts?: Post[];
  forums?: Forum[];
}
