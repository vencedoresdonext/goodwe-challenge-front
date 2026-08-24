import style from './style.module.css'
import type { ReactNode } from "react";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  children: ReactNode;
}

export default function Button({ type, children }: ButtonProps) {
  return (
    <>
      <button type={type} className={style['btn-login']}>{children}</button>
    </>
  );
}
