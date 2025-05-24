import Image from 'next/image';
export const revalidate = 10; // ISR強制

export default async function ISRPage() {
  const res = await fetch('https://dog.ceo/api/breeds/image/random', {
    next: {
      revalidate: 10,
    },
  });
  const resJson = await res.json();
  const imageUrl = resJson.message;
  const timestamp = new Date().toISOString();

  return (
    <div>
      ISR 10秒ごとにリロード：{timestamp}
      <Image src={imageUrl} alt="dog" width={500} height={500} />
    </div>
  );
}
