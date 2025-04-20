import { ReactNode } from "react";

interface CardProps {
  title: string;
  tools?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, tools, children }: CardProps) {
  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-md p-4 flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-700 pb-2">
        <h5 className="font-semibold">{title}</h5>
        <div className="text-gray-400">{tools}</div>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
