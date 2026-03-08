/*
 * ============================================================
 *  Hochzeit Berit & Jonas — Script
 * ============================================================
 *
 *  GOOGLE SHEETS SETUP — Anleitung fuer Jonas:
 *  -------------------------------------------
 *  1. Erstelle ein neues Google Sheet mit diesen Spalten in Zeile 1:
 *     Timestamp | Vorname | Nachname | Zusage | Anzahl | Gaestenamen | Nachricht
 *
 *  2. Gehe zu Extensions > Apps Script
 *
 *  3. Loesche den vorhandenen Code und fuege Folgendes ein:
 *
 *     function doPost(e) {
 *       var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *       var data = JSON.parse(e.postData.contents);
 *       sheet.appendRow([
 *         new Date(),
 *         data.vorname,
 *         data.nachname,
 *         data.attendance,
 *         data.guests,
 *         data.guestNames,
 *         data.message
 *       ]);
 *       return ContentService
 *         .createTextOutput(JSON.stringify({ result: "success" }))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 *
 *  4. Klicke auf "Deploy" > "New deployment"
 *     - Type: "Web app"
 *     - Execute as: "Me"
 *     - Who has access: "Anyone"
 *
 *  5. Kopiere die Web-App-URL und ersetze GOOGLE_SCRIPT_URL unten.
 *
 * ============================================================
 */

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyZQwjsI7uBA2y5hbTySBeeQdDGNGvnd57DjunzdUzosDFwwPx9f3cGbvUQrq4VAEh2/exec';

/* ============================================================
 *  Translations (DE / PT)
 * ============================================================ */
