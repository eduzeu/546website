import { fetchFrom } from "../../helpers";

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
 // const rating = document.getElementsByClassName("star-rating").value;
  //find a way to get the id based on cookies and pass to insertUserReview
  let revObject = {placename: placeName, reviewText: reviewText};

  InsertReview(revObject) //inserts review to database
  
  reviewForm.reset();
  reviewPrompt.classList.add('hidden');
});

const InsertReview = async (object) => {
  await fetch("/userFeed/review", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(revObject)
  });
};