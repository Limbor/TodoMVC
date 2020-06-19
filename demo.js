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

function flushStorage() {
    localStorage.setItem('data', JSON.stringify(window.model.data));
}

function updateItems() {
    flushStorage();
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
        if(!items[i].favorites) favorite.src = "img/star.png";
        else favorite.src = "img/star-fill.png";
        item.appendChild(favorite)
        favorite.addEventListener("touchend", () => {
            if(items[i].completed) return;
            items[i].favorites = !items[i].favorites;
            if(i !== 0 && items[i].favorites) items.unshift(items.splice(i, 1)[0]);
            else if(!items[i].favorites){
                for(let j = i + 1; j < items.length; j++){
                    if(items[j].favorites) {
                        items[j] = items.splice(j - 1, 1, items[j])[0];
                    }
                    else break;
                }
            }
            updateItems();
        })

        let trash = document.createElement("img");
        trash.src = 'img/trash.png';
        item.appendChild(trash);
        trash.addEventListener('touchend', () => {
           items.splice(i, 1);
           updateItems();
        });

        if(!items[i].completed) count++;
        else {
            checkbox.checked = true;
            content.classList.add(CL_COMPLETED);
        }
        checkbox.addEventListener("change", () => {
            items[i].completed = checkbox.checked;
            if(items[i].completed) items.push(items.splice(i, 1)[0]);
            else{
                for(let j = i - 1; j >= 0; j--){
                    if(items[j].completed){
                        items[j] = items.splice(j + 1, 1, items[j])[0];
                    }
                    else break;
                }
            }
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
    let items = window.model.data.items;
    let i;
    for(i = 0; i < items.length; i++){
        if(!items[i].favorites) break;
    }
    let item = {
        msg: message,
        completed: false,
        time: 0,
        favorites: false
    }
    if(i === items.length) items.push(item);
    else if(i === 0) items.unshift(item);
    else items.splice(i, 0, item);
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
    let data = localStorage.getItem('data');
    if(data) {
        window.model.data = JSON.parse(data);
        $('addInput').value = window.model.data.content;
        updateItems();
    }
    $('addInput').onkeyup = function (event) {
        if(event.key === "Enter"){
            window.model.data.content = '';
            addItem();
            this.blur();
        }
        else{
            window.model.data.content = $('addInput').value;
        }
        flushStorage();
    };
}