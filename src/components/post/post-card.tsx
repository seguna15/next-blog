import { PostCardProps } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function PostCard({post}: PostCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <Link className="hover:underline" href={`/post/${post.slug}`}>
          <CardTitle className="text-2xl">{post.title}</CardTitle>
        </Link>
        <CardDescription>
          By {post.author.name} on {formatDate(post.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{post.description}</p>
      </CardContent>
    </Card>
  );
}
