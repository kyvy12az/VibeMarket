import { forwardRef, useImperativeHandle, useState } from "react";

const HeartBurst = forwardRef((props, ref) => {
  const [hearts, setHearts] = useState<number[]>([]);

  useImperativeHandle(ref, () => ({
    trigger() {
      const id = Date.now();
      setHearts((prev) => [...prev, id]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h !== id));
      }, 1000);
    }
  }));

  return (
    <div className="hearts-container pointer-events-none absolute top-0 left-0 w-full h-full">
      {hearts.map((id) => (
        <span
          key={id}
          className="heart"
          style={{
            left: `${Math.random() * 40 + 30}%`,
            color: ["#ff4d6d", "#ff6b81", "#ff8fa3"][Math.floor(Math.random() * 3)]
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
});

export default HeartBurst;
