import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  DoughnutController,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  Tooltip,
} from "chart.js";
import dayjs from "dayjs";

import classNames from "classnames/bind";
import styles from "./ReportManager.module.scss";
import * as InvoiceService from "~/services/order.service";
import * as CategoryService from "~/services/category.service";
import * as ProductService from "~/services/product.service";
import * as BranchService from "~/services/branch.service";
import { convertCurrency } from "~/shared/services/convert.service";

Chart.register(
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
  BarController,
  LineController,
  PieController,
  DoughnutController,
  PointElement,
  LineElement,
  ArcElement,
  DoughnutController
);
const cx = classNames.bind(styles);

function ReportComponent() {
  const listType = [
    { value: "day", label: "Theo ngày" },
    { value: "monthly", label: "Theo tháng" },
    { value: "yearly", label: "Theo năm" },
  ];
  const listTypeChart = [
    { value: "line", label: "Đường" },
    { value: "bar", label: "Cột" },
    { value: "pie", label: "Tròn" },
  ];
  const listOfPay = [
    { value: "", label: "Tất cả" },
    { value: "notPay", label: "Chưa thanh toán" },
    { value: "paid", label: "Đã thanh toán" },
  ];
  const [listOfCategory, setListOfCategory] = useState([
    {
      value: "",
      label: "Tất cả",
    },
  ]);
  const [listOfProduct, setListOfProduct] = useState([
    {
      value: "",
      label: "Tất cả",
    },
  ]);
  const [category, setCategory] = useState({
    value: "",
    label: "Tất cả",
  });
  const [product, setProduct] = useState({
    value: "",
    label: "Tất cả",
  });
  const [startMonth, setStartMonth] = useState({
    value: 1,
    label: "Tháng 1",
  });
  const [endMonth, setEndMonth] = useState({
    value: 12,
    label: "Tháng 12",
  });
  const [year, setYear] = useState({
    value: 2024,
    label: "Năm 2024",
  });

  const [pay, setPay] = useState(listOfPay[0]);
  const [type, setType] = useState(listType[0]);
  const [typeChart, setTypeChart] = useState(listTypeChart[0]);
  const [dataChart, setDataChart] = useState([]);
  const [listOfBranch, setListOfBranch] = useState([]);
  const [filterDate, setFilterDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const chartRef = useRef(null);
  const [branch, setBranch] = useState(null);
  const [reportAll, setReportAll] = useState(null);
  const [reportNotPay, setReportNotPay] = useState(null);
  const [user] = useState(JSON.parse(localStorage.getItem("user") || null));

  useEffect(() => {
    const fetchData = async () => {
      const response = await CategoryService.getCategories();
      if (!response.data.success) return;

      const categories = response.data.result.map((item) => ({
        value: item._id,
        label: item.tenLoaiSanPham,
      }));

      setCategory(listOfCategory[0]);
      setListOfCategory([listOfCategory[0], ...categories]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await ProductService.getProducts();
      if (!response.data.success) return;

      const products = response.data.result
        .filter((item) =>
          category.value !== "" ? item.loaiSanPham._id === category.value : true
        )
        .map((item) => ({
          value: item._id,
          label: item.tenSanPham,
        }));

      setProduct(listOfProduct[0]);
      setListOfProduct([listOfProduct[0], ...products]);
    };

    fetchData();
  }, [category]);

  useEffect(() => {
    const fetchAPI = async () => {
      const response = await BranchService.getBranchs();

      if (!response.data.success) return;

      setListOfBranch(response.data.result);
    };

    fetchAPI();
  }, []);

  const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    value: index + 1,
    label: `Tháng ${index + 1}`,
  }));

  const yearOptions = Array.from({ length: 12 }, (_, index) => ({
    value: index + 2013,
    label: `Năm ${index + 2013}`,
  }));

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      const chartInstance = new Chart(ctx, {
        type: typeChart.value,
        data: {
          labels: dataChart.map((item) => item.name),
          datasets: [
            {
              label: "Doanh thu (nghìn đồng)",
              data: dataChart.map((item) => item.totalRevenue),
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)", // Đỏ nhạt
                "rgba(54, 162, 235, 0.6)", // Xanh dương nhạt
                "rgba(255, 206, 86, 0.6)", // Vàng nhạt
                "rgba(75, 192, 192, 0.6)", // Xanh ngọc nhạt (gốc)
                "rgba(153, 102, 255, 0.6)", // Tím nhạt
                "rgba(255, 159, 64, 0.6)", // Cam nhạt
                "rgba(201, 203, 207, 0.6)", // Xám nhạt
                "rgba(255, 127, 80, 0.6)", // Cam san hô
                "rgba(144, 238, 144, 0.6)", // Xanh lá nhạt
                "rgba(135, 206, 250, 0.6)", // Xanh trời nhạt
                "rgba(221, 160, 221, 0.6)", // Tím hoa cà
                "rgba(250, 128, 114, 0.6)", // Cam đỏ nhạt
              ],
              borderColor: [
                "rgba(255, 99, 132, 0.6)", // Đỏ nhạt
                "rgba(54, 162, 235, 0.6)", // Xanh dương nhạt
                "rgba(255, 206, 86, 0.6)", // Vàng nhạt
                "rgba(75, 192, 192, 0.6)", // Xanh ngọc nhạt (gốc)
                "rgba(153, 102, 255, 0.6)", // Tím nhạt
                "rgba(255, 159, 64, 0.6)", // Cam nhạt
                "rgba(201, 203, 207, 0.6)", // Xám nhạt
                "rgba(255, 127, 80, 0.6)", // Cam san hô
                "rgba(144, 238, 144, 0.6)", // Xanh lá nhạt
                "rgba(135, 206, 250, 0.6)", // Xanh trời nhạt
                "rgba(221, 160, 221, 0.6)", // Tím hoa cà
                "rgba(250, 128, 114, 0.6)", // Cam đỏ nhạt
              ],
              borderWidth: 1,
              tension: 0.4,
              pointBackgroundColor: [
                "rgba(255, 99, 132, 0.6)", // Đỏ nhạt
                "rgba(54, 162, 235, 0.6)", // Xanh dương nhạt
                "rgba(255, 206, 86, 0.6)", // Vàng nhạt
                "rgba(75, 192, 192, 0.6)", // Xanh ngọc nhạt (gốc)
                "rgba(153, 102, 255, 0.6)", // Tím nhạt
                "rgba(255, 159, 64, 0.6)", // Cam nhạt
                "rgba(201, 203, 207, 0.6)", // Xám nhạt
                "rgba(255, 127, 80, 0.6)", // Cam san hô
                "rgba(144, 238, 144, 0.6)", // Xanh lá nhạt
                "rgba(135, 206, 250, 0.6)", // Xanh trời nhạt
                "rgba(221, 160, 221, 0.6)", // Tím hoa cà
                "rgba(250, 128, 114, 0.6)", // Cam đỏ nhạt
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              enabled: true,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      chartRef.current.chartInstance = chartInstance;
    }
  }, [dataChart, typeChart]);

  useEffect(() => {
    const fetchData = async () => {
      const startMonthPadded = startMonth.value.toString().padStart(2, "0");
      const endMonthPadded = endMonth.value.toString().padStart(2, "0");
      const dayPadded = dayjs(filterDate).date().toString().padStart(2, "0");
      const monthPadded = (dayjs(filterDate).month() + 1)
        .toString()
        .padStart(2, "0");
      const yearPadded = dayjs(filterDate).year().toString().padStart(2, "0");

      const filterProductCategory =
        category.value && product.value
          ? {
              "items.sanPham.loaiSanPham": category.value,
              "items.sanPham._id": product.value,
            }
          : category.value && !product.value
          ? {
              "items.sanPham.loaiSanPham": category.value,
            }
          : product.value && !category.value
          ? {
              "items.sanPham._id": product.value,
            }
          : {};

      const filterBranch = branch
        ? {
            chiNhanh: branch?.label,
          }
        : {};

      const filterMatchOne = {
        isDel: false,
        ...(pay.value === "notPay"
          ? { trangThai: { $ne: "67397664f3ded3de5712f6ab" } }
          : pay.value === "paid"
          ? { trangThai: "67397664f3ded3de5712f6ab" }
          : {}),
        createdAt: {
          $gte: `${
            type.value === "day" && filterDate ? yearPadded : year.value
          }-${
            type.value === "day" && filterDate ? monthPadded : startMonthPadded
          }-${type.value === "day" && filterDate ? dayPadded : "01"}T00:00:00Z`,
          $lte: `${
            type.value === "day" && filterDate ? yearPadded : year.value
          }-${
            type.value === "day" && filterDate ? monthPadded : endMonthPadded
          }-${type.value === "day" && filterDate ? dayPadded : "31"}T23:59:59Z`,
        },
      };

      const filterMatchTwo = {
        ...filterProductCategory,
        ...filterBranch,
      };

      const groupFollow =
        type.value === "day"
          ? {
              maSanPham: "$items.sanPham._id",
              tenSanPham: "$items.sanPham.tenSanPham",
            }
          : { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };

      const filterGroup = {
        _id: {
          ...groupFollow,
        },
        totalProducts:
          category.value || product.value || type.value === "day"
            ? {
                $sum: {
                  $add: ["$items.soLuong", "$items.soLuongKhuyenMai"],
                },
              }
            : { $sum: "$soLuong" },
        totalRevenue:
          category.value || product.value || type.value === "day"
            ? { $sum: "$items.thanhTien" }
            : { $sum: "$thanhTien" },
      };

      const projectFollow =
        type.value === "day"
          ? {
              maSanPham: "$_id.maSanPham",
              tenSanPham: "$_id.tenSanPham",
            }
          : {
              year: "$_id.year",
              month: "$_id.month",
            };

      const filterProject = {
        _id: 0,
        ...projectFollow,
        totalProducts: 1,
        totalRevenue: 1,
      };

      const sortFollow =
        type.value === "day" ? { tenSanPham: 1 } : { year: 1, month: 1 };

      const filterSort = {
        ...sortFollow,
      };

      const filter = [
        {
          $match: {
            ...filterMatchOne,
          },
        },
        {
          $unwind:
            category.value || product.value || type.value === "day"
              ? "$items"
              : "$_id",
        },
        {
          $match: {
            ...filterMatchTwo,
          },
        },
        {
          $group: {
            ...filterGroup,
          },
        },
        {
          $project: {
            ...filterProject,
          },
        },
        {
          $sort: {
            ...filterSort,
          },
        },
      ];

      const response = await InvoiceService.reportOrders(filter);

      if (!response.data.success) return;

      const data =
        type.value === "day"
          ? listOfProduct.slice(1).map((product) => {
              const productData = response.data.result.find(
                (item) => item?.maSanPham === product.value
              );

              return {
                name: product.label,
                totalProducts: productData ? productData?.totalProducts : 0,
                totalRevenue: productData ? productData?.totalRevenue : 0,
              };
            })
          : Array.from(
              { length: endMonth.value - startMonth.value + 1 },
              (_, index) => {
                const month = index + startMonth.value;
                const monthData = response?.data?.result?.find(
                  (item) => item.month === month
                );

                return {
                  name: `Tháng ${month}`,
                  totalProducts: monthData ? monthData?.totalProducts : 0,
                  totalRevenue: monthData ? monthData?.totalRevenue : 0,
                };
              }
            );

      setDataChart(data);
    };

    fetchData();
  }, [
    year,
    startMonth,
    endMonth,
    category,
    product,
    branch,
    filterDate,
    type,
    listOfProduct,
    pay,
    listOfCategory,
  ]);

  useEffect(() => {
    const fetchAPI = async () => {
      const dayPadded = dayjs(filterDate).date().toString().padStart(2, "0");
      const monthPadded = (dayjs(filterDate).month() + 1)
        .toString()
        .padStart(2, "0");
      const yearPadded = dayjs(filterDate).year().toString().padStart(2, "0");

      const filterMatchAll = {
        isDel: false,
        createdAt: {
          $gte: `${yearPadded}-${monthPadded}-${dayPadded}T00:00:00Z`,
          $lte: `${yearPadded}-${monthPadded}-${dayPadded}T23:59:59Z`,
        },
      };

      const filterMatchOneNotPay = {
        trangThai: {
          $ne: "67397664f3ded3de5712f6ab",
        },
        phuongThucThanhToan: "COD",
        ...filterMatchAll,
      };

      const filterBranch = branch
        ? {
            chiNhanh: branch?.label,
          }
        : {};

      const filterMatchTwo = {
        ...filterBranch,
      };

      const filterGroup = {
        _id: {},
        totalOrders: {
          $sum: 1,
        },
        totalRevenue: {
          $sum: "$thanhTien",
        },
      };

      const projectFollow = {
        totalOrders: 1,
      };

      const filterProject = {
        _id: 0,
        ...projectFollow,
        totalRevenue: 1,
      };

      const filter = [
        {
          $unwind: "$_id",
        },
        {
          $match: {
            ...filterMatchTwo,
          },
        },
        {
          $group: {
            ...filterGroup,
          },
        },
        {
          $project: {
            ...filterProject,
          },
        },
        {
          $sort: {
            totalRevenue: 1,
          },
        },
      ];

      const filterNotPay = [
        {
          $match: {
            ...filterMatchOneNotPay,
          },
        },
        ...filter,
      ];

      const filterAll = [
        {
          $match: {
            ...filterMatchAll,
          },
        },
        ...filter,
      ];

      const responseNotPay = await InvoiceService.reportOrders(filterNotPay);
      const responseAll = await InvoiceService.reportOrders(filterAll);

      if (!responseNotPay.data.success || !responseAll.data.success) return;
      setReportNotPay(responseNotPay.data.result[0]);
      setReportAll(responseAll.data.result[0]);
    };
    fetchAPI();
  }, [
    year,
    startMonth,
    endMonth,
    category,
    product,
    branch,
    filterDate,
    type,
    listOfProduct,
  ]);

  const handleSelectType = (selectedType) => {
    setFilterDate(dayjs(new Date()).format("YYYY-MM-DD"));
    setStartMonth({
      value: 1,
      label: "Tháng 1",
    });
    setEndMonth({
      value: 12,
      label: "Tháng 12",
    });
    setYear({
      value: 2024,
      label: "Năm 2024",
    });
    setCategory(listOfCategory[0]);
    setProduct(listOfProduct[0]);
    setPay(listOfPay[0]);
    setType(selectedType);
  };

  return (
    <div className={cx("report")}>
      <h1 className={cx("report__header")}>Báo Cáo Doanh Thu</h1>
      {user?.vaiTro?.vaiTro !== "ADMIN" && (
        <div className={cx("report__data")}>
          <div className={cx("report__data__group")}>
            <h3 className={cx("report__data__group__title")}>
              Thống kê đơn hàng
            </h3>
            <div className={cx("report__data__group__item")}>
              <span className={cx("report__data__group__item__label")}>
                Tổng số đơn hàng:
              </span>
              <span className={cx("report__data__group__item__value")}>
                {reportAll?.totalOrders || 0}
              </span>
            </div>
            <div className={cx("report__data__group__item")}>
              <span className={cx("report__data__group__item__label")}>
                Đã thanh toán:
              </span>
              <span className={cx("report__data__group__item__value")}>
                {reportAll?.totalOrders - reportNotPay?.totalOrders || 0}
              </span>
            </div>
            <div className={cx("report__data__group__item")}>
              <span className={cx("report__data__group__item__label")}>
                Chưa thanh toán:
              </span>
              <span className={cx("report__data__group__item__value")}>
                {reportNotPay?.totalOrders || 0}
              </span>
            </div>
          </div>

          <div className={cx("report__data__group")}>
            <h3 className={cx("report__data__group__title")}>
              Thống kê tài chính
            </h3>
            <div className={cx("report__data__group__item")}>
              <span className={cx("report__data__group__item__label")}>
                Tổng doanh thu:
              </span>
              <span className={cx("report__data__group__item__value")}>
                {convertCurrency(reportAll?.totalRevenue || 0)}
              </span>
            </div>
            <div className={cx("report__data__group__item")}>
              <span className={cx("report__data__group__item__label")}>
                Số tiền đã thu:
              </span>
              <span className={cx("report__data__group__item__value")}>
                {convertCurrency(
                  reportAll?.totalRevenue - reportNotPay?.totalRevenue || 0
                )}
              </span>
            </div>
            <div className={cx("report__data__group__item")}>
              <span className={cx("report__data__group__item__label")}>
                Số tiền chưa thu:
              </span>
              <span className={cx("report__data__group__item__value")}>
                {convertCurrency(reportNotPay?.totalRevenue || 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className={cx("report__filter")}>
        {user?.vaiTro?.vaiTro === "ADMIN" && (
          <div className={cx("report__filter__branch")}>
            <label>Chi nhánh:</label>
            <Select
              value={branch}
              name="branch"
              onChange={(selectedBranch) => setBranch(selectedBranch)}
              options={listOfBranch.map((branch) => ({
                label: branch.tenChiNhanh,
                value: branch._id,
              }))}
              isClearable
              className={cx("report__filter__branch__select")}
            />
          </div>
        )}
        <div className={cx("report__filter__time")}>
          {user?.vaiTro?.vaiTro !== "ADMIN" ? (
            <>
              <div className={cx("report__filter__time__selector__date")}>
                <label>Ngày:</label>
                <input
                  type="date"
                  className={cx("report__filter__time__selector__date__search")}
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className={cx("report__filter__time__type")}>
                <Select
                  value={type}
                  onChange={handleSelectType}
                  name="type"
                  options={listType}
                />
              </div>
              <div className={cx("report__filter__time__selector")}>
                {type.value === "monthly" ? (
                  <>
                    <label>Chọn khoảng thời gian:</label>
                    <Select
                      value={startMonth}
                      onChange={(selectedMonth) => setStartMonth(selectedMonth)}
                      name="startMonth"
                      options={monthOptions}
                    />
                    <span>Đến</span>
                    <Select
                      value={endMonth}
                      onChange={(selectedMonth) => setEndMonth(selectedMonth)}
                      name="endMonth"
                      options={monthOptions}
                    />
                  </>
                ) : type.value === "yearly" ? (
                  <>
                    <label>Chọn năm:</label>
                    <Select
                      value={year}
                      onChange={(selectedYear) => setYear(selectedYear)}
                      name="year"
                      options={yearOptions}
                    />
                  </>
                ) : (
                  <>
                    <div className={cx("report__filter__time__selector__date")}>
                      <label>Chọn ngày:</label>
                      <input
                        type="date"
                        className={cx(
                          "report__filter__time__selector__date__search"
                        )}
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <div className={cx("report__filter__category")}>
          <label>Loại sản phẩm:</label>
          <Select
            value={category}
            onChange={(selectedCategory) => setCategory(selectedCategory)}
            name="category"
            options={listOfCategory}
            className={cx("report__filter__category__select")}
          />
        </div>
        {user?.vaiTro?.vaiTro !== "ADMIN" && (
          <div className={cx("report__filter__pay")}>
            <label>Trạng thái sản phẩm:</label>
            <Select
              value={pay}
              onChange={(selectedPay) => setPay(selectedPay)}
              name="pay"
              options={listOfPay}
              className={cx("report__filter__pay__select")}
            />
          </div>
        )}
        {type.value !== "day" && (
          <div className={cx("report__filter__product")}>
            <label>Sản phẩm:</label>
            <Select
              value={product}
              onChange={(selectedProduct) => setProduct(selectedProduct)}
              name="product"
              options={listOfProduct}
              className={cx("report__filter__product__select")}
            />
          </div>
        )}
      </div>

      <div className={cx("report__typeChart")}>
        <label>Biểu đồ:</label>
        <Select
          value={typeChart}
          onChange={(selectedTypeChart) => setTypeChart(selectedTypeChart)}
          name="typeChart"
          options={listTypeChart}
        />
      </div>
      <canvas ref={chartRef}></canvas>
      <div className={cx("report__list")}>
        <table className={cx("report__list__table")}>
          <thead>
            <tr>
              <th>{type.value === "day" ? "Tên sản phẩm" : "Tháng"} </th>
              <th>Số lượng</th>
              <th>Doanh thu (nghìn đồng)</th>
            </tr>
          </thead>
          <tbody>
            {dataChart.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.totalProducts}</td>
                <td>{convertCurrency(item.totalRevenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportComponent;
