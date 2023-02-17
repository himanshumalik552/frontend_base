import { FinancialDetail, FinancialPeriod, PhysicalDetail } from "./types";

export function getTotal(arr: any) {
  if (!Array.isArray(arr)) return;
  return arr.reduce((a, v) => a + v);
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const getMonthName = (monthYear: number) => {
  if (monthYear <= 0 || monthYear > 12) {
    return "";
  }
  return monthNames[monthYear - 1];
}

export function getMonth(date: Date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1)
    if (month.length < 2)
    month = '0' + month;

  return month;
}

export function getYear(date: Date) {
  var d = new Date(date),
  year = d.getFullYear();
  return  year;
}

export function formatDateForAddDialogBox(date: Date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + (d.getDate()),
    year = d.getFullYear();
  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;
  return [month, day, year].join('-');
}

export function formatDateToString(date: Date, includeDay: boolean = false) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + (d.getDate()),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    if (includeDay) {
        return [day, getMonthName(parseInt(month)), year].join(' ');
    }
    return [getMonthName(parseInt(month)), year].join(' ');
}

export function formatDateToStringUpdateDialogBox(date: Date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + (d.getDate()),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [day, getMonthName(parseInt(month)), year].join(' ');
}

export function formatDateToStringForFiltering(date: Date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + (d.getDate()),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [getMonthName(parseInt(month)), year].join(' ');
}

export function sortDates (date: any[]) {
 return date.sort((a, b) =>  Date.parse(b)-Date.parse(a))
}

export const getFilteredYearAndMonth = (porgressDetail: any[]) => {
  const periodsdate: any[] = porgressDetail.flatMap(f=>f.progress).map(f=>(f.progressDate))
  const afterSort :any[]= sortDates(periodsdate)
  const periods = afterSort.map(f=>({ month: parseInt(getMonth(f)) ,year:getYear(f),title:formatDateToStringForFiltering(f)}))
  const flags = new Set();
  const distinctPeriods = periods.filter(period => {
    if (flags.has(period.title)) {
      return false;
    }
    flags.add(period.title);
    return true;
  });
  return distinctPeriods;
}
export const getCurrentYearAndMonth = () => {
  const nowDate = new Date();
  const year = nowDate.getFullYear();
  const month = nowDate.getMonth()
  const currentDateAndYear: FinancialPeriod = { month: month,  year: year,title: `${getMonthName(month)} ${year}` };
  return currentDateAndYear;
}

export const getTotalPercentageFinancialAmount = (financialDetail: FinancialDetail) => {
  const progresses = financialDetail.progress ? financialDetail.progress : [];
  const amountPaidInMonth = getTotal(progresses.map(f => f.amountPaidInMonth));
  const amountPaidTillMonth = getTotal(progresses.map(f => f.amountPaidTillMonth));
  const totalAmountPaidPercentage = Math.round((amountPaidInMonth + amountPaidTillMonth) / financialDetail.totalAmount * 100);
  const totalAmount = totalAmountPaidPercentage * financialDetail.weightage;
  return totalAmount;
}
export const getTotalPercentagePhysicalDetailWork = (physicalDetail: PhysicalDetail) => {
  const progresses = physicalDetail.progress ? physicalDetail.progress : [];
  const workInMonth = getTotal(progresses.map(f => f.workInMonth));
  const workTillMonth = getTotal(progresses.map(f => f.workTillMonth));
  const percentageOfWorkDone = Math.round((workInMonth + workTillMonth) / physicalDetail.quantity * 100);
  const percentageTotalWork = percentageOfWorkDone * physicalDetail.weightage;
  return percentageTotalWork;
}
export const getFirstId = (arr : any[])=>{
    const itemId = arr[0].id;
    return itemId;
} 
