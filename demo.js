function $(id){
    return document.getElementById(id);
}

function $All(selector){
    return document.querySelectorAll(selector);
}

const CL_COMPLETED = 'completed';
const CL_CONTENT = 'content';

function updateAmount(itemCount) {
    $('itemCount').innerText = itemCount + " items left";
}

function updateItems() {
    let items = window.model.data.items;
    let list = $('itemList');
    list.innerText = '';
    let count = 0;
    for (let i = 0; i < items.length; ++i){
        let item = document.createElement("div");
        item.classList.add("item");
        list.appendChild(item);
        let checkbox = document.createElement("input");
        checkbox.type = 'checkbox';
        checkbox.id = 'item' + i;
        item.appendChild(checkbox);
        let label = document.createElement("label");
        label.htmlFor = checkbox.id;
        item.appendChild(label);
        let content = document.createElement("div");
        content.classList.add(CL_CONTENT);
        content.innerText = items[i].msg;
        item.appendChild(content);
        let favorite = document.createElement("img");
        favorite.src = "img/star.png";
        item.appendChild(favorite)
        favorite.addEventListener("click", () => {
            favorite.src = "img/star-fill.png";
        })
        if(!items[i].completed) count++;
        else {
            checkbox.checked = true;
            content.classList.add(CL_COMPLETED);
        }
        checkbox.addEventListener("change", () => {
            items[i].completed = checkbox.checked;
            updateItems();
        });
    }
    updateAmount(count);
}

function addItem() {
    let input = $("addInput");
    let message = input.value;
    if(message === ""){
        alert("输入内容不能为空");
        return;
    }
    window.model.data.items.unshift({
       msg: message,
       completed: false,
       time: 0,
       favorites: false
    });
    input.value = "";
    updateItems();
}

window.model = {
    data: {
        content: '',
        items: []
    },
    TOKEN: "TodoMVC"
}

window.onload = function () {
    $('addInput').onkeyup = function (event) {
        if(event.key === "Enter"){
            window.model.data.content = '';
            addItem();
            this.blur();
        }
        else{
            window.model.data.content = $('addInput').value;
        }
    };
    $('itemCount').innerText = "0 items left";
}