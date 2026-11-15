// Replace this number with your WhatsApp number in international format.
// Example for Bangladesh: 8801XXXXXXXXX (no + sign or spaces).
const WHATSAPP_NUMBER = "8801775099284";

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

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

const orderMessage = encodeURIComponent(
  "Assalamu Alaikum, I want to know more about SK DIGITAL PAY BD services."
);
const whatsappButton = document.getElementById("whatsappButton");
whatsappButton.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${orderMessage}`;

document.getElementById("year").textContent = new Date().getFullYear();
