// SK DIGITAL PAY BD — shared WhatsApp order handling
// Bangladesh international format: country code + number, without + or spaces.
const WHATSAPP_NUMBER = "8801775099284";

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "×" : "☰";
  });
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const whatsappButton = document.getElementById("whatsappButton");
if (whatsappButton) {
  whatsappButton.href = whatsappUrl("Assalamu Alaikum, I want to know more about SK DIGITAL PAY BD services.");
}

document.querySelectorAll(".service-order").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const service = button.dataset.service || "SK DIGITAL PAY BD service";
    const message = `Assalamu Alaikum, I want to order ${service}. Please share the current price and details.`;
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  });
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
