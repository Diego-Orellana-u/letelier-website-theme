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

// const rangeInput = document.querySelectorAll('.range__input input');
// const priceInput = document.querySelectorAll('.filter__price-container input');
// const progress = document.querySelector('.filter__slider-container .filter__slider-progress');

// let priceGap = 30000;


// priceInput.forEach(input => {
//     input.addEventListener("input", e => {
//         let minVal = parseInt(priceInput[0].value);
//         let maxVal = parseInt(priceInput[1].value);
           

//         if((minVal >= priceInput[0].value) || (maxVal <= priceInput[1].value)){
//             if(e.target.className === "input__min"){
//                 rangeInput[0].value = minVal;
//                 progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
//             }else{
//                 rangeInput[1].value = maxVal;
//                 progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
//             }
//         }
//     })
// })

// rangeInput.forEach(input => {
//     input.addEventListener("input", e => {

//         let minVal = parseInt(rangeInput[0].value),
//         maxVal = parseInt(rangeInput[1].value);


//         if(maxVal - minVal < priceGap){
//             if(e.target.className === "range__min"){
//                 rangeInput[0].value = maxVal - priceGap;
//             }else{
//                 rangeInput[1].value = minVal + priceGap;
//             }
//         }else{
//             priceInput[0].value = minVal;
//             priceInput[1].value = maxVal;
//             progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
//             progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
//         }
//     })
// })

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