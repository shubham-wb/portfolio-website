import { PostEditor } from "@/components/admin/PostEditor";
import { getPosts } from "@/lib/data";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  let initial = null;
  if (id) {
    const posts = await getPosts();
    initial = posts.find((p) => p.id === id) ?? null;
  }
  return <PostEditor initial={initial} />;
}
