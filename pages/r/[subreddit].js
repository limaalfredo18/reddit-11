import Link from "next/link";
import prisma from "lib/prisma";
import { getSubreddit, getPostsFromSubreddit } from "lib/data.js";
import { useRouter } from "next/router";
import Posts from "components/Posts";
import { useSession } from "next-auth/react";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Subreddit({ subreddit, posts }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  if (loading) return null;

  if (!subreddit)
    return (
      <p id="link" className="p-5 text-center">
        Subreddit does not exist 😞
      </p>
    );
  return (
    <>
      <header className="flex h-12 px-5 pt-3 pb-2 text-white bg-gray-800">
        <Link href={`/`} className="underline">
          Home
        </Link>

        <p className="grow"></p>
      </header>
      <header className="flex h-12 px-5 pb-2 text-white bg-gray-800">
        <p className="text-center">/r/{subreddit.name}</p>
        <p className="ml-4 text-left grow">{subreddit.description}</p>
      </header>
      {session && (
        <div className="p-10 mx-20 my-10 border border-gray-700 rounded border-3">
          <input
            className="w-full p-4 border border-gray-700 rounded border-3 "
            placeholder="Create post"
            onClick={() => {
              router.push(`/r/${subreddit.name}/submit`);
            }}
          ></input>
        </div>
      )}
      <Posts posts={posts} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const subreddit = await getSubreddit(params.subreddit, prisma);

  let posts = await getPostsFromSubreddit(params.subreddit, prisma);
  posts = JSON.parse(JSON.stringify(posts));

  return {
    props: {
      subreddit,
      posts,
    },
  };
}
