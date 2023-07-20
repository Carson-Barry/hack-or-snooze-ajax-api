"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

let myStories = [];

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  let starStyle = "fa-regular";
  if (currentUser.storyIsFavorite(story)) {
    starStyle = "fa-solid";
  }

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="${starStyle} fa-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


async function submitStoryFormAndDisplay() {

  //Get values from form
  const author = $("#submit-author").val();
  const title = $("#submit-title").val();
  const url = $("#submit-url").val();

  //If all values populated
  if (author && title && url) {
    //Add story to website using API
    let newStory = await storyList.addStory(currentUser, {title, author, url});

    //Clear and hide form, disable listener
    $submitStoryForm.trigger("reset");
    $submitStoryContainer.hide();
    $submitStorySubmit.off();

    //Add story to story list and DOM
    storyList.stories.unshift(newStory);
    putStoriesOnPage();
  }
};

function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  if (currentUser.favorites.length !== 0) {
    $noFavorites.hide();
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
    }
  }
  else {
    $noFavorites.show();
  }

  $(".favorite-star").on("click", favoriteStarClick);
}

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $allStoriesList.empty();

  const userStories = [];

  for (let story of storyList.stories) {
    if (currentUser.storyIsUser(story)) {
      userStories.push(story);
    }
  }

  // loop through all of our stories and generate HTML for them
  if (userStories.length !== 0) {
    $noUserStories.hide();
    for (let story of userStories) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
    }
  }
  else {
    $noUserStories.show();
  }
}


/** Handle button presses for the "favorite" star */

async function favoriteStarClick(evt) {
  let action;
  console.debug("favoriteStarClicked", evt);
  if ($(evt.target).hasClass("fa-star")) {
    if ($(evt.target).hasClass("fa-regular")) {
      //Not favorited, add favorite
      $(evt.target).removeClass("fa-regular").addClass("fa-solid");
      action = "ADD";
    }
    else {
      $(evt.target).removeClass("fa-solid").addClass("fa-regular")
    }
  }

  for (let story of storyList.stories) {
    if (story.storyId === $(evt.target).parent().attr("id")) {
      if (action === "ADD") {
        await currentUser.addFavoriteStatus(story);
      }
      else {
        await currentUser.removeFavoriteStatus(story);
      }
    }
  }
}

$allStoriesList.on("click", async function(evt) {
  await favoriteStarClick(evt)
})