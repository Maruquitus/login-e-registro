import { MouseEventHandler, ReactNode } from "react";

export function Button(props: {
  id: string;
  action: MouseEventHandler;
  text: string;
  children?: ReactNode;
}) {
  return (
    <button
      id={props.id}
      onClick={props.action}
      className="bg-green-500 text-white w-48 h-8 self-center mx-auto rounded-2xl font-bold hover:scale-105 ease-in-out duration-300"
    >
      {props.text}
      {props.children}
    </button>
  );
}
