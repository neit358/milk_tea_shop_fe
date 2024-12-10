import classNames from "classnames/bind";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import styles from "./RegisterPage.module.scss";
import { NavLink, useNavigate } from "react-router-dom";

import * as authService from "~/services/auth.service";
import ToastInformation from "~/Components/Notification";

const cx = classNames.bind(styles);

function RegisterPage() {
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bool, setBool] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleOnSubmitRegister = async (e) => {
    e.preventDefault();

    if (password !== passwordAgain) {
      setBool(true);
      setContent("Mật khẩu không trùng khớp");
      setTitle("Error");
      return;
    }

    const requestData = {
      sdt: phoneNumber,
      matKhau: password,
    };

    const response = await authService.register(requestData);

    setBool(true);
    setContent(response.data.message);
    if (response.data.success) {
      setTitle("Success");
      setTimeout(() => {
        navigate("/dang_nhap");
      }, 3000);
    } else setTitle("Error");
  };

  return (
    <div className={cx("registerPage")}>
      <>
        <div className={cx("registerPage__selection")}>
          <div className={cx("registerPage__selection__login")}>Đăng ký</div>
        </div>
        <form className={cx("form")} onSubmit={handleOnSubmitRegister}>
          <h3 className={cx("heading")}>Đăng ký thành viên</h3>
          <div className={cx("form__group")}>
            <label htmlFor="phoneNumber" className={cx("form__label")}>
              Số điện thoại
            </label>
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              className={cx("form__control")}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className={cx("form__group")}>
            <label htmlFor="password" className={cx("form__label")}>
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className={cx("form__control")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={cx("form__group")}>
            <label htmlFor="passwordAgain" className={cx("form__label")}>
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className={cx("form__control")}
              value={passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
            />
          </div>

          <button className={cx("form__submit")}>Đăng ký</button>
        </form>
      </>
      <NavLink to="/">
        <div className={cx("exit")}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
      </NavLink>

      {bool && (
        <ToastInformation
          content={content}
          title={title}
          bool={bool}
          setBool={setBool}
          timeOut={3000}
        />
      )}
    </div>
  );
}

export default RegisterPage;
