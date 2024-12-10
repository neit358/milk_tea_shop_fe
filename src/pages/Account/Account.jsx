import Select from "react-select";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import axios from "axios";

import * as userServices from "~/services/user.service";
import ToastInformation from "~/Components/Notification";
import LoadingComponent from "~/Components/Loading";
import styles from "./Account.module.scss";
import { customStyles } from "~/shared/services/style.service";

const cx = classNames.bind(styles);

function Account() {
  const [bool, setBool] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("John Doe");
  const [phone, setPhone] = useState("123-456-7890");
  const [numberAddress, setNumberAddress] = useState("");
  const [street, setStreet] = useState("");
  const [editing, setEditing] = useState(false);
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [user] = useState(JSON.parse(localStorage.getItem("user") || null));
  const [invalid, setInvalid] = useState(false);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    axios
      .get("https://vapi.vnappmob.com/api/province/")
      .then((response) => {
        const cityOptions = response.data.results.map((city) => ({
          value: city.province_id,
          label: city.province_name,
        }));
        setCities(cityOptions);
      })
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  const handleCityChange = (selectedCity) => {
    setCity(selectedCity.label);
    axios
      .get(
        `https://vapi.vnappmob.com/api/province/district/${selectedCity.value}`
      )
      .then((response) => {
        const districtOptions = response.data.results.map((district) => ({
          value: district.district_id,
          label: district.district_name,
        }));
        setDistricts(districtOptions);
        setWards([]);
      })
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const handleDistrictChange = (selectedDistrict) => {
    setDistrict(selectedDistrict.label);
    axios
      .get(
        `https://vapi.vnappmob.com/api/province/ward/${selectedDistrict.value}`
      )
      .then((response) => {
        const wardOptions = response.data.results.map((ward) => ({
          value: ward.ward_id,
          label: ward.ward_name,
        }));
        setWards(wardOptions);
      })
      .catch((error) => console.error("Error fetching wards:", error));
  };

  const handleChangeInformation = async () => {
    if (!user) {
      setContent("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      setTitle("Warn");
      setBool(true);
      return;
    }

    const bodyRequest = {
      ...user,
      ten: name,
      sdt: phone,
      diaChi: {
        soNha: numberAddress,
        tenDuong: street,
        phuong: ward,
        quan: district,
        thanhPho: city,
      },
    };

    setIsLoading(false);
    const response = await userServices.updateUser(user._id, bodyRequest);
    setContent(response.data.message);
    setBool(true);
    if (!response.data.success) {
      setTitle("Error");
      return;
    }

    localStorage.setItem("user", JSON.stringify(response.data.result));
    setTitle("Success");
    setTimeout(() => {
      setIsLoading(false);
      setEditing(false);
    }, 3000);
  };

  const handleCancel = () => {
    setEditing(false);
    loadingUser();
  };

  const handleChangePassword = async (e) => {
    try {
      e.preventDefault();
      setInvalid(true);

      if (!user) {
        setContent("Vui lòng đăng nhập để thêm vào giỏ hàng!");
        setTitle("Warn");
        setBool(true);
        return;
      }

      if (!currentPassword || !newPassword || !confirmPassword) {
        setContent("Vui lòng nhập đầy đủ thông tin!");
        setTitle("Warn");
        setBool(true);
        return;
      }

      if (newPassword.trim() !== confirmPassword.trim()) {
        setContent("Mật khẩu xác thực không khớp!");
        setTitle("Warn");
        setBool(true);
        return;
      }

      setIsLoading(true);
      const response = await userServices.changePassword(user._id, {
        matKhauCu: currentPassword.trim(),
        matKhauMoi: newPassword.trim(),
      });

      setContent(response.data.message);
      setBool(true);
      if (!response.data.success) {
        setIsLoading(false);
        setTitle("Error");
        return;
      }

      setTitle("Success");
      setTimeout(() => {
        setIsLoading(false);
        setEditing(false);
        setIsChangePassword(false);
      }, 3000);
    } catch {
      setBool(true);
      setContent("Lỗi kết nối đến server");
      setTitle("Error");
    }
  };

  useEffect(() => {
    if (user) {
      loadingUser();
    }
  }, [user]);

  const loadingUser = () => {
    setName(user?.ten || "");
    setPhone(user?.sdt || "");
    setNumberAddress(user?.diaChi?.soNha || "");
    setStreet(user?.diaChi?.tenDuong || "");
    setWard(user?.diaChi?.phuong || "");
    setDistrict(user?.diaChi?.quan || "");
    setCity(user?.diaChi?.thanhPho || "");
  };
  return (
    <>
      <div className={cx("account")}>
        <h1 className={cx("account__title")}>Thông tin tài khoản</h1>
        <div className={cx("account__content")}>
          {!isChangePassword ? (
            <div className={cx("account__content__column")}>
              <h2 className={cx("account__content__column__title")}>
                Thông tin cá nhân
              </h2>
              <div className={cx("account__content__column__form")}>
                <div
                  className={cx(
                    "account__content__column__form__group",
                    `${!name && invalid ? "invalid" : ""}`
                  )}
                  style={{
                    display: editing ? "flex" : "block",
                  }}
                >
                  <label
                    htmlFor="name"
                    className={cx(
                      "account__content__column__form__group__label"
                    )}
                  >
                    Tên:{" "}
                  </label>
                  {editing ? (
                    <>
                      <input
                        id="name"
                        type="text"
                        value={name || ""}
                        placeholder="Nhập tên"
                        className={cx(
                          "account__content__column__form__group__control"
                        )}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <span
                        className={cx(
                          "account__content__column__form__group__message"
                        )}
                      >
                        {invalid && !name ? "Tên không được để trống!" : ""}
                      </span>
                    </>
                  ) : (
                    <span
                      className={cx(
                        "account__content__column__form__group__value"
                      )}
                    >
                      {name}
                    </span>
                  )}
                </div>

                <div
                  className={cx(
                    "account__content__column__form__group",
                    `${!phone && invalid ? "invalid" : ""}`
                  )}
                  style={{
                    display: editing ? "flex" : "block",
                  }}
                >
                  <label
                    htmlFor="phone"
                    className={cx(
                      "account__content__column__form__group__label"
                    )}
                  >
                    Số điện thoại:{" "}
                  </label>
                  {editing ? (
                    <>
                      <input
                        id="phone"
                        type="text"
                        value={phone || ""}
                        placeholder="Nhập số điện thoại"
                        className={cx(
                          "account__content__column__form__group__control"
                        )}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <span
                        className={cx(
                          "account__content__column__form__group__message"
                        )}
                      >
                        {invalid && !phone
                          ? "Số điện thoại không được để trống!"
                          : ""}
                      </span>
                    </>
                  ) : (
                    <span
                      className={cx(
                        "account__content__column__form__group__value"
                      )}
                    >
                      {phone}
                    </span>
                  )}
                </div>

                <div
                  className={cx("account__content__column__form__group")}
                  style={{
                    display: editing ? "flex" : "block",
                  }}
                >
                  <label
                    htmlFor="numberAddress"
                    className={cx(
                      "account__content__column__form__group__label"
                    )}
                  >
                    Số nhà:{" "}
                  </label>
                  {editing ? (
                    <>
                      <input
                        id="numberAddress"
                        type="text"
                        value={numberAddress || ""}
                        placeholder="Nhập số nhà"
                        className={cx(
                          "account__content__column__form__group__control"
                        )}
                        onChange={(e) => setNumberAddress(e.target.value)}
                      />
                      <span
                        className={cx(
                          "account__content__column__form__group__message"
                        )}
                      ></span>
                    </>
                  ) : (
                    <span
                      className={cx(
                        "account__content__column__form__group__value"
                      )}
                    >
                      {numberAddress}
                    </span>
                  )}
                </div>

                <div
                  className={cx("account__content__column__form__group")}
                  style={{
                    display: editing ? "flex" : "block",
                  }}
                >
                  <label
                    htmlFor="street"
                    className={cx(
                      "account__content__column__form__group__label"
                    )}
                  >
                    Đường:{" "}
                  </label>
                  {editing ? (
                    <>
                      <textarea
                        id="street"
                        value={street || ""}
                        placeholder="Nhập tên đường"
                        className={cx(
                          "account__content__column__form__group__control"
                        )}
                        onChange={(e) => setStreet(e.target.value)}
                      />

                      <span
                        className={cx(
                          "account__content__column__form__group__message"
                        )}
                      ></span>
                    </>
                  ) : (
                    <span
                      className={cx(
                        "account__content__column__form__group__value"
                      )}
                    >
                      {street}
                    </span>
                  )}
                </div>

                <div
                  className={cx("account__content__column__form__group")}
                  style={{
                    display: editing ? "flex" : "block",
                  }}
                >
                  <label
                    htmlFor="street"
                    className={cx(
                      "account__content__column__form__group__label"
                    )}
                  >
                    Thành phố:{" "}
                  </label>
                  {editing ? (
                    <>
                      <Select
                        options={cities}
                        onChange={handleCityChange}
                        name="city"
                        styles={customStyles(true, invalid)}
                        className={cx(
                          "modal__content__form__group__control",
                          "modal__content__form__group__control--select"
                        )}
                      />

                      <span
                        className={cx(
                          "account__content__column__form__group__message"
                        )}
                      ></span>
                    </>
                  ) : (
                    <span
                      className={cx(
                        "account__content__column__form__group__value"
                      )}
                    >
                      {city}
                    </span>
                  )}
                </div>

                <div
                  className={cx("account__content__column__form__group")}
                  style={{
                    display: editing ? "flex" : "block",
                  }}
                >
                  <label
                    htmlFor="street"
                    className={cx(
                      "account__content__column__form__group__label"
                    )}
                  >
                    Quận/Huyện:{" "}
                  </label>
                  {editing ? (
                    <>
                      <Select
                        options={districts}
                        onChange={handleDistrictChange}
                        name="district"
                        styles={customStyles(true, invalid)}
                        className={cx(
                          "modal__content__form__group__control",
                          "modal__content__form__group__control--select"
                        )}
                      />
                      <span
                        className={cx(
                          "account__content__column__form__group__message"
                        )}
                      ></span>
                    </>
                  ) : (
                    <span
                      className={cx(
                        "account__content__column__form__group__value"
                      )}
                    >
                      {district}
                    </span>
                  )}
                </div>

                <div
                  className={cx("account__content__column__form__group")}
                  style={{
                    display: editing ? "flex" : "block",
                  }}
                >
                  <label
                    htmlFor="street"
                    className={cx(
                      "account__content__column__form__group__label"
                    )}
                  >
                    Phường/Xã:{" "}
                  </label>
                  {editing ? (
                    <>
                      <Select
                        options={wards}
                        name="ward"
                        onChange={(selectedOption) =>
                          setWard(selectedOption.label)
                        }
                        styles={customStyles(true, invalid)}
                        className={cx(
                          "modal__content__form__group__control",
                          "modal__content__form__group__control--select"
                        )}
                      />

                      <span
                        className={cx(
                          "account__content__column__form__group__message"
                        )}
                      ></span>
                    </>
                  ) : (
                    <span
                      className={cx(
                        "account__content__column__form__group__value"
                      )}
                    >
                      {ward}
                    </span>
                  )}
                </div>

                <div className={cx("account__content__column__form__actions")}>
                  {editing ? (
                    <>
                      <button
                        type="button"
                        className={cx(
                          "account__content__column__form__actions__button"
                        )}
                        onClick={handleChangeInformation}
                      >
                        Lưu
                      </button>
                      <button
                        type="button"
                        className={cx(
                          "account__content__column__form__actions__button"
                        )}
                        onClick={handleCancel}
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className={cx(
                        "account__content__column__form__actions__button"
                      )}
                      onClick={() => setEditing(true)}
                    >
                      Sửa
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={cx("account__content__column")}>
              <h2 className={cx("account__content__column__title")}>
                Đổi mật khẩu
              </h2>
              <form
                className={cx("account__content__column__form")}
                onSubmit={handleChangePassword}
              >
                <div
                  className={cx(
                    "account__content__column__form__group",
                    `${!currentPassword && invalid ? "invalid" : ""}`
                  )}
                >
                  <label
                    htmlFor="currentPassword"
                    className={cx(
                      "account__content__column__form__group__label"
                    )}
                  >
                    Mật khẩu hiện tại:
                  </label>
                  <input
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    id="currentPassword"
                    type="password"
                    placeholder="Nhập mật khẩu hiện tại"
                    className={cx(
                      "account__content__column__form__group__control"
                    )}
                  />
                  <span
                    className={cx(
                      "account__content__column__form__group__message"
                    )}
                  >
                    {invalid && !currentPassword
                      ? "Mật khẩu cũ không được để trống!"
                      : ""}
                  </span>
                </div>
                <div
                  className={cx(
                    "account__content__column__form__group",
                    `${!newPassword && invalid ? "invalid" : ""}`
                  )}
                >
                  <label
                    htmlFor="newPassword"
                    className={cx(
                      "account__content__column__form__group__label"
                    )}
                  >
                    Mật khẩu mới:
                  </label>
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    id="newPassword"
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    className={cx(
                      "account__content__column__form__group__control"
                    )}
                  />
                  <span
                    className={cx(
                      "account__content__column__form__group__message"
                    )}
                  >
                    {invalid && !newPassword
                      ? "Mật khẩu mới không được để trống!"
                      : ""}
                  </span>
                </div>
                <div
                  className={cx(
                    "account__content__column__form__group",
                    `${!confirmPassword && invalid ? "invalid" : ""}`
                  )}
                >
                  <label
                    htmlFor="confirmPassword"
                    className={cx(
                      "account__content__column__form__group__label"
                    )}
                  >
                    Xác nhận mật khẩu:
                  </label>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="confirmPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    className={cx(
                      "account__content__column__form__group__control"
                    )}
                  />
                  <span
                    className={cx(
                      "account__content__column__form__group__message"
                    )}
                  >
                    {invalid && !confirmPassword
                      ? "Mật khẩu xác thực không được để trống!"
                      : ""}
                  </span>
                </div>
                <button
                  type="submit"
                  className={cx(
                    "account__content__column__form__actions__button"
                  )}
                >
                  Đổi mật khẩu
                </button>
              </form>
            </div>
          )}

          <div className={cx("account__content__operation")}>
            <span
              onClick={() => {
                setIsChangePassword(!isChangePassword);
                setInvalid(false);
                setNewPassword("");
                setConfirmPassword("");
                setCurrentPassword("");
                setEditing(false);
              }}
            >
              {isChangePassword ? "Quay lại" : "Thay đổi mật khẩu"}
            </span>
          </div>
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

export default Account;
