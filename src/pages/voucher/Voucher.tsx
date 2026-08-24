import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Inicio/Inicio.css";
import "./voucher.css";
import logoGoodwe from "../../assets/images/logo_goodwe.png";

// Dados mockados - substituir pela chamada de API quando o backend estiver pronto
const mockVouchers = [
  { id: 1, nome: "File_name", status: "Ativo", date: "05/01/2023", porcentagem: "5%" },
  { id: 2, nome: "File_name", status: "Expirado", date: "05/01/2023", porcentagem: "5%" },
  { id: 3, nome: "File_name", status: "Processado", date: "05/01/2023", porcentagem: "5%" },
];

function IconRelatorios({ color = "#FF0A00" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#clip0_v_415)">
        <path d="..." stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="..." stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="..." stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="..." stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      ...
    </svg>
  );
}

function IconConfiguracao() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#clip0_v_427)">
        <path fillRule="evenodd" clipRule="evenodd" d="M10 6.66666C9.11599 6.66666 8.26814 7.01785 7.64302 7.64297C7.0179 8.26809 6.66671 9.11594 6.66671 9.99999C6.66671 10.884 7.0179 11.7319 7.64302 12.357C8.26814 12.9821 9.11599 13.3333 10 13.3333C10.8841 13.3333 11.7319 12.9821 12.3571 12.357C12.9822 11.7319 13.3334 10.884 13.3334 9.99999C13.3334 9.11594 12.9822 8.26809 12.3571 7.64297C11.7319 7.01785 10.8841 6.66666 10 6.66666ZM8.82153 8.82148C9.13409 8.50892 9.55801 8.33333 10 8.33333C10.4421 8.33333 10.866 8.50892 11.1786 8.82148C11.4911 9.13404 11.6667 9.55797 11.6667 9.99999C11.6667 10.442 11.4911 10.8659 11.1786 11.1785C10.866 11.4911 10.4421 11.6667 10 11.6667C9.55801 11.6667 9.13409 11.4911 8.82153 11.1785C8.50897 10.8659 8.33337 10.442 8.33337 9.99999C8.33337 9.55797 8.50897 9.13404 8.82153 8.82148Z" fill="#FC0000" />
        <path fillRule="evenodd" clipRule="evenodd" d="M9.15087 0.833328C8.77233 0.833328 8.44135 1.08846 8.34499 1.45453L7.92269 3.05887L6.58099 3.62446L5.55395 2.71073C5.22419 2.41735 4.72288 2.43198 4.41078 2.74407L2.74412 4.41074C2.4422 4.71266 2.41733 5.19393 2.68651 5.52537L3.58662 6.63362L3.03466 7.99156L1.47725 8.35515C1.10014 8.44319 0.833374 8.77941 0.833374 9.16666V10.8333C0.833374 11.2091 1.08486 11.5384 1.44739 11.6373L3.05712 12.0764L3.62424 13.4217L2.71142 14.4454C2.41741 14.7751 2.43176 15.2769 2.74412 15.5892L4.41078 17.2559C4.71311 17.5582 5.19519 17.5827 5.52658 17.3126L6.63444 16.4095L7.959 16.9543L8.35873 18.5373C8.45217 18.9074 8.78505 19.1667 9.16671 19.1667H10.8334C11.2149 19.1667 11.5477 18.9076 11.6412 18.5377L12.042 16.954L13.4108 16.3871C13.5486 16.5026 13.7066 16.6382 13.8638 16.7751C14.0201 16.9112 14.1653 17.0393 14.2715 17.1336C14.3246 17.1807 14.3678 17.2192 14.3977 17.2459L14.4429 17.2864C14.7725 17.582 15.2763 17.569 15.5893 17.2559L17.256 15.5892C17.5627 15.2825 17.5828 14.7918 17.3023 14.461L16.3945 13.3906L16.9562 12.0338L18.543 11.6215C18.9103 11.5261 19.1667 11.1945 19.1667 10.815V9.16666C19.1667 8.78556 18.9082 8.45302 18.5388 8.35905L16.9619 7.95786L16.4017 6.60444L17.3031 5.53795C17.5828 5.20708 17.5623 4.71709 17.256 4.41074L15.5893 2.74407C15.2817 2.43648 14.7893 2.41723 14.4586 2.69987L13.4 3.60472L11.9989 3.02866L11.5852 1.4548C11.4889 1.0886 11.1578 0.833328 10.7792 0.833328H9.15087ZM15.5347 14.9535L14.9646 15.5236L14.9583 15.5182C14.6506 15.2502 14.2541 14.9111 14.0305 14.7513C13.7965 14.584 13.4928 14.5492 13.227 14.6593L11.0178 15.5743C10.7747 15.675 10.5934 15.8846 10.5288 16.1397L10.1846 17.5H9.81577L9.47218 16.1393C9.40754 15.8833 9.22541 15.6731 8.98123 15.5727L6.80956 14.6793C6.52678 14.563 6.203 14.6109 5.966 14.8041L5.05699 15.5451L4.47913 14.9672L5.21866 14.138C5.43275 13.8979 5.48955 13.556 5.3646 13.2596L4.43543 11.0555C4.33602 10.8196 4.13376 10.6426 3.88686 10.5752L2.50004 10.1969V9.82785L3.83366 9.51651C4.09712 9.455 4.31433 9.26942 4.4162 9.01879L5.3162 6.80462C5.43067 6.52301 5.38271 6.20142 5.19107 5.96546L4.45397 5.05791L5.03344 4.47844L5.86613 5.21926C6.10619 5.43284 6.44766 5.48937 6.74375 5.36455L8.94791 4.43539C9.18615 4.33496 9.36428 4.12964 9.43009 3.87962L9.79324 2.49999H10.1366L10.4924 3.85352C10.5588 4.10617 10.7399 4.31305 10.9815 4.41239L13.2373 5.33989C13.5265 5.4588 13.858 5.4058 14.0957 5.20262L14.9557 4.4675L15.5355 5.04734L14.8011 5.9162C14.5998 6.15431 14.5483 6.48484 14.6676 6.7729L15.5817 8.98123C15.6823 9.2241 15.8915 9.40529 16.1462 9.4701L17.5 9.81453V10.1705L16.1355 10.5251C15.8825 10.5908 15.6751 10.7714 15.5751 11.0129L14.6601 13.2229C14.5406 13.5114 14.5925 13.8425 14.7945 14.0806L15.5347 14.9535Z" fill="#FC0000" />
      </g>
      <defs>
        <clipPath id="clip0_v_427">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function IconAjuda() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#clip0_v_435)">
        <path d="M8.33337 7.49998C8.33337 7.01084 8.51582 6.69801 8.75533 6.49478C9.01297 6.27618 9.38618 6.14581 9.79171 6.14581C10.1972 6.14581 10.5704 6.27618 10.8281 6.49478C11.0676 6.69801 11.25 7.01084 11.25 7.49998C11.25 7.86428 11.1642 8.06654 11.0645 8.21612C10.9481 8.39062 10.7951 8.52824 10.5362 8.76096L10.4842 8.80765C10.2179 9.04735 9.86751 9.37139 9.60035 9.84339C9.32502 10.3298 9.16671 10.9176 9.16671 11.6666C9.16671 12.1269 9.5398 12.5 10 12.5C10.4603 12.5 10.8334 12.1269 10.8334 11.6666C10.8334 11.1657 10.9355 10.8681 11.0508 10.6644C11.1742 10.4463 11.3447 10.2755 11.5992 10.0465C11.6221 10.0259 11.6462 10.0043 11.6714 9.98188C11.8991 9.77889 12.2111 9.50085 12.4512 9.14062C12.7421 8.70425 12.9167 8.17734 12.9167 7.49998C12.9167 6.53079 12.5262 5.74987 11.9064 5.22393C11.3046 4.71336 10.532 4.47915 9.79171 4.47915C9.05141 4.47915 8.27878 4.71336 7.67704 5.22393C7.05718 5.74987 6.66671 6.53079 6.66671 7.49998C6.66671 7.96022 7.0398 8.33331 7.50004 8.33331C7.96028 8.33331 8.33337 7.96022 8.33337 7.49998Z" fill="white" />
        <path d="M10.625 15.5597C10.9346 15.2192 10.9095 14.6921 10.569 14.3825C10.2284 14.0729 9.70137 14.098 9.39177 14.4386L9.38344 14.4477C9.07384 14.7883 9.09892 15.3153 9.43946 15.6249C9.78 15.9345 10.307 15.9094 10.6166 15.5689L10.625 15.5597Z" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M10 0.833313C4.9373 0.833313 0.833374 4.93724 0.833374 9.99998C0.833374 15.0627 4.9373 19.1666 10 19.1666C15.0628 19.1666 19.1667 15.0627 19.1667 9.99998C19.1667 4.93724 15.0628 0.833313 10 0.833313ZM2.50004 9.99998C2.50004 5.85772 5.85778 2.49998 10 2.49998C14.1423 2.49998 17.5 5.85772 17.5 9.99998C17.5 14.1422 14.1423 17.5 10 17.5C5.85778 17.5 2.50004 14.1422 2.50004 9.99998Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_v_435">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function IconSair() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5.83337 1.66663C5.17033 1.66663 4.53445 1.93002 4.06561 2.39886C3.59677 2.8677 3.33337 3.50358 3.33337 4.16663V15.8333C3.33337 16.4963 3.59677 17.1322 4.06561 17.6011C4.53445 18.0699 5.17033 18.3333 5.83337 18.3333H14.1667C14.8297 18.3333 15.4656 18.0699 15.9345 17.6011C16.4033 17.1322 16.6667 16.4963 16.6667 15.8333V15C16.6667 14.5397 16.2936 14.1666 15.8334 14.1666C15.3731 14.1666 15 14.5397 15 15V15.8333C15 16.0543 14.9122 16.2663 14.756 16.4225C14.5997 16.5788 14.3877 16.6666 14.1667 16.6666H5.83337C5.61236 16.6666 5.4004 16.5788 5.24412 16.4225C5.08784 16.2663 5.00004 16.0543 5.00004 15.8333V4.16663C5.00004 3.94561 5.08784 3.73365 5.24412 3.57737C5.4004 3.42109 5.61236 3.33329 5.83337 3.33329H14.1667C14.3877 3.33329 14.5997 3.42109 14.756 3.57737C14.9122 3.73365 15 3.94561 15 4.16663V4.99996C15 5.4602 15.3731 5.83329 15.8334 5.83329C16.2936 5.83329 16.6667 5.4602 16.6667 4.99996V4.16663C16.6667 3.50358 16.4033 2.8677 15.9345 2.39886C15.4656 1.93002 14.8297 1.66663 14.1667 1.66663H5.83337Z" fill="#FF0A00" />
      <path d="M13.9226 6.9107C13.5972 6.58527 13.0696 6.58527 12.7441 6.9107C12.4187 7.23614 12.4187 7.76378 12.7441 8.08921L13.8215 9.16663H10C9.5398 9.16663 9.16671 9.53972 9.16671 9.99996C9.16671 10.4602 9.5398 10.8333 10 10.8333H13.8215L12.7441 11.9107C12.4187 12.2361 12.4187 12.7638 12.7441 13.0892C13.0696 13.4147 13.5972 13.4147 13.9226 13.0892L16.4226 10.5892C16.7481 10.2638 16.7481 9.73614 16.4226 9.4107L13.9226 6.9107Z" fill="#FF0A00" />
    </svg>
  );
}

