window.model = {
    data: {
        content: '',
        items: [],
        checkAll: false
    },
    TOKEN: "TodoMVC"
}

function flushStorage() {
    localStorage.setItem('data', JSON.stringify(window.model.data));
}