# Link the RSVP form to Google Sheets (about 3 minutes)

1. Create a new Google Sheet (name it e.g. "Derick & Christina RSVPs").
2. **Extensions → Apps Script**. Delete the sample code and paste all of `Code.gs`. Save.
3. **Deploy → New deployment → ⚙ Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy, then authorise when asked ("Advanced → Go to project" if Google warns).
4. Copy the **Web app URL** (ends in `/exec`).
5. Open `rsvp.js` and paste it into `var RSVP_ENDPOINT = '...';` (line 6). Redeploy the site.
6. Test: open the site, submit an RSVP. A row appears in the sheet's **RSVP** tab.

If you edit `Code.gs` later: Deploy → Manage deployments → Edit → New version → Deploy (the URL stays the same).
