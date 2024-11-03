import {
  faCartShopping,
  faHeart,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import numeral from "numeral";

import classNames from "classnames/bind";
import styles from "./HomeChild.module.scss";

const cx = classNames.bind(styles);

import { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import LoadingComponent from "~/Components/Loading";
import ToastInformation from "../../../Components/Notification";
import Image from "../../../Components/Image/Image";
import ProductDetail from "../../productDetail/ProductDetail";

function HomeChild({ sanPham }) {
  const [bool, setBool] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [user] = useState(JSON.parse(localStorage.getItem("user") || null));
  const [isLoading, setIsLoading] = useState(false);
  const [addCart, setAddCart] = useState(false);

  const formattedPrice = numeral(sanPham.gia).format("0,0") + " đ";

  const handleModelAddCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddCart(true);
  };

  return (
    <>
      <NavLink to={`/chi_tiet_san_pham/${sanPham._id}`}>
        <li className={cx("homeChild", "grid__column-10-3")}>
          <div className={cx("homeChild__child")}>
            <div className={cx("homeChild__child__type")}></div>
            <div className={cx("homeChild__child__name")}>
              {sanPham.tenSanPham}
            </div>
            <div className={cx("homeChild__child__image")}>
              <Image
                alt="Ảnh"
                src={sanPham.hinhAnh}
                className={cx("homeChild__child__image__detail")}
              />
            </div>
            <div className={cx("homeChild__child__description")}>
              {sanPham.moTa}
            </div>
            <div className={cx("homeChild__child__price")}>
              <div className={cx("homeChild__child__price__cost")}>
                <div className={cx("homeChild__child__price__cost--default")}>
                  {formattedPrice}
                </div>
              </div>
              <div className={cx("homeChild__child__price__icon")}>
                <FontAwesomeIcon
                  icon={faCartShopping}
                  className={cx("homeChild__child__price__icon--child")}
                  onClick={handleModelAddCart}
                />
              </div>
            </div>
            <div className={cx("homeChild__child__interact")}>
              <div className={cx("homeChild__child__interact__wishlist")}>
                <FontAwesomeIcon
                  icon={faHeart}
                  className={cx("homeChild__child__interact__wishlist--icon")}
                />
                <span
                  className={cx(
                    "homeChild__child__interact__wishlist--content"
                  )}
                >
                  wishlist
                </span>
              </div>
              <div className={cx("homeChild__child__interact__compare")}>
                <FontAwesomeIcon
                  icon={faRepeat}
                  className={cx("homeChild__child__interact__compare--icon")}
                />
                <span
                  className={cx("homeChild__child__interact__compare--content")}
                >
                  compare
                </span>
              </div>
            </div>
          </div>
        </li>
      </NavLink>
      {addCart && (
        <div className={cx("modelAddCart")} onClick={() => setAddCart(false)}>
          <div
            className={cx("modelAddCart__content")}
            onClick={(e) => e.stopPropagation()}
          >
            <ProductDetail idProduct={sanPham._id} />
          </div>
        </div>
      )}
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
    </>
  );
}
HomeChild.propTypes = {
  sanPham: PropTypes.shape({
    _id: PropTypes.string,
    tenSanPham: PropTypes.string,
    gia: PropTypes.number,
    moTa: PropTypes.string,
    kichThuoc: PropTypes.array,
    hinhAnh: PropTypes.string,
  }).isRequired,
};

export default HomeChild;
