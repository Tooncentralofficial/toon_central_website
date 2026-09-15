"use client";

export default function Error({ error }: { error: Error }) {
  console.error(error);

  return (
    <main>
      <h1>Some error occurred</h1>
      <p>{error.message}</p>
    </main>
  );
}
