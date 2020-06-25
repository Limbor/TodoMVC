window.model = {
    data: {
        content: '',
        items: [],
        checkAll: false
    },
    TOKEN: "TodoMVC"
}

function init() {
    let data = localStorage.getItem('data');
    if(data) {
        window.model.data = JSON.parse(data);
        return true;
    }
    return false
}

function flushStorage() {
    localStorage.setItem('data', JSON.stringify(window.model.data));
}

function delItem(i) {
    let items= window.model.data.items;
    items.splice(i, 1);
}

function checkItem(i, checked) {
    let items= window.model.data.items;
    items[i].completed = checked;
    if(items[i].completed) {
        items[i].favorites = false;
        for(let j = i + 1; j < items.length; j++){
            if(!items[j].completed){
                items[j] = items.splice(j - 1, 1, items[j])[0];
            }
            else break;
        }
    }
    else{
        for(let j = i - 1; j >= 0; j--){
            if(items[j].completed){
                items[j] = items.splice(j + 1, 1, items[j])[0];
            }
            else break;
        }
    }
}

function favoriteItem(i) {
    let items= window.model.data.items;
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
}