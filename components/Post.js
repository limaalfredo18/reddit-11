import timeAgo from "lib/timeAgo";
import Link from "next/link";

export default function Post({ post }) {
  return (
    <div className="flex flex-col p-10 mx-20 my-10 mb-4 bg-gray-200 border border-black rounded-lg border-3">
      <div className="flex flex-shrink-0 pb-0 ">
        <div className="flex-shrink-0 block group ">
          <div className="flex items-center text-gray-800">
            <Link href={`/r/${post.subredditName}`} className="mr-2 underline">
              /r/{post.subredditName}
            </Link>{" "}
            Posted by
            <Link className="ml-1 underline" href={`/u/${post.author.name}`}>
              {post.author.name}
            </Link>{" "}
            <Link
              href={`/r/${post.subredditName}/comments/${post.id}`}
              className="mx-2 underline"
            >
              {timeAgo.format(new Date(post.createdAt))}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Link
          href={`/r/${post.subredditName}/comments/${post.id}`}
          className="flex-shrink text-2xl font-bold text-black color-gray-800 width-auto"
        >
          {post.title}
        </Link>

        {post.image && (
          <img
            className="flex-shrink mt-2 text-black color-gray-800 width-auto"
            src={post.image}
            alt="post image"
          />
        )}

        <p className="flex-shrink mt-2 text-black color-gray-800 width-auto">
          {post.content}
        </p>
      </div>
    </div>
  );
}
