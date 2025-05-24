import Image from 'next/image';

export default async function SSGPage() {
  const res = await fetch('https://dog.ceo/api/breeds/image/random');
  const resJson = await res.json();
  const imageUrl = resJson.message;
  const timestamp = new Date().toISOString();

  return (
    <div>
      SSG ビルド時に生成し固定：{timestamp}
      <Image src={imageUrl} alt="dog" width={500} height={500} />
    </div>
  );
}
