const quotes = [
    { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
  ];

  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
  }

  function createAddQuoteForm() {
    const formContainer = document.createElement("div");
  
    const inputQuoteText = document.createElement("input");
    inputQuoteText.id = "newQuoteText";
    inputQuoteText.type = "text";
    inputQuoteText.placeholder = "Enter a new quote";
  
    const inputQuoteCategory = document.createElement("input");
    inputQuoteCategory.id = "newQuoteCategory";
    inputQuoteCategory.type = "text";
    inputQuoteCategory.placeholder = "Enter quote category";
  
    const addQuoteButton = document.createElement("button");
    addQuoteButton.textContent = "Add Quote";
    addQuoteButton.addEventListener("click", addQuote);
  
    formContainer.appendChild(inputQuoteText);
    formContainer.appendChild(inputQuoteCategory);
    formContainer.appendChild(addQuoteButton);
    
    document.body.appendChild(formContainer);
  }

  function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (quoteText && quoteCategory) {
      quotes.push({ text: quoteText, category: quoteCategory });
      document.getElementById("quoteDisplay").innerHTML = "New quote added!";
    } else {
      alert("Please enter both a quote and a category.");
    }

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  document.addEventListener("DOMContentLoaded", () => {
    createAddQuoteForm();
  });
  
