// Load a book from disk
function loadBook(filename, displayName) {
  let currentBook = '';
  let url = 'books/' + filename;

  // reset The UI on book select/load
  document.getElementById('fileName').innerHTML = displayName;
  document.getElementById('searchstat').innerHTML = '';
  document.getElementById('keyword').value = '';

  // Create a server request to load a book
  // making the request
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      currentBook = xhr.responseText;

      getDocStats(currentBook);

      // Add line breaks to the txt response return
      // formats the document to appear as a paragraphs with breaks.
      currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

      document.getElementById('fileContent').innerHTML = currentBook;

      let elemnt = document.getElementById('fileContent');
      elemnt.scrollTop = 0;
    }
  };

}

// Function for the book statistics
function getDocStats(fileContent) {

  let docLength = document.getElementById('docLength');
  let wordCount = document.getElementById('wordCount');
  let charCount = document.getElementById('charCount');

  // convert all words to lower case
  let text = fileContent.toLowerCase();
  // matches words using regex - space at end or beginning.
  let wordArray = text.match(/\b\S+\b/g);
  // store the count of words
  let wordDictionary = {};

  // count the words in the array wordArray
  for (let word in wordArray) {
    let wordValue = wordArray[word];
    if (wordDictionary[wordValue] > 0) {
      wordDictionary[wordValue] += 1;
    }
    else {
      wordDictionary[wordValue] = 1;
    }
  }

  // sort the array
  let wordList = sortProperties(wordDictionary);

  // return the top 5 words
  let top5Words = wordList.slice(0, 6);
  let least5Words = wordList.slice(-6, wordList.length);

  // write the values to the page
  ULTemplate(top5Words, document.getElementById('mostUsed'));
  ULTemplate(least5Words, document.getElementById('leastUsed'));

}

function ULTemplate(items, element) {
  let rowTemplate = document.getElementById('template-ul-items');
  let templateHTML = rowTemplate.innerHTML;
  let resultsHTML = '';

  for (i = 0; i < items.length - 1; i++) {
    resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + "time(s)");
  }

  element.innerHTML = resultsHTML;
}


function sortProperties(obj) {

  // convert object into an array
  let rtnArray = Object.defineProperties(obj);

  // Sort the Array
  rtnArray.sort(function (first, second) {
    return second[1] - first[1];
  });

  return rtnArray;

}

// Remove stop words
function getStopWords(){
  return ['a','able','about','across','after','all','almost','also','am','among',]
}