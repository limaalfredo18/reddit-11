export default function Utils() {
  const tasks = [
    { task: "generate_users", description: "Generate random users" },
    { task: "generate_subreddits", description: "Generate random subreddits" },
    {
      task: "add_fake_content",
      description: "Add fake content",
    },
    {
      task: "clean_database",
      description: "Clean the database",
    },
  ];

  const Button = ({ task }) => (
    <div className="flex-1 mb-5">
      <button
        className="border px-8 py-2 mt-5 mr-8 font-bold rounded-2xl bg-blue-700 hover:bg-blue-900 text-white"
        onClick={async () => {
          await fetch("/api/utils", {
            body: JSON.stringify({
              task: task.task,
            }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          });
        }}
      >
        {task.description}
      </button>
    </div>
  );

  return (
    <div className="mt-10 ml-20">
      <h2 className="mb-10 text-2xl font-bold">Utils</h2>

      {tasks.map((task, index) => (
        <Button key={index} task={task} />
      ))}
    </div>
  );
}
