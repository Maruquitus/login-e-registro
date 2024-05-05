import { MouseEventHandler } from "react";

export function Link(props: {
  onClick?: MouseEventHandler;
  className?: string;
  destination: string;
  text: string;
}) {
  return (
    <a
      onClick={props.onClick}
      className={
        "text-green-600 hover:scale-105 duration-300 ease-in-out cursor-pointer inline-block " +
        props.className
      }
      href={props.destination}
    >
      {props.text}
    </a>
  );
}
