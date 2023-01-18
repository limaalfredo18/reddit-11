import Link from "next/link";
import prisma from "lib/prisma";
import { getSubreddit, getPost, getVotes, getVote } from "lib/data.js";
import timeAgo from "lib/timeAgo";
import NewComment from "components/NewComment";
import { useSession, getSession } from "next-auth/react";
import Comments from "components/Comments";
import { useRouter } from "next/router";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */

export default function Post({ subreddit, post, votes, vote }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  if (loading) return null;

  if (!post) return <p className="p-5 text-center">Post doest no exist 😒</p>;

  const sendVote = async (up) => {
    await fetch("/api/vote", {
      body: JSON.stringify({
        post: post.id,
        up,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    router.reload(window.location.pathname);
  };

  return (
    <>
      <header className="flex h-12 px-5 pt-3 pb-2 text-white bg-gray-800">
        <Link href={`/`} className="underline">
          Home
        </Link>
        <p className="grow"></p>
      </header>
      <header className="flex h-12 px-5 pb-2 text-white bg-gray-800">
        <Link href={`/r/${subreddit.name}`} className="text-center underline">
          /r/{subreddit.name}
        </Link>
        <p className="ml-4 text-left grow">{subreddit.description}</p>
      </header>

      <div className="flex flex-row justify-center px-10 mb-4 ">
        <div className="flex flex-col p-10 my-10 mb-4 text-center bg-gray-200 border-t border-b border-l border-black rounded-l-xl border-3">
          <div
            className="text-black cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              sendVote(true);
            }}
          >
            {vote?.up ? "⬆️" : "⤴️"}
          </div>
          <div className="text-black">{votes}</div>
          <div
            className="text-black cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              sendVote(false);
            }}
          >
            {!vote ? "⤵️" : vote?.up ? "⤵️" : "⬇️"}
          </div>
        </div>

        <div className="flex flex-col p-10 pl-0 my-10 mb-4 bg-gray-200 border-t border-b border-r border-black rounded-r-xl border-3">
          <div className="flex flex-shrink-0 pb-0 ">
            <div className="flex-shrink-0 block group ">
              <div className="flex items-center text-gray-800">
                Posted by{" "}
                <Link
                  className="ml-1 underline"
                  href={`/u/${post.author.name}`}
                >
                  {post.author.name}
                </Link>{" "}
                <p className="mx-2 underline">
                  {timeAgo.format(new Date(post.createdAt))}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="flex-shrink text-2xl font-bold text-black color-gray-800 width-auto">
              {post.title}
            </p>

            {post.image && (
              <imag
                className="flex-shrink mt-2 text-black color-gray-800 width-auto"
                src={post.image}
                alt="post image"
              />
            )}

            <p className="flex-shrink text-black color-gray-800 width-auto">
              {post.content}
            </p>
          </div>
          {session ? (
            <NewComment post={post} />
          ) : (
            <p className="p-5">
              <a href="/api/auth/signing">Login</a>
            </p>
          )}
          <div className="flex flex-col text-black">
            <Comments comments={post.comments} post={post} />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const subreddit = await getSubreddit(context.params.subreddit, prisma);

  let post = await getPost(parseInt(context.params.id), prisma);
  post = JSON.parse(JSON.stringify(post));

  let votes = await getVotes(parseInt(context.params.id), prisma);
  votes = JSON.parse(JSON.stringify(votes));

  let vote = await getVote(
    parseInt(context.params.id),
    session?.user.id,
    prisma
  );
  vote = JSON.parse(JSON.stringify(vote));

  return {
    props: {
      subreddit,
      post,
      vote,
      votes,
    },
  };
}