function IconAdd() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
      <rect width="50" height="50" rx="15" fill="#D9D9D9" />
      <rect width="50" height="50" rx="15" fill="#FF000A" />
      <path d="M34.3125 22.5938H27.2812V15.5625C27.2812 14.6997 26.5815 14 25.7188 14H24.1562C23.2935 14 22.5938 14.6997 22.5938 15.5625V22.5938H15.5625C14.6997 22.5938 14 23.2935 14 24.1562V25.7188C14 26.5815 14.6997 27.2812 15.5625 27.2812H22.5938V34.3125C22.5938 35.1753 23.2935 35.875 24.1562 35.875H25.7188C26.5815 35.875 27.2812 35.1753 27.2812 34.3125V27.2812H34.3125C35.1753 27.2812 35.875 26.5815 35.875 25.7188V24.1562C35.875 23.2935 35.1753 22.5938 34.3125 22.5938Z" fill="white" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M40 4.02857L35.9714 0L20 15.9714L4.02857 0L0 4.02857L15.9714 20L0 35.9714L4.02857 40L20 24.0286L35.9714 40L40 35.9714L24.0286 20L40 4.02857Z" fill="black" />
    </svg>
  );
}

function statusClass(status) {
  if (status === "Ativo") return "voucher-status voucher-status--ativo";
  if (status === "Expirado") return "voucher-status voucher-status--expirado";
  return "voucher-status voucher-status--processado";
}

