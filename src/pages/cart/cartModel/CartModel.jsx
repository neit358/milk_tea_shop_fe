import classNames from "classnames/bind";
import styles from "./CartModel.module.scss";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

const cx = classNames.bind(styles);

function CartModel({
  setShowCartModel,
  setAddress,
  setNote,
  setReceiver,
  setPhone,
  setTime,
  typeDisplay,
}) {
  const [wards, setWards] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [modelNote, setModelNote] = useState("");
  const [modelReceiver, setModelReceiver] = useState("");
  const [modelPhone, setModelPhone] = useState("");
  const [modelTime, setModelTime] = useState("");

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

  const handleClickInsideModal = (e) => {
    e.stopPropagation();
  };

  const handleClickCancelModel = () => {
    setShowCartModel(false);
  };

  const handleClickSubmit = (e) => {
    e.preventDefault();
    switch (typeDisplay) {
      case "address":
        setAddress(
          `${houseNumber}, ${streetName}, ${ward}, ${district}, ${city}`
        );
        break;
      case "note":
        setNote(modelNote);
        break;
      case "receiver":
        setReceiver(modelReceiver);
        break;
      case "phone":
        setPhone(modelPhone);
        break;
      case "time":
        setTime(new Date(modelTime).toISOString());
        break;
      default:
        break;
    }
    setShowCartModel(false);
  };

  return (
    <div className={cx("cartModel")} onClick={handleClickCancelModel}>
      <div
        className={cx("cartModel__content")}
        onClick={handleClickInsideModal}
      >
        <form className={cx("cartModel__content__form")}>
          {typeDisplay === "address" && (
            <>
              <label className={cx("cartModel__content__form--full-width")}>
                Số nhà:
                <input
                  type="text"
                  name="address.houseNumber"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                />
              </label>
              <label>
                Tên đường:
                <input
                  type="text"
                  name="address.streetName"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                />
              </label>
              <label>
                Thành phố:
                <Select
                  options={cities}
                  onChange={handleCityChange}
                  name="address.city"
                />
              </label>
              <label>
                Quận:
                <Select
                  options={districts}
                  onChange={handleDistrictChange}
                  name="address.district"
                />
              </label>
              <label>
                Phường:
                <Select
                  options={wards}
                  name="address.ward"
                  onChange={(selectedOption) => setWard(selectedOption.label)}
                />
              </label>
            </>
          )}
          {typeDisplay === "note" && (
            <label className={cx("cartModel__content__form--full-width")}>
              Ghi chú:
              <textarea
                name="note"
                value={modelNote}
                onChange={(e) => setModelNote(e.target.value)}
              />
            </label>
          )}
          {typeDisplay === "receiver" && (
            <label className={cx("cartModel__content__form--full-width")}>
              Người nhận:
              <input
                type="text"
                name="receiver"
                value={modelReceiver}
                onChange={(e) => setModelReceiver(e.target.value)}
              />
            </label>
          )}
          {typeDisplay === "time" && (
            <label className={cx("cartModel__content__form--full-width")}>
              Thời gian:
              <input
                type="datetime-local"
                name="time"
                value={modelTime}
                onChange={(e) => setModelTime(e.target.value)}
              />
            </label>
          )}
          {typeDisplay === "phone" && (
            <label className={cx("cartModel__content__form--full-width")}>
              Số điện thoại:
              <input
                type="text"
                name="phone"
                value={modelPhone}
                onChange={(e) => setModelPhone(e.target.value)}
              />
            </label>
          )}

          <div className={cx("cartModel__content__form__ok")}>
            <button type="submit" onClick={handleClickSubmit}>
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CartModel.propTypes = {
  setShowCartModel: PropTypes.func.isRequired,
  setAddress: PropTypes.func,
  setNote: PropTypes.func,
  setReceiver: PropTypes.func,
  setPhone: PropTypes.func,
  setTime: PropTypes.func,
  typeDisplay: PropTypes.string.isRequired,
};

export default CartModel;
