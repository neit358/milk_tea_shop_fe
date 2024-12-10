import numeral from "numeral";

export const convertCurrency = (gia) => {
  return numeral(gia).format("0,0") + " đ";
};

export const convertDate = (date) => {
  return date.replace(/T/, " ").replace(/\..+/, "");
};
