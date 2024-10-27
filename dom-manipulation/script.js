let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

const API_URL = "https://jsonplaceholder.typicode.com/posts";

function showRandomQuote() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === "all" 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length > 0) {
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        document.getElementById("quoteDisplay").textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
        sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
    } else {
        document.getElementById("quoteDisplay").textContent = "No quotes available for this category.";
    }
}

function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        postQuoteToServer(newQuote);
        document.getElementById("quoteDisplay").textContent = "New quote added!";
        populateCategories();
    } else {
        alert("Please enter both a quote and a category.");
    }

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
}

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = ["all", ...new Set(quotes.map(quote => quote.category))];

    categoryFilter.innerHTML = categories.map(category => 
        `<option value="${category}">${category}</option>`).join("");

    const lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";
    categoryFilter.value = lastSelectedCategory;
}

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);
    showRandomQuote();
}

function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "quotes.json";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Network response was not ok");
        const serverQuotes = await response.json();
        const formattedQuotes = serverQuotes.map(quote => ({
            text: quote.title,
            category: "Server"
        }));

        resolveConflicts(formattedQuotes);
    } catch (error) {
        console.error("Failed to fetch quotes:", error);
    }
}

function resolveConflicts(serverQuotes) {
    const localQuoteTexts = new Set(quotes.map(q => q.text));
    serverQuotes.forEach(serverQuote => {
        if (!localQuoteTexts.has(serverQuote.text)) {
            quotes.push(serverQuote);
        } else {
            alert(`Conflict detected for quote: "${serverQuote.text}". Server version will be prioritized.`);
            quotes = quotes.filter(q => q.text !== serverQuote.text);
            quotes.push(serverQuote);
        }
    });

    saveQuotes();
    populateCategories();
}

async function postQuoteToServer(quote) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: quote.text,
                body: quote.category
            })
        });
        if (!response.ok) throw new Error("Failed to post quote to server.");
        console.log("Quote posted successfully:", await response.json());
    } catch (error) {
        console.error("Error posting quote:", error);
    }
}

setInterval(fetchQuotesFromServer, 30000);

document.addEventListener("DOMContentLoaded", () => {
    const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
    if (lastViewedQuote) {
        document.getElementById("quoteDisplay").textContent = `"${lastViewedQuote.text}" - ${lastViewedQuote.category}`;
    }
    populateCategories();
    filterQuotes();
});

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
