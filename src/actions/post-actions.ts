"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { slugify } from "@/lib/utils"
import { eq } from "drizzle-orm"
import { isGelSchema } from "drizzle-orm/gel-core"
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
       
        return{
            success: false,
            message: "Failed to create post"
        }

    }
}