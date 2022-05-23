const { GoogleSpreadsheet } = require("google-spreadsheet");

function prettyDateString(dateObject) {
  return `${dateObject.getDate().toString().padStart(2, "0")}.${(
    dateObject.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${dateObject.getFullYear()}`;
}

function prettyTimeString(dateObject) {
  return `${dateObject.getHours().toString().padStart(2, "0")}:${dateObject
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

function sortByTime(a, b) {
  if (a.time < b.time) return -1;
  if (a.time > b.time) return 1;
  return 0;
}

function sortEventsByDateAscending(events) {
  let newEvents = [...events];
  newEvents.sort(function (a, b) {
    if (a.startDate < b.startDate) {
      return -1;
    }
    if (a.startDate > b.startDate) {
      return 1;
    }
    // dates are equal
    return 0;
  });
  return newEvents;
}

const getDoc = async () => {
  //Form Responses 1
  const SHEET_ID = process.env.SHEET_ID;
  const doc = new GoogleSpreadsheet(SHEET_ID);
  try {
    await doc.useServiceAccountAuth({
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    });
  } catch (e) {
    console.log(e);
  }

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex.find(
    (sheet) => sheet._rawProperties.title.toLowerCase() === "kombinert"
  );
  if (!sheet) return [];
  const rows = await sheet.getRows();
  const headers = rows[0]._sheet.headerValues;
  const cleanRows = rows.map((row) => {
    let newRow = {};
    headers.forEach((header, index) => {
      newRow[header.toLowerCase()] = row._rawData[index];
    });
    if (newRow && newRow.photo.includes("drive.google.com/open")) {
      newRow.photo =
        "https://drive.google.com/thumbnail?authuser=0&sz=w320&id=" +
        newRow.photo.split("=")[1];
    }
    return newRow;
  });
  // used to sort by days
  let days = [];
  cleanRows.forEach((event) => {
    let dayEvent = { day: event.day };
    if (!days.find((day) => day.day === event.day)) days.push(dayEvent);
  });
  days = days.map((day) => {
    day.events = cleanRows
      .filter((event) => event.day === day.day)
      .sort(sortByTime);
    return day;
  });
  return days;
};

module.exports = getDoc;
