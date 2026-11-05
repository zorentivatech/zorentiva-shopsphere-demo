const products = [
  {id:1,name:"The Sculpted Blazer",category:"Women",type:"Tailoring",price:8490,tag:"BESTSELLER",image:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=85"},
  {id:2,name:"The Essential Knit",category:"Men",type:"Knitwear",price:4290,tag:"NEW",image:"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=85"},
  {id:3,name:"The Everyday Tote",category:"Accessories",type:"Leather goods",price:5690,tag:"LIMITED EDIT",image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=85"},
  {id:4,name:"The Modern Trench",category:"Women",type:"Outerwear",price:11990,tag:"NEW",image:"https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=800&q=85"},
  {id:5,name:"The Relaxed Shirt",category:"Men",type:"Essentials",price:3490,tag:"",image:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85"},
  {id:6,name:"The Minimal Watch",category:"Accessories",type:"Finishing touch",price:7290,tag:"CURATED",image:"https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=85"},
  {id:7,name:"The Evening Edit",category:"Women",type:"Occasionwear",price:9990,tag:"",image:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=85"},
  {id:8,name:"The Weekend Loafer",category:"Men",type:"Footwear",price:6490,tag:"NEW",image:"https://images.unsplash.com/photo-1614252369475-531切?auto=format&fit=crop&w=800&q=85"}
];
products[7].image = "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=85";

let cart = [];
let activeCategory = "All";
const money = value => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);
const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

function renderProducts(){
  const visible = activeCategory === "All" ? products : products.filter(p=>p.category===activeCategory);
  productGrid.innerHTML = visible.map(p=>`
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        <button class="quick-add" data-add="${p.id}">ADD TO BAG +</button>
      </div>
      <div class="product-info"><div class="product-meta"><div><p class="product-name">${p.name}</p><span class="product-category">${p.type}</span></div><span class="product-price">${money(p.price)}</span></div></div>
    </article>`).join("");
}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2200)}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("open");cartDrawer.setAttribute("aria-hidden","false")}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("open");cartDrawer.setAttribute("aria-hidden","true")}
function addToCart(id){const found=cart.find(item=>item.id===id);if(found)found.qty++;else cart.push({id,qty:1});renderCart();showToast("Added to your bag");}
function changeQty(id,delta){const item=cart.find(p=>p.id===id);if(!item)return;item.qty+=delta;if(item.qty<1)cart=cart.filter(p=>p.id!==id);renderCart()}
function renderCart(){
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  const total=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("subtotal").textContent=money(total);
  document.getElementById("checkoutTotal").textContent=money(total);
  const holder=document.getElementById("cartItems");
  if(!cart.length){holder.innerHTML='<div class="empty-cart">Your bag is waiting for something lovely.</div>';}
  else holder.innerHTML=cart.map(item=>{const p=products.find(product=>product.id===item.id);return `<div class="cart-row"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><small>${p.type}</small><div class="quantity"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button><button class="remove-item" data-remove="${p.id}">Remove</button></div></div><strong>${money(p.price*item.qty)}</strong></div>`}).join("");
  document.getElementById("checkoutButton").disabled=!cart.length;
}
function openCheckout(){
  if(!cart.length){showToast("Your bag is empty");return;}
  closeCart();document.getElementById("checkoutModal").classList.add("open");document.getElementById("checkoutModal").setAttribute("aria-hidden","false");
}
function closeCheckout(){document.getElementById("checkoutModal").classList.remove("open");document.getElementById("checkoutModal").setAttribute("aria-hidden","true")}
document.addEventListener("click",event=>{
  const add=event.target.closest("[data-add]");if(add)addToCart(Number(add.dataset.add));
  const qty=event.target.closest("[data-qty]");if(qty)changeQty(Number(qty.dataset.qty),Number(qty.dataset.delta));
  const remove=event.target.closest("[data-remove]");if(remove){cart=cart.filter(p=>p.id!==Number(remove.dataset.remove));renderCart()}
});
document.getElementById("categoryPills").addEventListener("click",event=>{
  const button=event.target.closest("[data-category]");if(!button)return;
  activeCategory=button.dataset.category;document.querySelectorAll(".pill").forEach(p=>p.classList.toggle("active",p===button));renderProducts();
});
document.getElementById("cartTrigger").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("continueShopping").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("checkoutButton").addEventListener("click",openCheckout);
document.getElementById("closeCheckout").addEventListener("click",closeCheckout);
document.getElementById("checkoutForm").addEventListener("submit",event=>{
  event.preventDefault();
  const form=new FormData(event.currentTarget);
  const customer=form.get("customerName").trim();
  const orderNumber="SS"+Math.floor(100000+Math.random()*900000);
  document.getElementById("checkoutContent").innerHTML=`<div class="success-state"><div class="success-icon">✓</div><p class="eyebrow">ORDER CONFIRMED · DEMO</p><h2>Thank you, ${customer.replace(/[<>]/g,"")}.</h2><p>Your sample order <strong>${orderNumber}</strong> has been placed in this demo experience. No payment was collected and no order details were saved.</p><button class="button button-dark full-button" id="finishOrder">CONTINUE EXPLORING <span>→</span></button></div>`;
  cart=[];renderCart();
  document.getElementById("finishOrder").addEventListener("click",()=>{closeCheckout();location.reload()});
});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(link=>link.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
