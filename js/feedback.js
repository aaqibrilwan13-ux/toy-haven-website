/* =========================================================
   TOY HAVEN — feedback.js
   Validates and stores the feedback form, and powers the
   FAQ accordion.
   ========================================================= */

function showFeedbackFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(inputId + 'Error');
  if (input) input.classList.add('invalid');
  if (error) {
    error.textContent = message;
    error.classList.add('show');
  }
}

function clearFeedbackFieldError(inputId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(inputId + 'Error');
  if (input) input.classList.remove('invalid');
  if (error) {
    error.textContent = '';
    error.classList.remove('show');
  }
}

function validateFeedbackForm() {
  let isValid = true;
  ['feedbackName', 'feedbackEmail', 'feedbackMessage'].forEach(clearFeedbackFieldError);

  const name = document.getElementById('feedbackName').value;
  const email = document.getElementById('feedbackEmail').value;
  const message = document.getElementById('feedbackMessage').value;

  if (!validateNotEmpty(name)) {
    showFeedbackFieldError('feedbackName', 'Please enter your name.');
    isValid = false;
  }

  if (!validateNotEmpty(email)) {
    showFeedbackFieldError('feedbackEmail', 'Please enter your email address.');
    isValid = false;
  } else if (!validateEmail(email)) {
    showFeedbackFieldError('feedbackEmail', 'Please enter a valid email address.');
    isValid = false;
  }

  if (!validateNotEmpty(message)) {
    showFeedbackFieldError('feedbackMessage', 'Please enter a message.');
    isValid = false;
  } else if (message.trim().length < 10) {
    showFeedbackFieldError('feedbackMessage', 'Your message should be at least 10 characters.');
    isValid = false;
  }

  return isValid;
}

function initFeedbackForm() {
  const form = document.getElementById('feedbackForm');
  if (!form) return;
  const confirmation = document.getElementById('feedbackConfirmation');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateFeedbackForm()) return;

    const entry = {
      name: document.getElementById('feedbackName').value.trim(),
      email: document.getElementById('feedbackEmail').value.trim(),
      message: document.getElementById('feedbackMessage').value.trim(),
      date: new Date().toISOString()
    };

    const feedbackList = readStorage(STORAGE_KEYS.FEEDBACK, []);
    feedbackList.push(entry);
    writeStorage(STORAGE_KEYS.FEEDBACK, feedbackList);

    form.reset();
    if (confirmation) {
      confirmation.textContent = 'Thanks for reaching out! Our team will get back to you soon.';
      confirmation.classList.add('show');
    }
    showToast('Feedback submitted', 'success');
  });
}

/* ---------- FAQ ACCORDION ---------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      item.classList.toggle('open');
      question.setAttribute('aria-expanded', (!isOpen).toString());
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initFeedbackForm();
  initFaqAccordion();
});
