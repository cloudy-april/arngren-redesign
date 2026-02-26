/* Shared app logic (offline). Works with file:// and http:// */

(function(){
  const KEY_CART = "arngren_cart_v1";
  const KEY_WISH = "arngren_wish_v1";

  // ---- offline SVG thumbnails (no internet needed)
  function thumbSVG(kind, accent){
    const a = accent || "#1a4dd6";
    const label = String(kind || "ITEM").toUpperCase();
    return `
    <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${a}" stop-opacity="0.22"/>
          <stop offset="1" stop-color="#1f7a3a" stop-opacity="0.14"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="rgba(0,0,0,0.06)"/>
      <rect x="48" y="52" width="1104" height="696" rx="46" fill="url(#g)" stroke="rgba(0,0,0,0.12)" stroke-width="6"/>
      <circle cx="260" cy="260" r="120" fill="rgba(255,255,255,0.35)"/>
      <rect x="420" y="210" width="620" height="86" rx="18" fill="rgba(255,255,255,0.28)"/>
      <rect x="420" y="330" width="520" height="64" rx="18" fill="rgba(255,255,255,0.22)"/>
      <rect x="420" y="422" width="560" height="64" rx="18" fill="rgba(255,255,255,0.18)"/>
      <rect x="420" y="514" width="420" height="64" rx="18" fill="rgba(255,255,255,0.16)"/>
      <text x="98" y="710" font-family="Arial" font-size="64" font-weight="900" fill="rgba(0,0,0,0.65)">${label}</text>
    </svg>`;
  }

  // ---- demo catalog data with real product images
  const PRODUCTS = [
    {id:1,  name:"Falcon Pro GPS Drone X2", cat:"Drones", power:"Battery", price:799, newest:7, stock:true,  clearance:false, scale:"Professional",   motor:"Brushless", battery:"4S LiPo", desc:"GPS + stabilized 4K camera, return-to-home, 30min flight time.", kind:"Drone", accent:"#1a4dd6", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"},
    {id:2,  name:"SkyScout Mini Drone (Indoor)", cat:"Drones", power:"Battery", price:199, newest:10, stock:true, clearance:true,  scale:"Mini",   motor:"Brushed",   battery:"1S LiPo", desc:"Beginner-friendly drone, safe controls, HD camera.", kind:"Drone", accent:"#355cff", img:"https://images.unsplash.com/photo-1506399773649-6f3ee90b8ce0?w=400&h=400&fit=crop"},
    {id:3,  name:"VoltRide City E-Bike S", cat:"Electric Vehicles", power:"Battery", price:1199, newest:9, stock:true, clearance:false, scale:"Full-Size", motor:"500W Hub", battery:"48V", desc:"City e-bike with fast charging, 50km range, lightweight design.", kind:"E-Bike", accent:"#1f7a3a", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"},
    {id:4,  name:"EcoKart Electric Go-Kart", cat:"Electric Vehicles", power:"Battery", price:899, newest:5, stock:true, clearance:false, scale:"Standard", motor:"800W", battery:"48V", desc:"Compact go-kart for private use, professional-grade handling.", kind:"Go-Kart", accent:"#2b8a3e", img:"https://images.unsplash.com/photo-1599927921359-f29aa3ab6e4f?w=400&h=400&fit=crop"},
    {id:5,  name:"RC Tank 1/16 (Steel Look)", cat:"RC & Toys", power:"Battery", price:259, newest:8, stock:true, clearance:true,  scale:"1/16", motor:"Brushed", battery:"NiMH", desc:"Detailed RC tank for hobbyists, realistic movement and design.", kind:"RC Tank", accent:"#b45309", img:"https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop"},
    {id:6,  name:"Crawler RC 4x4 1/10", cat:"RC & Toys", power:"Battery", price:349, newest:6, stock:true, clearance:false, scale:"1/10", motor:"Brushed", battery:"2S LiPo", desc:"Rock crawler with extreme torque, all-terrain capability.", kind:"RC Car", accent:"#8b5cf6", img:"https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=400&h=400&fit=crop"},
    {id:7,  name:"Precision Solder Kit Pro", cat:"Tools", power:"Wired", price:129, newest:7, stock:true, clearance:false, scale:"Desktop", motor:"—", battery:"—", desc:"Professional electronics repair kit with soldering iron + 50 tips.", kind:"Solder Kit", accent:"#0f766e", img:"https://images.unsplash.com/photo-1585864299869-592a1dff5366?w=400&h=400&fit=crop"},
    {id:8,  name:"Workshop Rotary Tool 200W", cat:"Tools", power:"Wired", price:89, newest:4, stock:true, clearance:true,  scale:"Handheld", motor:"200W", battery:"—", desc:"Professional rotary tool with 50+ accessories for cutting & grinding.", kind:"Rotary Tool", accent:"#ef4444", img:"https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=400&fit=crop"},
    {id:9,  name:"Action Cam 4K Compact", cat:"Cameras", power:"Battery", price:149, newest:3, stock:true, clearance:false, scale:"Compact", motor:"—", battery:"4-hour battery", desc:"4K 60fps action camera with wide 170° lens and waterproof design.", kind:"Action Cam", accent:"#111827", img:"https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop"},
    {id:10, name:"Mini ATV Offroad 110cc", cat:"Electric Vehicles", power:"Gas", price:1399, newest:2, stock:false, clearance:false, scale:"Full-Size", motor:"110cc", battery:"—", desc:"Demo listing (out of stock) - Off-road ATV for extreme terrain.", kind:"ATV", accent:"#64748b", img:"https://images.unsplash.com/photo-1605559907676-2a1b3001113c?w=400&h=400&fit=crop"},
    
    // Additional Drones
    {id:11, name:"Phantom Vision FPV Racing Drone", cat:"Drones", power:"Battery", price:549, newest:11, stock:true, clearance:false, scale:"Racing", motor:"Brushless", battery:"4S LiPo", desc:"High-speed FPV racing drone with HD camera and stabilization.", kind:"Drone", accent:"#ff6b6b", img:"https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop"},
    {id:12, name:"HoverMax Beginner Quadcopter", cat:"Drones", power:"Battery", price:119, newest:12, stock:true, clearance:true, scale:"Mini", motor:"Brushed", battery:"1S LiPo", desc:"Perfect starter drone with one-button takeoff and landing.", kind:"Drone", accent:"#4ecdc4", img:"https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400&h=400&fit=crop"},
    {id:13, name:"AeroScan Industrial Inspection Drone", cat:"Drones", power:"Battery", price:1899, newest:13, stock:true, clearance:false, scale:"Professional", motor:"Brushless", battery:"6S LiPo", desc:"Professional-grade drone for industrial inspections and surveying.", kind:"Drone", accent:"#2c3e50", img:"https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400&h=400&fit=crop"},
    
    // Additional Electric Vehicles
    {id:14, name:"UrbanCruiser Electric Scooter", cat:"Electric Vehicles", power:"Battery", price:699, newest:14, stock:true, clearance:false, scale:"Compact", motor:"350W", battery:"36V", desc:"Foldable electric scooter for city commuting, 40km range.", kind:"E-Scooter", accent:"#16a085", img:"https://images.unsplash.com/photo-1568583784966-ddb9a82cc1e7?w=400&h=400&fit=crop"},
    {id:15, name:"SpeedWave Mountain E-Bike", cat:"Electric Vehicles", power:"Battery", price:1599, newest:15, stock:true, clearance:false, scale:"Full-Size", motor:"750W", battery:"52V", desc:"Powerful mountain e-bike with suspension and off-road capability.", kind:"E-Bike", accent:"#27ae60", img:"https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400&h=400&fit=crop"},
    {id:16, name:"CompactRide Folding E-Scooter", cat:"Electric Vehicles", power:"Battery", price:449, newest:16, stock:true, clearance:true, scale:"Compact", motor:"250W", battery:"24V", desc:"Ultra-portable folding scooter, perfect for last-mile travel.", kind:"E-Scooter", accent:"#f39c12", img:"https://images.unsplash.com/photo-1593787157173-09d16b261c01?w=400&h=400&fit=crop"},
    {id:17, name:"PowerBoard Electric Skateboard", cat:"Electric Vehicles", power:"Battery", price:599, newest:17, stock:true, clearance:false, scale:"Standard", motor:"Dual 500W", battery:"36V", desc:"Electric skateboard with wireless remote, 25km range.", kind:"E-Skateboard", accent:"#e74c3c", img:"https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=400&h=400&fit=crop"},
    
    // Additional RC & Toys
    {id:18, name:"Monster Truck RC 1/8 Scale", cat:"RC & Toys", power:"Battery", price:429, newest:18, stock:true, clearance:false, scale:"1/8", motor:"Brushless", battery:"3S LiPo", desc:"High-speed monster truck with all-terrain tires and suspension.", kind:"RC Car", accent:"#9b59b6", img:"https://images.unsplash.com/photo-1620825938334-87556fe5ba89?w=400&h=400&fit=crop"},
    {id:19, name:"RC Helicopter 6-Channel", cat:"RC & Toys", power:"Battery", price:299, newest:19, stock:true, clearance:false, scale:"Standard", motor:"Brushless", battery:"3S LiPo", desc:"6-channel RC helicopter with gyro stabilization and LED lights.", kind:"RC Helicopter", accent:"#e67e22", img:"https://images.unsplash.com/photo-1569144654912-5f146d08b98b?w=400&h=400&fit=crop"},
    {id:20, name:"RC Boat Speed Racing", cat:"RC & Toys", power:"Battery", price:249, newest:20, stock:true, clearance:true, scale:"Standard", motor:"Brushless", battery:"2S LiPo", desc:"Waterproof racing boat with 30mph top speed and self-righting.", kind:"RC Boat", accent:"#3498db", img:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=400&fit=crop"},
    {id:21, name:"RC Drift Car 1/10 AWD", cat:"RC & Toys", power:"Battery", price:379, newest:21, stock:true, clearance:false, scale:"1/10", motor:"Brushless", battery:"2S LiPo", desc:"All-wheel-drive drift car with customizable suspension and body.", kind:"RC Car", accent:"#34495e", img:"https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=400&fit=crop"},
    {id:22, name:"RC Airplane Glider Trainer", cat:"RC & Toys", power:"Battery", price:189, newest:22, stock:true, clearance:false, scale:"Trainer", motor:"Brushed", battery:"1S LiPo", desc:"Beginner-friendly RC glider with easy flight characteristics.", kind:"RC Plane", accent:"#1abc9c", img:"https://images.unsplash.com/photo-1569144654912-5f146d08b98b?w=400&h=400&fit=crop"},
    
    // Additional Tools
    {id:23, name:"MultiTool Pro Cordless Kit", cat:"Tools", power:"Battery", price:299, newest:23, stock:true, clearance:false, scale:"Professional", motor:"18V", battery:"Li-Ion", desc:"Professional cordless multi-tool kit with 6 attachments.", kind:"Multi-Tool", accent:"#c0392b", img:"https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop"},
    {id:24, name:"Digital Oscilloscope 100MHz", cat:"Tools", power:"Wired", price:449, newest:24, stock:true, clearance:false, scale:"Desktop", motor:"—", battery:"—", desc:"Professional digital oscilloscope with 100MHz bandwidth.", kind:"Oscilloscope", accent:"#8e44ad", img:"https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop"},
    {id:25, name:"Heat Gun Industrial 2000W", cat:"Tools", power:"Wired", price:79, newest:25, stock:true, clearance:true, scale:"Handheld", motor:"2000W", battery:"—", desc:"Industrial heat gun with adjustable temperature and air flow.", kind:"Heat Gun", accent:"#d35400", img:"https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop"},
    {id:26, name:"3D Printer Filament PLA 1kg", cat:"Tools", power:"Wired", price:29, newest:26, stock:true, clearance:false, scale:"Standard", motor:"—", battery:"—", desc:"High-quality PLA filament for 3D printing, multiple colors.", kind:"Filament", accent:"#95a5a6", img:"https://images.unsplash.com/photo-1636690598982-0afcefbb4397?w=400&h=400&fit=crop"},
    {id:27, name:"Laser Engraver 5W Desktop", cat:"Tools", power:"Wired", price:349, newest:27, stock:true, clearance:false, scale:"Desktop", motor:"5W Laser", battery:"—", desc:"Compact laser engraver for wood, leather, and acrylic.", kind:"Laser Engraver", accent:"#7f8c8d", img:"https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop"},
    
    // Additional Cameras
    {id:28, name:"Pro DSLR Camera Body 42MP", cat:"Cameras", power:"Battery", price:2199, newest:28, stock:true, clearance:false, scale:"Professional", motor:"—", battery:"LP-E6N", desc:"Professional DSLR camera body with 42MP full-frame sensor.", kind:"DSLR", accent:"#2c3e50", img:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop"},
    {id:29, name:"Mirrorless Camera Kit 24MP", cat:"Cameras", power:"Battery", price:1299, newest:29, stock:true, clearance:false, scale:"Standard", motor:"—", battery:"NP-FW50", desc:"Mirrorless camera with 24MP sensor and 18-55mm lens kit.", kind:"Mirrorless", accent:"#34495e", img:"https://images.unsplash.com/photo-1606980707002-22350ba77e3a?w=400&h=400&fit=crop"},
    {id:30, name:"Instant Camera Polaroid Style", cat:"Cameras", power:"Battery", price:99, newest:30, stock:true, clearance:true, scale:"Compact", motor:"—", battery:"AA Batteries", desc:"Instant camera with auto-exposure and built-in flash.", kind:"Instant Camera", accent:"#e84393", img:"https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop"},
    {id:31, name:"Security Camera 4K Night Vision", cat:"Cameras", power:"Wired", price:179, newest:31, stock:true, clearance:false, scale:"Standard", motor:"—", battery:"—", desc:"4K security camera with night vision and motion detection.", kind:"Security Cam", accent:"#2c3e50", img:"https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=400&fit=crop"},
    {id:32, name:"Webcam HD 1080p Pro", cat:"Cameras", power:"Wired", price:89, newest:32, stock:true, clearance:false, scale:"Compact", motor:"—", battery:"—", desc:"Professional HD webcam with auto-focus and ring light.", kind:"Webcam", accent:"#0984e3", img:"https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop"},
    {id:33, name:"GoPro Style Action Cam 5K", cat:"Cameras", power:"Battery", price:399, newest:33, stock:true, clearance:false, scale:"Compact", motor:"—", battery:"8-hour battery", desc:"5K action camera with waterproof case and image stabilization.", kind:"Action Cam", accent:"#6c5ce7", img:"https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop"}
  ];

  // ---- storage helpers
  function loadJSON(key, fallback){
    try{ return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch{ return fallback; }
  }
  function saveJSON(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  function loadCartObj(){ return loadJSON(KEY_CART, {}); }        // {id: qty}
  function saveCartObj(o){ saveJSON(KEY_CART, o); }
  function loadWishArr(){ return loadJSON(KEY_WISH, []); }        // [id, id]
  function saveWishArr(a){ saveJSON(KEY_WISH, a); }

  function getProduct(id){
    id = Number(id);
    return PRODUCTS.find(p=>p.id===id) || null;
  }

  function cartCount(){
    const o = loadCartObj();
    let c = 0;
    for(const k in o) c += Number(o[k] || 0);
    return c;
  }

  function syncHeaderCounts(){
    const cartEl = document.getElementById("cartCount");
    const wishEl = document.getElementById("wishCount");
    if(cartEl) cartEl.textContent = String(cartCount());
    if(wishEl) wishEl.textContent = String(loadWishArr().length);
  }

  function toggleWish(id){
    id = Number(id);
    const a = loadWishArr();
    const idx = a.indexOf(id);
    let on = false;
    if(idx >= 0){ a.splice(idx,1); on = false; }
    else { a.push(id); on = true; }
    saveWishArr(a);
    syncHeaderCounts();
    return on;
  }

  function addToCart(id, qty){
    id = Number(id);
    qty = Number(qty || 1);
    const p = getProduct(id);
    if(!p || !p.stock) return false;

    const o = loadCartObj();
    o[id] = Number(o[id] || 0) + qty;
    if(o[id] < 1) delete o[id];
    saveCartObj(o);
    syncHeaderCounts();
    return true;
  }

  function setCartQty(id, qty){
    id = Number(id);
    qty = Number(qty || 0);
    const o = loadCartObj();
    if(qty <= 0) delete o[id];
    else o[id] = qty;
    saveCartObj(o);
    syncHeaderCounts();
  }

  function clearCart(){
    saveCartObj({});
    syncHeaderCounts();
  }

  function readCartItems(){
    const o = loadCartObj();
    const items = [];
    for(const k in o){
      const p = getProduct(k);
      if(p) items.push({p, qty:Number(o[k]||0)});
    }
    return items;
  }

  // ---- toast helper (optional)
  function showToast(title, text){
    const t = document.getElementById("toast");
    if(!t) return;
    const tt = document.getElementById("toastTitle");
    const tx = document.getElementById("toastText");
    if(tt) tt.textContent = title;
    if(tx) tx.textContent = text;
    t.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(()=> t.classList.remove("show"), 2400);
  }

  // ---- expose API globally
  window.ArngrenApp = {
    PRODUCTS,
    thumbSVG,
    getProduct,
    syncHeaderCounts,
    toggleWish,
    addToCart,
    setCartQty,
    clearCart,
    readCartItems,
    showToast
  };
})();