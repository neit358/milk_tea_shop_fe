import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import classNames from "classnames/bind";
import styles from "./Order.module.scss";
import OrderChild from "./orderChild";
import ConfirmModel from "~/Components/ConfirmModel";
import ToastInformation from "~/Components/Notification";
import * as invoiceService from "~/services/order.service";
import * as statusService from "~/services/status.service";
import OrderProgress from "./orderProgress";
import LoadingComponent from "~/Components/Loading";
import { NavLink } from "react-router-dom";

const cx = classNames.bind(styles);

function Invoice({ invoiceId }) {
  const [listOfInvoice, setListOfInvoice] = useState([]);
  const [listOfStatus, setListOfStatus] = useState([]);
  const [bool, setBool] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmContent, setConfirmContent] = useState("");
  const [user] = useState(JSON.parse(localStorage.getItem("user") || null));
  const [isConfirmModel, setIsConfirmModel] = useState(false);
  const [operation, setOperation] = useState("");
  const [cancelId, setCancelId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!user) {
      setContent("Bạn cần đăng ký hoặc đăng nhập để xem thông tin đơn hàng");
      setTitle("Warn");
      setBool(true);
      return;
    }

    const fetchAPI = async () => {
      try {
        const response = invoiceId
          ? await invoiceService.getOrderById(invoiceId)
          : await invoiceService.getOrder();
        if (response.data.success) {
          setListOfInvoice(
            invoiceId ? [response.data.result] : response.data.result
          );
        } else {
          setContent(response.data.message);
          setTitle("Warn");
          setBool(true);
        }
      } catch {
        setContent("Api không tồn tại!");
        setTitle("Warn");
        setBool(true);
      }
    };

    fetchAPI();
  }, [isConfirmModel]);

  useEffect(() => {
    if (!user) {
      setContent("Bạn cần đăng ký hoặc đăng nhập để xem thông tin đơn hàng");
      setTitle("Warn");
      setBool(true);
      return;
    }

    const fetchAPI = async () => {
      try {
        const response = await statusService.getStatuses();
        if (response.data.success) {
          setListOfStatus(response.data.result);
        } else {
          setContent(response.data.message);
          setTitle("Warn");
          setBool(true);
        }
      } catch {
        setContent("Api không tồn tại!");
        setTitle("Warn");
        setBool(true);
      }
    };

    fetchAPI();
  }, []);

  const handleClickConfirmCancelOrder = (id) => {
    setCancelId(id);
    setOperation("cancel");
    setConfirmTitle("Hủy đơn hàng");
    setConfirmContent("Bạn có chắc chắn muốn hủy đơn hàng không?");
    setIsConfirmModel(true);
  };

  const handleCancelOrder = async () => {
    try {
      setIsLoading(true);
      const response = await invoiceService.cancelOrder(cancelId);
      setContent(response.data.message);
      setTitle(response.data.success ? "Success" : "Error");
      setBool(true);
      if (response.data.success) {
        setTimeout(() => {
          setIsLoading(false);
          setIsConfirmModel(false);
        }, 3000);
      }
    } catch {
      setContent("Api không tồn tại!");
      setTitle("Warn");
      setBool(true);
    }
  };

  const handleClickConfirmChangeStatus = (trangThai) => {
    setOperation("change");
    setConfirmTitle(trangThai.thaoTac);
    setConfirmContent(
      `Bạn có chắc chắn muốn ${trangThai.thaoTac.toLowerCase()}?`
    );
    setIsConfirmModel(true);
  };

  const handleChangeStatus = async () => {
    try {
      const trangThai = listOfStatus.find(
        (status) =>
          status.trangThai === listOfInvoice[0].trangThai.trangThai + 1
      )._id;

      if (!trangThai) {
        setContent("Không thể thay đổi trạng thái");
        setTitle("Error");
        setBool(true);
        return;
      }

      const response = await invoiceService.updateOrder(invoiceId, {
        trangThai,
      });

      setContent(response.data.message);
      setTitle(response.data.success ? "Success" : "Error");
      setBool(true);
      if (response.data.success) {
        setTimeout(() => {
          setIsConfirmModel(false);
        }, 3000);
      }
    } catch {
      setContent("Api không tồn tại!");
      setTitle("Warn");
      setBool(true);
    }
  };

  return (
    <>
      <div className={cx("order")}>
        {!invoiceId && <h1 className={cx("order__title")}>Quản lý đơn hàng</h1>}

        {user ? (
          listOfInvoice.length > 0 ? (
            listOfInvoice.map((invoice, index) => (
              <div key={index} className={cx("order__container")}>
                {/* Tiến trình đơn hàng */}
                {!invoiceId && (
                  <OrderProgress
                    invoice={invoice}
                    index={index}
                    listOfStatus={listOfStatus}
                  />
                )}

                {/* Danh sách sản phẩm */}
                <div className={cx("order__container__details")}>
                  <table className={cx("order__container__details__table")}>
                    <thead>
                      <tr>
                        <th
                          className={cx(
                            "order__container__details__table__column"
                          )}
                        ></th>
                        <th
                          className={cx(
                            "order__container__details__table__column"
                          )}
                        >
                          Sản phẩm
                        </th>
                        <th
                          className={cx(
                            "order__container__details__table__column"
                          )}
                        >
                          Số lượng
                        </th>
                        <th
                          className={cx(
                            "order__container__details__table__column"
                          )}
                        >
                          Kích thước
                        </th>
                        <th
                          className={cx(
                            "order__container__details__table__column"
                          )}
                        >
                          Topping
                        </th>
                        <th
                          className={cx(
                            "order__container__details__table__column"
                          )}
                        >
                          Giá
                        </th>
                        <th
                          className={cx(
                            "order__container__details__table__column"
                          )}
                        >
                          Ghi chú
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items &&
                        invoice.items.length > 0 &&
                        invoice.items.map((item, index) => (
                          <OrderChild key={index} item={item} />
                        ))}
                    </tbody>
                  </table>

                  {/* Thông tin tổng đơn hàng */}
                  <div className={cx("order__container__details__summary")}>
                    <h2
                      className={cx(
                        "order__container__details__summary__title"
                      )}
                    >
                      Tổng đơn hàng
                    </h2>
                    <div
                      className={cx("order__container__details__summary__item")}
                    >
                      <span>Tổng tiền hàng:</span>
                      <span>{invoice.tongTien} đ</span>
                    </div>
                    <div
                      className={cx("order__container__details__summary__item")}
                    >
                      <span>Phí vận chuyển:</span>
                      <span>{invoice.tienShip} đ</span>
                    </div>
                    <div
                      className={cx("order__container__details__summary__item")}
                    >
                      <span>Giảm giá:</span>
                      <span>-{invoice.giamGia} đ</span>
                    </div>
                    <div
                      className={cx(
                        "order__container__details__summary__item",
                        "order__container__details__summary__item--total"
                      )}
                    >
                      <span>Tổng cộng:</span>
                      <span>{invoice.thanhTien} đ</span>
                    </div>
                  </div>
                </div>

                {/* Nút hành động */}
                <div className={cx("order__buttons")}>
                  {invoiceId ? (
                    <button
                      className={cx(
                        "order__buttons__btn",
                        "order__buttons__btn--confirm",
                        "order__buttons__btn--disable"
                      )}
                      style={{
                        pointerEvents:
                          invoice.trangThai.trangThai ===
                          listOfStatus[listOfStatus.length - 1]?.trangThai
                            ? "none"
                            : "auto",
                        opacity:
                          invoice.trangThai.trangThai ===
                          listOfStatus[listOfStatus.length - 1]?.trangThai
                            ? "0.5"
                            : "1",
                        backgroundColor: invoice.trangThai.mauSac,
                      }}
                      onClick={() =>
                        handleClickConfirmChangeStatus(invoice.trangThai)
                      }
                    >
                      {invoice.trangThai.thaoTac}
                    </button>
                  ) : (
                    <button
                      className={cx(
                        "order__buttons__btn",
                        "order__buttons__btn--cancel"
                      )}
                      style={{
                        pointerEvents:
                          invoice.trangThai.trangThai !==
                          listOfStatus[0]?.trangThai
                            ? "none"
                            : "auto",
                        opacity:
                          invoice.trangThai.trangThai !==
                          listOfStatus[0]?.trangThai
                            ? "0.5"
                            : "1",
                      }}
                      onClick={() => handleClickConfirmCancelOrder(invoice._id)}
                    >
                      Hủy đơn hàng
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div
              className={cx("order__container__details__table--noData")}
              colSpan="7"
            >
              Không có dữ liệu
            </div>
          )
        ) : (
          <div
            className={cx("order__container__details__table--noData")}
            colSpan="7"
          >
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
            tài khoản để có thể xem đơn hàng
          </div>
        )}
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
      {isConfirmModel && (
        <ConfirmModel
          title={confirmTitle}
          content={confirmContent}
          callbackOk={
            operation === "cancel" ? handleCancelOrder : handleChangeStatus
          }
          callbackCancel={() => setIsConfirmModel(false)}
        />
      )}
      {isLoading && <LoadingComponent />}
    </>
  );
}

Invoice.propTypes = {
  invoiceId: PropTypes.string,
};

export default Invoice;
