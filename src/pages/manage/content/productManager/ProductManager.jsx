import classNames from "classnames/bind";
import styles from "./ProductManager.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ProductManagerChild from "./productManagerChild/ProductManagerchild";
import { useEffect, useState } from "react";
import * as productService from "~/services/product.service";
import LoadingComponent from "~/Components/Loading";
import ToastInformation from "~/Components/Notification";
import ConfirmModel from "~/Components/ConfirmModel";

const cx = classNames.bind(styles);

function ProductManager() {
  const [confirmContent, setConfirmContent] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [bool, setBool] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listProduct, setListProduct] = useState([]);
  const [idProductEdit, setIdProductEdit] = useState("");
  const [idProductDelete, setIdProductDelete] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [isConfirmModel, setIsConfirmModel] = useState(false);

  const handleClickEdit = (id) => {
    setShowModel(true);
    setIdProductEdit(id);
  };

  const handleClickDelete = async (id) => {
    setConfirmTitle("Xác nhận xóa sản phẩm");
    setConfirmContent("Bạn có chắc chắn muốn xóa sản phẩm này không?");
    setIsConfirmModel(true);
    setIdProductDelete(id);
  };

  const handleDeleteProduct = async () => {
    try {
      setIsLoading(true);
      const response = await productService.deleteProduct(idProductDelete);
      setContent(response.data.message);
      setBool(true);
      if (response.data.success) {
        setTitle("Success");
        setTimeout(() => {
          setIsLoading(false);
          window.location.reload();
        }, 3000);
        return;
      }
      setTitle("Error");
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await productService.getProducts();

      setListProduct([]);
      if (response.data.success) {
        setListProduct(response.data.result);
      }
    };
    fetchData();
  }, []);

  const handleClickCreate = () => {
    setIdProductEdit("");
    setShowModel(true);
  };

  return (
    <>
      <div className={cx("product")}>
        <div className={cx("product__header")}>
          <h2>QUẢN LÝ SẢN PHẨM</h2>
          <button onClick={() => handleClickCreate()}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Thêm Sản Phẩm</span>
          </button>
        </div>
        <div className={cx("product__container")}>
          <table className={cx("product__table")}>
            <thead>
              <tr>
                <th>Tên Sản Phẩm</th>
                <th>Giá</th>
                <th>Trạng Thái</th>
                <th>Đề Xuất</th>
                <th>Hình Ảnh</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {listProduct.map((product, index) => (
                <tr key={index}>
                  <td>{product.tenSanPham}</td>
                  <td>{product.gia.toLocaleString()} VND</td>
                  <td>{product.trangThai ? "Hoạt động" : "Ngừng bán"}</td>
                  <td>{product.deXuat ? "Có" : "Không"}</td>
                  <td>
                    <img
                      src={product.hinhAnh}
                      alt={product.tenSanPham}
                      className={cx("product__table__image")}
                    />
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className={cx("product__table__icon")}
                      onClick={() => handleClickEdit(product._id)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className={cx("product__table__icon")}
                      onClick={() => handleClickDelete(product._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModel && (
        <ProductManagerChild
          idProductEdit={idProductEdit}
          setShowModel={setShowModel}
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
      {isConfirmModel && (
        <ConfirmModel
          title={confirmTitle}
          content={confirmContent}
          callbackOk={handleDeleteProduct}
          callbackCancel={() => setIsConfirmModel(false)}
        />
      )}
    </>
  );
}

export default ProductManager;
