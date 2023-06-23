/* eslint-disable @next/next/no-img-element */
import config from "@config/index";
import { SortType } from "@services/CommonTypes";
import {
  Promotions,
  PromotionsQuery,
  PromotionsService,
} from "@services/Promotions";
import {
  DataView,
  DataViewLayoutOptions,
  DataViewPageEvent,
} from "primereact/dataview";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { LayoutType, SortOrderType } from "../../../types/types";

const PromotionsDataview = () => {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [layout, setLayout] = useState<LayoutType>("grid");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState<SortOrderType>(0);
  const [sortField, setSortField] = useState("");

  const [promotionss, setPromotionss] = useState<Promotions[]>([]);
  const [promotionssBackup, setPromotionssBackup] = useState<Promotions[]>([]);
  const [loading, setLoading] = useState(false);
  const [row, setRow] = useState<number>(9);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const promotionsService = new PromotionsService();

  const sortOptions = [
    { label: "Date new to old", value: "!id" },
    { label: "Date old to new", value: "id" },
  ];

  useEffect(() => {
    setLoading(true);
    (async () => {
      let d = await promotionsService.getPromotions({ limit: row });
      if (d.error == undefined) {
        setPromotionss(d.docs);
        setPromotionssBackup(d.docs);
        setLoading(false);
        setTotalRecords(d.count);
      } else {
        setLoading(false);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: d.error,
          life: 3000,
        });
      }
    })();
  }, []);
  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setGlobalFilterValue(value);
    if (value.length === 0) {
      setPromotionss(promotionssBackup);
    } else {
      const filtered = promotionss!.filter((promotions: Promotions) => {
        return (
          promotions.name.toLowerCase().includes(value) ||
          promotions.description.toLowerCase().includes(value) ||
          promotions.discount.toLowerCase().includes(value)
        );
      });
      setPromotionss(filtered);
    }
  };
  const onSortChange = (event: DropdownChangeEvent) => {
    const value = event.value;

    if (value.indexOf("!") === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const dataViewHeader = (
    <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
      <Dropdown
        value={sortKey}
        options={sortOptions}
        optionLabel="label"
        placeholder="Sort By"
        onChange={onSortChange}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />

        <InputText
          value={globalFilterValue}
          onChange={onFilter}
          placeholder="Search by"
        />
      </span>
      <DataViewLayoutOptions
        layout={layout}
        onChange={(e) => setLayout(e.value as LayoutType)}
      />
    </div>
  );
  const changePage = async (e: DataViewPageEvent) => {
    await getNewData(e);
  };

  const getNewData = async (e: any) => {
    setLoading(true);
    let type = row == e.rows ? 1 : 0;

    let searchObj: PromotionsQuery = {};

    if (type == 0) {
      // Chnage row number
      searchObj = { ...searchObj, page: 0, limit: row };
    } else if (type == 1) {
      // Change page number
      searchObj = { ...searchObj, page: e.page, limit: row };
    }
    if (e.rows !== row) {
      setRow(e.rows);
    }

    let d = await promotionsService.getPromotions(searchObj);
    if (d.error == undefined) {
      setPromotionss(d.docs);
      setPromotionssBackup(d.docs);
      setLoading(false);
      setTotalRecords(d.count);
      toast.current?.show({
        severity: "success",
        summary: "Loaded",
        detail: "Data retrived",
        life: 3000,
      });
    } else {
      setLoading(false);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: d.error,
        life: 3000,
      });
    }
  };
  const dataviewListItem = (data: Promotions) => {
    return (
      <div className="col-12">
        <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
          {data.image != undefined ? (
            <img
              src={`${config.serverURI}/${data.image}`}
              alt={data.name}
              className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5"
            />
          ) : (
            <img
              src={"/photo_na.png"}
              alt={data.name}
              className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5"
            />
          )}

          <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
            <div className="font-bold text-2xl">{data.name}</div>
            <div className="mb-2">{data.description}</div>
            {/* <Rating value={2} readOnly cancel={false} className="mb-2"></Rating> */}
            <div className="flex align-items-center">
              <i className="pi pi-tag mr-2"></i>
              <span className="font-semibold">{data.discount}</span>
            </div>{" "}
            <div className="flex align-items-center mt-2">
              <div>
                <i className="pi pi-clock mr-2" />
              </div>
              <div>{data.startDate.split("T")[0]} to </div>
              <div>{data.endDate.split("T")[0]}</div>
            </div>
          </div>

          {/* <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
            <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">
              $ {data.id}
            </span>
            <Button
              icon="pi pi-shopping-cart"
              label="Add to Cart"
              disabled={data.id === "OUTOFSTOCK"}
              className="mb-2 p-button-sm"
            ></Button>
            <span className={`product-badge status-active`}>{data.id}</span>
          </div> */}
        </div>
      </div>
    );
  };

  const dataviewGridItem = (data: Promotions) => {
    return (
      <div className="col-12 lg:col-4">
        <div className="card m-3 border-1 surface-border">
          {/* <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
            <div className="flex align-items-center">
              <i className="pi pi-tag mr-2" />
              <span className="font-semibold">{data.id}</span>
            </div>
            <span className={`product-badge status-active`}>{data.id}</span>
          </div> */}
          <div className="flex flex-column align-items-center text-center mb-3">
            {data.image != undefined ? (
              <img
                src={`${config.serverURI}/${data.image}`}
                alt={data.name}
                className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5"
              />
            ) : (
              <img
                src={`/photo_na.png`}
                alt={data.name}
                className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5"
              />
            )}
            <div className="text-2xl font-bold mt-3">{data.name}</div>
            <div className="mb-1">{data.description}</div>
            <div className="flex align-items-center mb-2">
              <i className="pi pi-tag mr-2 align-content-center" />
              <span className="font-semibold">{data.discount}</span>
            </div>
            <div className="align-items-center">
              <i className="pi pi-clock mr-2" />
              <span>{data.startDate.split("T")[0]} to </span>
              <span>{data.endDate.split("T")[0]}</span>
            </div>
            {/* <Rating value={data.id} readOnly cancel={false} /> */}
          </div>
          {/* <div className="flex align-items-center justify-content-between">
            <span className="text-2xl font-semibold">$ {data.id}</span>
            <Button
              icon="pi pi-shopping-cart"
              disabled={data.id === "OUTOFSTOCK"}
            />
          </div> */}
        </div>
      </div>
    );
  };

  const itemTemplate = (data: Promotions, layout: LayoutType) => {
    if (!data) {
      return;
    }

    if (layout === "list") {
      return dataviewListItem(data);
    } else if (layout === "grid") {
      return dataviewGridItem(data);
    }
  };

  return (
    <div className="grid list-demo">
      <div className="col-12">
        <div className="card">
          <h5>Promotions</h5>
          <DataView
            value={promotionss}
            layout={layout}
            loading={loading}
            paginator
            sortOrder={sortOrder}
            sortField={sortField}
            totalRecords={totalRecords}
            itemTemplate={itemTemplate}
            rows={row}
            lazy={true}
            onPage={changePage}
            rowsPerPageOptions={[9, 12, 15, 18, 21, 24, 27, 30]}
            header={dataViewHeader}
          ></DataView>
        </div>
      </div>
    </div>
  );
};

export default PromotionsDataview;
