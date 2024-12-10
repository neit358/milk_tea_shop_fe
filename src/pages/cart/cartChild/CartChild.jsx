import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import classNames from "classnames/bind";
import styles from "./CartChild.module.scss";
import Image from "~/Components/Image/Image";
import { useEffect, useState } from "react";
import * as cartService from "~/services/cart.service";

const cx = classNames.bind(styles);

import PropTypes from "prop-types";
import LoadingComponent from "~/Components/Loading";
import ToastInformation from "~/Components/Notification";
import ProductDetail from "~/pages/productDetail";
import { convertCurrency } from "~/shared/services/convert.service";

function CartChild({
  idCart,
  cart,
  reload,
  setReload,
  setSelectionCart,
  selectionCart,
  branch,
  handleTotalProduct,
}) {
  const [bool, setBool] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [user] = useState(JSON.parse(localStorage.getItem("user") || null));
  const [isLoading, setIsLoading] = useState(false);
  const [editCart, setEditCart] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleChangeSelected = (e) => {
    setChecked(e.target.checked);
    if (e.target.checked) {
      setSelectionCart([...selectionCart, cart]);
    } else {
      setSelectionCart(selectionCart.filter((item) => item._id !== cart._id));
    }
  };

  useEffect(() => {
    selectionCart.length === 0 && setChecked(false);
  }, [selectionCart]);

  const handleOnClickDeleteCart = async () => {
    if (!user) {
      setContent("Hãy đăng ký hoặc đăng nhập để xem giỏ hàng!");
      setTitle("Warn");
      setBool(true);
      return;
    }
    setIsLoading(true);
    const response = await cartService.deleteCart(idCart, {
      id: cart._id,
    });
    setBool(true);
    setContent(response.data.message);
    if (response.data.success) {
      setTitle("Success");
      setReload(!reload);
      setTimeout(() => {
        setIsLoading(false);
        window.location.reload();
      }, 3000);
    } else {
      setTitle("Error");
    }
  };

  const handleOnClickEditCart = () => {
    setEditCart(true);
  };

  return (
    <>
      <tr className={cx("cartChild")}>
        <td className={cx("cartChild__column")}>
          <div className={cx("cartChild__column__icon")}>
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
                onClick={handleOnClickEditCart}
              />
            </div>
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
          <div className={cx("cartChild__column__content")}>
            {cart.thongTinTopping?.length > 0
              ? cart.thongTinTopping.map((topping) => (
                  <div key={topping._id}>
                    {topping.topping.tenTopping} x {topping.soLuong}
                  </div>
                ))
              : "--"}
          </div>
        </td>
        <td className={cx("cartChild__column")}>
          <div className={cx("cartChild__column__content")}>
            {convertCurrency(handleTotalProduct(cart))}
          </div>
        </td>
        <td className={cx("cartChild__column")}>
          <input
            type="checkbox"
            onChange={handleChangeSelected}
            checked={checked}
          />
        </td>
        <td className={cx("cartChild__column")}>
          <div className={cx("cartChild__column__content")}>
            {cart.da?.tenDa &&
              cart.da?.tenDa !== "Bình thường" &&
              `Đá: ${cart.da?.tenDa}`}
          </div>
          <div className={cx("cartChild__column__content")}>
            {cart.ngot?.tenNgot &&
              cart.ngot?.tenNgot !== "Bình thường" &&
              `Đường: ${cart.ngot?.tenNgot}`}
          </div>
          <div className={cx("cartChild__column__content")}>
            {cart.tra?.tenTra &&
              cart.tra?.tenTra !== "Bình thường" &&
              `Trà: ${cart.tra?.tenTra}`}
          </div>
          {cart?.khuyenMai &&
            cart?.khuyenMai?.trangThai &&
            new Date(cart?.khuyenMai?.ngayBatDau) < new Date() &&
            new Date(cart?.khuyenMai?.ngayKetThuc) > new Date() &&
            !cart?.khuyenMai.isDel && (
              <div
                className={cx("cartChild__column__content")}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span>Khuyến mãi:</span>
                <span>{cart?.khuyenMai?.tag}</span>
              </div>
            )}
        </td>
        {branch?.value &&
          !cart?.sanPham?.chiNhanhApDung.some((id) => id === branch.value) && (
            <td className={cx("cartChild__column--notBranch")}>
              <div className={cx("cartChild__column__content--notBranch")}>
                Sản phẩm không có ở chi nhánh này
              </div>
            </td>
          )}
      </tr>
      {editCart && (
        <tr className={cx("modelCart")} onClick={() => setEditCart(false)}>
          <td
            className={cx("modelCart__content")}
            onClick={(e) => e.stopPropagation()}
          >
            <ProductDetail
              idProduct={cart.sanPham._id}
              cartItem={cart}
              idCart={idCart}
            />
          </td>
        </tr>
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

CartChild.propTypes = {
  idCart: PropTypes.string.isRequired,
  cart: PropTypes.object.isRequired,
  reload: PropTypes.bool.isRequired,
  setReload: PropTypes.func.isRequired,
  setSelectionCart: PropTypes.func.isRequired,
  selectionCart: PropTypes.array.isRequired,
  branch: PropTypes.object,
  handleTotalProduct: PropTypes.func.isRequired,
};

export default CartChild;
