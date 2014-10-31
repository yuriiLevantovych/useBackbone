var Controller = Backbone.Router.extend({
    routes: {
        "": "start", // Пустой hash-тэг
        "!/": "start", // Начальная страница
        "!/success": "success", // Блок удачи
        "!/error": "error" // Блок ошибки
    },
    start: function () {
        appState.set({state: "start"});
    },
    success: function () {
        appState.set({state: "success"});
    },
    error: function () {
        appState.set({state: "error"});
    }
});
var AppState = Backbone.Model.extend({
    defaults: {
        username: "",
        state: "start"
    }
});
var Family = ["Саша", "Юля", "Елизар"]; // Моя семья
var appState = new AppState();

var Block = Backbone.View.extend({
    el: $("#block"), // DOM элемент widget'а

    initialize: function () { // Подписка на событие модели
        console.log(this.model)
        this.model.bind('change', this.render, this);
    },
    templates: {// Шаблоны на разное состояние
        "start": _.template($('#start').html()),
        "success": _.template($('#success').html()),
        "error": _.template($('#error').html())
    },
    events: {
        "click input:button": "check" // Обработчик клика на кнопке "Проверить"
    },
    check: function () {
        var username = $(this.el).find("input:text").val();
        var find = (_.detect(Family, function (elem) {
            return elem == username
        })); // Проверка имени пользователя
        appState.set({// Сохранение имени пользователя и состояния
            "state": find ? "success" : "error",
            "username": username
        });
    },
    render: function () {
        var state = this.model.get("state");
        $(this.el).html(this.templates[state](this.model.toJSON()));
        return this;
    }
});

var block = new Block({model: appState});
appState.trigger("change");

appState.bind("change:state", function () { // подписка на смену состояния для контроллера
    var state = this.get("state");
    if (state == "start")
        controller.navigate("!/", false); // false потому, что нам не надо 
    // вызывать обработчик у Router
    else
        controller.navigate("!/" + state, false);
});


var controller = new Controller(); // Создаём контроллер

Backbone.history.start();  // Запускаем HTML5 History push 

controller.start();