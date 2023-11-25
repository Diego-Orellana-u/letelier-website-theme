// HEADER
const navMenu = document.querySelector('.nav__list');
const toggleButton = document.getElementById('nav-toggle');


toggleButton.addEventListener('click', () => {
    const visibility = navMenu.getAttribute('data-visible');
    const menuIcon = document.getElementById('menu-icon-path')

    if(visibility === "false"){
        navMenu.setAttribute('data-visible', true); //show menu on mobile
        toggleButton.setAttribute('aria-expanded',true) //search purpose
        menuIcon.setAttribute("d", "m12 10.586 4.95-4.95 1.415 1.415-4.95 4.95 4.95 4.95-1.415 1.414-4.95-4.95-4.95 4.95-1.413-1.415 4.95-4.95-4.95-4.95L7.05 5.638l4.95 4.95Z")
    }else{
        navMenu.setAttribute('data-visible', false)
        toggleButton.setAttribute('aria-expanded',false)
        menuIcon.setAttribute("d", "M3 4h18v2H3V4Zm0 7h18v2H3v-2Zm0 7h18v2H3v-2Z")
    }
})

const navSearchBtn = document.getElementById('search-toggle');
const navSearchContainer = document.querySelector('.navmenu__search-container');

navSearchBtn.addEventListener('click', () => {
    const visibility = navSearchContainer.getAttribute('data-visible');
    const navSearchIcon = document.getElementById('search-icon-path');

    if(visibility === "false"){
        navSearchContainer.setAttribute('data-visible', true); //show menu on mobile
        navSearchBtn.setAttribute('aria-expanded',true); //search purpose
        navSearchIcon.setAttribute('d', 'm12 10.586 4.95-4.95 1.415 1.415-4.95 4.95 4.95 4.95-1.415 1.414-4.95-4.95-4.95 4.95-1.413-1.415 4.95-4.95-4.95-4.95L7.05 5.638l4.95 4.95Z') //change icon
    }else{
        navSearchContainer.setAttribute('data-visible', false);
        navSearchBtn.setAttribute('aria-expanded',false);
        navSearchIcon.setAttribute('d', 'm18.031 16.617 4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617Zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7 3.133 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15Z')
    }
})

// CART DRAWER

//cart variables
const productForms = document.querySelectorAll('form[action="/cart/add"');
const cartToggle = document.getElementById('cart-toggle');
const cartDrawer = document.querySelector('.mini__cart-container');
const overlay = document.querySelector('.drawer__overlay');


function openCart(){
    cartDrawer.setAttribute('data-visible', true);
    cartToggle.setAttribute('aria-expanded',true);
    overlay.style.opacity = '0.3';
    overlay.style.visibility = 'visible';
}

function closeCart(){
    cartDrawer.setAttribute('data-visible', false);
    cartToggle.setAttribute('aria-expanded', false);
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
}

function updateCartCounter(count){
    document.querySelectorAll('.header__cart-count').forEach(el => {
        el.textContent = count
    })
}

async function updateCart(){
    const res = await fetch("/?section_id=cart-drawer");
    const text = await res.text();
    const html = document.createElement('div');
    html.innerHTML = text;

    const newContainer = html.querySelector(".mini__cart-container").innerHTML;
    document.querySelector('.mini__cart-container').innerHTML = newContainer;


    addCartListeners();
}

function addCartListeners(){

    //Update quantities
    document.querySelectorAll('.mini__cart-item button').forEach(button => {
        button.addEventListener('click', async () => {
            //get product key
            const root = button.closest('.mini__cart-item')
            const key = root.getAttribute('data-line-item-key')

            //get new quantity
            const currentQuantity = parseInt(button.parentElement.querySelector('input').value)
            const isUp = button.classList.contains('mini__cart-quantity-plus')
            const newQuantity = isUp ? currentQuantity + 1 : currentQuantity - 1;
 
            //ajax update
            const res = await fetch('/cart/update.js', {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({updates: { [key]: newQuantity}})
            })
            const cart = await res.json();

            updateCartCounter(cart.item_count)

            //update cart
            updateCart();
        })
    })
    document.querySelectorAll('.mini__cart-close, .drawer__overlay').forEach(c =>{
        c.addEventListener('click', closeCart)
    })

}

addCartListeners()

cartToggle.addEventListener('click', () => {
    openCart()
})


productForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        //submit form
        await fetch('/cart/add', {
            method: "post",
            body: new FormData(form),
        })

        //get cart count
        const res = await fetch('/cart.js')
        const cart = await res.json()
        updateCartCounter(cart.item_count)

        //update cart
        await updateCart()

        //open cart
        openCart()
    })
})

// SEARCH



// FAQ

const faqBody = document.querySelectorAll(".faq__question-body");
const faqHeader = document.querySelectorAll(".faq__question-header");

faqHeader.forEach(header => {
    header.addEventListener("click", () => {
        header.parentElement.classList.toggle('faq-visible')
    })
})


// FILTER

