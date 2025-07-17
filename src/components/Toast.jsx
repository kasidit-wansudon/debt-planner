import { useEffect, useState } from "react";

export default function Toast({ message, onClose, type = "error" }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;
  
  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "warning"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-white shadow-lg ${bgColor}`}>
      {message}
    </div>
  );
}
