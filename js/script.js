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
    kr: '\uad50\ud68c \uacb0\ud63c\uc2dd \ucd08\ub300\uc7a5'
  },
  heroTitle: {
    de: 'Berit & Jonas',
    pt: 'Berit & Jonas',
    kr: 'Berit & Jonas'
  },
  heroDate: {
    de: '13. Juni 2026 \u00b7 Berlin',
    pt: '13 de Junho de 2026 \u00b7 Berlim',
    kr: '2026\ub144 6\uc6d4 13\uc77c \u00b7 \ubca0\ub97c\ub9b0'
  },
  invitationText: {
    de: 'Zu unserer kirchlichen Trauung laden wir Euch ganz herzlich ein! Im Anschluss m\u00f6chten wir den Sommertag gemeinsam mit Euch genie\u00dfen \u2013 bei gutem Essen, erfrischenden Getr\u00e4nken und vielen sch\u00f6nen Gespr\u00e4chen in entspannter Atmosph\u00e4re.',
    pt: 'Convidamos voc\u00eas com muito carinho para o nosso casamento na igreja! Depois da cerim\u00f4nia, gostar\u00edamos de aproveitar o dia de ver\u00e3o junto com voc\u00eas \u2013 com boa comida, bebidas refrescantes e muitas conversas agrad\u00e1veis em um ambiente descontra\u00eddo.',
    kr: '\uc800\ud76c \uad50\ud68c \uacb0\ud63c\uc2dd\uc5d0 \uc5ec\ub7ec\ubd84\uc744 \uc9c4\uc2ec\uc73c\ub85c \ucd08\ub300\ud569\ub2c8\ub2e4! \uc608\uc2dd \ud6c4\uc5d0\ub294 \ub9db\uc788\ub294 \uc74c\uc2dd\uacfc \uc2dc\uc6d0\ud55c \uc74c\ub8cc, \uc990\uac70\uc6b4 \ub300\ud654\uc640 \ud568\uaed8 \uc5ec\ub984\ub0a0\uc744 \ud568\uaed8 \uc990\uae30\uace0 \uc2f6\uc2b5\ub2c8\ub2e4.'
  },
  scheduleTitle: {
    de: 'Ablauf',
    pt: 'Programa',
    kr: '\uc77c\uc815'
  },
  scheduleItem1Title: {
    de: 'Gottesdienst',
    pt: 'Cerim\u00f4nia',
    kr: '\uc608\ubc30'
  },
  scheduleItem2Title: {
    de: 'Ansto\u00dfen',
    pt: 'Brinde',
    kr: '\uac74\ubc30'
  },
  scheduleItem3Title: {
    de: 'Kaffee und Kuchen',
    pt: 'Caf\u00e9 e bolo',
    kr: '\ucee4\ud53c\uc640 \ucf00\uc774\ud06c'
  },
  scheduleItem4Title: {
    de: 'Abendessen mit Buffet',
    pt: 'Jantar com buffet',
    kr: '\ubdd4\ud398 \ub9cc\ucc2c'
  },
  scheduleItem5Title: {
    de: 'Gem\u00fctliches Beisammensein',
    pt: 'Momento de conviv\u00eancia',
    kr: '\ud3b8\uc548\ud55c \ud658\ub2f4'
  },
  dresscodeText: {
    de: 'Dresscode: sommerlich entspannt',
    pt: 'Dresscode: ver\u00e3o descontra\u00eddo',
    kr: '\ub4dc\ub808\uc2a4\ucf54\ub4dc: \uc5ec\ub984 \uce90\uc8fc\uc5bc'
  },
  dresscodeHint: {
    de: 'Je nach Wetter wird es m\u00f6glich sein, nach drau\u00dfen in den Garten zu gehen.',
    pt: 'Dependendo do clima, ser\u00e1 poss\u00edvel ir para o jardim ao ar livre.',
    kr: '\ub0a0\uc528\uc5d0 \ub530\ub77c \uc57c\uc678 \uc815\uc6d0\uc73c\ub85c \ub098\uac08 \uc218 \uc788\uc2b5\ub2c8\ub2e4.'
  },
  locationTitle: {
    de: 'Ort',
    pt: 'Local',
    kr: '\uc7a5\uc18c'
  },
  locationExtra: {
    de: 'Die anschlie\u00dfende Feier findet ebenfalls in der Kirche statt.',
    pt: 'A festa tamb\u00e9m acontecer\u00e1 na igreja.',
    kr: '\uc774\uc5b4\uc9c0\ub294 \ucd95\ud558 \ud30c\ud2f0\ub3c4 \uad50\ud68c\uc5d0\uc11c \uc5f4\ub9bd\ub2c8\ub2e4.'
  },
  locationTransit: {
    de: 'Gut erreichbar mit U-Bahn und Bus \u2014 Haltestelle Leopoldplatz',
    pt: 'F\u00e1cil acesso por metr\u00f4 e \u00f4nibus \u2014 esta\u00e7\u00e3o Leopoldplatz',
    kr: '\uc9c0\ud558\ucca0\uacfc \ubc84\uc2a4\ub85c \uc27d\uac8c \uc811\uadfc \uac00\ub2a5 \u2014 Leopoldplatz \uc5ed'
  },
  rsvpTitle: {
    de: 'Zusage',
    pt: 'Confirma\u00e7\u00e3o',
    kr: '\ucc38\uc11d \ud655\uc778'
  },
  rsvpDeadline: {
    de: 'Bitte meldet euch bis zum 31. M\u00e4rz 2026 an',
    pt: 'Por favor, confirmem at\u00e9 31 de mar\u00e7o de 2026',
    kr: '2026\ub144 3\uc6d4 31\uc77c\uae4c\uc9c0 \ud68c\uc2e0\ud574 \uc8fc\uc138\uc694'
  },
  rsvpVornameLabel: {
    de: 'Vorname',
    pt: 'Nome',
    kr: '\uc774\ub984'
  },
  rsvpVornamePlaceholder: {
    de: 'Vorname',
    pt: 'Nome',
    kr: '\uc774\ub984'
  },
  rsvpNachnameLabel: {
    de: 'Nachname',
    pt: 'Sobrenome',
    kr: '\uc131'
  },
  rsvpNachnamePlaceholder: {
    de: 'Nachname',
    pt: 'Sobrenome',
    kr: '\uc131'
  },
  rsvpAttendanceLabel: {
    de: 'Kommt ihr?',
    pt: 'Voc\u00eas v\u00eam?',
    kr: '\ucc38\uc11d\ud558\uc2dc\ub098\uc694?'
  },
  rsvpYes: {
    de: 'Wir kommen gerne!',
    pt: 'Estaremos presentes!',
    kr: '\ub124, \ucc38\uc11d\ud569\ub2c8\ub2e4!'
  },
  rsvpNo: {
    de: 'Leider k\u00f6nnen wir nicht',
    pt: 'Infelizmente n\u00e3o poderemos ir',
    kr: '\uc544\uc27d\uc9c0\ub9cc \ucc38\uc11d\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4'
  },
  rsvpGuestsCountLabel: {
    de: 'Wie viele Personen kommen insgesamt?',
    pt: 'Quantas pessoas v\u00eam no total?',
    kr: '\ucd1d \uba87 \uba85\uc774 \uc624\uc2dc\ub098\uc694?'
  },
  rsvpGuestsHint: {
    de: 'Euch mitgez\u00e4hlt',
    pt: 'Incluindo voc\u00eas',
    kr: '\ubcf8\uc778 \ud3ec\ud568'
  },
  rsvpGuestNamesLabel: {
    de: 'Namen eurer Begleitung',
    pt: 'Nomes dos acompanhantes',
    kr: '\ub3d9\ubc18\uc790 \uc774\ub984'
  },
  rsvpGuestPlaceholder: {
    de: 'Name',
    pt: 'Nome',
    kr: '\uc774\ub984'
  },
  rsvpMessageLabel: {
    de: 'Nachricht an uns',
    pt: 'Mensagem para n\u00f3s',
    kr: '\uba54\uc2dc\uc9c0'
  },
  rsvpMessagePlaceholder: {
    de: 'Optional: Schreibt uns eine Nachricht...',
    pt: 'Opcional: Escreva uma mensagem...',
    kr: '\uc120\ud0dd\uc0ac\ud56d: \uba54\uc2dc\uc9c0\ub97c \ub0a8\uaca8\uc8fc\uc138\uc694...'
  },
  rsvpSubmit: {
    de: 'Absenden',
    pt: 'Enviar',
    kr: '\ubcf4\ub0b4\uae30'
  },
  rsvpSuccessMessage: {
    de: 'Vielen Dank! Wir haben eure Antwort erhalten.',
    pt: 'Muito obrigado! Recebemos a sua resposta.',
    kr: '\uac10\uc0ac\ud569\ub2c8\ub2e4! \ub2f5\ubcc0\uc774 \uc811\uc218\ub418\uc5c8\uc2b5\ub2c8\ub2e4.'
  },
  rsvpErrorMessage: {
    de: 'Etwas ist schiefgelaufen. Bitte versucht es erneut.',
    pt: 'Algo deu errado. Por favor, tente novamente.',
    kr: '\ubb38\uc81c\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4. \ub2e4\uc2dc \uc2dc\ub3c4\ud574 \uc8fc\uc138\uc694.'
  },
  footerText: {
    de: 'Wir freuen uns auf euch! \u2665 Berit & Jonas',
    pt: 'Estamos ansiosos para v\u00ea-los! \u2665 Berit & Jonas',
    kr: '\uc5ec\ub7ec\ubd84\uc744 \ub9cc\ub098\ubf59\uae30\ub97c \uae30\ub300\ud569\ub2c8\ub2e4! \u2665 Berit & Jonas'
  }
};

/* ============================================================
 *  Language Toggle
 * ============================================================ */
let currentLang = 'de';
const langOrder = ['de', 'pt', 'kr'];
const langLabels = {
  de: '\ud83c\udde9\ud83c\uddea DE',
  pt: '\ud83c\udde7\ud83c\uddf7 PT',
  kr: '\ud83c\uddf0\ud83c\uddf7 \ud55c'
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
}

// Form submission
rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = rsvpForm.querySelector('.btn-submit');
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
