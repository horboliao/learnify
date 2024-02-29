const columns = [
    {name: "НАЗВА", uid: "title", sortable: true},
    {name: "ЦІНА", uid: "price", sortable: true},
    {name: "СТАТУС", uid: "status", sortable: true},
    {name: "СТВОРЕНО", uid: "created", sortable: true},
    {name: "КАТЕГОРІЯ", uid: 'category', sortable: true},
    {name: "ДІЇ З КУРСОМ", uid: "actions"},
];

const statusOptions = [
    {name: "Відкриті", uid: "opened"},
    {name: "Приховані", uid: "hidden"},
];

export {columns, statusOptions};