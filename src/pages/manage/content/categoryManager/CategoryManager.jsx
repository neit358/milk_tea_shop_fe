import {
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import classNames from "classnames/bind";
import styles from "./CategoryManager.module.scss";
import { useEffect, useState } from "react";
import * as categoryService from "~/services/category.service";
import ConfirmModel from "~/Components/ConfirmModel";
import ToastInformation from "~/Components/Notification";
import LoadingComponent from "~/Components/Loading";
import CategoryManagerChild from "./categoryManagerChild";

const cx = classNames.bind(styles);

function CategoryManager() {
  const [confirmContent, setConfirmContent] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");
  const [isConfirmModel, setIsConfirmModel] = useState(false);
  const [idCategoryEdit, setIdCategoryEdit] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [listOfCategory, setListOfCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [bool, setBool] = useState(false);

  const handleClickCreate = () => {
    setIdCategoryEdit("");
    setShowModal(true);
  };

  const handleClickDelete = (id) => {
    setConfirmTitle("Xác nhận xóa loại sản phẩm");
    setConfirmContent("Bạn có chắc chắn muốn xóa loại sản phẩm này không?");
    setIsConfirmModel(true);
    setIdCategoryEdit(id);
  };

  const handleClickEdit = (id) => {
    setIdCategoryEdit(id);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchAPI = async () => {
      const response = await categoryService.getCategories();
      if (response.data.success) {
        setListOfCategory(response.data.result);
        return;
      }
    };

    fetchAPI();
  }, []);

  const handleDeleteProduct = async () => {
    try {
      setIsLoading(true);
      const response = await categoryService.deleteCategory(idCategoryEdit);
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
      <div className={cx("category")}>
        <div className={cx("category__header")}>
          <h2>QUẢN LÝ LOẠI SẢN PHẨM</h2>
          <button onClick={() => handleClickCreate()}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Thêm Loại Sản Phẩm</span>
          </button>
        </div>
        <div className={cx("category__container")}>
          <table className={cx("category__table")}>
            <thead>
              <tr>
                <th>Tên Loại Sản Phẩm</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {listOfCategory.map((category, index) => (
                <tr key={index}>
                  <td>{category.tenLoaiSanPham}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className={cx("category__table__icon")}
                      onClick={() => handleClickEdit(category._id)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className={cx("category__table__icon")}
                      onClick={() => handleClickDelete(category._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <CategoryManagerChild
          idCategoryEdit={idCategoryEdit}
          setShowModal={setShowModal}
        />
      )}
      {isConfirmModel && (
        <ConfirmModel
          title={confirmTitle}
          content={confirmContent}
          callbackOk={handleDeleteProduct}
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
    </>
  );
}

export default CategoryManager;
