import Head from "next/head";
import { getPosts } from "lib/data.js";
import prisma from "lib/prisma";
import Posts from "components/Posts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home({ posts }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const loading = status === "loading";
  if (loading) {
    return null;
  }

  if (session && !session.user.name) {
    return router.push("/setup");
  }
  return (
    <div>
      <Head>
        <title>Reddit Clone</title>
        <meta name="description" content="A great social network!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gray-800 text-white h-12 flex pt-3 px-5 pb-2">
        <p>Reddit Clone</p>
        <p className="grow"></p>
        <a
          className="flex border-blue-700 bg-blue-700 hover:bg-blue-900 px-4 font-bold rounded-2xl mb-1"
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
        >
          {session ? "Logout" : "Login"}
        </a>
      </header>
      <Posts posts={posts} />
    </div>
  );
}

export async function getServerSideProps() {
  let posts = await getPosts(prisma);
  posts = JSON.parse(JSON.stringify(posts));

  return {
    props: {
      posts: posts,
    },
  };
}
