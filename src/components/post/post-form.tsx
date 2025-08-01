"use client";

import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { createPost } from "@/actions/post-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

//post form schema 
const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(255, "Title must be less than 255 characters long"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long")
    .max(255, "Description must be less than 255 characters long"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
});

type PostFormValues = z.infer<typeof postSchema>;



export default function PostForm  (){
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const {register, handleSubmit, formState: {errors}} = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
          title: "",
          description: "",
          content: "",
        },
    })


    const onFormSubmit = async (data: PostFormValues) => {
        startTransition(async()=>{
            try {
                const formData = new FormData();
                formData.append("title", data.title);
                formData.append("description", data.description);
                formData.append("content", data.content);
                let res;

                res = await createPost(formData);
                console.log(res)
               if(res.success){
                toast("Post created successfully")
                router.refresh()
                router.push("/")
               }else{
                toast(res.message)
               }
            } catch (error) {
               
                toast("Failed to create post")
            }
        })

    }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter post title"
          {...register("title")}
          disabled={isPending}
        />
        {errors?.title && (
          <p className="text-red-700 text-sm">{errors?.title?.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter a short post description"
          {...register("description")}
          disabled={isPending}
          className=" resize-none"
        />
        {errors?.description && (
          <p className="text-red-700 text-sm">{errors?.description?.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Enter post content"
          className="min-h-[250px] resize-none"
          {...register("content")}
          disabled={isPending}
        />
        {errors?.content && (
          <p className="text-red-700 text-sm">{errors?.content?.message}</p>
        )}
      </div>
      <Button disabled={isPending} type="submit" className="mt-5 w-full">
        {isPending ? "Creating post..." : "Create Post"}
      </Button>
    </form>
  );
}