const translations = {
  heroPre: {
    de: 'Einladung zur kirchlichen Trauung',
    pt: 'Convite para o casamento na igreja',
  },
  heroTitle: {
    de: 'Berit & Jonas',
    pt: 'Berit & Jonas',
  },
  heroDate: {
    de: '13. Juni 2026 \u00b7 Berlin',
    pt: '13 de Junho de 2026 \u00b7 Berlim',
  },
  invitationText: {
    de: 'Zu unserer kirchlichen Trauung laden wir Euch ganz herzlich ein! Im Anschluss m\u00f6chten wir den Sommertag gemeinsam mit Euch genie\u00dfen \u2013 bei gutem Essen, erfrischenden Getr\u00e4nken und vielen sch\u00f6nen Gespr\u00e4chen in entspannter Atmosph\u00e4re.',
    pt: 'Convidamos voc\u00eas com muito carinho para o nosso casamento na igreja! Depois da cerim\u00f4nia, gostar\u00edamos de aproveitar o dia de ver\u00e3o junto com voc\u00eas \u2013 com boa comida, bebidas refrescantes e muitas conversas agrad\u00e1veis em um ambiente descontra\u00eddo.',
  },
  scheduleTitle: {
    de: 'Ablauf',
    pt: 'Programa',
  },
  scheduleItem0Title: {
    de: 'Treffen',
    pt: 'Encontro',
  },
  scheduleItem1Title: {
    de: 'Gottesdienst',
    pt: 'Cerim\u00f4nia',
  },
  scheduleItem2Title: {
    de: 'Ansto\u00dfen',
    pt: 'Brinde',
  },
  scheduleItem3Title: {
    de: 'Kaffee und Kuchen',
    pt: 'Caf\u00e9 e bolo',
  },
  scheduleItem4Title: {
    de: 'Abendessen mit Buffet',
    pt: 'Jantar com buffet',
  },
  scheduleItem5Title: {
    de: 'Gem\u00fctliches Beisammensein',
    pt: 'Momento de conviv\u00eancia',
  },
  dresscodeText: {
    de: 'Dresscode: sommerlich entspannt',
    pt: 'Dresscode: ver\u00e3o descontra\u00eddo',
  },
  dresscodeHint: {
    de: 'Je nach Wetter wird es m\u00f6glich sein, nach drau\u00dfen in den Garten zu gehen.',
    pt: 'Dependendo do clima, ser\u00e1 poss\u00edvel ir para o jardim ao ar livre.',
  },
  geschenkeTitle: {
    de: 'Geschenke',
    pt: 'Presentes',
  },
  geschenkeText: {
    de: 'Wir w\u00fcnschen uns keine Geschenke. Dass Ihr den Weg auf Euch nehmt, um mit uns zu feiern, ist Geschenk genug.',
    pt: 'N\u00e3o desejamos presentes. Que voc\u00eas fa\u00e7am o caminho para celebrar conosco j\u00e1 \u00e9 presente suficiente.',
  },
  locationTitle: {
    de: 'Ort',
    pt: 'Local',
  },
  locationExtra: {
    de: 'Die anschlie\u00dfende Feier findet ebenfalls in der Kirche statt.',
    pt: 'A festa tamb\u00e9m acontecer\u00e1 na igreja.',
  },
  locationTransit: {
    de: 'Gut erreichbar mit U-Bahn und Bus \u2014 Haltestelle Leopoldplatz',
    pt: 'F\u00e1cil acesso por metr\u00f4 e \u00f4nibus \u2014 esta\u00e7\u00e3o Leopoldplatz',
  },
  rsvpTitle: {
    de: 'Zusage',
    pt: 'Confirma\u00e7\u00e3o',
  },
  rsvpDeadline: {
    de: 'Bitte meldet Euch bis zum 30. April 2026 an',
    pt: 'Por favor, confirmem at\u00e9 30 de abril de 2026',
  },
  rsvpVornameLabel: {
    de: 'Vorname',
    pt: 'Nome',
  },
  rsvpVornamePlaceholder: {
    de: 'Vorname',
    pt: 'Nome',
  },
  rsvpNachnameLabel: {
    de: 'Nachname',
    pt: 'Sobrenome',
  },
  rsvpNachnamePlaceholder: {
    de: 'Nachname',
    pt: 'Sobrenome',
  },
  rsvpAttendanceLabel: {
    de: 'Wer kommt?',
    pt: 'Quem vem?',
  },
  rsvpYes: {
    de: 'Dabei',
    pt: 'Presente',
  },
  rsvpNo: {
    de: 'Leider nicht dabei',
    pt: 'Infelizmente n\u00e3o',
  },
  rsvpGuestsCountLabel: {
    de: 'Wie viele Personen kommen insgesamt?',
    pt: 'Quantas pessoas v\u00eam no total?',
  },
  rsvpGuestsHint: {
    de: 'Dich mitgez\u00e4hlt',
    pt: 'Incluindo voc\u00ea',
  },
  rsvpGuestNamesLabel: {
    de: 'Namen eurer Begleitung',
    pt: 'Nomes dos acompanhantes',
  },
  rsvpGuestPlaceholder: {
    de: 'Name',
    pt: 'Nome',
  },
  rsvpMessageLabel: {
    de: 'Nachricht an uns',
    pt: 'Mensagem para n\u00f3s',
  },
  rsvpMessagePlaceholder: {
    de: 'Optional: Schreibt uns eine Nachricht...',
    pt: 'Opcional: Escreva uma mensagem...',
  },
  rsvpSubmit: {
    de: 'Absenden',
    pt: 'Enviar',
  },
  rsvpSuccessMessage: {
    de: 'Vielen Dank! Wir haben eure Antwort erhalten.',
    pt: 'Muito obrigado! Recebemos a sua resposta.',
  },
  rsvpErrorMessage: {
    de: 'Etwas ist schiefgelaufen. Bitte versucht es erneut.',
    pt: 'Algo deu errado. Por favor, tente novamente.',
  },
  footerText: {
    de: 'Wir freuen uns auf Euch! \u2665 Berit & Jonas',
    pt: 'Estamos ansiosos para v\u00ea-los! \u2665 Berit & Jonas',
  }
};

/* ============================================================
 *  Language Toggle
 * ============================================================ */
let currentLang = 'de';
const langOrder = ['de', 'pt'];
const langLabels = {
  de: '\ud83c\udde9\ud83c\uddea DE',
  pt: '\ud83c\udde7\ud83c\uddf7 PT'
};

const langToggle = document.getElementById('lang-toggle');

langToggle.addEventListener('click', () => {
  const currentIndex = langOrder.indexOf(currentLang);
  currentLang = langOrder[(currentIndex + 1) % langOrder.length];
  // Show the NEXT language on the button
  const nextIndex = (langOrder.indexOf(currentLang) + 1) % langOrder.length;
  langToggle.textContent = langLabels[langOrder[nextIndex]];
  applyTranslations();
});

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] && translations[key][currentLang]) {
      el.textContent = translations[key][currentLang];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key] && translations[key][currentLang]) {
      el.placeholder = translations[key][currentLang];
    }
  });

  // Update dynamic guest name placeholders
  document.querySelectorAll('#guest-names-container input').forEach(input => {
    input.placeholder = translations.rsvpGuestPlaceholder[currentLang];
  });
}

/* ============================================================
 *  RSVP Form — Guest count stepper + dynamic names
 * ============================================================ */
