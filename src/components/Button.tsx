import { MouseEventHandler, ReactNode } from "react";

export function Button(props: {
  style?: any;
  action: MouseEventHandler;
  text: string;
  children?: ReactNode;
}) {
  return (
    <button
      style={props.style}
      onClick={props.action}
      className="bg-green-500 text-white w-48 h-8 self-center mx-auto rounded-2xl font-bold hover:scale-105 ease-in-out duration-300"
    >
      {props.text}
      {props.children}
    </button>
  );
}
