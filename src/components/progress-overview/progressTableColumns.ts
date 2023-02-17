import { reportTypes } from './../../utils/types';
import { ProgressColumn } from "../../utils/types";
var moment = require('moment');

const getWeeklyColumns = (m: any, days: number[], interval: number, weekly: boolean) => {

    const columnArray: ProgressColumn[] = [];
    const momentDate = moment(m.formatted_month, "YYYY-MM");
    var weekNum = 0;

    days.forEach(day => {
        const startMoment = day <= 0 ?
            momentDate.startOf('month') :
            momentDate.startOf('month').add(day + 1, 'days');
        const startDate = new Date(startMoment.format('YYYY-MM-DD'));

        const index = days.findIndex(d => d === day);
        const endMoment = index === (days.length - 1) ?
            momentDate.endOf('month') :
            moment(startDate, "DD-MM-YYYY").add(interval, 'days')
        const endDate = new Date(endMoment.format('YYYY-MM-DD'));

        ++weekNum;
        columnArray.push({
            minDate: startDate,
            maxDate: endDate,
            title: weekly ? `WK-${weekNum} (${startMoment.format('MMM-YYYY')})` :
                `${startMoment.format('MMM')}-${weekNum} (${startMoment.format('YYYY')})`
        })
    })

    return columnArray;
}

const getColumnsOtherThanDaily = (distinctDates: Date[], reportType: reportTypes) => {

    var min = distinctDates.reduce(function (a, b) { return a < b ? a : b; }) || new Date();
    var max = distinctDates.reduce(function (a, b) { return a > b ? a : b; }) || new Date();
    var minMomentDate = moment(min);
    var maxMomentDate = moment(max);
    const columnArray: ProgressColumn[] = [];

    var betweenMonths: { formatted_month: string }[] = [];
    if (minMomentDate < maxMomentDate) {
        var date = minMomentDate.startOf('month');
        while (date < maxMomentDate.endOf('month')) {
            betweenMonths.push({
                formatted_month: date.format("YYYY-MM")
            });
            date.add(1, 'month');
        }
    }

    switch (reportType) {
        case "weekly":
            betweenMonths.forEach(m => {
                const arr = [0, 7, 14, 21];
                const weeklyColumns = getWeeklyColumns(m, arr, 7, true);
                columnArray.push(...weeklyColumns);
            })

            break;

        case "fortnightly":
            betweenMonths.forEach(m => {
                const arr = [0, 14];
                const weeklyColumns = getWeeklyColumns(m, arr, 14, false);
                columnArray.push(...weeklyColumns);
            })
            break;

        case "monthly":
            betweenMonths.forEach(m => {
                const momentDate = moment(m.formatted_month, "YYYY-MM");
                const startOfMonth = new Date(momentDate.startOf('month').format('YYYY-MM-DD'));
                const endOfMonth = new Date(momentDate.endOf('month').format('YYYY-MM-DD'));
                columnArray.push({
                    minDate: startOfMonth,
                    maxDate: endOfMonth,
                    title: momentDate.format('MMM-YYYY')
                })
            })
            break;
    }

    return columnArray;
}

export const getColumns = (distinctDates: Date[], reportType: reportTypes) => {

    const columns: ProgressColumn[] = [];
    switch (reportType) {
        case "monthly":
        case "fortnightly":
        case "weekly":
            const aa = getColumnsOtherThanDaily(distinctDates, reportType);
            columns.push(...aa);
            break;
        case "daily":
        default:
            distinctDates.forEach(d => {
                columns.push({
                    minDate: d,
                    maxDate: d,
                    title: moment(d).format('DD-MMM-YYYY')
                })
            })
            break;
    }

    return columns;
}