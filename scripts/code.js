window.onload = function() {

    $("#fullpage").fullpage({ // настройка fullpage
        sectionsColor: [, "yellow"],
        anchors: ["first", "second"],
        scrollBar: true,
        loopHorizontal: true,
        scrollOverflow: true
    });

    let head = $("header");
    let $main = $("main");
    let modal = $("#modal");
    let curentElement = null;
    let $additionally = null;
    let countContacts = 12;
    modal.on("click", modalClose);
    modal.on("click", contactDel);
    modal.on("click", contactChange);
    $main.on("click", modalShow);
    $("#generate").on("click", function() { $main.empty() });
    $("#generate").on("click", generate);
    $("#add").on("click", function() {
        form(addObject, "Добавить"); // построение формы,addObject обработчик кнопки (можем менять)
        location.href = "#section2"; // переход    

    });
    $("#clear").on("click", function() {
        localStorage.clear();
        $main.empty();
    });

    function modalShow(e) { // показ окна 
        modal.empty();
        if (curentElement) {
            curentElement.css("opacity", 1);
        }
        if ($(e.target).hasClass("divImg")) {
            curentElement = $(e.target).parent(); // получаем div чей элемент сгенерировал событие
            modal.css({
                "top": curentElement.offset().top,
                "left": curentElement.offset().left,
                "width": curentElement.width(),
                "height": curentElement.height(),
                "background-color": curentElement.css("background-color"),
                "display": "block"
            })

            let array = arrayFromLocal() //  массив объектов из Local Storage
            let id = curentElement.children().eq(0).html(); // получаем айди div по которому кликнули
            let obj = objReturn(id, array);
            modal.append(curentElement.clone()); // вставка данных
            $("#modal .divImg ").animate({ "width": 280, "height": 220 }, 300);
            $additionally = modal.children().eq(0); // получаем div кликнутого элемента для вставки
            $additionally.append($('<div> </div>').html("click to delete").addClass("admin flexChild"));
            $additionally.append($('<div> </div>').html("click to change").addClass("adminChange flexChild"));
            modal.append($additionally); // вставка дополнительных элементов

            modal.animate({ "width": 400, "height": 400 }, 500);
            modal.animate({ "top": (window.pageYOffset + 150), "left": (window.innerWidth - 400) / 2 }, 700);
            curentElement.css("opacity", 0);
        } //end  if
        event.stopPropagation();
    } // end modalShow

    function modalClose(e) {
        modal.animate({ "width": curentElement.width(), "height": curentElement.height() }, 300);
        modal.animate({ "top": curentElement.offset().top, "left": curentElement.offset().left }, 400);
        setTimeout(function() {
            modal.css("display", "none");
            curentElement.css("opacity", 1);
            curentElement = null;
        }, 700);
    } // end modalClose

    function generate() {
        if (!localStorage.getItem("localStorage")) { // проверяем есть ли значения в localStorage
            let array = [];
            for (let i = 0; i < countContacts; i++) {
                let obj = new ConFabrica();
                obj.randCon();
                array.push(obj);
            }
            localStorage.setItem("localStorage", JSON.stringify(array)); // заносим массив в localStorage 
        }

        let array = arrayFromLocal(); // массив элементов из локального хранилища
        for (let i = 0; i < countContacts; i++) {
            let obj = array[i];

            let div = $('<div>  </div>').css({ 'background-color': "wheat" });
            let id = $('<div> id объявления </div>').html(obj.id).attr("id", obj.id).addClass("divInside").appendTo(div);
            let img = $('<div>  </div>').addClass("divImg").css('backgroundImage', "url(" + obj.image + ")").appendTo(div);
            let name = $('<div> </div>').html("Name: " + obj.name).addClass("divInside").appendTo(div);
            let mobilePhone = $('<div> </div>').html("mobilePhone: " + obj.mobilePhone).addClass("divInside").appendTo(div);
            let dear = $('<div> </div>').html("dear: " + obj.dear).addClass("divInside").appendTo(div);
            let jobTitle = $('<div> </div>').html("jobTitle: " + obj.jobTitle).addClass("divInside").appendTo(div);
            let birthDate = $('<div> </div>').html("birthDate: " + obj.birthDate).addClass("divInside").appendTo(div);
            div.addClass("flexChild flex").appendTo("#main");

        }
    }

}; // end load

///////////////////////////////--------------------------------------OTHER FUNCTION-------------------------------------------------///////////////////////////
function objReturn(value, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == value) {
            return array[i];
        }
    }
}

function contactDel(e) {
    if ($(e.target).hasClass("admin")) {
        let id = $(e.target).parent().children().eq(0).html();
        let array = arrayFromLocal();
        array.pop(objReturn(id, array)); // удаляем объект чей элемент сгенерировал событие
        localStorage.setItem("localStorage", JSON.stringify(array)); // заносим новый массив в локал сторадж(перезаписываем)
        $("#" + id).parent().remove();
    }
}

