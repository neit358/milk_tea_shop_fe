import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useEffect } from "react";
import Select from "react-select";

import classNames from "classnames/bind";
import styles from "./cart.module.scss";
import ToastInformation from "~/Components/Notification";
import CartChild from "./cartChild";
import CartModel from "./cartModel";
import * as cartService from "~/services/cart.service";
import * as invoiceService from "~/services/order.service";
import * as statusService from "~/services/status.service";
import * as promotionService from "~/services/promotion.service";
import * as branchService from "~/services/branch.service";
import LoadingComponent from "~/Components/Loading";
import dayjs from "dayjs";
import { NavLink } from "react-router-dom";

const cx = classNames.bind(styles);

function Cart() {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || null));
  const [bool, setBool] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [listCart, setListCart] = useState([]);
  const [idCart, setIdCart] = useState("");
  const [reload, setReload] = useState(false);
  const [showCartModel, setShowCartModel] = useState(false);
  const [selectionCart, setSelectionCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [shipping] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [receiver, setReceiver] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState(null);
  const [methodPay, setMethodPay] = useState("");
  const [branch, setBranch] = useState(null);
  const [typeDisplay, setTypeDisplay] = useState("none");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPromotionOrderId, setSelectedPromotionOrderId] =
    useState(null);
  const [listOfBranch, setListOfBranch] = useState([]);
  const [promotionsOrder, setPromotionsOrder] = useState([]);
  const [validate, setValidate] = useState(false);
  const [promotionOrder, setPromotionOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      setContent("Hãy đăng ký hoặc đăng nhập để xem giỏ hàng!");
      setTitle("Warn");
      setBool(true);
      return;
    }

    setPhone(user.sdt);
    setReceiver(user.ten);
    setAddress(
      user?.diaChi &&
        `${user?.diaChi?.soNha || ""} ${user?.diaChi?.tenDuong || ""} ${
          user?.diaChi?.phuong || ""
        } ${user?.diaChi?.quan || ""} ${user?.diaChi?.thanhPho || ""} `
    );

    const fetchAPI = async () => {
      const response = await cartService.getCarts(user._id);
      if (response.data.success) {
        setIdCart(response.data.result._id);

        const listData = response.data.result.items;

        listData.map((item) => {
          const listKhuyenMai = item?.sanPham?.khuyenMai?.filter(
            (khuyenMai) => {
              return (
                new Date(khuyenMai.ngayBatDau) <= new Date() &&
                new Date(khuyenMai.ngayKetThuc) >= new Date() &&
                khuyenMai.trangThai &&
                !khuyenMai.isDel
              );
            }
          );

          const khuyenMai =
            listKhuyenMai.length > 0
              ? listKhuyenMai[listKhuyenMai.length - 1]
              : null;

          item.khuyenMai = khuyenMai;
          return item;
        });

        setListCart(listData);
      } else {
        setContent(response.data.message);
        setTitle("Warn");
        setBool(true);
      }
    };
    fetchAPI();
  }, [user]);

  useEffect(() => {
    const totalSelected = selectionCart.reduce(
      (acc, item) => acc + handleTotalProduct(item),
      0
    );

    const totalDiscount = selectionCart.reduce(
      (acc, item) => acc + handleDiscountProduct(item),
      0
    );

    const promotionOfOrder =
      selectedPromotionOrderId &&
      promotionsOrder.find((item) => item._id === selectedPromotionOrderId);

    promotionOfOrder && setPromotionOrder(promotionOfOrder);

    setDiscount(
      totalDiscount +
        (promotionOfOrder &&
        promotionOfOrder.giaTriDonHangToiThieu <= totalSelected
          ? promotionOfOrder.phuongThucKhuyenMai === "percentage"
            ? promotionOfOrder.giaToiDaKhuyenMai === -1
              ? totalSelected * promotionOfOrder.giaTriKhuyenMai * 0.01
              : totalSelected * promotionOfOrder.giaTriKhuyenMai * 0.01 >
                promotionOfOrder.giaToiDaKhuyenMai
              ? promotionOfOrder.giaToiDaKhuyenMai
              : totalSelected * promotionOfOrder.giaTriKhuyenMai * 0.01
            : promotionOfOrder.giaTriKhuyenMai
          : 0)
    );
    setTotal(totalSelected);
  }, [selectionCart, selectedPromotionOrderId, promotionsOrder]);

  useEffect(() => {
    setTotalPayment(
      total + shipping - discount > 0 ? total + shipping - discount : 0
    );
  }, [total, shipping, discount]);

  const handleTotalProduct = (item) => {
    return (
      item.soLuong * item.sanPham.gia +
      item.thongTinKichThuoc.giaThem +
      item.soLuong *
        item.thongTinTopping.reduce(
          (acc, item) => acc + item.topping.gia * item.soLuong,
          0
        )
    );
  };

  const handleDiscountProduct = (item) => {
    return item.khuyenMai &&
      new Date(item.khuyenMai.ngayBatDau) < new Date() &&
      new Date(item.khuyenMai.ngayKetThuc) > new Date() &&
      item.khuyenMai.trangThai &&
      !item.khuyenMai.isDel
      ? item.khuyenMai.phuongThucKhuyenMai === "percentage"
        ? item.khuyenMai.giaTriKhuyenMai !== 100
          ? item.sanPham.gia * item.khuyenMai.giaTriKhuyenMai * 0.01
          : 0
        : item.khuyenMai.giaTriKhuyenMai
      : 0;
  };

  const handleQualityPromotionProduct = (item) => {
    return item.khuyenMai &&
      item.khuyenMai.phuongThucKhuyenMai === "percentage" &&
      item.khuyenMai.giaTriKhuyenMai === 100
      ? item.soLuong
      : 0;
  };

  const handleQualityProductOrder = (items) => {
    return items.reduce(
      (acc, item) => acc + item.soLuong + handleQualityPromotionProduct(item),
      0
    );
  };

  const handleClickSubmitPay = async () => {
    if (!branch) {
      setContent("Vui lòng chọn chi nhánh!");
      setTitle("Warn");
      setBool(true);
      return;
    }

    if (selectionCart.length === 0) {
      setContent("Bạn chưa thêm sản phẩm để thanh toán!");
      setTitle("Warn");
      setBool(true);
      return;
    }

    if (!address || !methodPay || !phone) {
      setContent("Vui lòng nhập đầy đủ thông tin!");
      setTitle("Warn");
      setBool(true);
      setValidate(true);
      setTimeout(() => {
        setValidate(false);
      }, 1000);
      return;
    }

    setIsLoading(true);

    const responseStatus = await statusService.getStatuses();

    if (!responseStatus.data.success) {
      setContent(responseStatus.data.message);
      setTitle("Warn");
      setBool(true);
      setIsLoading(false);
      return;
    }

    const bodyRequest = {
      items: selectionCart.map((item) => ({
        sanPham: item.sanPham,
        soLuong: item.soLuong,
        soLuongKhuyenMai: handleQualityPromotionProduct(item),
        thongTinKichThuoc: {
          kichThuoc: item.thongTinKichThuoc.kichThuoc,
          giaThem: item.thongTinKichThuoc.giaThem,
        },
        thongTinTopping: item.thongTinTopping.map((topping) => ({
          topping: topping.topping,
          soLuong: topping.soLuong,
        })),
        da: item.da,
        ngot: item.ngot,
        tra: item.tra,
        khuyenMai: item.khuyenMai,
        tongTien: handleTotalProduct(item),
        giamGia: handleDiscountProduct(item),
        thanhTien: handleTotalProduct(item) - handleDiscountProduct(item),
      })),
      ghiChu: note,
      diaChi: {
        soNha: address.split(",")[0].trim(),
        tenDuong: address.split(",")[1].trim(),
        phuong: address.split(",")[2].trim(),
        quan: address.split(",")[3].trim(),
        thanhPho: address.split(",")[4].trim(),
      },
      sdt: phone,
      trangThai: responseStatus.data.result[0]._id,
      thoiGianGiao: time,
      phuongThucThanhToan: methodPay,
      chiNhanh: branch.label,
      soLuongSanPham: handleQualityProductOrder(selectionCart),
      khuyenMai: promotionOrder,
      tongTien: total,
      giamGia: discount,
      tienShip: shipping,
      thanhTien: totalPayment,
    };

    const responseAddCart = await invoiceService.addOrder(bodyRequest);

    setBool(true);
    setContent(responseAddCart.data.message);
    setTitle(responseAddCart.data.success ? "Success" : "Warn");
    if (responseAddCart.data.success) {
      try {
        selectionCart.forEach(async (item) => {
          const responseDeleteCart = await cartService.deleteCart(idCart, {
            id: item._id,
          });

          if (!responseDeleteCart.data.success) {
            setContent("Xóa giỏ hàng thất bại!");
            setTitle("Error");
            setBool(true);
            setIsLoading(false);
            return;
          }
        });

        setTimeout(() => {
          setIsLoading(false);
          window.location.href = "/don_mua";
        }, 3000);
      } catch {
        setBool(true);
        setContent("Lỗi kết nối đến server");
        setTitle("Error");
      }
    }
  };

  useEffect(() => {
    const fetchAPI = async () => {
      const response = await promotionService.getPromotions();

      if (!response.data.success) {
        setContent(response.data.message);
        setTitle("Warn");
        setBool(true);
        return;
      }

      const listPromotion = response.data.result.filter(
        (order) =>
          order.giaToiDaKhuyenMai !== 0 &&
          new Date(order.ngayBatDau) < new Date() &&
          new Date(order.ngayKetThuc) > new Date() &&
          order.trangThai
      );

      setPromotionsOrder(listPromotion);
    };

    fetchAPI();
  }, []);

  useEffect(() => {
    const fetchAPI = async () => {
      const response = await branchService.getBranchs();

      if (!response.data.success) {
        setContent(response.data.message);
        setTitle("Warn");
        setBool(true);
        return;
      }

      setListOfBranch(response.data.result);
    };

    fetchAPI();
  }, []);

  const handleChangeBranch = (selectedBranch) => {
    setBranch(selectedBranch);
    setSelectionCart([]);
  };

  return (
    <>
      <div className={cx("cart")}>
        <div className={cx("cart__topic")}>Cart</div>
        {user && (
          <div className={cx("cart__branch")}>
            <label>Chi nhánh:</label>
            <Select
              value={branch}
              name="branch"
              onChange={handleChangeBranch}
              options={listOfBranch.map((branch) => ({
                label: branch.tenChiNhanh,
                value: branch._id,
              }))}
              isClearable
              className={cx("cart__branch__select")}
            />
          </div>
        )}
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
              <th className={cx("cart__tableRow__column")}>Topping</th>
              <th className={cx("cart__tableRow__column")}>Giá</th>
              <th className={cx("cart__tableRow__column")}>Chọn</th>
              <th className={cx("cart__tableRow__column")}>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {user ? (
              listCart.length > 0 ? (
                listCart.map((cart, index) => (
                  <CartChild
                    key={index}
                    cart={cart}
                    idCart={idCart}
                    setReload={setReload}
                    reload={reload}
                    setSelectionCart={setSelectionCart}
                    selectionCart={selectionCart}
                    branch={branch}
                    handleTotalProduct={handleTotalProduct}
                  />
                ))
              ) : (
                <tr>
                  <td className={cx("cart__table--noData")} colSpan="10">
                    Không có dữ liệu
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td className={cx("cart__table--noData")} colSpan="10">
                  Hãy{" "}
                  <NavLink
                    to="/dang_ki"
                    style={{
                      color: "blue",
                    }}
                  >
                    đăng ký
                  </NavLink>{" "}
                  hoặc{" "}
                  <NavLink
                    to="/dang_nhap"
                    style={{
                      color: "blue",
                    }}
                  >
                    đăng nhập
                  </NavLink>{" "}
                  tài khoản để có thể xem giỏ hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {user && (
          <div className={cx("cart__pay")}>
            <div
              className={cx("cart__pay__information", "cart__pay__background")}
            >
              <div className={cx("cart__pay__information__item")}>
                <span>
                  <span>Người nhận: </span>
                  <span>{receiver || user.ten || "..."}</span>
                </span>
                <div
                  className={cx("cart__pay__information__item__edit")}
                  onClick={() => {
                    setTypeDisplay("receiver");
                    setShowCartModel(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </div>
              </div>
              <div className={cx("cart__pay__information__item")}>
                <span className={cx(`${!phone && validate ? "warning" : ""}`)}>
                  Số điện thoại: <span>{phone || user.sdt || "..."}</span>
                </span>
                <div
                  className={cx("cart__pay__information__item__edit")}
                  onClick={() => {
                    setTypeDisplay("phone");
                    setShowCartModel(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </div>
              </div>
              <div className={cx("cart__pay__information__item")}>
                <span
                  className={cx(`${!address && validate ? "warning" : ""}`)}
                >
                  <span>Địa chỉ: </span>
                  <span>
                    {address ||
                      (user.diaChi &&
                        `${user?.diaChi?.soNha} ${user?.diaChi?.tenDuong} ${user?.diaChi?.phuong} ${user?.diaChi?.quan} ${user?.diaChi?.thanhPho} `) ||
                      "..."}
                  </span>
                </span>
                <div
                  className={cx("cart__pay__information__item__edit")}
                  onClick={() => {
                    setTypeDisplay("address");
                    setShowCartModel(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </div>
              </div>
              <div
                className={cx(
                  "cart__pay__information__item",
                  "cart__pay__information__time"
                )}
              >
                <span className={cx("cart__pay__information__time__item")}>
                  Thời gian nhận hàng:
                  <br />
                  <div
                    className={cx(
                      "cart__pay__information__time__item__information"
                    )}
                  >
                    <div>
                      Nhận hàng trong:{" "}
                      {time ? dayjs(time).format("DD/MM/YYYY") : "Hôm nay"}
                    </div>
                    <div>
                      Vào lúc:{" "}
                      {time ? dayjs(time).format("HH:mm") : "Càng sớm càng tốt"}
                    </div>
                  </div>
                </span>
                <div
                  className={cx("cart__pay__information__item__edit")}
                  onClick={() => {
                    setTypeDisplay("time");
                    setShowCartModel(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </div>
              </div>
              <div className={cx("cart__pay__information__item")}>
                <span>
                  <span>Ghi chú: </span>
                  <span>{note || "..."}</span>
                </span>
                <div
                  className={cx("cart__pay__information__item__edit")}
                  onClick={() => {
                    setTypeDisplay("note");
                    setShowCartModel(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </div>
              </div>
              <div
                className={cx(
                  "cart__pay__information__item",
                  "cart__pay__information__pay"
                )}
              >
                <span className={cx("cart__pay__information__pay__item")}>
                  <span
                    className={cx(`${!methodPay && validate ? "warning" : ""}`)}
                  >
                    Phương thức thanh toán:
                  </span>
                  <br />
                  <div
                    className={cx("cart__pay__information__pay__item__group")}
                  >
                    <span
                      className={cx(
                        "cart__pay__information__pay__item__group__span"
                      )}
                    >
                      <input
                        type="radio"
                        value="COD"
                        name="name"
                        checked={methodPay === "COD"}
                        onChange={(e) => setMethodPay(e.target.value)}
                        className={cx(
                          "cart__pay__information__pay__item__group__span__radio"
                        )}
                      />
                      Thanh toán khi nhận hàng
                    </span>
                    <span
                      className={cx(
                        "cart__pay__information__pay__item__group__span"
                      )}
                    >
                      <input
                        type="radio"
                        value="VNPAY"
                        checked={methodPay === "VNPAY"}
                        onChange={(e) => setMethodPay(e.target.value)}
                        className={cx(
                          "cart__pay__information__pay__item__group__span__radio"
                        )}
                      />
                      Thanh toán bằng VNPay
                    </span>
                    <span
                      className={cx(
                        "cart__pay__information__pay__item__group__span"
                      )}
                    >
                      <input
                        type="radio"
                        value="BANK"
                        checked={methodPay === "BANK"}
                        onChange={(e) => setMethodPay(e.target.value)}
                        className={cx(
                          "cart__pay__information__pay__item__group__span__radio"
                        )}
                      />
                      Thanh toán bằng ngân hàng
                    </span>
                  </div>
                </span>
              </div>
            </div>
            <div className={cx("cart__pay__total", "cart__pay__background")}>
              <div className={cx("cart__pay__total__promotion")}>
                <h3>Chọn Khuyến Mãi</h3>
                <div className={cx("cart__pay__total__promotion__list")}>
                  {promotionsOrder.map((promotion) => (
                    <label
                      key={promotion._id}
                      className={cx(
                        "cart__pay__total__promotion__list__option"
                      )}
                    >
                      <input
                        type="checkbox"
                        name="promotion"
                        value={promotion._id}
                        checked={selectedPromotionOrderId === promotion._id}
                        onChange={(event) =>
                          setSelectedPromotionOrderId(
                            selectedPromotionOrderId === event.target.value
                              ? null
                              : event.target.value
                          )
                        }
                      />
                      <span
                        className={cx("cart__pay__total__promotion__list__tag")}
                      >
                        {promotion.tag}
                      </span>
                    </label>
                  ))}
                </div>
                <p>
                  Khuyến mãi đã chọn:{" "}
                  {selectedPromotionOrderId
                    ? promotionsOrder.find(
                        (promotion) =>
                          promotion._id === selectedPromotionOrderId
                      ).tag
                    : "Chưa chọn"}
                </p>
              </div>

              <div className={cx("cart__pay__total__item")}>
                <span>Tiền hàng:</span>
                <span>{total} ₫</span>
              </div>
              <div className={cx("cart__pay__total__item")}>
                <span>Tiền ship:</span>
                <span>{shipping} ₫</span>
              </div>
              <div className={cx("cart__pay__total__item")}>
                <span>Giảm giá:</span>
                <span>-{discount} ₫</span>
              </div>
              <hr className={cx("cart__pay__total__divider")} />
              <div
                className={cx(
                  "cart__pay__total__item",
                  "cart__pay__total__item--total"
                )}
              >
                <span>Thành tiền:</span>
                <span>{totalPayment} ₫</span>
              </div>
              <div className={cx("cart__pay__total__button")}>
                <button
                  className={cx("cart__pay__total__button__pay")}
                  onClick={handleClickSubmitPay}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isLoading && <LoadingComponent />}
      {bool && (
        <ToastInformation
          content={content}
          title={title}
          bool={bool}
          setBool={setBool}
          timeOut={3000}
        />
      )}
      {showCartModel && (
        <CartModel
          setShowCartModel={setShowCartModel}
          setAddress={setAddress}
          setNote={setNote}
          setReceiver={setReceiver}
          setPhone={setPhone}
          setTime={setTime}
          typeDisplay={typeDisplay}
        />
      )}
    </>
  );
}

export default Cart;
