import PropTypes from "prop-types";
import Select from "react-select";

import classNames from "classnames/bind";
import styles from "./ProductManagerChild.module.scss";
import ToastInformation from "~/Components/Notification";
import LoadingComponent from "~/Components/Loading";
import { useEffect, useState } from "react";
import * as productService from "~/services/product.service";
import * as typeService from "~/services/type.service";
import * as iceService from "~/services/ice.service";
import * as sweetService from "~/services/sweet.service";
import * as branchService from "~/services/branch.service";
import * as toppingService from "~/services/topping.service";
import * as sizeService from "~/services/size.service";
import * as uploadService from "~/services/upload.service";

import Image from "~/Components/Image";

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
  const [URLImage, setURLImage] = useState("");

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
      const listTypeFound = await typeService.getTypes();
      const listIceFound = await iceService.getIces();
      const listSweetnessFound = await sweetService.getSweets();
      const listBranchFound = await branchService.getBranchs();
      const listToppingFound = await toppingService.getToppings();
      const listSizeFound = await sizeService.getSizes();
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
        setToppings(productFound.data.result.thongTinTopping);
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
    };
    fetchAPI();
  }, []);

  const handleClickForm = (e) => {
    e.stopPropagation();
  };

  const handleSizeChange = (index, selectedSize) => {
    const newSizes = [...sizes];
    newSizes[index].kichThuoc._id = selectedSize.value;
    newSizes[index].kichThuoc.tenKichThuoc = selectedSize.label;
    setSizes(newSizes);
  };

  const handlePriceChange = (index, event) => {
    const newSizes = [...sizes];
    newSizes[index].giaThem = event.target.value;
    setSizes(newSizes);
  };

  const handleAddSize = () => {
    setSizes([...sizes, { kichThuoc: "", giaThem: 0 }]);
  };

  const handleRemoveSize = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  const handleToppingChange = (index, selectedTopping) => {
    const newToppings = [...toppings];
    newToppings[index].topping._id = selectedTopping.value;
    newToppings[index].topping.tenTopping = selectedTopping.label;
    setToppings(newToppings);
  };

  const handlePriceToppingChange = (index, event) => {
    const newToppings = [...toppings];
    newToppings[index].giaThem = event.target.value;
    setToppings(newToppings);
  };

  const handleAddTopping = () => {
    setToppings([...toppings, { topping: "", giaThem: 0 }]);
  };

  const handleRemoveTopping = (index) => {
    const newToppings = toppings.filter((_, i) => i !== index);
    setToppings(newToppings);
  };

  const handleClickSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setContent("Vui lòng đăng nhập chỉnh sửa!");
      setTitle("Warn");
      setBool(true);
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

    const productUpdate = {
      tenSanPham: name,
      gia: price,
      moTa: description,
      hinhAnh: imageUrl,
      trangThai: status?.value,
      deXuat: recommend?.value,
      loaiSanPham: type.value,
      thongTinKichThuoc: sizes.map((size) => ({
        kichThuoc: size.kichThuoc._id,
        giaThem: size.giaThem,
      })),
      thongTinTopping: toppings.map((topping) => ({
        topping: topping.topping._id,
        giaThem: topping.giaThem,
      })),
      ngot: sweetness.map((sweet) => sweet.value),
      da: ices.map((ice) => ice.value),
      chiNhanhApDung: branchs.map((branch) => branch.value),
    };

    const responseUpdate = await productService.updateProduct(
      idProductEdit,
      productUpdate
    );

    setContent(responseUpdate.data.message);
    setBool(true);
    if (responseUpdate.data.success) {
      setTitle("Success");
      setTimeout(() => {
        setIsLoading(false);
        setShowModel(false);
        window.location.reload();
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
              Tên sản phẩm:
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Giá:
              <input
                type="number"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
            <label>
              Mô tả:
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label>
              Trạng thái:
              <Select
                value={status}
                onChange={(selectedStatus) => setStatus(selectedStatus)}
                name="status"
                isClearable
                options={listStatus}
              />
            </label>

            <label>
              Đề xuất:
              <Select
                value={recommend}
                onChange={(selectedRecommend) =>
                  setRecommend(selectedRecommend)
                }
                name="Recommend"
                isClearable
                options={listRecommend}
              />
            </label>
            <label>
              Loại sản phẩm:
              {listOfType?.length > 0 && (
                <Select
                  value={type}
                  onChange={(selectedType) => setType(selectedType)}
                  name="type"
                  isClearable
                  options={listOfType}
                />
              )}
            </label>
            <label>
              Đá:
              {listOfIce?.length > 0 && (
                <Select
                  isMulti
                  value={ices}
                  onChange={(selectedIces) => setIces(selectedIces)}
                  name="ice"
                  isClearable
                  options={listOfIce}
                />
              )}
            </label>
            <label>
              Ngọt:
              {listOfSweetness?.length > 0 && (
                <Select
                  isMulti
                  value={sweetness}
                  onChange={(selectedSweetness) =>
                    setSweetness(selectedSweetness)
                  }
                  name="sweetness"
                  isClearable
                  options={listOfSweetness}
                />
              )}
            </label>
            <label>
              Chi nhánh áp dụng:
              {listOfBranch?.length > 0 && (
                <Select
                  isMulti
                  value={branchs}
                  onChange={(selectedBranchs) => setBranchs(selectedBranchs)}
                  name="branchs"
                  isClearable
                  options={listOfBranch}
                />
              )}
            </label>
            <label className={cx("modal__content__form--full-width")}>
              Kích thước:
              {sizes?.map((size, index) => {
                return (
                  <div
                    key={index}
                    className={cx("modal__content__form__option")}
                  >
                    {listOfSize?.length > 0 && (
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
                      />
                    )}
                    <input
                      type="text"
                      value={size.giaThem}
                      onChange={(event) => handlePriceChange(index, event)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(index)}
                    >
                      Xóa
                    </button>
                  </div>
                );
              })}
              <button type="button" onClick={handleAddSize}>
                Thêm Kích Thước
              </button>
            </label>
            <label className={cx("modal__content__form--full-width")}>
              Topping:
              {toppings?.map((topping, index) => {
                return (
                  <div
                    key={index}
                    className={cx("modal__content__form__option")}
                  >
                    {listOfTopping?.length > 0 && (
                      <Select
                        value={{
                          value: topping.topping._id,
                          label: topping.topping.tenTopping,
                        }}
                        onChange={(selectedTopping) =>
                          handleToppingChange(index, selectedTopping)
                        }
                        name="topping"
                        isClearable
                        options={listOfTopping}
                      />
                    )}
                    <input
                      type="text"
                      value={topping.giaThem}
                      onChange={(event) =>
                        handlePriceToppingChange(index, event)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTopping(index)}
                    >
                      Xóa
                    </button>
                  </div>
                );
              })}
              <button type="button" onClick={handleAddTopping}>
                Thêm Topping
              </button>
            </label>
            <label>
              Hình ảnh:
              <div className={cx("modal__content__form__uploadImage")}>
                <input
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
                    onClick={() => {
                      setURLImage("");
                      setSelectedFile(null);
                    }}
                  >
                    Xóa
                  </button>
                )}
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
              Sửa
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
