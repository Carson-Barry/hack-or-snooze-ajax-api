"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logs in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserButtons.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show menu for submitting story when the submit button is clicked */

async function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  $submitStoryContainer.show();


  console.log("ran")
  await $submitStorySubmit.on("click", async function() {

    const author = $("#submit-author").val();
    const title = $("#submit-title").val();
    const url = $("#submit-url").val();
  
    console.log(author, title, url)

    if (author && title && url) {
      let newStory = await storyList.addStory(currentUser,
        {title, author, url});
      $submitStoryContainer.hide()
      console.log(newStory)
    }
  });
}

$navSubmit.on("click", navSubmitClick);

/** Load favorites page when the favorites button is clicked */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);

}

$navFavorites.on("click", navFavoritesClick);

/** Load user stories page when the my stories button is clicked */

function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick", evt);

}

$navMyStories.on("click", navMyStoriesClick);