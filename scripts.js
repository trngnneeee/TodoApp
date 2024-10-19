import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import { getDatabase, ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const firebaseConfig = {
apiKey: "AIzaSyA-KDKAvmvqnnAJ0zqCuqKlNHPYLU2UYFA",
authDomain: "first-database-dc421.firebaseapp.com",
databaseURL: "https://first-database-dc421-default-rtdb.asia-southeast1.firebasedatabase.app",
projectId: "first-database-dc421",
storageBucket: "first-database-dc421.appspot.com",
messagingSenderId: "346994648038",
appId: "1:346994648038:web:04b76452f244adf4042c27"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const todosRef = ref(db, 'todos');

function showAlert(content, time){
    const newAlert = document.createElement("div");
    newAlert.setAttribute("class", "alert alert--success");

    newAlert.innerHTML = `
        <span class="alert__content">${content}</span>
        <span class="alert__close">
            <i class="fa-solid fa-xmark"></i>
        </span>
    `;

    const listAlert = document.querySelector(".list-alert");
    listAlert.appendChild(newAlert);

    const closeAlert = listAlert.querySelector(".alert__close");
    closeAlert.addEventListener("click", () => {
        listAlert.removeChild(newAlert);
    })

    setTimeout(() => {
        listAlert.removeChild(newAlert);
    }, time);
}

function showConfirmDelete(id) {
    const body = document.querySelector("body");
    
    const ElementConfirm = document.createElement("div");
    ElementConfirm.classList.add("modal");

    ElementConfirm.innerHTML = `
        <div class = "modal__main">
            <div class = "modal__content">
                <button class = "modal__button modal__content--confirm">Xác nhận</button>
                <button class = "modal__button modal__content--cancel">Hủy</button>
            </div>
            <div class = "modal__close">
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
        <div class = "modal__overlay"></div>
    `
    body.appendChild(ElementConfirm);


    const confirm = document.querySelector(".modal__content--confirm");
    const cancel = document.querySelector(".modal__content--cancel");
    const overlay = document.querySelector(".modal__overlay");
    const close = document.querySelector(".modal__close");
    confirm.addEventListener("click", () =>{
        body.removeChild(ElementConfirm);
        remove(ref(db, '/todos/' + id)).then(() => {
            showAlert("Xóa thành công!", 3000);
        });
    })

    close.addEventListener("click", () => {
        body.removeChild(ElementConfirm);
    })

    cancel.addEventListener("click", () => {
        body.removeChild(ElementConfirm);
    })

    overlay.addEventListener("click", () => {
        body.removeChild(ElementConfirm);
    })
}

function showConfirmModify(id) {
    const body = document.querySelector("body");
    
    const ElementConfirm = document.createElement("div");
    ElementConfirm.classList.add("modal");

    ElementConfirm.innerHTML = `
        <div class = "modal__main">
            <div class = "modal__content">
                <input class = "modal__input" type = "text" placeholder = "Nhập công việc...">
                <button class = "modal__button--modify modal__content--confirm">Xác nhận</button>
                <button class = "modal__button--modify modal__content--cancel">Hủy</button>
            </div>
            <div class = "modal__close">
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
        <div class = "modal__overlay"></div>
    `
    body.appendChild(ElementConfirm);

    const confirm = document.querySelector(".modal__content--confirm");
    const cancel = document.querySelector(".modal__content--cancel");
    const close = document.querySelector(".modal__close");
    const overlay = document.querySelector(".modal__overlay");
    confirm.addEventListener("click", () =>{
        const input = document.querySelector(".modal__input");
        const data = input.value;
        if (data != "")
        {
            const dataUpdate = {
                content: data
            };
            update(ref(db, '/todos/' + id), dataUpdate).then(() => {
                showAlert("Cập nhật thành công!", 3000);
            });
        }
        body.removeChild(ElementConfirm);
    })

    close.addEventListener("click", () => {
        body.removeChild(ElementConfirm);
    })

    cancel.addEventListener("click", () => {
        body.removeChild(ElementConfirm);
    })

    overlay.addEventListener("click", () => {
        body.removeChild(ElementConfirm);
    })
}

// Add work
const todoAppCreate = document.querySelector(".todo-app__create");
if (todoAppCreate)
{
    todoAppCreate.addEventListener("submit", (event) => {
        event.preventDefault();

        const content = todoAppCreate.content.value;
        if (content)
        {
            const data = {
                content: content,
                complete: false
            };

            const newTodoRef = push(todosRef);
            set(newTodoRef, data).then(() => {
                showAlert("Tạo thành công!", 3000);
            })
            todoAppCreate.content.value = "";
        }
    })
}
// End Add work

onValue(todosRef, (items) => {
    // View in HTML
    const htmls = [];
    items.forEach((item) => {
        const key = item.key;
        const data = item.val();

        let buttonComplete = '';
        if (!data.complete)
        {
            buttonComplete = `
        <a href = "#" class="todo-app__button todo-app__action--complete" button-complete = "${key}">
            <i class="fa-solid fa-check"></i>
        </a>
        `;
        }
        else buttonComplete = `
        <a href = "#" class="todo-app__button todo-app__action--undo" button-undo = "${key}">
            <i class="fa-solid fa-rotate-left"></i>
        </a>
        `;

        let html = `
            <div class="todo-app__item ${data.complete ? "todo-app__item--complete" : ""}">
                <div class="todo-app__item-content">${data.content}</div>
                <div class="todo-app__action">
                    <a href = "#" class="todo-app__button todo-app__action--modify" button-modify = "${key}">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </a>
                    ${buttonComplete}
                    <a href = "#" class="todo-app__button todo-app__action--delete" button-delete = "${key}">
                        <i class="fa-solid fa-trash"></i>
                    </a>
                </div>
            </div>`;
        htmls.push(html);
    })
    const todoAppList = document.querySelector(".todo-app__list");
    todoAppList.innerHTML = htmls.reverse().join("");
    // End View in HTML
    //----------------------------------------------------------
    // Complete button
    const listButtonComplete = document.querySelectorAll("[button-complete]");
    listButtonComplete.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-complete");
            const dataUpdate = {
                complete: true
            };
            update(ref(db, '/todos/' + id), dataUpdate).then(() => {
                showAlert("Cập nhật thành công!", 3000);
            });
        })
    })
    // End complete button
    //----------------------------------------------------------
    // Undo button
    const listButtonUndo = document.querySelectorAll("[button-undo]");
    listButtonUndo.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-undo");
            const dataUpdate = {
                complete: false
            };
            update(ref(db, '/todos/' + id), dataUpdate).then(() => {
                showAlert("Hoàn tác thành công!", 3000);
            });
        })
    })

    // End Undo button
    //----------------------------------------------------------
    // Delete button
    const listButtonDelete = document.querySelectorAll("[button-delete]");
    listButtonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-delete");
            showConfirmDelete(id);
        })
    })
    // End Delete button
    //----------------------------------------------------------
    // Modify Content Button
    const listButtonModify = document.querySelectorAll("[button-modify]");
    listButtonModify.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-modify");
            showConfirmModify(id);
        })
    })
    // End Modify Content Button
})
