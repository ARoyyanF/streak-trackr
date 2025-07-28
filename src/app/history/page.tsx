import UnderConstruction from "~/components/under-construction";

export default async function History() {
  // If there's no session, show a sign-in prompt

  return (
    <main className="flex h-[calc(100vh-5rem)] items-center justify-center">
      <UnderConstruction />
    </main>
  );
}
