import { google } from 'googleapis';

const sheets = google.sheets('v4');

const getAuthClient = async () => {
  const auth = new google.auth.GoogleAuth({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n'
      ),
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth;
};

export const appendAttendee = async (data: any) => {
  try {
    const auth = await getAuthClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const result = await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: spreadsheetId!,
      range: 'Sheet1!A:L',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            data.id,
            data.uuid,
            data.firstName,
            data.lastName,
            data.dni,
            data.phone,
            data.email,
            data.paymentStatus,
            data.qrUsed ? 'Sí' : 'No',
            data.purchaseDate,
            data.entryDate || '',
            data.paymentId,
          ],
        ],
      },
    });

    return result.data;
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    throw error;
  }
};

export const getAttendeeByUUID = async (uuid: string) => {
  try {
    const auth = await getAuthClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const result = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: spreadsheetId!,
      range: 'Sheet1!A:L',
    });

    const rows = result.data.values || [];
    const attendee = rows.find((row: any[]) => row[1] === uuid);

    if (!attendee) return null;

    return {
      id: attendee[0],
      uuid: attendee[1],
      firstName: attendee[2],
      lastName: attendee[3],
      dni: attendee[4],
      phone: attendee[5],
      email: attendee[6],
      paymentStatus: attendee[7],
      qrUsed: attendee[8] === 'Sí',
      purchaseDate: attendee[9],
      entryDate: attendee[10],
      paymentId: attendee[11],
    };
  } catch (error) {
    console.error('Error getting attendee from Google Sheets:', error);
    throw error;
  }
};

export const getAllAttendees = async () => {
  try {
    const auth = await getAuthClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const result = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: spreadsheetId!,
      range: 'Sheet1!A:L',
    });

    const rows = result.data.values || [];
    return rows.slice(1).map((row: any[]) => ({
      id: row[0],
      uuid: row[1],
      firstName: row[2],
      lastName: row[3],
      dni: row[4],
      phone: row[5],
      email: row[6],
      paymentStatus: row[7],
      qrUsed: row[8] === 'Sí',
      purchaseDate: row[9],
      entryDate: row[10],
      paymentId: row[11],
    }));
  } catch (error) {
    console.error('Error getting attendees from Google Sheets:', error);
    throw error;
  }
};

export const updateQRUsed = async (uuid: string) => {
  try {
    const auth = await getAuthClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const result = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: spreadsheetId!,
      range: 'Sheet1!A:L',
    });

    const rows = result.data.values || [];
    const rowIndex = rows.findIndex((row: any[]) => row[1] === uuid);

    if (rowIndex === -1) throw new Error('Attendee not found');

    const now = new Date().toISOString();

    await sheets.spreadsheets.values.update({
      auth,
      spreadsheetId: spreadsheetId!,
      range: `Sheet1!I${rowIndex + 1}:K${rowIndex + 1}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['Sí', now, now]],
      },
    });
  } catch (error) {
    console.error('Error updating QR status:', error);
    throw error;
  }
};
