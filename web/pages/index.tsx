import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
      <Image src="/next.svg" alt="NextJS" width={72} height={16} />
    </div>
  );
}
