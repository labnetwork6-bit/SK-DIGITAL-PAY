// SK DIGITAL PAY BD — Firebase reviews + WhatsApp order handling
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, query, where, orderBy, limit,
  getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBxoaBitSHCpzzcxwQ_ZWpGeKVAFQTeGE",
  authDomain: "sk-digital-pay.firebaseapp.com",
  projectId: "sk-digital-pay",
  storageBucket: "sk-digital-pay.firebasestorage.app",
  messagingSenderId: "134362335828",
  appId: "1:134362335828:web:982dd860d40ae1a348bbc1",
  measurementId: "G-L0BEGMFHMP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  whatsappButton.href = whatsappUrl(
    "Assalamu Alaikum, I want to know more about SK DIGITAL PAY BD services."
  );
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

// ------------------------------
// Customer review submission
// ------------------------------
const reviewForm = document.getElementById("reviewForm");
const reviewMessage = document.getElementById("reviewMessage");
const reviewSubmit = document.getElementById("reviewSubmit");
const reviewList = document.getElementById("reviewList");

function showReviewMessage(message, type = "info") {
  if (!reviewMessage) return;
  reviewMessage.textContent = message;
  reviewMessage.className = `review-message ${type}`;
}

if (reviewForm) {
  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("reviewName")?.value.trim();
    const rating = Number(document.querySelector('input[name="rating"]:checked')?.value);
    const comment = document.getElementById("reviewComment")?.value.trim();

    if (!name || !Number.isInteger(rating) || rating < 1 || rating > 5 || !comment) {
      showReviewMessage("Please enter your name, select a star rating and write a review.", "error");
      return;
    }

    if (name.length > 60 || comment.length > 1000) {
      showReviewMessage("Name must be under 60 characters and review under 1,000 characters.", "error");
      return;
    }

    if (reviewSubmit) {
      reviewSubmit.disabled = true;
      reviewSubmit.textContent = "Submitting...";
    }

    try {
      await addDoc(collection(db, "reviews"), {
        name,
        rating,
        comment,
        status: "pending",
        createdAt: serverTimestamp()
      });

      reviewForm.reset();
      showReviewMessage("Thank you! Your review has been submitted and will appear after approval.", "success");
    } catch (error) {
      console.error("Review submission failed:", error);
      showReviewMessage("Sorry, your review could not be submitted. Please try again.", "error");
    } finally {
      if (reviewSubmit) {
        reviewSubmit.disabled = false;
        reviewSubmit.textContent = "Submit Review";
      }
    }
  });
}

// Show only approved reviews to website visitors.
async function loadApprovedReviews() {
  if (!reviewList) return;

  try {
    const approvedQuery = query(
      collection(db, "reviews"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
      limit(12)
    );

    const snapshot = await getDocs(approvedQuery);
    reviewList.replaceChildren();

    if (snapshot.empty) {
      const empty = document.createElement("p");
      empty.className = "review-empty";
      empty.textContent = "No published reviews yet. Be the first to share your experience!";
      reviewList.appendChild(empty);
      return;
    }

    snapshot.forEach((reviewDoc) => {
      const review = reviewDoc.data();
      const card = document.createElement("article");
      card.className = "customer-review";

      const top = document.createElement("div");
      top.className = "customer-review-top";

      const customer = document.createElement("strong");
      customer.textContent = review.name || "Customer";

      const stars = document.createElement("span");
      stars.className = "review-stars";
      stars.setAttribute("aria-label", `${review.rating || 0} out of 5 stars`);
      stars.textContent = "★".repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)));

      const comment = document.createElement("p");
      comment.textContent = review.comment || "";

      top.append(customer, stars);
      card.append(top, comment);
      reviewList.appendChild(card);
    });
  } catch (error) {
    console.error("Could not load reviews:", error);
    reviewList.textContent = "Reviews are temporarily unavailable.";
  }
}

loadApprovedReviews();
