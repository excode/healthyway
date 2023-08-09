import { getDataAll } from "@lib/httpRequest";

export type Report = {
  order: number;
  revenue: number;
  customer: number;
  id?: string | any;
};

export class ReportService {
  // getCustomer(request: CustomerQuery) {
  //   return getDatas<Customer, CustomerQuery>("/customer", request);
  // }

  getReportAll(request: any) {
    return getDataAll<Report, any>("/reportsOf24H", request);
  }
}
