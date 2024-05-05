import { KeyboardEventHandler } from "react";

export function Input(props: { título: string; id: string; tipo: string, setState: Function }) {
  return (
    <div className="w-full row grid">
      <label className="text-white font-semibold">{props.título}</label>
      <input
        required
        onKeyUp={(e: any) =>
          props.setState(e.target.value)
        }
        id={props.id}
        className="text-black text-sm h-8 bg-gray-100/70 shadow-sm rounded-md outline-0 font-medium p-1"
        type={props.tipo}
      ></input>
    </div>
  );
}
