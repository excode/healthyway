/* eslint-disable @next/next/no-img-element */

import config from "@config/configs";
import { Customer, CustomerService } from "@services/Customer";
import { FeedbackService } from "@services/Feedback";
import { MealItem, MealItemService } from "@services/MealItem";
import { MealOrderItem, MealOrderItemService } from "@services/MealOrderItem";
import { Report, ReportService } from "@services/Report";
import { ChartData, ChartOptions } from "chart.js";
import { LangContext } from "hooks/lan";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Noto_Naskh_Arabic } from "next/font/google";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Menu } from "primereact/menu";
import { useContext, useEffect, useRef, useState } from "react";
import { ProductService } from "../../demo/service/ProductService";
import { LayoutContext } from "../../layout/context/layoutcontext";
import { Demo } from "../../types/types";
const noto = Noto_Naskh_Arabic({ subsets: ["arabic"] });

const lineData: ChartData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "First Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: "#2f4860",
      borderColor: "#2f4860",
      tension: 0.4,
    },
    {
      label: "Second Dataset",
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      backgroundColor: "#00bb7e",
      borderColor: "#00bb7e",
      tension: 0.4,
    },
  ],
};

const Dashboard = () => {
  const { locale } = useRouter();
  const { t } = useTranslation();

  // i18n.changeLanguage("en");
  const [products, setProducts] = useState<Demo.Product[]>([]);
  const menu1 = useRef<Menu>(null);
  const menu2 = useRef<Menu>(null);
  const { textFormat } = useContext(LangContext);
  const [lineOptions, setLineOptions] = useState<ChartOptions>({});
  const { layoutConfig } = useContext(LayoutContext);
  const customerService = new CustomerService();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCustomerRecords, setTotalCustomerRecords] = useState(0);
  const [totalMealItemRecords, setTotalMealItemRecords] = useState(0);
  const [totalMealOrderRecords, setTotalMealOrderRecords] = useState(0);
  const mealitemService = new MealItemService();
  const reportService = new ReportService();
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [report, setReport] = useState<Report[]>([]);
  const mealorderitemService = new MealOrderItemService();
  const [mealOrderItems, setMealOrderItems] = useState<MealOrderItem[]>([]);
  const feedbackService = new FeedbackService();
  const [totalFeedbackRecords, setTotalFeedbackRecords] = useState(0);
  const applyLightTheme = () => {
    const lineOptions: ChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };

  const applyDarkTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: "#ebedef",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#ebedef",
          },
          grid: {
            color: "rgba(160, 167, 181, .3)",
          },
        },
        y: {
          ticks: {
            color: "#ebedef",
          },
          grid: {
            color: "rgba(160, 167, 181, .3)",
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };

  useEffect(() => {
    ProductService.getProductsSmall().then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    if (layoutConfig.colorScheme === "light") {
      applyLightTheme();
    } else {
      applyDarkTheme();
    }
  }, [layoutConfig?.colorScheme]);

  useEffect(() => {
    // setLoading(true);
    (async () => {
      let dCustomers = await customerService.getCustomer({ limit: 10 });
      const dReport = await reportService.getReportAll({});
      console.log({ dReport });
      // console.log(dCustomers)
      let dMeal = await mealitemService.getMealItem({ limit: 10 });
      let dMealOrder = await mealorderitemService.getMealOrderItem({
        limit: 10,
      });
      let dFeedBack = await feedbackService.getFeedback({ limit: 10 });
      if (
        (dCustomers.error && dMeal.error && dMealOrder && dFeedBack) ===
        undefined
      ) {
        setReport(dReport.data);
        setCustomers(dCustomers.docs);
        setMealItems(dMeal.docs);
        // setBackupCustomers(d.docs);
        // setLoading(false);
        setTotalCustomerRecords(dCustomers.count);
        setTotalMealItemRecords(dMeal.count);
        setTotalMealOrderRecords(dMealOrder.count);
        setTotalFeedbackRecords(dFeedBack.count);
      } else {
        // setLoading(false);
        // toast.current?.show({
        //   severity: "error",
        //   summary: "Error",
        //   detail: d.error,
        //   life: 3000,
        // });
      }
    })();
  }, []);
  const formatCurrency = (value: number) => {
    return value?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };
  return (
    <div className="grid">
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3 ">
                {t("ORDER")}
              </span>
              <div className="text-900 font-medium text-xl">
                {/* {totalMealOrderRecords} */}
                {report[0]?.order}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-shopping-cart text-blue-500 text-xl" />
            </div>
          </div>
          {/* <span className="text-green-500 font-medium">
            {totalMealOrderRecords} {t("NEW")}
          </span>
          <span className="text-500">{t("SINCE_LAST_VISIT")}</span> */}
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                {t("REVENUE")}
              </span>
              <div className="text-900 font-medium text-xl">
                {report[0]?.revenue}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-orange-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-map-marker text-orange-500 text-xl" />
            </div>
          </div>
          {/* <span className="text-green-500 font-medium">%52+ </span>
          <span className="text-500">{t("SINCE_LAST_WEEK")}</span> */}
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                {t("CUSTOMERS")}
              </span>
              <div className="text-900 font-medium text-xl">
                {/* {totalCustomerRecords} */}
                {report[0]?.customer}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-inbox text-cyan-500 text-xl" />
            </div>
          </div>
          {/* <span className="text-green-500 font-medium">
            {totalCustomerRecords}
          </span>
          <span className="text-500"> {t("NEWLY_REGISTERED")}</span> */}
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                {t("COMMENTS")}
              </span>
              <div className="text-900 font-medium text-xl">
                {totalFeedbackRecords} {t("UNREAD")}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-purple-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-comment text-purple-500 text-xl" />
            </div>
          </div>
          {/* <span className="text-green-500 font-medium">
            {totalFeedbackRecords}{" "}
          </span>
          <span className="text-500">{t("RESPONDED")}</span> */}
        </div>
      </div>

      <div dir={textFormat} className=" col-12 xl:col-6">
        <div className="card">
          <h5>{t("RECENT_SALES")}</h5>
          <DataTable
            className={locale === "ar" ? noto.className : ""}
            tableClassName={locale === "ar" ? noto.className : ""}
            value={mealItems}
            rows={5}
            paginator
            responsiveLayout="scroll"
          >
            <Column
              header={t("IMAGE")}
              body={(data) => (
                <img
                  className="shadow-2"
                  src={`${config.serverURI}/${data.image}`}
                  //   src={`/demo/images/product/${data.image}`}
                  alt={data.image}
                  width="50"
                />
              )}
            />

            <Column
              field="name"
              header={t("NAME")}
              sortable
              style={{ width: "35%" }}
            />
            <Column
              field="price"
              header={t("PRICE")}
              sortable
              style={{ width: "35%" }}
              body={(data) => formatCurrency(data.price)}
            />
            <Column
              header={t("VIEW")}
              style={{ width: "15%" }}
              body={() => (
                <>
                  <Button icon="pi pi-search" text />
                </>
              )}
            />
          </DataTable>
        </div>
        <div className="card">
          <div className="flex justify-content-between align-items-center mb-5">
            <h5>{t("BEST_SELLING_ITEMS")}</h5>
            <div>
              <Button
                type="button"
                icon="pi pi-ellipsis-v"
                className="p-button-rounded p-button-text p-button-plain"
                onClick={(event) => menu1.current?.toggle(event)}
              />
              <Menu
                ref={menu1}
                popup
                model={[
                  { label: `${t("ADD_NEW")}`, icon: "pi pi-fw pi-plus" },
                  { label: `${t("Remove")}`, icon: "pi pi-fw pi-minus" },
                ]}
              />
            </div>
          </div>

          {mealItems.map((item, index) => (
            <ul className="list-none p-0 m-0">
              <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                  <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                    {item.name}
                  </span>
                  <div className="mt-1 text-600">{item.groupName}</div>
                </div>
                {index % 2 === 0 ? (
                  <div className="mt-2 md:mt-0 flex align-items-center">
                    <div
                      className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                      style={{ height: "8px" }}
                    >
                      <div
                        className="bg-orange-500 h-full"
                        style={{ width: "50%" }}
                      />
                    </div>
                    <span className="text-orange-500 ml-3 font-medium">
                      %50
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 md:mt-0 flex align-items-center">
                    <div
                      className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                      style={{ height: "8px" }}
                    >
                      <div
                        className="bg-pink-500 h-full"
                        style={{ width: "67%" }}
                      />
                    </div>
                    <span className="text-pink-500 ml-3 font-medium">%67</span>
                  </div>
                )}
              </li>
              {/* <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                  <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                    Portal Sticker
                  </span>
                  <div className="mt-1 text-600">Accessories</div>
                </div>
                <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                  <div
                    className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                    style={{ height: "8px" }}
                  >
                    <div
                      className="bg-cyan-500 h-full"
                      style={{ width: "16%" }}
                    />
                  </div>
                  <span className="text-cyan-500 ml-3 font-medium">%16</span>
                </div>
              </li>
              <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                  <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                    Supernova Sticker
                  </span>
                  <div className="mt-1 text-600">Accessories</div>
                </div>
                <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                  <div
                    className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                    style={{ height: "8px" }}
                  >
                    <div
                      className="bg-pink-500 h-full"
                      style={{ width: "67%" }}
                    />
                  </div>
                  <span className="text-pink-500 ml-3 font-medium">%67</span>
                </div>
              </li>
              <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                  <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                    Wonders Notebook
                  </span>
                  <div className="mt-1 text-600">Office</div>
                </div>
                <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                  <div
                    className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                    style={{ height: "8px" }}
                  >
                    <div
                      className="bg-green-500 h-full"
                      style={{ width: "35%" }}
                    />
                  </div>
                  <span className="text-green-500 ml-3 font-medium">%35</span>
                </div>
              </li>
              <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                  <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                    Mat Black Case
                  </span>
                  <div className="mt-1 text-600">Accessories</div>
                </div>
                <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                  <div
                    className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                    style={{ height: "8px" }}
                  >
                    <div
                      className="bg-purple-500 h-full"
                      style={{ width: "75%" }}
                    />
                  </div>
                  <span className="text-purple-500 ml-3 font-medium">%75</span>
                </div>
              </li>
              <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                  <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                    Robots T-Shirt
                  </span>
                  <div className="mt-1 text-600">Clothing</div>
                </div>
                <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                  <div
                    className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                    style={{ height: "8px" }}
                  >
                    <div
                      className="bg-teal-500 h-full"
                      style={{ width: "40%" }}
                    />
                  </div>
                  <span className="text-teal-500 ml-3 font-medium">%40</span>
                </div>
              </li> */}
            </ul>
          ))}
        </div>
      </div>

      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>{t("SALES_OVERVIEW")}</h5>
          <Chart type="line" data={lineData} options={lineOptions} />
        </div>

        <div className="card">
          <div className="flex align-items-center justify-content-between mb-4">
            <h5>{t("NOTIFICATIONS")}</h5>
            <div>
              <Button
                type="button"
                icon="pi pi-ellipsis-v"
                className="p-button-rounded p-button-text p-button-plain"
                onClick={(event) => menu2.current?.toggle(event)}
              />
              <Menu
                ref={menu2}
                popup
                model={[
                  { label: `${t("ADD_NEW")}`, icon: "pi pi-fw pi-plus" },
                  { label: `${t("REMOVE")}`, icon: "pi pi-fw pi-minus" },
                ]}
              />
            </div>
          </div>

          <span className="block text-600 font-medium mb-3">{t("TODAY")}</span>
          <ul className="p-0 mx-0 mt-0 mb-4 list-none">
            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
              <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                <i className="pi pi-dollar text-xl text-blue-500" />
              </div>
              <span className="text-900 line-height-3">
                Richard Jones
                <span className="text-700">
                  has purchased a Teriyaki-beef for{" "}
                  <span className="text-blue-500">79$</span>
                </span>
              </span>
            </li>
            <li className="flex align-items-center py-2">
              <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                <i className="pi pi-download text-xl text-orange-500" />
              </div>
              {/* <span className="text-700 line-height-3">
                Your request for withdrawal of{" "}
                
                <span className="text-blue-500 font-medium">2500$</span> has
                been initiated.
              </span> */}
              <span className="text-900 line-height-3">
                Abdullah
                <span className="text-700">
                  {" "}
                  has posted a new comment about your Fish.
                </span>
              </span>
            </li>
          </ul>

          <span className="block text-600 font-medium mb-3">YESTERDAY</span>
          <ul className="p-0 m-0 list-none">
            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
              <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                <i className="pi pi-dollar text-xl text-blue-500" />
              </div>
              <span className="text-900 line-height-3">
                Keyser Wick
                <span className="text-700">
                  {" "}
                  has purchased a Fish Curry for{" "}
                  <span className="text-blue-500">59$</span>
                </span>
              </span>
            </li>
            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
              <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">
                <i className="pi pi-question text-xl text-pink-500" />
              </div>
              <span className="text-900 line-height-3">
                Jane Davis
                <span className="text-700">
                  {" "}
                  has posted a new comment about your beef.
                </span>
              </span>
            </li>
          </ul>
        </div>
        {/* <div
                    className="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3"
                    style={{ borderRadius: '1rem', background: 'linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1C80CF 47.88%, #FFFFFF 100.01%)' }}
                >
                    <div>
                        <div className="text-blue-100 font-medium text-xl mt-2 mb-3">TAKE THE NEXT STEP</div>
                        <div className="text-white font-medium text-5xl">Try PrimeBlocks</div>
                    </div>
                    <div className="mt-4 mr-auto md:mt-0 md:mr-0">
                        <Link href="https://blocks.primereact.org" className="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised">
                            Get Started
                        </Link>
                    </div>
                </div> */}
      </div>
    </div>
  );
};

export default Dashboard;

export async function getStaticProps(context: any) {
  // extract the locale identifier from the URL
  const { locale } = context;

  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}
