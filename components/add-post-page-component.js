import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

let imageUrl = "";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container">
  <div class="page-header">
      <h1 class="logo">instapro</h1>
      <button class="header-button add-or-login-button">
      <div title="Добавить пост" class="add-post-sign"></div>
      </button>
      <button title="Админ" class="header-button logout-button">Выйти</button>   
  </div>
</div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container">
  <div class="uploada=image">
      
            <label class="file-upload-label secondary-button">
                <input id="image-input" type="file" class="file-upload-input" style="display:none">
                Выберите фото
            </label>
          
      
  </div>
</div>
          <label>
            Опишите фотографию:
            <textarea id="text-input" class="input textarea" rows="4"></textarea>
            </label>
            <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

  };
  render();
  renderUploadImageComponent({
    element: appEl.querySelector(".upload-image-container"),
    onImageUrlChange(newImageUrl) {
      imageUrl = newImageUrl;
    },
  });
  document.getElementById("add-button").addEventListener("click", () => {
    const text = document.getElementById('text-input').value.trim(); // убираем пробелы в начале и конце
    const imageInput = document.getElementById('image-input');

    // Проверка на заполненные поля
    if (!text || !imageUrl) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    onAddPostClick({
      description: text,
      imageUrl: imageUrl,
    });
  });
};