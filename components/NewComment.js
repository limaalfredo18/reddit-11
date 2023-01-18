import { useRouter } from "next/router";
import { useState } from "react";

export default function NewComment({ post, comment }) {
  const router = useRouter();
  const [content, setContent] = useState("");

  return (
    <form
      className="flex flex-col mt-10"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!content) {
          alert("Enter some text in the comment");
          return;
        }
        const res = await fetch("/api/comment", {
          body: JSON.stringify({
            post: post.id,
            comment: comment?.id,
            content: content,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
        return router.reload(window.location.pathname);
      }}
    >
      <textarea
        className="w-full p-4 text-lg font-medium bg-transparent bg-gray-600 border border-gray-800 rounded-xl "
        rows={1}
        cols={50}
        placeholder="Add a comment"
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="mt-5">
        <button className="px-8 py-2 mt-0 mr-8 font-bold bg-green-600 border border-green-700 hover:bg-green-800 rounded-3xl ">
          Comment
        </button>
      </div>
    </form>
  );
}
