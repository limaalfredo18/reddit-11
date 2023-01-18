import timeAgo from "lib/timeAgo";
import Link from "next/link";
import { useState } from "react";
import NewComment from "./NewComment";

const Comment = ({ comment, post }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="mt-6 ">
      <p>
        <Link className="underline" href={`/u/${comment.author.name}`}>
          {comment.author.name}
        </Link>{" "}
        {timeAgo.format(new Date(comment.createdAt))}
      </p>
      <p>{comment.content}</p>
      {showReplies ? (
        <div className="pl-10">
          <NewComment comment={comment} post={post} />
        </div>
      ) : (
        <p
          className="text-sm font-bold underline cursor-pointer"
          onClick={() => setShowReplies(true)}
        >
          reply
        </p>
      )}
    </div>
  );
};

export default function Comments({ comments, post }) {
  if (!comments) return null;

  return (
    <>
      {comments.map((comment, index) => (
        <div key={index}>
          <Comment comment={comment} post={post} />
          {comment.comments && (
            <div className="pl-10">
              <Comments comments={comment.comments} post={post} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
