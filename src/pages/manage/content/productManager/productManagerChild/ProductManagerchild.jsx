import PropTypes from "prop-types";
import Select from "react-select";

import classNames from "classnames/bind";
import styles from "./ProductManagerChild.module.scss";
import ToastInformation from "~/Components/Notification";
import LoadingComponent from "~/Components/Loading";
import { useEffect, useState } from "react";
import * as productService from "~/services/product.service";
import * as categoryService from "~/services/category.service";
import * as iceService from "~/services/ice.service";
import * as sweetService from "~/services/sweet.service";
import * as branchService from "~/services/branch.service";
import * as toppingService from "~/services/topping.service";
import * as sizeService from "~/services/size.service";
import * as uploadService from "~/services/upload.service";
import * as teaService from "~/services/tea.service";

import Image from "~/Components/Image";
import { customStyles } from "~/shared/services/style.service";

const cx = classNames.bind(styles);

function ProductManagerChild({ idProductEdit, setShowModel }) {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || null));
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [bool, setBool] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [listOfTea, setListOfTea] = useState([]);
  const [listOfSize, setListOfSize] = useState([]);
  const [listOfType, setListOfType] = useState([]);
  const [listOfSweetness, setListOfSweetness] = useState([]);
  const [listOfBranch, setListOfBranch] = useState([]);
  const [listOfIce, setListOfIce] = useState([]);
  const [listOfTopping, setListOfTopping] = useState([]);
  const [type, setType] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [sweetness, setSweetness] = useState([]);
  const [ices, setIces] = useState([]);
  const [branchs, setBranchs] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [teas, setTeas] = useState([]);
  const [URLImage, setURLImage] = useState("");
  const [invalid, setInvalid] = useState(false);

  const listStatus = [
    { value: true, label: "Hoạt động" },
    { value: false, label: "Ngừng bán" },
  ];

  const listRecommend = [
    { value: true, label: "Có" },
    { value: false, label: "Không" },
  ];

  useEffect(() => {
    const fetchAPI = async () => {
      setIsLoading(true);
      const listTypeFound = await categoryService.getCategories();
      const listIceFound = await iceService.getIces();
      const listSweetnessFound = await sweetService.getSweets();
      const listBranchFound = await branchService.getBranchs();
      const listToppingFound = await toppingService.getToppings();
      const listSizeFound = await sizeService.getSizes();
      const listTeaFound = await teaService.getTeas();
      if (idProductEdit) {
        const productFound = await productService.getProduct(idProductEdit);
        if (!productFound.data.success) {
          setContent(productFound.data.message);
          setTitle("Warn");
          setBool(true);
          return;
        }

        setName(productFound.data.result.tenSanPham);
        setPrice(productFound.data.result.gia);
        setDescription(productFound.data.result.moTa);
        setImage(productFound.data.result.hinhAnh);
        setBranchs(
          productFound.data.result.chiNhanhApDung?.map(
            (branch) => branch.tenChiNhanh
          )
        );
        setStatus(
          listStatus.find(
            (item) => item.value === productFound.data.result.trangThai
          )
        );
        setRecommend(
          listRecommend.find(
            (item) => item.value === productFound.data.result.deXuat
          )
        );
        setType({
          value: productFound.data.result.loaiSanPham._id,
          label: productFound.data.result.loaiSanPham.tenLoaiSanPham,
        });
        setSizes(productFound.data.result.thongTinKichThuoc);
        setSweetness(
          productFound.data.result.ngot.map((sweet) => ({
            value: sweet._id,
            label: sweet.tenNgot,
          }))
        );
        setIces(
          productFound.data.result.da.map((ice) => ({
            value: ice._id,
            label: ice.tenDa,
          }))
        );
        setBranchs(
          productFound.data.result.chiNhanhApDung.map((chiNhanh) => ({
            value: chiNhanh._id,
            label: chiNhanh.tenChiNhanh,
          }))
        );
        setToppings(
          productFound.data.result.thongTinTopping.map((topping) => ({
            value: topping._id,
            label: topping.tenTopping,
          }))
        );
        setTeas(
          productFound.data.result.tra.map((tea) => ({
            value: tea._id,
            label: tea.tenTra,
          }))
        );
      }
      setIsLoading(false);

      setListOfType(
        listTypeFound.data.result?.map((type) => ({
          value: type._id,
          label: type.tenLoaiSanPham,
        }))
      );

      setListOfIce(
        listIceFound.data.result?.map((type) => ({
          value: type._id,
          label: type.tenDa,
        }))
      );

      setListOfSweetness(
        listSweetnessFound.data.result?.map((type) => ({
          value: type._id,
          label: type.tenNgot,
        }))
      );

      setListOfBranch(
        listBranchFound.data.result?.map((branch) => ({
          value: branch._id,
          label: branch.tenChiNhanh,
        }))
      );

      setListOfTopping(
        listToppingFound.data.result?.map((topping) => ({
          value: topping._id,
          label: topping.tenTopping,
        }))
      );

      setListOfSize(
        listSizeFound.data.result?.map((size) => ({
          value: size._id,
          label: size.tenKichThuoc,
        }))
      );

      setListOfTea(
        listTeaFound.data.result?.map((tea) => ({
          value: tea._id,
          label: tea.tenTra,
        }))
      );
    };
    fetchAPI();
  }, []);

  const handleClickForm = (e) => {
    e.stopPropagation();
  };

  const handleSizeChange = (index, selectedSize) => {
    const newSizes = [...sizes];
    newSizes[index].kichThuoc._id = selectedSize?.value || "";
    newSizes[index].kichThuoc.tenKichThuoc = selectedSize?.label || "";
    setSizes(newSizes);
  };

  const handlePriceChange = (index, event) => {
    const newSizes = [...sizes];
    newSizes[index].giaThem = event.target.value;
    setSizes(newSizes);
  };

  const handleAddSize = () => {
    setSizes([
      ...sizes,
      { kichThuoc: { _id: "", tenKichThuoc: "" }, giaThem: "0" },
    ]);
  };

  const handleRemoveSize = (index, event) => {
    event.preventDefault();
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  const handleClickSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setContent(
        `Vui lòng đăng nhập để ${idProductEdit ? "chỉnh sửa" : "thêm"}!`
      );
      setTitle("Warn");
      setBool(true);
      return;
    }

    const invalidSize =
      sizes.length > 0 &&
      sizes.some(
        (size) => !size.kichThuoc.tenKichThuoc || !size.giaThem.toString()
      );

    if (
      !name ||
      !price.toString() ||
      !type ||
      (idProductEdit && !status) ||
      invalidSize
    ) {
      setBool(true);
      setTitle("Warn");
      setContent("Vui lòng điền đầy đủ thông tin!");
      setInvalid(true);
      return;
    }

    let imageUrl = image;
    setIsLoading(true);
    if (URLImage && selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const responseUpload = await uploadService.uploadImage(formData);
      if (responseUpload.data.success) {
        setImage(responseUpload.data.url);
        imageUrl = responseUpload.data.url;
      } else {
        setIsLoading(false);
        setContent(responseUpload.data.message);
        setTitle("Error");
        setBool(true);
        return;
      }
    }

    const bodyRequest = {
      tenSanPham: name,
      gia: price || 0,
      moTa: description,
      hinhAnh: imageUrl,
      trangThai: status?.value,
      deXuat: recommend?.value,
      loaiSanPham: type.value,
      thongTinKichThuoc: sizes.map((size) => ({
        kichThuoc: size?.kichThuoc?._id,
        giaThem: size.giaThem || 0,
      })),
      thongTinTopping: toppings.map((topping) => topping?.value),
      ngot: sweetness.map((sweet) => sweet?.value),
      da: ices.map((ice) => ice?.value),
      tra: teas.map((tea) => tea?.value),
      chiNhanhApDung: branchs.map((branch) => branch?.value),
    };

    const responseUpdate = idProductEdit
      ? await productService.updateProduct(idProductEdit, bodyRequest)
      : await productService.createProduct(bodyRequest);

    setContent(responseUpdate.data.message);
    setBool(true);
    if (responseUpdate.data.success) {
      setTitle("Success");
      setTimeout(() => {
        setIsLoading(false);
        setShowModel(false);
      }, 3000);
    } else {
      setTitle("Error");
      setBool(true);
    }
  };

  return (
    <>
      <div className={cx("modal")} onClick={() => setShowModel(false)}>
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
                  Tên sản phẩm:
                </label>
                <input
                  value={name || ""}
                  type="text"
                  name="name"
                  placeholder="Nhập tên sản phẩm"
                  className={cx("modal__content__form__group__control")}
                  onChange={(e) => setName(e.target.value)}
                />

                <span className={cx("modal__content__form__group__message")}>
                  {invalid && !name ? "Tên sản phẩm không được để trống!" : ""}
                </span>
              </div>
            </label>
            <label>
              <div
                className={cx(
                  "modal__content__form__group",
                  `${!price.toString() && invalid ? "invalid" : ""}`
                )}
              >
                <label
                  htmlFor="price"
                  className={cx("modal__content__form__group__label")}
                >
                  Giá:
                </label>
                <input
                  value={price}
                  type="number"
                  name="price"
                  placeholder="Nhập giá sản phẩm"
                  className={cx("modal__content__form__group__control")}
                  onChange={(e) => setPrice(e.target.value)}
                />

                <span className={cx("modal__content__form__group__message")}>
                  {invalid && !price.toString()
                    ? "Giá không được để trống!"
                    : ""}
                </span>
              </div>
            </label>
            <label>
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
            {idProductEdit && (
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
              <div className={cx("modal__content__form__group")}>
                <label
                  htmlFor="recommend"
                  className={cx("modal__content__form__group__label")}
                >
                  Đề xuất:
                </label>
                <Select
                  value={recommend}
                  name="recommend"
                  isClearable
                  styles={customStyles(recommend, invalid)}
                  options={listRecommend}
                  onChange={(selectedRecommend) =>
                    setRecommend(selectedRecommend)
                  }
                  className={cx(
                    "modal__content__form__group__control",
                    "modal__content__form__group__control--select"
                  )}
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
                  `${!type && invalid ? "invalid" : ""}`
                )}
              >
                <label
                  htmlFor="type"
                  className={cx("modal__content__form__group__label")}
                >
                  Loại sản phẩm:
                </label>
                {listOfType?.length > 0 && (
                  <Select
                    value={type}
                    name="type"
                    isClearable
                    styles={customStyles(type, invalid)}
                    options={listOfType}
                    onChange={(selectedType) => setType(selectedType)}
                    className={cx(
                      "modal__content__form__group__control",
                      "modal__content__form__group__control--select"
                    )}
                  />
                )}
                <span className={cx("modal__content__form__group__message")}>
                  {invalid && !type ? "Loại sản phẩm không được để trống!" : ""}
                </span>
              </div>
            </label>
            <label>
              <div className={cx("modal__content__form__group")}>
                <label
                  htmlFor="ice"
                  className={cx("modal__content__form__group__label")}
                >
                  Đá:
                </label>
                {listOfIce?.length > 0 && (
                  <Select
                    isMulti
                    value={ices}
                    name="ice"
                    isClearable
                    styles={customStyles(ices, invalid)}
                    options={listOfIce}
                    onChange={(selectedIces) => setIces(selectedIces)}
                    className={cx(
                      "modal__content__form__group__control",
                      "modal__content__form__group__control--select"
                    )}
                  />
                )}
                <span className={cx("modal__content__form__group__message")}>
                  {""}
                </span>
              </div>
            </label>
            <label>
              <div className={cx("modal__content__form__group")}>
                <label
                  htmlFor="sweetness"
                  className={cx("modal__content__form__group__label")}
                >
                  Ngọt:
                </label>
                {listOfSweetness?.length > 0 && (
                  <Select
                    isMulti
                    value={sweetness}
                    name="sweetness"
                    isClearable
                    styles={customStyles(sweetness, invalid)}
                    options={listOfSweetness}
                    onChange={(selectedSweetness) =>
                      setSweetness(selectedSweetness)
                    }
                    className={cx(
                      "modal__content__form__group__control",
                      "modal__content__form__group__control--select"
                    )}
                  />
                )}
                <span className={cx("modal__content__form__group__message")}>
                  {""}
                </span>
              </div>
            </label>
            <label>
              <div className={cx("modal__content__form__group")}>
                <label
                  htmlFor="tea"
                  className={cx("modal__content__form__group__label")}
                >
                  Trà:
                </label>
                {listOfTea?.length > 0 && (
                  <Select
                    isMulti
                    value={teas}
                    name="tea"
                    isClearable
                    styles={customStyles(teas, invalid)}
                    options={listOfTea}
                    onChange={(selectedTeas) => setTeas(selectedTeas)}
                    className={cx(
                      "modal__content__form__group__control",
                      "modal__content__form__group__control--select"
                    )}
                  />
                )}
                <span className={cx("modal__content__form__group__message")}>
                  {""}
                </span>
              </div>
            </label>
            <label>
              <div className={cx("modal__content__form__group")}>
                <label
                  htmlFor="branch"
                  className={cx("modal__content__form__group__label")}
                >
                  Chi nhánh áp dụng:
                </label>
                {listOfBranch?.length > 0 && (
                  <Select
                    isMulti
                    value={branchs}
                    name="branch"
                    isClearable
                    styles={customStyles(branchs, invalid)}
                    options={listOfBranch}
                    onChange={(selectedBranches) =>
                      setBranchs(selectedBranches)
                    }
                    className={cx(
                      "modal__content__form__group__control",
                      "modal__content__form__group__control--select"
                    )}
                  />
                )}
                <span className={cx("modal__content__form__group__message")}>
                  {""}
                </span>
              </div>
            </label>
            <label
              className={cx(
                `${idProductEdit ? "modal__content__form--full-width" : ""}`
              )}
            >
              <div className={cx("modal__content__form__group")}>
                <label
                  htmlFor="topping"
                  className={cx("modal__content__form__group__label")}
                >
                  Topping:
                </label>
                {listOfTopping?.length > 0 && (
                  <Select
                    isMulti
                    value={toppings}
                    name="toppings"
                    isClearable
                    styles={customStyles(toppings, invalid)}
                    options={listOfTopping}
                    onChange={(selectedToppings) =>
                      setToppings(selectedToppings)
                    }
                    className={cx(
                      "modal__content__form__group__control",
                      "modal__content__form__group__control--select"
                    )}
                  />
                )}
                <span className={cx("modal__content__form__group__message")}>
                  {""}
                </span>
              </div>
            </label>
            <span className={cx("modal__content__form--full-width")}>
              <label
                htmlFor="size"
                className={cx("modal__content__form__group__label")}
              >
                Kích thước:
              </label>
              {sizes?.map((size, index) => {
                return (
                  <div
                    key={index}
                    className={cx("modal__content__form__option")}
                  >
                    {listOfSize?.length > 0 && (
                      <div className={cx("modal__content__form__option__size")}>
                        <div
                          className={cx(
                            "modal__content__form__group",
                            `${
                              !size.kichThuoc.tenKichThuoc && invalid
                                ? "invalid"
                                : ""
                            }`
                          )}
                        >
                          <Select
                            value={{
                              value: size.kichThuoc._id,
                              label: size.kichThuoc.tenKichThuoc,
                            }}
                            onChange={(selectedSize) =>
                              handleSizeChange(index, selectedSize)
                            }
                            name="size"
                            isClearable
                            options={listOfSize}
                            styles={customStyles(
                              size.kichThuoc.tenKichThuoc,
                              invalid
                            )}
                            className={cx(
                              "modal__content__form__group__control",
                              "modal__content__form__group__control--select"
                            )}
                          />
                          <span
                            className={cx(
                              "modal__content__form__group__message"
                            )}
                          >
                            {invalid && !size.kichThuoc.tenKichThuoc
                              ? "Kích thước không được để trống!"
                              : ""}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className={cx("modal__content__form__option__size")}>
                      <div
                        className={cx(
                          "modal__content__form__group",
                          `${
                            !size.giaThem.toString() && invalid ? "invalid" : ""
                          }`
                        )}
                      >
                        <input
                          name="price"
                          placeholder="Nhập giá thêm"
                          className={cx("modal__content__form__group__control")}
                          type="number"
                          value={size.giaThem}
                          onChange={(event) => handlePriceChange(index, event)}
                        />
                        <span
                          className={cx("modal__content__form__group__message")}
                        >
                          {invalid && !size.giaThem.toString()
                            ? "Giá không được để trống!"
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div
                      className={cx("modal__content__form__option__delete")}
                      onClick={(event) => handleRemoveSize(index, event)}
                    >
                      Xóa
                    </div>
                  </div>
                );
              })}
              <div
                className={cx("modal__content__form__add")}
                onClick={handleAddSize}
              >
                Thêm
              </div>
            </span>
            <label>
              <div
                className={cx(
                  "modal__content__form__group",
                  "modal__content__form__uploadImage"
                )}
              >
                <label
                  htmlFor="branch"
                  className={cx("modal__content__form__group__label")}
                >
                  Hình ảnh:
                </label>

                <input
                  className={cx("modal__content__form__group__control")}
                  type="file"
                  name="image"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      const url = URL.createObjectURL(e.target.files[0]);
                      setURLImage(url);
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
                {URLImage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setURLImage("");
                      setSelectedFile(null);
                    }}
                  >
                    Xóa ảnh
                  </button>
                )}
                <span className={cx("modal__content__form__group__message")}>
                  {""}
                </span>
              </div>
              <Image
                src={URLImage || image || "https://placehold.co/600x400"}
                alt="Hình ảnh"
                className={cx("modal__content__form__image")}
              />
            </label>
            <button
              type="submit"
              className={cx(
                "modal__content__form--full-width",
                "modal__content__form--center-button"
              )}
              onClick={handleClickSubmit}
            >
              {idProductEdit ? "Cập nhật" : "Thêm"}
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

ProductManagerChild.propTypes = {
  idProductEdit: PropTypes.string.isRequired,
  setShowModel: PropTypes.func.isRequired,
};

export default ProductManagerChild;
