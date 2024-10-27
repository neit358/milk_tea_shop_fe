import classNames from "classnames/bind";
import styles from "./HeaderTop.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faShop, faTruck, faUser } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function HeaderTop() {
    return ( 
        <div className={cx("header__top")}>
            <div className={cx("wrapper")}>
                <div className={cx("header__top__child")}>
                    <div className={cx("header__top__child__left")}>
                        Welcome to Worldwide Electronics Store
                    </div>
                    <div className={cx("header__top__child__right")}>
                        <div className={cx("header__top__child__right__child", "header__top__child__right__local")}>
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span className={cx("header__top__child__right__local__content")}>Store Locator</span>
                        </div>
                        <div className={cx("header__top__child__right__child", "header__top__child__right__order")}>
                            <FontAwesomeIcon icon={faTruck} />
                            <span className={cx("header__top__child__right__order__content")}>Track Your Order</span>
                        </div>
                        <div className={cx("header__top__child__right__child", "header__top__child__right__shop")}>
                            <FontAwesomeIcon icon={faShop} />
                            <span className={cx("header__top__child__right__shop__content")}>Shop</span>
                        </div>
                        <div className={cx("header__top__child__right__child", "header__top__child__right__account")}>
                            <FontAwesomeIcon icon={faUser} />
                            <span className={cx("header__top__child__right__account__content")}>My Account</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default HeaderTop;