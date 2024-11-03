import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import classNames from "classnames/bind";
import styles from "./CartChild.module.scss";
import Image from "~/Components/Image/Image";
import { useState } from "react";
import * as cartServices from "~/services/cart.service";

const cx = classNames.bind(styles);

import PropTypes from "prop-types";
import LoadingComponent from "~/Components/Loading";
import ToastInformation from "~/Components/Notification";

function CartChild({ cart, reload, setReload }) {
  const [bool, setBool] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [user] = useState(JSON.parse(localStorage.getItem("user") || null));
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClickDeleteCart = async () => {
    if (!user) {
      setContent("Hãy đăng ký hoặc đăng nhập để xem danh sách yêu thích!");
      setTitle("Warn");
      setBool(true);
      return;
    }
    setIsLoading(true);
    const response = await cartServices.deleteCart({
      _id: cart._id,
    });
    setIsLoading(false);
    setBool(true);
    setContent(response.data.message);
    if (response.data.success) {
      setTitle("Success");
      setReload(!reload);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      setTitle("Error");
    }
  };

  return (
    <>
      <tr className={cx("cartChild")}>
        <td className={cx("cartChild__column", "cartChild__column__icon")}>
          <div className={cx("cartChild__column__icon__detail")}>
            <FontAwesomeIcon
              icon={faXmark}
              className={cx("cartChild__column__icon__detail__exit")}
              onClick={handleOnClickDeleteCart}
            />
          </div>
          <div className={cx("cartChild__column__icon__detail")}>
            <FontAwesomeIcon
              icon={faPenToSquare}
              className={cx("cartChild__column__icon__detail__edit")}
              onClick={handleOnClickDeleteCart}
            />
          </div>
        </td>
        <td className={cx("cartChild__column")}>
          <Image
            alt="ảnh sản phẩm"
            src={cart.sanPham.hinhAnh}
            className={cx("cartChild__column__image")}
          />
        </td>
        <td className={cx("cartChild__column")}>
          <div className={cx("cartChild__column__content")}>
            {cart.sanPham.tenSanPham}
          </div>
        </td>
        <td className={cx("cartChild__column")}>
          <div className={cx("cartChild__column__content")}>{cart.soLuong}</div>
        </td>
        <td className={cx("cartChild__column")}>
          <div className={cx("cartChild__column__content")}>
            {cart.thongTinKichThuoc.kichThuoc.tenKichThuoc}
          </div>
        </td>
        <td className={cx("cartChild__column")}>
          <div className={cx("cartChild__column__content")}>{cart.da}</div>
        </td>
        <td className={cx("cartChild__column")}>
          <div className={cx("cartChild__column__content")}>{cart.ngot}</div>
        </td>
        <td className={cx("cartChild__column")}>
          <div className={cx("cartChild__column__content")}>
            {cart.sanPham.gia}
          </div>
        </td>
      </tr>
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

CartChild.propTypes = {
  cart: PropTypes.object.isRequired,
  reload: PropTypes.bool.isRequired,
  setReload: PropTypes.func.isRequired,
};

export default CartChild;
