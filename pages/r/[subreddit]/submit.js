import { useRouter } from "next/router";
import prisma from "lib/prisma";
import Link from "next/link";
import { useState } from "react";
import { getSubreddit } from "lib/data";
import { useSession } from "next-auth/react";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */

export default function NewPost({ subreddit }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { data: session, status } = useSession();
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const loading = status === "loading";
  if (loading) return null;

  if (!session) return <p className="text-center =-5">Not logged in 😞</p>;

  return (
    <>
      <header className="flex h-12 px-5 pt-3 pb-2 text-white bg-gray-800">
        <Link className="underline" href={`/`}>
          Home
        </Link>
        <p className="grow"></p>
      </header>
      <header className="flex h-12 px-5 pb-2 text-white bg-gray-800">
        <Link className="text-center underline" href={`/r/${subreddit.name}`}>
          /r/{subreddit.name}
        </Link>
        <p className="ml-4 text-left grow">{subreddit.description}</p>
      </header>

      <div className="flex flex-row justify-center px-10 mb-4 ">
        <div className="flex flex-col p-10 my-10 mb-4 bg-gray-200 border border-black border-3 rounded-xl">
          <form
            className="flex flex-col "
            onSubmit={async (e) => {
              e.preventDefault();
              if (!title) {
                alert("Enter a title");
                return;
              }
              if (!content && !image) {
                alert("Enter some text or image in the post");
                return;
              }

              const body = new FormData();
              body.append("title", title);
              body.append("content", content);
              body.append("subreddit_name", subreddit.name);
              body.append("image", image);

              const res = await fetch("/api/post", {
                body: body,
                method: "POST",
              });
              return router.push(`/r/${subreddit.name}`);
            }}
          >
            <h2 className="mb-8 text-2xl font-bold text-black">
              Create a post
            </h2>
            <input
              className="w-full p-4 text-lg font-medium bg-gray-800 border border-b-0 border-gray-700 rounded outline-none"
              placeholder="The post title"
              rows={1}
              cols={50}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="text-sm text-gray-600">
              <label className="relative block my-3 font-medium underline cursor-pointer">
                {!imageURL && (
                  <p className="font-bold cursor-pointer">Upload an image</p>
                )}
                <image src={imageURL} />
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      if (e.target.files[0].size > 3072000) return false;
                    }
                    setImage(e.target.files[0]);
                    setImageURL(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </label>
            </div>

            <textarea
              className="w-full p-4 mt-1 text-lg font-medium bg-gray-800 border border-gray-700 rounded outline-none"
              rows={5}
              cols={50}
              placeholder="The post content"
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="mt-5">
              <button className="px-8 py-2 mt-0 mr-8 font-bold bg-green-700 border border-green-600 rounded-xl hover:bg-green-900">
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const subreddit = await getSubreddit(params.subreddit, prisma);

  return {
    props: {
      subreddit,
    },
  };
}
