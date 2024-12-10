import classNames from "classnames/bind";
import styles from "./OrderManagerChild.module.scss";
import PropTypes from "prop-types";
import * as invoiceService from "~/services/order.service";

import { useState, useEffect } from "react";
import Order from "~/pages/order";
import ToastInformation from "~/Components/Notification";
import dayjs from "dayjs";

const cx = classNames.bind(styles);

function OrderManageChild({ invoiceId }) {
  const [listOrder, setListOrder] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [bool, setBool] = useState(false);

  useEffect(() => {
    const fetchAPI = async () => {
      const response = await invoiceService.getOrderById(invoiceId);
      if (response.data.success) {
        setListOrder(response.data.result);
      } else {
        setContent(response.data.message);
        setTitle("Warn");
        setBool(true);
      }
    };

    fetchAPI();
  }, []);

  return (
    <>
      <div className={cx("orderManageChild")}>
        {listOrder ? (
          <>
            <div className={cx("orderManageChild__orderInfo")}>
              <h3>Thông tin đơn hàng</h3>
              <p>
                <strong>Ghi chú:</strong> {listOrder.ghiChu || "Không có"}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {listOrder.sdt}
              </p>
              <p>
                Thời gian nhận hàng:
                <br />
                <div className={cx("orderManageChild__orderInfo__information")}>
                  <div>
                    Nhận hàng trong:{" "}
                    {listOrder.thoiGianGiao
                      ? dayjs(listOrder.thoiGianGiao).format("DD/MM/YYYY")
                      : "Hôm nay"}
                  </div>
                  <div>
                    Vào lúc:{" "}
                    {listOrder.thoiGianGiao
                      ? dayjs(listOrder.thoiGianGiao).format("HH:mm")
                      : "Càng sớm càng tốt"}
                  </div>
                </div>
              </p>
              <p>
                <strong>Phương thức thanh toán:</strong>{" "}
                {listOrder.phuongThucThanhToan}
              </p>
              <p>
                Thời gian nhận hàng:
                <br />
                <div className={cx("orderManageChild__orderInfo__information")}>
                  {`${listOrder.diaChi?.soNha || ""} ${
                    listOrder.diaChi?.tenDuong || ""
                  }, 
          ${listOrder.diaChi?.phuong || ""}, ${listOrder.diaChi?.quan || ""}, 
          ${listOrder.diaChi?.thanhPho || ""}`}
                </div>
              </p>
            </div>
            <Order invoiceId={invoiceId} />
          </>
        ) : (
          <p>Đang tải thông tin đơn hàng...</p>
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
    </>
  );
}

OrderManageChild.propTypes = {
  invoiceId: PropTypes.string.isRequired,
};

export default OrderManageChild;
