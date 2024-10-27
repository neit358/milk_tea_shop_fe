import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faHeart,
  faMagnifyingGlass,
  faRepeat,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import styles from "./HeaderBody.module.scss";
import classNames from "classnames/bind";
import ToastInformation from "~/Components/Notification";
import { IconLogo } from "~/Components/Icons";
import { regexSearchMapper } from "../../../../regex/search.regex";

const cx = classNames.bind(styles);

function HeaderBody({ setSearch }) {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || null));
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [bool, setBool] = useState(false);
  const [quality, setQuantity] = useState(0);

  const navigate = useNavigate();

  const handleSearchRoom = (event) => {
    const name = event.target.value;
    const listElementName = name.split(" ");
    const filter = {
      $or: listElementName.map((elementName) => ({
        name: {
          $regex: ".*" + regexSearchMapper(elementName) + ".*",
          $options: "i",
        },
      })),
    };

    setSearch(filter);
  };

  const handleOnClickLogout = async () => {
    // const response = await authServices.logout();
    // setBool(true);
    // setContent(response.data.message);
    // if (response.data.success) {
    //   setTitle("Success");
    //   setTimeout(() => {
    //     localStorage.removeItem("user");
    //     window.location.reload();
    //     navigate("/");
    //   }, 3000);
    // } else {
    //   setTitle("Warn");
    //   setTimeout(() => {
    //     localStorage.removeItem("user");
    //     window.location.reload();
    //     navigate("/");
    //   }, 3000);
    // }
  };

  useEffect(() => {
    if (user) {
      // cartServices.getWishlists(user._id).then((res) => {
      //   if (res.data.success) {
      //     const cart = res.data.result.items;
      //     setQuantity(cart.length);
      //   }
      // });
    }
  }, [user]);

  return (
    <div className={cx("header__body")}>
      <div className={cx("wrapper")}>
        <div className={cx("header__body__child")}>
          <NavLink to="/">
            <div className={cx("header__body__child__logo")}>
              <IconLogo />
            </div>
          </NavLink>
          <div className={cx("header__body__child__search")}>
            <div
              className={cx("header__body__child__search__details")}
              tabIndex={100}
            >
              <input
                type="text"
                placeholder="Search for Products"
                className={cx("header__body__child__search__details__input")}
                onChange={handleSearchRoom}
              />
            </div>
            <div className={cx("header__body__child__search__btnSearch")}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={cx(
                  "header__body__child__search__btnSearch--iconSearch"
                )}
              />
            </div>
          </div>
          <div className={cx("header__body__child__selection")}>
            <div className={cx("header__body__child__selection__compare")}>
              <FontAwesomeIcon
                icon={faRepeat}
                className={cx("header__body__child__selection__icon")}
              />
              <div
                className={cx("header__body__child__selection__compare__hover")}
              >
                Compare
              </div>
            </div>
            <div className={cx("header__body__child__selection__heart")}>
              <FontAwesomeIcon
                icon={faCartShopping}
                className={cx("header__body__child__selection__icon")}
              />
              <div
                className={cx("header__body__child__selection__heart__hover")}
              >
                Buy
              </div>
            </div>
            <div className={cx("header__body__child__selection__acc")}>
              <FontAwesomeIcon
                icon={faUser}
                className={cx("header__body__child__selection__icon")}
              />
              {user === null ? (
                <div
                  className={cx("header__body__child__selection__acc__hover")}
                >
                  <NavLink to="/login">
                    <div
                      className={cx(
                        "header__body__child__selection__acc__hover__login"
                      )}
                    >
                      Đăng nhập
                    </div>
                  </NavLink>
                  <NavLink to="/register">
                    <div
                      className={cx(
                        "header__body__child__selection__acc__hover__register"
                      )}
                    >
                      Đăng ký
                    </div>
                  </NavLink>
                </div>
              ) : (
                <div
                  className={cx("header__body__child__selection__acc__hover")}
                >
                  <div
                    className={cx(
                      "header__body__child__selection__acc__hover__userName"
                    )}
                  >
                    {user.personalInformation?.fullName
                      ? user.personalInformation?.fullName
                      : user.username}
                  </div>
                  <div
                    className={cx(
                      "header__body__child__selection__acc__hover__info"
                    )}
                  >
                    <NavLink
                      to={"/account"}
                      style={{ textDecoration: "none", color: "currentcolor" }}
                    >
                      Thông tin cá nhân
                    </NavLink>
                  </div>
                  {user.role === "ChuTro" && (
                    <div
                      className={cx(
                        "header__body__child__selection__acc__hover__info"
                      )}
                    >
                      <NavLink
                        to={"/articleManager"}
                        style={{
                          textDecoration: "none",
                          color: "currentcolor",
                        }}
                      >
                        Quản lý bài viết
                      </NavLink>
                    </div>
                  )}
                  <div
                    className={cx(
                      "header__body__child__selection__acc__hover__logout"
                    )}
                    onClick={handleOnClickLogout}
                  >
                    logout
                  </div>
                </div>
              )}
            </div>
            <NavLink to="/wishlist">
              <div className={cx("header__body__child__selection__cart")}>
                <div
                  className={cx("header__body__child__selection__cart__icon")}
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={cx("header__body__child__selection__icon")}
                  />
                  <div
                    className={cx(
                      "header__body__child__selection__cart__icon__quality"
                    )}
                  >
                    {quality}
                  </div>
                </div>
                <span
                  className={cx(
                    "header__body__child__selection__cart__content"
                  )}
                ></span>
                <div
                  className={cx("header__body__child__selection__cart__hover")}
                >
                  Wishlist
                </div>
              </div>
            </NavLink>
          </div>
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
      </div>
    </div>
  );
}

HeaderBody.propTypes = {
  setSearch: PropTypes.func.isRequired,
};

export default HeaderBody;
