import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiagramNext,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

import classNames from "classnames/bind";
import styles from "./OrderManager.module.scss";
import OrderManageChild from "./orderManagerChild";
import * as orderService from "~/services/order.service";
import * as statusService from "~/services/status.service";
import { convertCurrency } from "~/shared/services/convert.service";
import ConfirmModel from "~/Components/ConfirmModel";
import ToastInformation from "~/Components/Notification";
import LoadingComponent from "~/Components/Loading";

const cx = classNames.bind(styles);

function OrderManage() {
  const [listOfOrder, setListOfOrder] = useState([]);
  const [showDetailOrder, setShowDetailOrder] = useState(false);
  const [detailInvoiceId, setDetailInvoiceId] = useState([]);
  const [listOfFilterStatus, setListOfFilterStatus] = useState([
    {
      label: "Tất cả",
      value: "",
    },
  ]);
  const [filterStatus, setFilterStatus] = useState(listOfFilterStatus[0]);
  const [listOfStatus, setListOfStatus] = useState([]);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmContent, setConfirmContent] = useState("");
  const [isConfirmModel, setIsConfirmModel] = useState(false);
  const [bool, setBool] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [orderChangeStatus, setOrderChangeStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterDate, setFilterDate] = useState("");

  const totalQualityOrder = (products) => {
    return products.reduce((total, product) => total + product.soLuong, 0);
  };

  const handleClickDetailOrder = (id) => {
    setDetailInvoiceId(id);
    setShowDetailOrder(true);
  };

  const handleClickConfirmChangeStatus = (e, order) => {
    e.stopPropagation();
    setOrderChangeStatus(order);
    setConfirmTitle(order.trangThai.thaoTac);
    setConfirmContent(
      `Bạn có chắc chắn muốn ${order.trangThai.thaoTac.toLowerCase()}?`
    );
    setIsConfirmModel(true);
  };

  const handleChangeStatus = async () => {
    try {
      const trangThai = listOfStatus.find(
        (status) =>
          status.trangThai === orderChangeStatus.trangThai.trangThai + 1
      )._id;

      if (!trangThai) {
        setContent("Không thể thay đổi trạng thái");
        setTitle("Error");
        setBool(true);
        return;
      }

      setIsLoading(true);
      const response = await orderService.updateOrder(orderChangeStatus._id, {
        trangThai,
      });

      setContent(response.data.message);
      setTitle(response.data.success ? "Success" : "Error");
      setBool(true);
      if (response.data.success) {
        setTimeout(() => {
          setIsConfirmModel(false);
          setIsLoading(false);
        }, 3000);
      }
    } catch {
      setContent("Api không tồn tại!");
      setTitle("Warn");
      setBool(true);
    }
  };

  useEffect(() => {
    const fetchAPI = async () => {
      const filter = {};

      if (filterStatus?.value) {
        filter["trangThai"] = filterStatus.value;
      }

      if (filterDate) {
        filter["createdAt"] = new Date(filterDate.toString()).toISOString();
      }

      const response = await orderService.filterOrders({ data: filter });
      if (response.data.success) {
        setListOfOrder(response.data.result);
        return;
      }
    };

    fetchAPI();
  }, [isConfirmModel, showDetailOrder, filterStatus, filterDate]);

  useEffect(() => {
    const fetchAPI = async () => {
      const response = await statusService.getStatuses();
      if (response.data.success) {
        setFilterStatus(listOfFilterStatus[0]);
        setListOfStatus(response.data.result);
        let statuses = [];
        response.data.result.map((status) =>
          statuses.push({
            label: status.tenTrangThai,
            value: status._id,
          })
        );
        setListOfFilterStatus([listOfFilterStatus[0], ...statuses]);
      }
    };

    fetchAPI();
  }, []);

  return (
    <div className={cx("order")}>
      <div className={cx("order__header")}>
        <h2>QUẢN LÝ ĐƠN HÀNG</h2>
      </div>
      {showDetailOrder ? (
        <OrderManageChild invoiceId={detailInvoiceId} />
      ) : (
        <>
          <div className={cx("order__filter")}>
            <div className={cx("order__filter__search")}>
              <Select
                value={filterStatus}
                onChange={(selectedFilterStatus) =>
                  setFilterStatus(selectedFilterStatus)
                }
                name="filterStatus"
                isClearable
                options={listOfFilterStatus}
              />
            </div>

            <div className={cx("order__filter__date")}>
              <label>Ngày đặt:</label>
              <input
                type="date"
                className={cx("order__filter__date__search")}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>
          <div className={cx("order__list")}>
            <table className={cx("order__list__table")}>
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                  <th>Số lượng</th>
                  <th>Tổng tiền</th>
                  <th>Chuyển trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {listOfOrder.map((order, index) => (
                  <tr
                    key={index}
                    onClick={() => handleClickDetailOrder(order._id)}
                  >
                    <td>{order.tenNguoiNhan || order.sdt}</td>
                    <td>
                      {order.createdAt.replace(/T/, " ").replace(/\..+/, "")}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div
                        className={cx("order__list__table__status")}
                        style={{
                          backgroundColor: order.trangThai.mauSac,
                          color: "var(--white-color)",
                        }}
                      >
                        {order.trangThai.tenTrangThai}
                      </div>
                    </td>
                    <td>{totalQualityOrder(order.items)}</td>
                    <td>{convertCurrency(order.thanhTien)}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faDiagramNext}
                        className={cx(
                          "order__list__table__submit",
                          `${
                            listOfStatus.length > 0 &&
                            listOfStatus[listOfStatus.length - 1]._id ===
                              order.trangThai._id
                              ? "disabled"
                              : ""
                          }`
                        )}
                        onClick={(e) =>
                          handleClickConfirmChangeStatus(e, order)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showDetailOrder && (
        <div
          className={cx("order__exit")}
          onClick={() => {
            setShowDetailOrder(false);
            setDetailInvoiceId("");
          }}
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
        </div>
      )}

      {isConfirmModel && (
        <ConfirmModel
          title={confirmTitle}
          content={confirmContent}
          callbackOk={handleChangeStatus}
          callbackCancel={() => setIsConfirmModel(false)}
        />
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
    </div>
  );
}

export default OrderManage;
