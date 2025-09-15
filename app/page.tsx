import { getUsers } from "@/server/users";

export default async function Home() {
  const users = await getUsers();

  return (
    <div>
      <div>{JSON.stringify(users, null, 2)}</div>
    </div>
  );
}
