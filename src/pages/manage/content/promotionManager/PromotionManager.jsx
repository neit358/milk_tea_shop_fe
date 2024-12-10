import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import classNames from "classnames/bind";
import styles from "./PromotionManager.module.scss";
import * as promotionService from "~/services/promotion.service";
import ToastInformation from "~/Components/Notification";
import PromotionManageChild from "./promotionManagerChild";
import ConfirmModel from "~/Components/ConfirmModel";
import LoadingComponent from "~/Components/Loading";
import { convertDate } from "~/shared/services/convert.service";

const cx = classNames.bind(styles);

function PromotionManager() {
  const [listOfPromotion, setListOfPromotion] = useState([]);
  const [bool, setBool] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [idPromotionEdit, setIdPromotionEdit] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmContent, setConfirmContent] = useState("");
  const [isConfirmModel, setIsConfirmModel] = useState(false);
  const [idProductDelete, setIdProductDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await promotionService.getPromotions();
        if (response.data.success) {
          setListOfPromotion(response.data.result);
        } else {
          setBool(true);
          setContent(response.data.message);
          setTitle("Error");
        }
      } catch {
        setBool(true);
        setContent("API không tồn tại!");
        setTitle("Error");
      }
    };

    fetchAPI();
  }, [showModal, isConfirmModel]);

  const handleClickEdit = (id) => {
    setIdPromotionEdit(id);
    setShowModal(true);
  };

  const handleClickCreate = () => {
    setShowModal(true);
    setIdPromotionEdit("");
  };

  const handleClickDelete = (id) => {
    setIdProductDelete(id);
    setConfirmTitle("Xác nhận xóa khuyến mãi");
    setConfirmContent("Bạn có chắc chắn muốn xóa khuyến mãi này không?");
    setIsConfirmModel(true);
    setIdProductDelete(id);
  };

  const handleDeletePromotion = async () => {
    try {
      setIsLoading(true);
      const response = await promotionService.deletePromotion(idProductDelete);

      if (!response.data.success) return;
      setBool(true);
      setContent(response.data.message);
      setTitle("Success");
      setTimeout(() => {
        setIsLoading(false);
        setIsConfirmModel(false);
      }, 3000);
    } catch {
      setBool(true);
      setContent("API không tồn tại!");
      setTitle("Error");
    }
  };

  const listStatus = [
    { value: true, label: "Hoạt động" },
    { value: false, label: "Không hoạt động" },
  ];

  const getStatusLabel = (status) => {
    const statusObj = listStatus.find((item) => item.value === status);
    return statusObj ? statusObj.label : "Không xác định";
  };

  return (
    <>
      <div className={cx("promotion")}>
        <div className={cx("promotion__header")}>
          <h2>QUẢN LÝ KHUYẾN MÃI</h2>
          <button onClick={() => handleClickCreate()}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Thêm Khuyến Mãi</span>
          </button>
        </div>
        <div className={cx("promotion__list")}>
          <table className={cx("promotion__list__table")}>
            <thead>
              <tr>
                <th>Tên Khuyến Mãi</th>
                <th>Giá Trị</th>
                <th>Ngày Bắt Đầu</th>
                <th>Ngày Kết Thúc</th>
                <th>Trạng Thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {listOfPromotion?.map((promotion, index) => (
                <tr key={index}>
                  <td>{promotion.tenKhuyenMai}</td>
                  <td>{promotion.giaTriKhuyenMai}</td>
                  <td>{convertDate(promotion.ngayBatDau)}</td>
                  <td>{convertDate(promotion.ngayKetThuc)}</td>
                  <td>
                    <div
                      className={cx("promotion__list__table__status")}
                      style={{
                        backgroundColor: promotion.trangThai ? "green" : "red",
                        color: "var(--white-color)",
                      }}
                    >
                      {getStatusLabel(promotion.trangThai)}
                    </div>
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className={cx("promotion__list__table__icon")}
                      onClick={() => handleClickEdit(promotion._id)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className={cx("promotion__list__table__icon")}
                      onClick={() => handleClickDelete(promotion._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      {showModal && (
        <PromotionManageChild
          setShowModal={setShowModal}
          idPromotionEdit={idPromotionEdit}
        />
      )}
      {isConfirmModel && (
        <ConfirmModel
          title={confirmTitle}
          content={confirmContent}
          callbackOk={handleDeletePromotion}
          callbackCancel={() => setIsConfirmModel(false)}
        />
      )}

      {isLoading && <LoadingComponent />}
    </>
  );
}

export default PromotionManager;
