const booksList = document.querySelector("#booksList");
const booksForm = document.querySelector("#searchForm");
const booksFilterSelect = booksForm.querySelector("#filterBooks");
const sortBooksSelect = booksForm.querySelector("#sortBooks");
const booksInput = booksForm.querySelector("#searchInput");
const booksFromPeriod = booksForm.querySelector("#booksFromPeriod");
const booksToPeriod = booksForm.querySelector("#booksToPeriod");
const bookTemplate = document.querySelector("#bookTemplate").content;


// functions

const updateInputText = debounce(text => {
    filterBooks(text,booksFilterSelect.value,sortBooksSelect.value,booksFromPeriod.value,booksToPeriod.value);
})

function renderBooks(books, list, regEx) {
    // create a new fragment for all the book items
    const booksFragment = new DocumentFragment();
    // clear the list
    list.innerHTML = "";
    // iterate through books and render them to the screen
    books.forEach(book => {
        const { author, country, imageLink, language, link, pages, title, year } = book;
        const bookTemplateClone = bookTemplate.cloneNode(true);

        bookTemplateClone.querySelector("#bookImg").src = imageLink;
        if (regEx && regEx?.source !== "(?:)") {
            bookTemplateClone.querySelector("#bookTitle").innerHTML = title.replace(regEx,`<mark>${regEx.source.toLowerCase()}</mark>`);
        }else{
            bookTemplateClone.querySelector("#bookTitle").textContent = title;
        }
        bookTemplateClone.querySelector("#bookAuthor").textContent = author;
        bookTemplateClone.querySelector("#bookYear").textContent = year;
        bookTemplateClone.querySelector("#bookPages").textContent = pages;
        bookTemplateClone.querySelector("#bookLang").textContent = language;
        bookTemplateClone.querySelector("#bookWiki").href = link;

        // add the template to the fragment
        booksFragment.appendChild(bookTemplateClone);
    })
    list.appendChild(booksFragment);
}

function filterBooks(searchQuery,author,sortType,fromYear,toYear) {
    const searchQueryRegex = new RegExp(searchQuery, "gi");
    const filteredBooks = books.filter(book => book.title.match(searchQueryRegex) && (author === "" || book.author === author) && (fromYear === "" || book.year >= fromYear) && (toYear === "" || book.year <= toYear));
    const sortedBooks = sortBooks(filteredBooks,sortType);
    renderBooks(sortedBooks, booksList, searchQueryRegex);
}

function sortBooks(books,sortType){
    if(!sortType) return books;
    const copiedBooks = [...books];
    if(sortType === "oldest-latest"){
        return copiedBooks.sort((accumulator,current) => accumulator.year - current.year);
    }
    if(sortType === "latest-oldest"){
        return copiedBooks.sort((accumulator,current) => current.year - accumulator.year);
    }
    if(sortType === "a-z"){
        return copiedBooks.sort((accumulator,current) => accumulator.title > current.title);
    }
    if(sortType === "z-a"){
        return copiedBooks.sort((accumulator,current) => accumulator.title < current.title);
    }
    if(sortType === "pages (ascending)"){
        return copiedBooks.sort((accumulator,current) => accumulator.pages - current.pages);
    }
    if(sortType === "pages (descending)"){
        return copiedBooks.sort((accumulator,current) => current.pages - accumulator.pages);
    }
}

function getAuthors(array){
    const uniqueAuthors = new Set();
    array.forEach(item => {
        if(item.author !== "Unknown") uniqueAuthors.add(item.author);
    });
    return uniqueAuthors;
}

function renderAuthors(authors,list){
    const newAuthorsFragment = new DocumentFragment();
    authors.forEach(author => {
        const newOption = document.createElement("option");
        newOption.value = author;
        newOption.textContent = author;
        newAuthorsFragment.appendChild(newOption);
    })
    list.appendChild(newAuthorsFragment);
}

function debounce(cb, delay = 1000) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            cb(...args);
        }, delay)
    }
}

// event listener
booksInput.addEventListener("input", e => {
    updateInputText(e.target.value);
});

booksForm.addEventListener("submit", evt => {
    evt.preventDefault();
    filterBooks(booksInput.value,booksFilterSelect.value,sortBooksSelect.value,booksFromPeriod.value,booksToPeriod.value);
});

renderAuthors(getAuthors(books),booksFilterSelect);
renderBooks(books, booksList);