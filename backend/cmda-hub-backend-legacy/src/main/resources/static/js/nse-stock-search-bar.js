document.addEventListener("DOMContentLoaded", function () {
  var input = document.getElementById('stock-input');
  var autocompleteList = document.getElementById('stock-list');
  var selectedStock = null; // Variable to store selected stock

  input.addEventListener('input', function() {
      var inputValue = this.value.trim().toLowerCase();
      var stockItems = autocompleteList.getElementsByTagName('li');

      for (var i = 0; i < stockItems.length; i++) {
          var stockName = stockItems[i].getElementsByClassName('stock-name')[0].textContent.toLowerCase();
          var stockSymbol = stockItems[i].getElementsByClassName('stock-symbol')[0].textContent.toLowerCase();
          
          var matchesName = stockName.includes(inputValue);
          var matchesSymbol = stockSymbol.includes(inputValue);

          if (matchesName || matchesSymbol) {
              stockItems[i].style.display = 'block';
          } else {
              stockItems[i].style.display = 'none';
          }
      }

      autocompleteList.style.display = 'block';
  });

  input.addEventListener('focus', function() {
      autocompleteList.style.display = 'block';
  });

  // Handle click on autocomplete list items
  autocompleteList.addEventListener('click', function(event) {
      var clickedItem = event.target.closest('li');
      if (clickedItem) {
          var selectedStockName = clickedItem.querySelector('.stock-name').textContent;
          var selectedStockSymbol = clickedItem.querySelector('.stock-symbol').textContent;

          // Store selected stock in a variable
          selectedStock = selectedStockSymbol + ' - ' + selectedStockName;
          input.value = selectedStock;
          input.style.color = 'black'; // Set input text color to black

          // Hide autocomplete list after selection
          autocompleteList.style.display = 'none';
      }
  });

  // Hide autocomplete on click outside input and list
  document.addEventListener('click', function(event) {
      if (!autocompleteList.contains(event.target) && event.target !== input) {
          autocompleteList.style.display = 'none';
      }
  });
});
