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
  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
  