const rsvpForm = document.getElementById('rsvp-form');
const guestsCountGroup = document.getElementById('guests-count-group');
const guestNamesGroup = document.getElementById('guest-names-group');
const guestNamesContainer = document.getElementById('guest-names-container');
const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
const successMessage = document.getElementById('rsvp-success');
const errorMessage = document.getElementById('rsvp-error');
const stepperMinus = document.getElementById('stepper-minus');
const stepperPlus = document.getElementById('stepper-plus');
const stepperValue = document.getElementById('stepper-value');

let guestCount = 1;

// Show/hide guests section based on attendance
attendanceRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    const attending = e.target.value === 'yes';
    guestsCountGroup.style.display = attending ? 'block' : 'none';
    if (!attending) {
      guestNamesGroup.style.display = 'none';
      guestCount = 1;
      stepperValue.textContent = '1';
      guestNamesContainer.innerHTML = '';
    }
    validateForm();
  });
});

// Stepper controls
stepperMinus.addEventListener('click', () => {
  if (guestCount > 1) {
    guestCount--;
    stepperValue.textContent = guestCount;
    renderGuestNameFields();
  }
});

stepperPlus.addEventListener('click', () => {
  if (guestCount < 10) {
    guestCount++;
    stepperValue.textContent = guestCount;
    renderGuestNameFields();
  }
});

function renderGuestNameFields() {
  // Show name fields only if more than 1 guest
  if (guestCount <= 1) {
    guestNamesGroup.style.display = 'none';
    guestNamesContainer.innerHTML = '';
    validateForm();
    return;
  }

  guestNamesGroup.style.display = 'block';

  // Keep existing values
  const existingValues = [];
  guestNamesContainer.querySelectorAll('input').forEach(input => {
    existingValues.push(input.value);
  });

  guestNamesContainer.innerHTML = '';

  // Create fields for additional guests (guest 2, 3, etc.)
  const additionalCount = guestCount - 1;
  for (let i = 0; i < additionalCount; i++) {
    const row = document.createElement('div');
    row.className = 'guest-name-row';

    const num = document.createElement('span');
    num.textContent = (i + 2) + '.';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = translations.rsvpGuestPlaceholder[currentLang];
    input.name = 'guest_' + (i + 1);
    if (existingValues[i]) {
      input.value = existingValues[i];
    }

    row.appendChild(num);
    row.appendChild(input);
    guestNamesContainer.appendChild(row);
  }
  validateForm();
}

// Form validation — enable submit only when required fields are filled
const submitBtn = rsvpForm.querySelector('.btn-submit');
submitBtn.disabled = true;

function validateForm() {
  const vorname = document.getElementById('rsvp-vorname').value.trim();
  const nachname = document.getElementById('rsvp-nachname').value.trim();
  const attendanceChecked = document.querySelector('input[name="attendance"]:checked');

  if (!vorname || !nachname || !attendanceChecked) {
    submitBtn.disabled = true;
    return;
  }

  // If attending with extra guests, all guest names must be filled
  if (attendanceChecked.value === 'yes' && guestCount > 1) {
    const guestInputs = guestNamesContainer.querySelectorAll('input');
    for (const input of guestInputs) {
      if (!input.value.trim()) {
        submitBtn.disabled = true;
        return;
      }
    }
  }

  submitBtn.disabled = false;
}

// Listen for input changes on main fields
document.getElementById('rsvp-vorname').addEventListener('input', validateForm);
document.getElementById('rsvp-nachname').addEventListener('input', validateForm);
attendanceRadios.forEach(radio => radio.addEventListener('change', validateForm));

// Also validate when guest name fields change (delegated)
guestNamesContainer.addEventListener('input', validateForm);

// Form submission
rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.textContent = '...';

  // Collect guest names
  const guestNameInputs = guestNamesContainer.querySelectorAll('input');
  const guestNamesList = [];
  guestNameInputs.forEach(input => {
    if (input.value.trim()) {
      guestNamesList.push(input.value.trim());
    }
  });

  const formData = {
    vorname: document.getElementById('rsvp-vorname').value.trim(),
    nachname: document.getElementById('rsvp-nachname').value.trim(),
    attendance: document.querySelector('input[name="attendance"]:checked').value,
    guests: guestCount,
    guestNames: guestNamesList.join(', '),
    message: document.getElementById('rsvp-message').value.trim()
  };

  if (formData.attendance === 'no') {
    formData.guests = 0;
    formData.guestNames = '';
  }

  try {
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      console.log('RSVP Data (Demo):', formData);
    } else {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    }

    rsvpForm.style.display = 'none';
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
  } catch (err) {
    console.error('RSVP Error:', err);
    errorMessage.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = translations.rsvpSubmit[currentLang];
  }
});

/* ============================================================
 *  Scroll Fade-in Animations
 * ============================================================ */
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

fadeElements.forEach(el => observer.observe(el));
