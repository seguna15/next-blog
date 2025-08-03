'use client'

import { DeletePostButtonProps } from "@/lib/types"
import { Button } from "../ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { deletePost } from "@/actions/post-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


export default function DeletePostButton({postId}: DeletePostButtonProps) {

  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeletePost =async  () => {
    setIsDeleting(true)
    try {
      const res = await deletePost(postId)
      if(res.success){
        toast(res.message)
        router.push("/")
        router.refresh()
      }else{
        toast(res.message)
      }
    } catch (error) {
      toast("Failed to delete post")
    }finally{
      setIsDeleting(false)
    }
  }

  return (
    <>
        <Button onClick={handleDeletePost} variant='destructive' size='sm' disabled={isDeleting}>
            <Trash2 className="h-4 w-4 mr-2"/> 
          {
            isDeleting ? "Deleting..." : "Delete"
          }
        </Button>
    </>
  )
}
