import { LOADING_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { likeApi, dislikeApi } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";


export function renderUserPostsPageComponent({ appEl }) {
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts"></ul>
    </div>`;
  
  appEl.innerHTML = appHtml;
  const postsContainer = appEl.querySelector(".posts");
  
  posts.forEach((post) => {
    const likes = post.likes.length === 1 ? post.likes[0].name :
      post.likes.length === 2 ? `${post.likes[0].name}, ${post.likes[1].name}` :
      post.likes.length > 2 ? `${post.likes[0].name}, ${post.likes[1].name} и еще ${post.likes.length - 2} человек` : '0';

    const postHtml = `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" data-is-liked="${post.isLiked}" class="like-button">
            <img src="./assets/images/${post.isLiked ? "like-active.svg" : "like-not-active.svg"}">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${likes}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date"> ${formatDistanceToNow(new Date(), { addSuffix: true, locale: ru })} </p>
      </li>`;
      
    postsContainer.innerHTML += postHtml;
  });

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });


  postsContainer.addEventListener("click", (event) => {
    const target = event.target.closest(".like-button");
    if (!target) return;

    const postId = target.dataset.postId;
    const isLiked = target.dataset.isLiked === "true";

    handleLikeButtonClick({ postId, isLiked });
  });

  const handleLikeButtonClick = ({ postId, isLiked }) => {
    const action = isLiked ? dislikeApi : likeApi;
    //const nextPage = isLiked ? POSTS_PAGE : LOADING_PAGE;

    goToPage(LOADING_PAGE);

    action({ postId, token: getToken() })
      .then(() => goToPage(POSTS_PAGE))
      .catch((error) => {
        console.error("Ошибка при изменении статуса лайка:", error);
        // goToPage(nextPage);
      });
  };
}