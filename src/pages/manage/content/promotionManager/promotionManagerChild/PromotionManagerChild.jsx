import Select from "react-select";
import dayjs from "dayjs";

import classNames from "classnames/bind";
import styles from "./PromotionManagerChild.module.scss";
import PropTypes from "prop-types";
import LoadingComponent from "~/Components/Loading";
import ToastInformation from "~/Components/Notification";
import * as PromotionService from "~/services/promotion.service";
import * as ProductService from "~/services/product.service";
import * as CategoryService from "~/services/category.service";

const cx = classNames.bind(styles);

import { useEffect, useState } from "react";
import { customStyles } from "~/shared/services/style.service";

const listMethodPromotion = [
  { value: "percentage", label: "percentage" },
  { value: "fixed", label: "fixed" },
];

function PromotionManageChild({ idPromotionEdit, setShowModal }) {
  const [bool, setBool] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [methodPromotion, setMethodPromotion] = useState("");
  const [valuePromotion, setValuePromotion] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [minimumValue, setMinimumValue] = useState(0);
  const [maximum, setMaximum] = useState(0);
  const [typePromotion, setTypePromotion] = useState(null);
  const [listSelected, setListSelected] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [turnOnEditProductPromotion, setTurnOnEditProductPromotion] =
    useState(false);
  const [invalid, setinvalid] = useState(false);

  const [status, setStatus] = useState(null);

  const listStatus = [
    { value: true, label: "Hoạt động" },
    { value: false, label: "Ngừng khuyến mãi" },
  ];

  useEffect(() => {
    if (idPromotionEdit) {
      const fetchAPI = async () => {
        try {
          const response = await PromotionService.getPromotion(idPromotionEdit);

          if (response.data.success) {
            {
              const data = response.data.result;

              setName(data.tenKhuyenMai);
              setTag(data.tag);
              setDescription(data.moTa);
              setMethodPromotion(
                listMethodPromotion.find(
                  (item) => item.value === data.phuongThucKhuyenMai
                )
              );
              setValuePromotion(data.giaTriKhuyenMai);
              setMinimumValue(data.giaTriDonHangToiThieu);
              setMaximum(data.giaToiDaKhuyenMai);
              setStatus(
                listStatus.find((item) => item.value === data.trangThai)
              );
              setStartTime(
                dayjs(data.ngayBatDau).format("YYYY-MM-DDTHH:mm:ss.SSS")
              );
              setEndTime(
                dayjs(data.ngayKetThuc).format("YYYY-MM-DDTHH:mm:ss.SSS")
              );
            }
            return;
          }
          setBool(true);
          setContent(response.data.message);
          setTitle("Error");
        } catch {
          setBool(true);
          setContent("Api không tồn tại!");
          setTitle("Error");
        }
      };

      fetchAPI();
    }
  }, []);

  const handleClickForm = (e) => {
    e.stopPropagation();
  };

  const handleClickSubmit = async (event) => {
    event.preventDefault();

    if (
      !name ||
      !tag ||
      !methodPromotion ||
      !valuePromotion ||
      !startTime ||
      !endTime ||
      (idPromotionEdit && !status)
    ) {
      setBool(true);
      setTitle("Warn");
      setContent("Vui lòng điền đầy đủ thông tin!");
      setinvalid(true);
      return;
    }

    let bodyRequest = {
      tenKhuyenMai: name,
      moTa: description,
      phuongThucKhuyenMai: methodPromotion.value,
      giaTriKhuyenMai: valuePromotion,
      giaTriDonHangToiThieu: minimumValue,
      giaToiDaKhuyenMai: maximum,
      ngayBatDau: startTime,
      ngayKetThuc: endTime,
      tag: tag,
    };

    if (idPromotionEdit) {
      bodyRequest = {
        ...bodyRequest,
        trangThai: status.value,
      };
    }

    setIsLoading(true);
    let response = idPromotionEdit
      ? await PromotionService.updatePromotions(idPromotionEdit, bodyRequest)
      : await PromotionService.createPromotions(bodyRequest);

    if (!response.data.success) return;

    if (
      (typePromotion && typePromotion.value !== "orderDiscount") ||
      turnOnEditProductPromotion
    ) {
      const listId = selectedProduct.map((product) => product.value);
      bodyRequest = {
        type: typePromotion.value,
        listId,
      };

      response = await PromotionService.applyPromotions(
        response.data.result._id,
        bodyRequest
      );
    }

    if (!response.data.success) return;
    setBool(true);
    setContent(response.data.message);
    setTitle("Success");
    setTimeout(() => {
      setIsLoading(false);
      setShowModal(false);
    }, 3000);
  };

  const listTypePromotion = [
    { value: "productDiscount", label: "Giảm giá theo sản phẩm" },
    { value: "categoryDiscount", label: "Giảm giá theo loại sản phẩm" },
    { value: "allProductsDiscount", label: "Giảm giá cho tất cả sản phẩm" },
    { value: "orderDiscount", label: "Giảm giá cho đơn hàng" },
  ];

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setSelectedProduct([]);
        if (!typePromotion) return;
        switch (typePromotion.value) {
          case "productDiscount": {
            const responseProducts = await ProductService.getProducts();

            if (responseProducts.data.success) {
              const listProducts = responseProducts.data.result.map(
                (product) => ({
                  value: product._id,
                  label: product.tenSanPham,
                })
              );
              setListSelected(listProducts);
            }
            break;
          }
          case "categoryDiscount": {
            const responseCategories = await CategoryService.getCategories();

            if (responseCategories.data.success) {
              const listCategories = responseCategories.data.result.map(
                (category) => ({
                  value: category._id,
                  label: category.tenLoaiSanPham,
                })
              );
              setListSelected(listCategories);
            }
            break;
          }
          case "allProductsDiscount": {
            const responseProducts = await ProductService.getProducts();

            if (responseProducts.data.success) {
              const listProducts = responseProducts.data.result.map(
                (product) => ({
                  value: product._id,
                  label: product.tenSanPham,
                })
              );
              setListSelected(listProducts);
              setSelectedProduct(listProducts);
            }
            break;
          }
        }
      } catch {
        setBool(true);
        setContent("Không tìm thấy api này!");
        setTitle("Error");
      }
    };
    fetchAPI();
  }, [typePromotion]);

  return (
    <>
      <div className={cx("modal")} onClick={() => setShowModal(false)}>
        <div className={cx("modal__content")} onClick={handleClickForm}>
          <form className={cx("modal__content__form")}>
            <label>
              <div
                className={cx(
                  "modal__content__form__group",
                  `${!name && invalid ? "invalid" : ""}`
                )}
              >
                <label
                  htmlFor="name"
                  className={cx("modal__content__form__group__label")}
                >
                  Tên khuyến mãi:
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên sản phẩm"
                  className={cx("modal__content__form__group__control")}
                />

                <span className={cx("modal__content__form__group__message")}>
                  {invalid && !name ? "Tên không được để trống!" : ""}
                </span>
              </div>
            </label>
            <label>
              <div
                className={cx(
                  "modal__content__form__group",
                  `${!name && invalid ? "invalid" : ""}`
                )}
              >
                <label
                  htmlFor="name"
                  className={cx("modal__content__form__group__label")}
                >
                  Nhãn:
                </label>
                <input
                  type="text"
                  name="tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Nhập tag khuyến mãi"
                  className={cx("modal__content__form__group__control")}
                />

                <span className={cx("modal__content__form__group__message")}>
                  {invalid && !name ? "Tag không được để trống!" : ""}
                </span>
              </div>
            </label>
            <label
              className={cx(
                `${!idPromotionEdit ? "modal__content__form--full-width" : ""}`
              )}
            >
              <div className={cx("modal__content__form__group")}>
                <label
                  htmlFor="description"
                  className={cx("modal__content__form__group__label")}
                >
                  Mô tả:
                </label>
                <textarea
                  value={description}
                  type="text"
                  name="description"
                  placeholder="Nhập giá mô tả sản phẩm"
                  className={cx("modal__content__form__group__control")}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <span className={cx("modal__content__form__group__message")}>
                  {""}
                </span>
              </div>
            </label>
            {idPromotionEdit && (
              <label>
                <div
                  className={cx(
                    "modal__content__form__group",
                    `${!status && invalid ? "invalid" : ""}`
                  )}
                >
                  <label
                    htmlFor="status"
                    className={cx("modal__content__form__group__label")}
                  >
                    Trạng thái:
                  </label>
                  <Select
                    value={status}
                    name="status"
                    isClearable
                    styles={customStyles(status, invalid)}
                    options={listStatus}
                    onChange={(selectedStatus) => setStatus(selectedStatus)}
                    className={cx(
                      "modal__content__form__group__control",
                      "modal__content__form__group__control--select"
                    )}
                  />
                  <span className={cx("modal__content__form__group__message")}>
                    {invalid && !status
                      ? "Trạng thái không được để trống!"
                      : ""}
                  </span>
                </div>
              </label>
            )}
            <label>
              <div
                className={cx(
                  "modal__content__form__group",
                  `${!methodPromotion && invalid ? "invalid" : ""}`
                )}
              >
                <label
                  htmlFor="methodPromotion"
                  className={cx("modal__content__form__group__label")}
                >
                  Phương thức khuyến mãi:
                </label>
                <Select
                  value={methodPromotion}
                  onChange={(selectedMethodPromotion) =>
                    setMethodPromotion(selectedMethodPromotion)
                  }
                  name="methodPromotion"
                  isClearable
                  options={listMethodPromotion}
                  styles={customStyles(methodPromotion, invalid)}
                  className={cx(
                    "modal__content__form__group__control",
                    "modal__content__form__group__control--select"
                  )}
                />
                <span className={cx("modal__content__form__group__message")}>
                  {invalid && !methodPromotion
                    ? "Phương thức không được để trống!"
                    : ""}
                </span>
              </div>
            </label>
            <label>
              <div
                className={cx(
                  "modal__content__form__group",
                  `${!valuePromotion && invalid ? "invalid" : ""}`
                )}
              >
                <label
                  htmlFor="valuePromotion"
                  className={cx("modal__content__form__group__label")}
                >
                  Giá trị khuyến mãi:
                </label>

                <input
                  type="number"
                  name="valuePromotion"
                  value={valuePromotion}
                  onChange={(e) => setValuePromotion(e.target.value)}
                  placeholder="Nhập giá trị khuyến mãi"
                  className={cx("modal__content__form__group__control")}
                />
                <span className={cx("modal__content__form__group__message")}>
                  {invalid && !valuePromotion
                    ? "Giá trị không được để trống!"
                    : ""}
                </span>
              </div>
            </label>
            <label>
              <div className={cx("modal__content__form__group")}>
                <label
                  htmlFor="minimumValue"
                  className={cx("modal__content__form__group__label")}
                >
                  Giá trị đơn hàng tối thiểu:
                </label>
                <input
                  type="number"
                  name="minimumValue"
                  value={minimumValue}
                  onChange={(e) => setMinimumValue(e.target.value)}
                  placeholder="Nhập giá trị tối thiểu"
                  className={cx("modal__content__form__group__control")}
                />

                <span className={cx("modal__content__form__group__message")}>
                  {""}
                </span>
              </div>
            </label>
            <label>
              <div className={cx("modal__content__form__group")}>
                <label
                  htmlFor="minimumValue"
                  className={cx("modal__content__form__group__label")}
                >
                  Giá trị khuyến mãi tối đa:
                </label>
                <input
                  type="number"
                  name="maximum"
                  value={maximum}
                  onChange={(e) => setMaximum(e.target.value)}
                  placeholder="Nhập giá trị tối đa"
                  className={cx("modal__content__form__group__control")}
                />

                <span className={cx("modal__content__form__group__message")}>
                  {""}
                </span>
              </div>
            </label>
            <label>
              <div
                className={cx(
                  "modal__content__form__group",
                  `${!startTime && invalid ? "invalid" : ""}`
                )}
              >
                <label
                  htmlFor="startTime"
                  className={cx("modal__content__form__group__label")}
                >
                  Ngày bắt đầu:
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="Chọn thời gian"
                  className={cx("modal__content__form__group__control")}
                />

                <span className={cx("modal__content__form__group__message")}>
                  {invalid && !startTime
                    ? "Thời gian không được để trống!"
                    : ""}
                </span>
              </div>
            </label>
            <label>
              <div
                className={cx(
                  "modal__content__form__group",
                  `${!endTime && invalid ? "invalid" : ""}`
                )}
              >
                <label
                  htmlFor="endTime"
                  className={cx("modal__content__form__group__label")}
                >
                  Ngày kết thúc:
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="Chọn thời gian"
                  className={cx("modal__content__form__group__control")}
                />

                <span className={cx("modal__content__form__group__message")}>
                  {invalid && !endTime ? "Thời gian không được để trống!" : ""}
                </span>
              </div>
            </label>
            {idPromotionEdit && (
              <div
                className={cx(
                  "modal__content__form__changePromotion",
                  "modal__content__form--full-width"
                )}
              >
                <label>Chỉnh sửa sản phẩm áp dụng: </label>
                <a
                  onClick={() =>
                    setTurnOnEditProductPromotion(!turnOnEditProductPromotion)
                  }
                  className={cx("modal__content__form__changePromotion__edit")}
                >
                  {turnOnEditProductPromotion ? "Hủy" : "Chỉnh sửa"}
                </a>
              </div>
            )}

            {(!idPromotionEdit || turnOnEditProductPromotion) && (
              <>
                <label>
                  <div
                    className={cx(
                      "modal__content__form__group",
                      `${!typePromotion && invalid ? "invalid" : ""}`
                    )}
                  >
                    <label
                      htmlFor="typePromotion"
                      className={cx("modal__content__form__group__label")}
                    >
                      Áp dụng:
                    </label>
                    <Select
                      value={typePromotion}
                      onChange={(selectedTypePromotion) =>
                        setTypePromotion(selectedTypePromotion)
                      }
                      name="typePromotion"
                      isClearable
                      options={listTypePromotion}
                      styles={customStyles(typePromotion, invalid)}
                      className={cx(
                        "modal__content__form__group__control",
                        "modal__content__form__group__control--select"
                      )}
                    />
                    <span
                      className={cx("modal__content__form__group__message")}
                    >
                      {invalid && !typePromotion
                        ? "Áp dụng không được để trống!"
                        : ""}
                    </span>
                  </div>
                </label>
                <label>
                  <div
                    className={cx(
                      "modal__content__form__group",
                      `${!listSelected && invalid ? "invalid" : ""}`
                    )}
                  >
                    <label
                      htmlFor="listSelected"
                      className={cx("modal__content__form__group__label")}
                    >
                      Chọn sản phẩm:
                    </label>
                    <Select
                      value={selectedProduct}
                      onChange={(selectedProduct) =>
                        setSelectedProduct(selectedProduct)
                      }
                      name="listSelected"
                      isClearable
                      isMulti
                      options={listSelected}
                      isDisabled={
                        !typePromotion ||
                        typePromotion.value === "orderDiscount"
                      }
                      styles={customStyles(listSelected && invalid)}
                      className={cx(
                        "modal__content__form__group__control",
                        "modal__content__form__group__control--select"
                      )}
                    />
                    <span
                      className={cx("modal__content__form__group__message")}
                    >
                      {invalid && !listSelected
                        ? "Áp dụng không được để trống!"
                        : ""}
                    </span>
                  </div>
                </label>
              </>
            )}
            <button
              type="submit"
              className={cx(
                "modal__content__form--full-width",
                "modal__content__form--center-button"
              )}
              onClick={handleClickSubmit}
            >
              {idPromotionEdit ? "Cập nhật" : "Thêm"}
            </button>
          </form>
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

PromotionManageChild.propTypes = {
  idPromotionEdit: PropTypes.string,
  setShowModal: PropTypes.func.isRequired,
};

export default PromotionManageChild;
