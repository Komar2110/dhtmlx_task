const configLayout = {
    type: "none",
    width: '420px',
    height: 'auto',
    css: "dhx_widget--bordered formContainer",
    header: "My form",
    rows: [
        {
            id: "tabbar",
        },
        {
            id: "ribbon",
        },
    ]
};

const configTabbar = {
    views: [
        {
            id: "first",
            tab: "First",
        },
        {
            id: "second",
            tab: "Second"
        },
        {
            id: "third",
            tab: "Third"
        },
    ]
};

import { View } from "dhx-optimus";
import ribbondata from "./ribbondata.json"

export class FormView extends View {
    init() {

        //создание экземпляров классов 
        let layout = new dhx.Layout(null, configLayout);
        let tabbar = new dhx.Tabbar(null, configTabbar);
        let ribbon = new dhx.Ribbon(null);

        ribbon.data.parse(ribbondata);

        //размещение tabbar внутри layout и ribbon внутри tabbar
        layout.getCell("tabbar").attach(tabbar);

        tabbar.getCell("first").attach(ribbon);

        //создание colorpicker
        let colorpicker = new dhx.Colorpicker(null);

        let popup = new dhx.Popup();

        popup.attach(colorpicker);

        // событие на клик по ribbon, находим по target где произошло событие
        // проверяем класс у этого элемента или у ближайшего родителя
        ribbon.events.on("click", function (id, e) {
            let container;

            if (e.target.classList.contains('myColorPicker')) {
                container = e.target.classList.contains('myColorPicker');
            } else {
                container = e.target.closest('.myColorPicker');
            }

            let elemToColor;

            //по id определяем какой colorpicker был вызван, передаем элемент для смены цвета
            if (id === "colorPickerTitle") {
                elemToColor = document.querySelector('.dhx_layout-cell-header');
            }
            if (id === "colorPickerBackground") {
                elemToColor = document.querySelector('.dhx_tabbar--top > .dhx_layout-cell');
            }

            if (elemToColor) {
                showColorpicker(container, elemToColor);
            }
        });

        //открываем colorpicker
        function showColorpicker(container, elemToColor) {
            colorpicker.target = elemToColor;
            popup.show(container);
        }

        //меняем цвет области при выборе цвета в colorpicker, прячем popup
        colorpicker.events.on("change", function (color) {
            colorpicker.target.style.backgroundColor = color;
            popup.hide();
            colorpicker.target = null;
        });

        return layout;
    }
    ready() {

        let header = document.querySelector('.dhx_layout-cell-header');

        let form = document.querySelector('.form');

        header.addEventListener('mousedown', function (event) {

            event.stopPropagation();
            let currentForm = event.target.parentElement;

            //расстояние от курсора до левого верхнего угла формы
            let shiftX = event.clientX - currentForm.getBoundingClientRect().left;
            let shiftY = event.clientY - currentForm.getBoundingClientRect().top;

            let widthViewport = document.documentElement.clientWidth;
            let heightViewport = document.documentElement.clientHeight;

            function moveAt(pageX, pageY) {

                let retLeft;
                let retTop;

                if (pageX - shiftX + currentForm.offsetWidth > widthViewport) {
                    retLeft = widthViewport - currentForm.offsetWidth;
                } else {
                    retLeft = pageX - shiftX;
                }

                if (pageY - shiftY + currentForm.offsetHeight > heightViewport) {
                    retTop = heightViewport - currentForm.offsetHeight;
                } else {
                    retTop = pageY - shiftY;
                }

                retLeft = retLeft > 0 ? retLeft : 0;
                retTop = retTop > 0 ? retTop : 0;

                currentForm.style.left = retLeft + 'px';
                currentForm.style.top = retTop + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            //перемещение формы при срабатывании этого события
            document.addEventListener('mousemove', onMouseMove);

            //прикрепить форму, удалить обработчики
            currentForm.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                currentForm.onmouseup = null;

                //проверка на выход за пределы правой границы
                if (widthViewport < (currentForm.offsetWidth + currentForm.getBoundingClientRect().left)) {
                    currentForm.style.left = widthViewport - currentForm.getBoundingClientRect().width + 'px';
                }

                //проверка на выход за пределы нижней границы
                if (heightViewport < currentForm.offsetHeight + currentForm.getBoundingClientRect().top) {
                    currentForm.style.top = heightViewport - currentForm.getBoundingClientRect().height + 'px';
                }
            };
        });
    }
}