const filterDrawer = document.getElementById('filter-container')
const openFilterBtn = document.querySelectorAll('.filter__openBtn')
const closeFilterBtn = document.getElementById('filter-closeBtn')
const filterLabel = document.querySelectorAll('.filter__label')



function openFilter(){
    filterDrawer.setAttribute('data-visible', true)
    openFilterBtn.forEach(btn => btn.setAttribute('aria-expanded', true))
    overlay.style.opacity = '0.3';  //reusing overlay of cart drawer
    overlay.style.visibility = 'visible';
}

function closeFilter(){
    filterDrawer.setAttribute('data-visible', false)
    openFilterBtn.forEach(btn => btn.setAttribute('aria-expanded', false))
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
}

openFilterBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        openFilter()
    })
})

document.querySelectorAll('.filter__closebtn, .drawer__overlay').forEach(c =>{
    c.addEventListener('click', closeFilter)
})

filterLabel.forEach(label => {
    label.addEventListener('click', () => {
        label.parentElement.classList.toggle('filter-visible')
    })
})

//MOBILE PRICE FILTER

const rangeMobileInput = document.querySelectorAll('.range__mobile__input input');
const priceMobileInput = document.querySelectorAll('.filter__mobile__price-container input');
const progressMobile = document.querySelector('.filter__mobile__slider-container .filter__mobile__slider-progress');

let mobilePriceGap = 30000;


priceMobileInput.forEach(input => {
    input.addEventListener("input", e => {
        let minVal = parseInt(priceMobileInput[0].value);
        let maxVal = parseInt(priceMobileInput[1].value);
           

        if((minVal >= priceMobileInput[0].value) || (maxVal <= priceMobileInput[1].value)){
            if(e.target.className === "input__mobile__min"){
                rangeMobileInput[0].value = minVal;
                progressMobile.style.left = (minVal / rangeMobileInput[0].max) * 100 + "%";
            }else{
                rangeMobileInput[1].value = maxVal;
                progressMobile.style.right = 100 - (maxVal / rangeMobileInput[1].max) * 100 + "%";
            }
        }
    })
})

rangeMobileInput.forEach(input => {
    input.addEventListener("input", e => {

        let minVal = parseInt(rangeMobileInput[0].value),
        maxVal = parseInt(rangeMobileInput[1].value);


        if(maxVal - minVal < mobilePriceGap){
            if(e.target.className === "range__mobile__min"){
                rangeMobileInput[0].value = maxVal - mobilePriceGap;
            }else{
                rangeMobileInput[1].value = minVal + mobilePriceGap;
            }
        }else{
            priceMobileInput[0].value = minVal;
            priceMobileInput[1].value = maxVal;
            progressMobile.style.left = (minVal / rangeMobileInput[0].max) * 100 + "%";
            progressMobile.style.right = 100 - (maxVal / rangeMobileInput[1].max) * 100 + "%";
        }
    })
})

//DESKTOP PRICE FILTER

const rangeInput = document.querySelectorAll('.range__input input');
const priceInput = document.querySelectorAll('.filter__price-container input');
const progress = document.querySelector('.filter__slider-container .filter__slider-progress');

let priceGap = 30000;


priceInput.forEach(input => {
    input.addEventListener("input", e => {
        let minVal = parseInt(priceInput[0].value);
        let maxVal = parseInt(priceInput[1].value);
           

        if((minVal >= priceInput[0].value) || (maxVal <= priceInput[1].value)){
            if(e.target.className === "input__min"){
                rangeInput[0].value = minVal;
                progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
            }else{
                rangeInput[1].value = maxVal;
                progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
            }
        }
    })
})

rangeInput.forEach(input => {
    input.addEventListener("input", e => {

        let minVal = parseInt(rangeInput[0].value),
        maxVal = parseInt(rangeInput[1].value);


        if(maxVal - minVal < priceGap){
            if(e.target.className === "range__min"){
                rangeInput[0].value = maxVal - priceGap;
            }else{
                rangeInput[1].value = minVal + priceGap;
            }
        }else{
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
            progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }
    })
})

// PRODUCT ZOOM
const magnifyingArea = document.getElementById("magnifying_area");
const magnifyingImg = document.getElementById("magnifying_img");

magnifyingArea.addEventListener('mousemove', function(e){
    clientX = e.clientX - magnifyingArea.offsetLeft
    clientY = e.clientY - magnifyingArea.offsetTop

    mWidth = magnifyingArea.offsetWidth
    mHeight = magnifyingArea.offsetHeight

    clientX = clientX / mWidth * 100
    clientY = clientY / mHeight * 100

    magnifyingImg.style.transform = 'translate(-'+clientX+'%, -'+clientY+'%) scale(2)'
    // magnifyingImg.style.transform = 'translate(-50%,-50%) scale(2)'

})

magnifyingArea.addEventListener('mouseleave', function(){
    magnifyingImg.style.transform = 'translate(0%,0%) scale(1)'
})
