interface Params {
  params: Promise<{
    id: string;
  }>;
}

export const generateMetadata = async ({ params }: Params) => {
  const { id } = await params;
  return {
    title: `ブログ記事ID: ${id}`,
    description: `ブログ記事ID: ${id} の詳細です`,
  };
};

export default async function page({ params }: Params) {
  const { id } = await params;
  return (
    <div>
      <h1>Blog Post {id}</h1>
    </div>
  );
}
