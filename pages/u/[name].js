import Link from "next/link";
import prisma from "lib/prisma";
import { getUser, getPostsFromUser } from "lib/data";

import Posts from "components/Posts";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Profile({ user, posts }) {
  if (!user) return <p className="p-5 text-center">User does not exist 😞</p>;

  return (
    <>
      <header className="flex h-12 px-5 pt-3 pb-2 text-white bg-gray-800">
        <Link className="underline" href={`/`}>
          Home
        </Link>
        <p className="grow"></p>
      </header>
      <header className="flex h-12 px-5 pt-3 pb-2 text-white bg-gray-800">
        <p className="text-center">/u/{user.name}</p>
      </header>
      <Posts posts={posts} />
    </>
  );
}

export async function getServerSideProps(context) {
  let user = await getUser(context.params.name, prisma);
  user = JSON.parse(JSON.stringify(user));

  let posts = await getPostsFromUser(context.params.name, prisma);
  posts = JSON.parse(JSON.stringify(posts));

  return {
    props: {
      user,
      posts,
    },
  };
}
