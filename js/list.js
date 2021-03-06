function $(id){
    return document.getElementById(id);
}

function $All(selector){
    return document.querySelectorAll(selector);
}

const CL_COMPLETED = 'completed';
const CL_CONTENT = 'content';
const CL_TIME = 'time';
const CL_WITHOUT_TIME = 'withoutTime';
const CL_TODAY = 'today';
const CL_OVERDUE = 'overdue';

function getTimeString() {
    let date = new Date();
    let nowMonth = date.getMonth() + 1;
    let strDate = date.getDate();
    if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = "0" + nowMonth;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    return [date.getFullYear(), nowMonth, strDate].join('-');
}

function setTime(time, element) {
    let now = new Date(getTimeString());
    let due = new Date(time);
    element.innerText = due.toDateString();

    if(due < now) {
        element.classList.add(CL_OVERDUE);
        if(due.getDate() === now.getDate() - 1 && due.getMonth() === now.getMonth()
            && due.getFullYear() === now.getFullYear()){
            element.innerText = 'Yesterday';
        }
    }
    else if(due.getTime() === now.getTime()){
        element.classList.add(CL_TODAY);
        element.innerText = 'Today';
    }
    else if(due.getDate() === now.getDate() + 1 && due.getMonth() === now.getMonth()
        && due.getFullYear() === now.getFullYear()){
        element.innerText = 'Tomorrow';
    }
}

function updateAmount(itemCount) {
    $('itemCount').innerText = itemCount + " items left";
}

function updateCheckAllSate() {
    if(window.model.data.checkAll) $All('#complete img')[0].src = 'img/check-all.png';
    else $All('#complete img')[0].src = 'img/uncheck-all.png';
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
        item.addEventListener('touchend', () => {
            window.location.href = './edit?index=' + i.toString();
        });

        let checkbox = document.createElement("input");
        checkbox.type = 'checkbox';
        checkbox.id = 'item' + i;
        item.appendChild(checkbox);

        let label = document.createElement("label");
        label.htmlFor = checkbox.id;
        item.appendChild(label);
        label.addEventListener('touchend', (e) => {
            e.stopPropagation();
        });

        let content = document.createElement("div");
        content.classList.add(CL_CONTENT);
        content.innerText = items[i].msg;
        item.appendChild(content);

        if(items[i].time === '') content.classList.add(CL_WITHOUT_TIME);
        else{
            let time = document.createElement("div");
            time.classList.add(CL_TIME);
            time.innerHTML = items[i].time;
            setTime(items[i].time, time);
            let calendar = document.createElement("img");
            calendar.src = 'img/calendar.png';
            time.insertBefore(calendar, time.firstChild);
            item.appendChild(time);
        }

        let favorite = document.createElement("img");
        if(!items[i].favorites) favorite.src = "img/star.png";
        else favorite.src = "img/star-fill.png";
        item.appendChild(favorite)
        favorite.addEventListener("touchend", (e) => {
            e.stopPropagation();
            favoriteItem(i);
            updateItems();
        })

        let trash = document.createElement("img");
        trash.src = 'img/trash.png';
        item.appendChild(trash);
        trash.addEventListener('touchend', (e) => {
            e.stopPropagation();
           delItem(i);
           updateItems();
        });

        if(!items[i].completed) count++;
        else {
            checkbox.checked = true;
            content.classList.add(CL_COMPLETED);
        }
        checkbox.addEventListener("change", () => {
            checkItem(i, checkbox.checked)
            updateItems();
        });
    }
    window.model.data.checkAll = (count === 0 && items.length !== 0);
    updateAmount(count);
    updateCheckAllSate();
}

function addItem() {
    let input = $("addInput");
    let message = input.value;
    if(message === ""){
        alert("输入内容不能为空");
        return;
    }
    let nowDate = getTimeString();
    let items = window.model.data.items;
    let i;
    for(i = 0; i < items.length; i++){
        if(!items[i].favorites) break;
    }
    let item = {
        msg: message,
        completed: false,
        time: '',
        favorites: false,
        createDate: nowDate
    }
    if(i === items.length) items.push(item);
    else if(i === 0) items.unshift(item);
    else items.splice(i, 0, item);
    input.value = "";
    updateItems();
}

window.onload = function () {
    if(init()) {
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
    $('complete').ontouchend = function () {
        if(window.model.data.checkAll){
            window.model.data.checkAll = false;
            window.model.data.items.forEach((item) => {
                item.completed = false;
            });
        }
        else{
            window.model.data.checkAll = true;
            window.model.data.items.forEach((item) => {
                item.completed = true;
                item.favorites = false;
            });
        }
        updateItems();
    }
    $('clear').ontouchend = function () {
        let items = window.model.data.items;
        for(let i = 0; i < items.length; i++){
            if(items[i].completed) {
                items.splice(i, 1);
                i--;
            }
        }
        updateItems();
    }
}