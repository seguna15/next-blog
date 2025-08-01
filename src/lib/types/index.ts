export interface PostListProps {
    posts: Array<{
        id: number,
        title: string,
        description: string,
        slug: string,
        createdAt: Date,
        author: {
            name: string,
        }
    }>
}


export interface PostCardProps {
  post:{
    id: number;
    title: string;
    description: string;
    slug: string;
    createdAt: Date;
    author: {
      name: string;
    };
  }
}