/**
 * RSVP → Google Sheet. Bound to the spreadsheet (Extensions → Apps Script).
 * Deploy as Web app: Execute as "Me", access "Anyone". Paste the /exec URL into rsvp.js.
 * Columns: Timestamp | Name | Engagement | Cocktail Party | Madhuramveppu | Wedding Ceremony | Wedding Reception | Note
 * Each event column holds the number of guests (blank = not attending).
 */
var SHEET_NAME = 'RSVP';
var EVENTS = ['Engagement', 'Cocktail Party', 'Madhuramveppu', 'Wedding Ceremony', 'Wedding Reception'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var d = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(['Timestamp', 'Name'].concat(EVENTS, ['Note']));
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, EVENTS.length + 3).setFontWeight('bold');
    }
    var ev = d.events || {};
    var row = [new Date(), clean(d.name, 80)];
    EVENTS.forEach(function (k) { row.push(ev[k] ? Math.min(Math.max(parseInt(ev[k], 10) || 1, 1), 20) : ''); });
    row.push(clean(d.note, 500));
    sh.appendRow(row);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out({ ok: true, info: 'RSVP endpoint is live' }); }

// Strip a leading = + - @ so a guest's text can never run as a spreadsheet formula
function clean(s, max) {
  s = String(s || '').slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
