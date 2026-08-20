import style from "./Logo.module.css";
import logoGoodwe from "../assets/logoGoodwe.png"; // ajuste o caminho conforme seu projeto

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function Logo({ className, ...props }: LogoProps) {
  return (
    <div className={`${style.logo} ${className ?? ""}`} {...props}>
      <img src={logoGoodwe} alt="GoodWe" className={style.logo_image} />
    </div>
  );
}
