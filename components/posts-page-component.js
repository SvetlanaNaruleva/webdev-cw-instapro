import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, user } from "../index.js";
import { attributesLikes } from "../attributes-likes.js";
import { formatDistanceToNow } from "date-fns";

export function renderPostsPageComponent({ appEl }) {

    // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                </ul>
              </div>`;


  appEl.innerHTML = appHtml;
  const postsHTML = document.querySelector(".posts");
  let postHTML = "";

  posts.forEach((post) => {
    let likes = '0';
    if (post.likes.length === 1) {
      likes = post.likes[0].name;
    } else if (post.likes.length === 2) {
      likes = `${post.likes[0].name}, ${post.likes[1].name}`;
    } else if (post.likes.length > 2) {
      likes = `${post.likes[0].name}, ${post.likes[1].name} и еще ${post.likes.length - 2} человек`;
    };

    postHTML = `
<li class="post">
<div class="post-header" data-user-id="${post.user.id}" >
    <img  src="${post.user.imageUrl}" class="post-header__user-image">
    <p class="post-header__user-name">${post.user.name}</p>
</div>
<div class="post-image-container">
  <img class="post-image" src="${post.imageUrl}">
</div>
<div class="post-likes">
<img class="preloader-likes --not-entered">
${user ? `<button 
  data-post-id="${post.id}" 
  data-is-liked="${post.isLiked}"
  data-likes="${post.likes.length}" 
  class="like-button">
    <img src="./assets/images/${post.isLiked ? "like-active.svg" : "like-not-active.svg"
        }">` : ''}
  </button>
  <p class="post-likes-text">
  Нравится: <strong>${likes}</strong>
  </p>
</div>
<p class="post-text">
  <span class="user-name">${post.user.name}</span>
  ${post.description}
</p>
</li>
`;
    postsHTML.innerHTML += postHTML;

  });

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {

      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  };

  for (let userEl of document.querySelectorAll(".like-button")) {
    userEl.addEventListener("click", () => {
      userEl.classList.add('not-entered');
      userEl.previousElementSibling.classList.remove('--not-entered');
      const sentData = {
        isLiked: userEl.dataset.isLiked === "true" ? true : false,
        likes: userEl.dataset.likes,
        postId: userEl.dataset.postId,
        token: getToken(),
        img: userEl.querySelector('img'),
      }
      attributesLikes(sentData);
    });
  };
};