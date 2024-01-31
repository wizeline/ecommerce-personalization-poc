interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function Test({ data }: { data: Post }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>UserId: {data.userId}</p>
      <p>Id: {data.id}</p>
      <p>Title: {data.title}</p>
      <p>Body: {data.body}</p>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const data: Post = await res.json();

  return {
    props: {
      data,
    },
  };
}

export default Test;