export default function Voucher() {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState(mockVouchers);
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState({ nome: "", status: "", date: "", porcentagem: "" });

  function handleChange(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleAdicionar() {
    // Front-end apenas: sem integração com backend por enquanto.
    const novoVoucher = {
      id: vouchers.length + 1,
      nome: form.nome || "File_name",
      status: form.status || "Ativo",
      date: form.date || "--/--/----",
      porcentagem: form.porcentagem || "0%",
    };
    console.log("Novo voucher:", novoVoucher);
    setVouchers((prev) => [...prev, novoVoucher]);
    setForm({ nome: "", status: "", date: "", porcentagem: "" });
    setModalAberto(false);
  }

  return (
    <div className="background">
      <div className="frame1">
        <img src={logoGoodwe} alt="GoodWe" className="logo-goodwe" />
      </div>

      <div className="layout">
        <aside className="sidebar">
          <div className="perfil">
            <div className="perfil-foto" />
            <span className="perfil-nome">ENZO TABUQUI</span>
          </div>

          <nav className="menu">
            <button className="menu-item relatorios voucher-menu-item--ativo" onClick={() => navigate("/voucher")}>
              <IconRelatorios color="#FFFFFF" />
              <span>Relatórios</span>
            </button>
            <button className="menu-item carregadores" onClick={() => navigate("/inicio")}>
              <span className="dot-icon" />
              <span>Carregadores</span>
            </button>
            <button className="menu-item configuracao">
              <IconConfiguracao />
              <span>Configuração</span>
            </button>
          </nav>

          <div className="menu-inferior">
            <button className="menu-item ajuda">
              <IconAjuda />
              <span>Ajuda</span>
            </button>
            <button className="menu-item sair" onClick={() => navigate("/cadastro")}>
              <IconSair />
              <span>Sair</span>
            </button>
          </div>
        </aside>

        <main className="content">
          <div className="voucher-header">
            <div className="voucher-titulo">Vouchers</div>
            <button className="voucher-add-btn" onClick={() => setModalAberto(true)}>
              <IconAdd />
            </button>
          </div>

          <div className="voucher-tabela">
            <div className="voucher-tabela-header">
              <span className="voucher-col voucher-col--nome">Nome</span>
              <span className="voucher-col voucher-col--status">Status</span>
              <span className="voucher-col voucher-col--date">Date ⇅</span>
              <span className="voucher-col voucher-col--porcentagem">Porcentagem</span>
            </div>

            {vouchers.map((v) => (
              <div className="voucher-tabela-row" key={v.id}>
                <span className="voucher-col voucher-col--nome">{v.nome}</span>
                <span className="voucher-col voucher-col--status">
                  <span className={statusClass(v.status)}>{v.status}</span>
                </span>
                <span className="voucher-col voucher-col--date">{v.date}</span>
                <span className="voucher-col voucher-col--porcentagem">{v.porcentagem}</span>
              </div>
            ))}
          </div>
        </main>
      </div>

      {modalAberto && (
        <div className="voucher-modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="voucher-modal" onClick={(e) => e.stopPropagation()}>
            <button className="voucher-modal-close" onClick={() => setModalAberto(false)}>
              <IconClose />
            </button>

            <input
              type="text"
              className="voucher-input voucher-input--grande"
              placeholder="Nome do arquivo"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />

            <div className="voucher-input-row">
              <input
                type="text"
                className="voucher-input voucher-input--medio"
                placeholder="Status"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              />
              <input
                type="text"
                className="voucher-input voucher-input--medio"
                placeholder="Data"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>

            <input
              type="text"
              className="voucher-input voucher-input--pequeno"
              placeholder="Porcentagem"
              value={form.porcentagem}
              onChange={(e) => handleChange("porcentagem", e.target.value)}
            />

            <button className="voucher-btn-adicionar" onClick={handleAdicionar}>
              <span className="voucher-btn-adicionar-texto">ADICIONAR</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
