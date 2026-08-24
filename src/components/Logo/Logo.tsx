import style from "./style.module.css";
import logoGoodwe from "../../assets/logo_goodwe.png"; // ajuste o caminho conforme seu projeto

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function Logo({ className, ...props }: LogoProps) {
  return (
    <div className={`${style.logo} ${className ?? ""}`} {...props}>
      <img src={logoGoodwe} alt="GoodWe" className={style.logo_image} />
    </div>
  );
}
