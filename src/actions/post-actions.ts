"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { slugify } from "@/lib/utils"
import { and, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

export async function createPost(formData: FormData){
    try {
        //get the current user
        const session = await auth.api.getSession({
            headers: await headers()
        })

       

        if(!session || !session?.user){
            return{
                success: false,
                message: "You must be logged in to create a post"
            }
        }

        // get form data
        const title = formData.get("title") as string
        const content = formData.get("content") as string
        const description = formData.get("description") as string

        //validation check
        if(!title || !content || !description){
            return{
                success: false,
                message: "All fields are required"
            }
        }
        //create the slug from post title
        const slug = slugify(title)

        // check if slug already exist
        const existingPost = await db.query.posts.findFirst({
            where: eq(posts.slug, slug)
        })

        if(existingPost){
            return{
                success: false,
                message: "A post with this title already exist"
            }
        }

       
        //create the post
        const [newPost] = await db.insert(posts).values({
            title,
            content,
            description,
            slug,
            authorId: session.user.id
        }).returning()

        //revalidate homepage and page details cache
        revalidatePath("/")
        revalidatePath(`/posts/${slug}`)
        revalidatePath("/profile")

        return {
            success: true,
            message: "Post created successfully",
            slug
        }

    } catch (error) {
       console.log(error, "Failed to create post")
        return{
            success: false,
            message: "Failed to create post"
        }

    }
}

export async function updatePost(postId: number, formData: FormData){
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session || !session?.user) {
        return {
          success: false,
          message: "You must be logged in to update a post",
        };
      }

      // get form data
      const title = formData.get("title") as string;
      const content = formData.get("content") as string;
      const description = formData.get("description") as string;

      //validation check
      if (!title || !content || !description) {
        return {
          success: false,
          message: "All fields are required",
        };
      }
      //create the slug from post title
      const slug = slugify(title);

      // check if slug already exist
      const existingPost = await db.query.posts.findFirst({
        where: and(eq(posts.slug, slug), ne(posts.id, postId))
      });


      if (existingPost) {
        return {
          success: false,
          message: "A post with this title already exist",
        };
      }

      const post = await db.query.posts.findFirst({
        where: eq(posts.id, postId)
      })

      if (!post) {
        return {
          success: false,
          message: "Post not found",
        };
      }

      if(post?.authorId !== session.user.id){
        return{
            success: false,
            message: "You are not authorized to update this post"
        }
      }

      await db.update(posts).set({
        title,
        content,
        description,
        slug,
        updatedAt: new Date()
      }).where(eq(posts.id, postId))

      revalidatePath('/')
      revalidatePath(`/posts/${slug}`)
      revalidatePath('/profile')

      return{
        success: true,
        message: "Post updated successfully",
        slug
      }

    } catch (error) {
       console.log(error, "Failed to update post")
      
        return{
            success: false,
            message: "Failed to update post"
        }
    }
}

export async function deletePost(postId: number){
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session?.user) {
            return {
              success: false,
              message: "You must be logged in to delete a post",
            };
        }

        const postToDelete = await db.query.posts.findFirst({
            where: eq(posts.id, postId)
        })

        if(!postToDelete){
            return{
                success: false,
                message: "Post not found"
            }
        }

        if(postToDelete.authorId !== session.user.id){
            return{
                success: false,
                message: "You are not authorized to delete this post"
            }
        }

        await db.delete(posts).where(eq(posts.id, postId))

        revalidatePath('/')
        revalidatePath('/profile')
        return{
            success: true,
            message: "Post deleted successfully"
        }

    } catch (error) {
        console.log(error, "Failed to delete post")
      
        return{
            success: false,
            message: "Failed to delete post"
        }
    }
}