
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ブログ記事一覧",
  description: "ブログ記事一覧です",
};

const articles = [
  { id: 1, title: "Article 1" },
  { id: 2, title: "Article 2" },
  { id: 3, title: "Article 3" },
];

// 3秒後にデータを取得する
async function fetchArticles() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // throw new Error("エラーが発生しました");
  return articles;
}

export default async function BlogPage() {
  const articles = await fetchArticles();
  return (
    <div>
      <h1>Blog一覧</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>Title : {article.title}</li>
        ))}
      </ul>
    </div>
  );
}