function contactChange(e) {
    if ($(e.target).hasClass("adminChange")) {
        let id = $(e.target).parent().children().eq(0).html();
        $parent = $("#slide2");
        $parent.empty();
        form(changeObject, "Изменить Объект", id); // создаем форму и назначаем обработчик для кнопки(изменение)

        // добавляем в форму элементы div по которому кликнули
        for (let i = 0; i < array.length; i++) {
            if (array[i].id == id) {
                for (key in array[i]) {

                    $("#" + key + "").val(array[i][key]); // заменили объект
                }
            }
        }
        location.href = "#section2"; // переход 
    }
}


class ConFabrica {

    constructor(array = []) { //  по умолчанию равен пустому массиву
        this.id = setTimeout(function() {
            (new Date()).getTime();
        }, 1);
        this.name = array[0];
        this.mobilePhone = array[1];
        this.dear = array[2];
        this.jobTitle = array[3];
        this.birthDate = array[4];
    }

    randCon() {
        this.name = randElement(["Alex", "Macha", "Kolyj", "Anna", "Poma", "Kolja", "Katij"]);
        this.mobilePhone = randElement([+441515424238, +16174402031, +447822234967, 80235048175]);
        this.dear = randElement(["Yes", "No"]);
        this.jobTitle = randElement(["director", "master", "manager"]);
        this.birthDate = randElement(["15.07.78", "18.05.94", "1.12.85", "25.02.90"]);
        this.image = "images/randFabrica/" + randElement(["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"]);

        function randElement(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
    }
}


function arrayFromLocal() {
    let jsonArray = localStorage.getItem("localStorage");
    return array = JSON.parse(jsonArray);
}

function form(clickHandler, nameButton, id = "Назначается автоматически") {

    function labelInput(name, parent) {
        let $div = $("<div></div>").addClass("formdiv flex ");
        $div.append($("<label></label>").html(name).addClass("flexChild formLegend"));
        $input = $("<input>").attr({ type: "text", id: name }).addClass("flexChild formInput");
        $div.append($input);
        parent.append($div);
    }


    $parent = $("#section2");
    $parent.empty();
    let obj = new ConFabrica();
    for (key in obj) {
        if (key === "id") {
            let $div = $("<div></div>").addClass("formdiv flex ").attr("id", "divchange");
            $div.append($("<label></label>").html("id").addClass("flexChild formLegend"));
            $div.append($("<label></label>").attr({ "type": "text", "id": "idchange" }).addClass("flexChild formInput").html(id));
            $parent.append($div);
            continue;
        }
        if (key === "image") {
            labelInput(key, $parent);
        }
        labelInput(key, $parent);
    }

    let insert = $("<button ></button>").html(nameButton).attr('id', "insert").addClass("formdiv formLegend");
    insert.on("click", clickHandler);
    $parent.append(insert);
}

function addObject() {
    let array = arrayFromLocal();
    let dataArray = [];
    let i = 0;
    let validate = true;
    for (key in array[0]) {
        if (key === "id") {
            continue;
        }
        dataArray[i++] = $("#" + key + "").val();
    }
    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] == "") {
            validate = false;
            alert("Строка " + (i + 2) + " пуста. Заполните");
        }

        if (dataArray[i].length > 20) {
            validate = false;
            alert("Строка " + (i + 2) + " превышает 20 символов");
        }
    }


    if (validate == true) {
        let obj = new ConFabrica(dataArray);
        array.push(obj);
        localStorage.setItem("localStorage", JSON.stringify(array)); // заносим новый массив в локал сторадж(перезаписываем) 
        alert("Добавлен новый объект");
        location.href = "#section1"; // переход  
    }

}

function changeObject() {
    let array = arrayFromLocal();
    let id = $("#idchange").html();
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == id) {
            for (key in array[i]) {
                if (key === "id") {
                    continue;
                }
                if (key === "image") {
                    continue;
                }
                array[i][key] = $("#" + key + "").val(); // заменили объект
            }
        }
    }
    localStorage.setItem("localStorage", JSON.stringify(array)); // заносим новый массив в локал сторадж(перезаписываем)
    alert("Объект изменен");
    $("#main").empty();
    document.getElementById("generate").click()

    location.href = "#section1"; // переход    
}


/*$(document).ready(function() {
    let validateName = false;
    let validatemobilePhone = false;
    let validatedear = false;
    let validatebirthDate = false;

    $("formdiv").submit()(function(e) {
        let name = $("#name").val;
        let mobilePhone = $("#mobilePhone").val;
        let dear = $("#dear").val;
        let jobTitle = $("#jobTitle").val;
        let birthDate = $("#birthDate").val;
    })
})*/