const { GoogleSpreadsheet } = require("google-spreadsheet");

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
    (sheet) => sheet._rawProperties.title.toLowerCase() === "kioskmeny"
  );
  if (!sheet) return [];
  const rows = await sheet.getRows();
  const headers = rows[0]._sheet.headerValues;
  const cleanRows = rows.map((row) => {
    let newRow = {};
    headers.forEach((header, index) => {
      newRow[header.toLowerCase()] = row._rawData[index];
    });
    return newRow;
  });
  return cleanRows;
};

module.exports = getDoc;
