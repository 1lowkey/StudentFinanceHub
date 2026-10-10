(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const name = document.getElementById("contactName");
  const email = document.getElementById("contactEmail");
  const subject = document.getElementById("contactSubject");
  const message = document.getElementById("contactMessage");
  const success = document.getElementById("contactSuccess");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, messageText) {
    const error = document.getElementById(input.id + "Error");
    input.classList.toggle("field-error", Boolean(messageText));
    if (error) {
      error.textContent = messageText || "";
      error.classList.toggle("show", Boolean(messageText));
    }
  }

  function validate() {
    let valid = true;

    if (!name.value.trim()) {
      setError(name, "Please enter your name.");
      valid = false;
    } else {
      setError(name, "");
    }

    const emailValue = email.value.trim();
    if (!emailValue) {
      setError(email, "Please enter your email address.");
      valid = false;
    } else if (!emailPattern.test(emailValue)) {
      setError(email, "Enter a valid email address, e.g. you@example.com.");
      valid = false;
    } else {
      setError(email, "");
    }

    if (!subject.value.trim()) {
      setError(subject, "Please enter a subject.");
      valid = false;
    } else {
      setError(subject, "");
    }

    if (message.value.trim().length < 10) {
      setError(message, "Please write at least 10 characters.");
      valid = false;
    } else {
      setError(message, "");
    }

    return valid;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    success.classList.remove("show");

    if (validate()) {
      const firstName = name.value.trim().split(" ")[0];
      success.textContent =
        "Thank you, " + firstName + "! Your message passed validation. " +
        "This is a front-end demo — no message was actually sent or stored.";
      success.classList.add("show");
      form.reset();
      if (form.scrollIntoView) form.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      const firstError = form.querySelector(".field-error");
      if (firstError) firstError.focus();
    }
  });

  [name, email, subject, message].forEach((field) => {
    field.addEventListener("input", () => {
      if (field.classList.contains("field-error")) setError(field, "");
    });
  });
})();
