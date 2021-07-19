const header = document.querySelector('.dhx_layout-cell-header');
const form = document.querySelector('.form');

header.addEventListener('mousedown', function (event) {
    event.stopPropagation();
    let currentForm = event.target.parentElement;
    //if (event.target !== header) return;

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

        if (pageY - shiftY+ currentForm.offsetHeight > heightViewport) {
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