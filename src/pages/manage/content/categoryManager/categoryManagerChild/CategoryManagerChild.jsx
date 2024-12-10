import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import classNames from "classnames/bind";
import styles from "./CategoryManagerChild.module.scss";
import * as categoryService from "~/services/category.service";
import ToastInformation from "~/Components/Notification";
import LoadingComponent from "~/Components/Loading";

const cx = classNames.bind(styles);

function CategoryManagerChild({ idCategoryEdit, setShowModal }) {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [bool, setBool] = useState(false);
  const [nameCategory, setNameCategory] = useState("");

  useEffect(() => {
    if (!idCategoryEdit) return;
    const fetchAPI = async () => {
      const response = await categoryService.getCategory(idCategoryEdit);
      if (response.data.success) {
        setNameCategory(response.data.result.tenLoaiSanPham);
        return;
      }
    };

    fetchAPI();
  }, [idCategoryEdit]);

  const handleOperationCategory = async () => {
    try {
      if (!nameCategory) {
        setBool(true);
        setTitle("Warn");
        setContent("Tên loại sản phẩm không được để trống!");
        return;
      }

      const bodyRequest = {
        tenLoaiSanPham: nameCategory,
      };

      setIsLoading(true);
      if (idCategoryEdit) {
        const response = await categoryService.updateCategory(
          idCategoryEdit,
          bodyRequest
        );
        setContent(response.data.message);
        setBool(true);
        setTitle(response.data.success ? "Success" : "Error");
        if (response.data.success) {
          setTimeout(() => {
            setIsLoading(false);
            window.location.reload();
          }, 3000);
          return;
        }
        return;
      }

      const response = await categoryService.createCategory(bodyRequest);
      setContent(response.data.message);
      setBool(true);
      setTitle(response.data.success ? "Success" : "Error");
      if (response.data.success) {
        setTimeout(() => {
          setIsLoading(false);
          window.location.reload();
        }, 3000);
        return;
      }
    } catch {
      setBool(true);
      setTitle("Error");
      setContent("Không tìm thấy api này!");
    }
  };

  return (
    <>
      <div className={cx("modal")} onClick={() => setShowModal(false)}>
        <div
          className={cx("modal__content")}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>{idCategoryEdit ? "Cập nhật" : "Thêm"} Loại Sản Phẩm</h2>
          <label htmlFor="name">Tên Loại Sản Phẩm</label>
          <input
            type="text"
            id="name"
            value={nameCategory}
            onChange={(e) => setNameCategory(e.target.value)}
          />
          <button onClick={() => setShowModal(false)}>Đóng</button>
          <button
            onClick={handleOperationCategory}
            className={cx(`${!nameCategory ? "disabled" : ""}`)}
          >
            {idCategoryEdit ? "Cập nhật" : "Thêm"}
          </button>
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
      {isLoading && <LoadingComponent />}
    </>
  );
}
CategoryManagerChild.propTypes = {
  idCategoryEdit: PropTypes.string.isRequired,
  setShowModal: PropTypes.func.isRequired,
};

export default CategoryManagerChild;
