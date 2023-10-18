//cart variables
const productForms = document.querySelectorAll('form[action="/cart/add"');
const cartToggle = document.getElementById('cart-toggle');
const cartDrawer = document.querySelector('.mini__cart-container');
const cartClose = document.querySelectorAll('.mini__cart-close, .drawer__overlay');
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

cartClose.forEach(c =>{
    c.addEventListener('click', () => {
        closeCart()
    })
})

async function updateCart(){
    const res = await fetch("/?section_id=cart-drawer");
    const text = await res.text();
    const html = document.createElement('div');
    html.innerHTML = text;

    const newContainer = html.querySelector(".mini__cart-container").innerHTML;
    document.querySelector('.mini__cart-container').innerHTML = newContainer;
}

cartToggle.addEventListener('click', () => {
    openCart()
})

document.querySelector(".mini__cart-container").addEventListener("click", (e) => {
    e.stopPropagation();
})

productForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        //submit form
        await fetch('/cart/add', {
            method: "post",
            body: new FormData(form),
        })

        //update cart
        await updateCart()

        //open cart
        openCart()
    })
})