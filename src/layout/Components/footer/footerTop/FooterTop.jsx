import styles from "./FooterTop.module.scss";
import classNames from "classnames/bind";

import { faPlaneDeparture } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const cx = classNames.bind(styles);

function FooterTop() {
  return (
    <div className={cx("footer__top")}>
      <div className={cx("wrapper")}>
        <div className={cx("footer__top__ticket")}>
          <div className={cx("footer__top__ticket__content")}>
            <div className={cx("footer__top__ticket__content__left")}>
              <FontAwesomeIcon
                icon={faPlaneDeparture}
                className={cx("footer__top__ticket__content__left--icont")}
              />
              <div
                className={cx("footer__top__ticket__content__left__content")}
              >
                Sign up to Newsletter
              </div>
            </div>
            <div className={cx("footer__top__ticket__content__right")}>
              ...and receive <strong>$20 coupon for first shopping</strong>
            </div>
          </div>
          <div className={cx("footer__top__ticket__input")}>
            <input
              type="text"
              name=""
              id=""
              className={cx("footer__top__ticket__input__child")}
              placeholder="Enter your email address"
            />
            <a className={cx("link-href")}>
              <button className={cx("footer__top__ticket__input__content")}>
                SignUp
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterTop;
