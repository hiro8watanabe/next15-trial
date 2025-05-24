import ClientComponent from '@/components/ClientComponent';
import Link from 'next/link';

export default function ServerComponent() {
  console.log('ServerComponent');
  return (
    <div>
      <p>ServerComponent</p>
      <ClientComponent />
      <Link href="/about">About</Link>
    </div>
  );
}
