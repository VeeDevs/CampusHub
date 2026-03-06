import { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`rounded-xl bg-sky-600 px-4 py-2 text-white ${props.className ?? ""}`} />;
}
