import { changeLocalPosts, posts } from "./index.js";
import { likeApi, dislikeApi } from "./api.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";

export function attributesLikes(data) {
    const { postId, token, img } = data;

    if (data.isLiked) {
        img.src = `./assets/images/like-not-active.svg`;
        dislikePost(postId, token)
            .then(() => {})
            .catch(error => console.error("Ошибка при изменении статуса лайка:", error));
    } else {
        img.src = `./assets/images/like-active.svg`;
        likePost(postId, token)
            .then(() => {})
            .catch(error => console.error("Ошибка при изменении статуса лайка:", error));
    }
}

function likePost(postId, token) {
    return likeApi({ postId, token })
        .then(responseData => updatePost(postId, responseData.post))
        .catch(error => {
            console.error("Ошибка при установке лайка:", error);
            throw error;
        });
}

function dislikePost(postId, token) {
    return dislikeApi({ postId, token })
        .then(responseData => updatePost(postId, responseData.post))
        .catch(error => {
            console.error("Ошибка при установке лайка:", error);
            throw error;
        });
}

function updatePost(postId, newPost) {
    const updatedPosts = posts.map(post => (post.id === postId ? newPost : post));
    changeLocalPosts(updatedPosts);
    renderPostsPageComponent({ appEl: document.getElementById("app") });
}