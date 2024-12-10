import classNames from "classnames/bind";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";

import styles from "./LoginPage.module.scss";
import ToastInformation from "~/Components/Notification/Notification";
import * as authService from "~/services/auth.service";
import LoadingComponent from "~/Components/Loading";

const cx = classNames.bind(styles);

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bool, setBool] = useState(false);
  const navigate = useNavigate();

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await authService.login({
      sdt: username,
      matKhau: password,
    });
    setBool(true);
    setContent(response.data.message);
    if (!response.data.success) {
      setTitle("Error");
      setIsLoading(false);
      return;
    }
    const user = response.data.result;

    localStorage.setItem("user", JSON.stringify(user));
    setTitle("Success");
    setTimeout(() => {
      user.vaiTro.vaiTro === "GUEST" ? navigate("/") : navigate("/quan_ly");
      setIsLoading(false);
    }, 3000);
  };

  const handleOnClickExit = () => {};

  return (
    <div className={cx("loginPage")}>
      <>
        <div className={cx("loginPage__selection")}>
          <div className={cx("loginPage__selection__login")}>Đăng nhập</div>
        </div>
        <form className={cx("form")} onSubmit={handleSubmitLogin}>
          <h3 className={cx("heading")}>Đăng nhập thành viên</h3>
          <div className={cx("form--group")}>
            <label htmlFor="email" className={cx("form--label")}>
              Email/Tên đăng nhập
            </label>
            <input
              value={username}
              type="text"
              placeholder="VD: email@domain.com"
              className={cx("form--control")}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={cx("form--group")}>
            <label htmlFor="password" className={cx("form--label")}>
              Mật khẩu
            </label>
            <input
              value={password}
              type="password"
              placeholder="Nhập mật khẩu"
              className={cx("form--control")}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className={cx("form--submit")}>Đăng nhập</button>
          <a
            href="/loginPage/loginPageForget?type=forgetPassword"
            style={{ textDecoration: "none" }}
          >
            <div className={cx("forgot")}>Quên mật khẩu</div>
          </a>
        </form>
      </>
      <NavLink to="/">
        <div className={cx("exit")} onClick={handleOnClickExit}>
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
      {isLoading && <LoadingComponent />}
    </div>
  );
}

export default LoginPage;
