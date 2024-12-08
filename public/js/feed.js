// Get references to the necessary elements
const postButton = document.getElementById('postButton');
const reviewPrompt = document.getElementById('reviewPrompt');
const cancelButton = document.getElementById('cancelButton');
const reviewForm = document.getElementById('reviewForm');

// console.log(postButton, reviewPrompt, cancelButton, reviewForm);

// Event listener for the post button
postButton.addEventListener('click', () => {
  reviewPrompt.classList.remove('hidden');
});

// Event listener for the cancel button
cancelButton.addEventListener('click', () => {
  reviewPrompt.classList.add('hidden');
  reviewForm.reset();  
});

 reviewForm.addEventListener('submit', (event) => {
  event.preventDefault();

   const placeName = document.getElementById('placeName').value;
  const reviewText = document.getElementById('reviewText').value;


  reviewForm.reset();
  reviewPrompt.classList.add('hidden');
});