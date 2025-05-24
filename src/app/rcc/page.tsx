"use client";
import { useState } from "react";
export default function ClientComponent() {
  const [count, setCount] = useState(0);
  console.log("ClientComponent");
  return (
    <div>
      <p>ClientComponent</p>
      <button onClick={() => setCount(count + 1)}>Count Up : {count}</button>
    </div>
  );
}
