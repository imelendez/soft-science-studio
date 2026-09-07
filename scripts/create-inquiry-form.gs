/**
 * Creates the Soft Science Studio project inquiry form, wires it to a new
 * private response spreadsheet, and prints the two URLs the website needs.
 *
 * HOW TO RUN
 *   1. Go to script.google.com  ->  New project
 *      (do this while signed in to the Google account YOU own, not an
 *      employer account — this form and its responses belong to the studio)
 *   2. Delete the sample code, paste this whole file in
 *   3. Save, then Run -> createInquiryForm
 *   4. Approve the permission prompt (it needs Forms + Sheets access)
 *   5. Open View -> Logs. Copy the two URLs it prints into contact.html,
 *      replacing FORM_EMBED_URL_PENDING and FORM_SHARE_URL_PENDING.
 *
 * WHAT THIS SCRIPT CANNOT DO
 *   Google Forms exposes no API for theme color, so the cobalt (#3154C8)
 *   cannot be set from code. Forms also only offers a fixed palette in its
 *   UI, not arbitrary hex. See BRAND note at the bottom for the two things
 *   that do work.
 */

// --- Brand reference (for the manual theming step; not settable via API) ---
var BRAND = {
  cobalt: '#3154C8',  // primary
  cyan:   '#39C6E8',  // accent
  cream:  '#FAF8F2',  // light ground
  ink:    '#18202A'   // text
};

function createInquiryForm() {
  var form = FormApp.create('Soft Science Studio — Project inquiry');

  form.setTitle('Tell me about your project')
      .setDescription(
        "A few sentences are enough. What's taking too much time, " +
        "confusing your team, or not working?"
      );

  // --- Fields -------------------------------------------------------------
  form.addTextItem()
      .setTitle('Name')
      .setRequired(true);

  // Email validation: rejects anything that isn't a valid address, so you
  // don't lose an inquiry to a typo you can never reply to.
  var email = form.addTextItem()
      .setTitle('Email')
      .setRequired(true);
  email.setValidation(
    FormApp.createTextValidation()
      .setHelpText('Please enter a valid email address so I can reply.')
      .requireTextIsEmail()
      .build()
  );

  form.addTextItem()
      .setTitle('Organization or website')
      .setHelpText('Optional.')
      .setRequired(false);

  form.addParagraphTextItem()
      .setTitle('What would you like help with?')
      .setHelpText(
        'Rough is fine. What is happening now, and what would a good ' +
        'outcome look like?'
      )
      .setRequired(true);

  // This is the only reliable free way to learn where inquiries come from:
  // UTM parameters do not survive into an embedded form, and a cross-origin
  // iframe cannot report submissions back to your analytics.
  form.addTextItem()
      .setTitle('How did you hear about this?')
      .setHelpText('Optional.')
      .setRequired(false);

  // --- Settings -----------------------------------------------------------
  // No sign-in required: collecting verified emails would force responders
  // to have a Google account and log in, which loses real inquiries.
  form.setCollectEmail(false);
  form.setRequireLogin(false);          // no-op on personal accounts; explicit anyway
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(false);
  form.setPublishingSummary(false);     // responders must not see other responses
  form.setProgressBar(false);
  form.setShowLinkToRespondAgain(false);

  form.setConfirmationMessage(
    "Thanks for reaching out. I'll review your message and follow up by email."
  );

  // --- Private response spreadsheet ---------------------------------------
  var ss = SpreadsheetApp.create('Soft Science Studio — Inquiries');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // --- Output -------------------------------------------------------------
  var embedUrl = form.getPublishedUrl().replace('/viewform', '/viewform?embedded=true');

  Logger.log('=======================================================');
  Logger.log('PASTE THESE INTO contact.html');
  Logger.log('');
  Logger.log('FORM_EMBED_URL_PENDING  ->  ' + embedUrl);
  Logger.log('FORM_SHARE_URL_PENDING  ->  ' + form.getPublishedUrl());
  Logger.log('');
  Logger.log('Responses spreadsheet (keep private): ' + ss.getUrl());
  Logger.log('Edit the form here: ' + form.getEditUrl());
  Logger.log('=======================================================');
  Logger.log('STILL TO DO BY HAND:');
  Logger.log('1. In the RESPONSES SPREADSHEET: Tools > Notification settings');
  Logger.log('   > Notify me immediately when a form is submitted.');
  Logger.log('   (Apps Script cannot enable this; it is a per-user setting.)');
  Logger.log('2. In the FORM editor: theme (paint palette icon) > pick the');
  Logger.log('   closest blue. Exact ' + BRAND.cobalt + ' is not settable —');
  Logger.log('   Forms has no hex input. For real brand presence, upload a');
  Logger.log('   header image made in your own colors instead.');
  Logger.log('3. Submit one test response while signed OUT (private window)');
  Logger.log('   and confirm it lands in the sheet and emails you.');
  Logger.log('=======================================================');
}

/**
 * Optional: adds the follow-up tracking columns to the right of the form's
 * own response columns, so the same sheet doubles as a lightweight pipeline
 * tracker without needing a CRM.
 *
 * Run this AFTER at least one response exists, so the header row is present.
 * Open the responses spreadsheet, then Extensions > Apps Script, paste, run.
 *
 * Caution: do not sort or delete rows in the responses tab afterwards —
 * that is where hand-kept columns drift out of alignment with responses.
 */
function addTrackerColumns() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var lastCol = sheet.getLastColumn();
  var headers = [
    'Status',          // New / Replied / Call booked / Proposal sent / Won / Lost / Not a fit
    'Next action',
    'Next action date',
    'Proposal value',
    'Close date',
    'Notes'
  ];
  sheet.getRange(1, lastCol + 1, 1, headers.length)
       .setValues([headers])
       .setFontWeight('bold');
  sheet.setFrozenRows(1);
  Logger.log('Added ' + headers.length + ' tracker columns after column ' + lastCol + '.');
}
