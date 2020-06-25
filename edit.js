function $(id){
    return document.getElementById(id);
}

function $All(selector){
    return document.querySelectorAll(selector);
}

function getParameter(key)
{
    let ref = window.location.href;
    let args = ref.split("?");
    let value = "";
    if(args[0] === ref) {
        return value;
    }
    let str = args[1];
    args = str.split("&");
    for(let i = 0; i < args.length; i++ ) {
        str = args[i];
        let arg = str.split("=");
        if(arg.length <= 1) continue;
        if(arg[0] === key) value = arg[1];
    }
    return value;
}

window.onload = function () {
    let data = localStorage.getItem('data');
    if(data) window.model.data = JSON.parse(data);
    let index = getParameter('index');
    if(index === '') location.href = './list.html'
    let item = window.model.data.items[index];

    let editInput = $('editInput');
    editInput.value = item.msg;
    editInput.addEventListener('keyup', (e) => {
        if(e.key === "Enter"){
            item.msg = editInput.value;
            flushStorage();
            editInput.blur();
        }
    });
    editInput.addEventListener('blur', () => {
        if(item.msg !== editInput.value) editInput.value = item.msg;
    });

    let checkbox = $('check');
    checkbox.checked = item.completed;
    checkbox.addEventListener("change", () => {
        item.completed = checkbox.checked;
        flushStorage();
    });

    let favorite = $('favorite');
    if(item.favorites) favorite.src = 'img/star-fill.png';
}