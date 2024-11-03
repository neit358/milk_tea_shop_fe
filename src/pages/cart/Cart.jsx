import classNames from "classnames/bind";
import styles from "./cart.module.scss";
import * as cartServices from "~/services/cart.service";
import { useState } from "react";
import { useEffect } from "react";
import ToastInformation from "~/Components/Notification";
import CartChild from "./cartChild";

const cx = classNames.bind(styles);

function Cart() {
  const [bool, setBool] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [listCart, setListCart] = useState([]);
  const [reload, setReload] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem("user") || null));

  useEffect(() => {
    if (!user) {
      setContent("Hãy đăng ký hoặc đăng nhập để xem danh sách yêu thích!");
      setTitle("Warn");
      setBool(true);
      return;
    }

    const fetchAPI = async () => {
      const response = await cartServices.getCarts(user._id);
      if (response.data.success) {
        setListCart(response.data.result.items);
      } else {
        setContent(response.data.message);
        setTitle("Warn");
        setBool(true);
      }
    };
    fetchAPI();
  }, [user]);
  return (
    <>
      <div className={cx("cart")}>
        <div className={cx("cart__topic")}>Cart</div>
        <table className={cx("cart__table")}>
          <thead>
            <tr className={cx("cart__tableRow")}>
              <th className={cx("cart__tableRow__column")}></th>
              <th
                className={cx(
                  "cart__tableRow__column",
                  "cart__tableRow__column--2"
                )}
              ></th>
              <th className={cx("cart__tableRow__column")}>Sản phẩm</th>
              <th className={cx("cart__tableRow__column")}>Số lượng</th>
              <th className={cx("cart__tableRow__column")}>Kích thước</th>
              <th className={cx("cart__tableRow__column")}>Đá</th>
              <th className={cx("cart__tableRow__column")}>Ngọt</th>
              <th className={cx("cart__tableRow__column")}>Giá</th>
            </tr>
          </thead>
          <tbody>
            {user?.sdt ? (
              listCart.length > 0 ? (
                listCart.map((cart, index) => (
                  <CartChild
                    key={index}
                    cart={cart}
                    setReload={setReload}
                    reload={reload}
                  />
                ))
              ) : (
                <tr>
                  <td className={cx("cart__table--noData")} colSpan="8">
                    Không có dữ liệu
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td className={cx("cart__table--noData")} colSpan="8">
                  Hãy <a href="./account?type=register">đăng ký</a> hoặc{" "}
                  <a href="./account?type=login">đăng nhập</a> tài khoản để có
                  thể xem danh sách yêu thích
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
    </>
  );
}

export default Cart;
