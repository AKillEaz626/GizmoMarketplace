import './style.css';

interface Product {
  title: string;
  description: string;
  badge: string;
  tags: string[];
  category: string;
  price: string;
  status: string;
}

const products: Product[] = [
  {
    title: 'Industrial Fan Shroud',
    description: 'Durable part designed for airflow systems. Compatible with PLA, ABS, and PETG for robust manufacturing.',
    badge: 'Commercial Use',
    tags: ['PLA', 'ABS', 'PETG', 'Engineering'],
    category: 'Industrial',
    price: '$49',
    status: 'Ready to print',
  },
  {
    title: 'Adjustable Tablet Stand',
    description: 'Multi-angle stand with cable routing. Licensed for commercial distribution and print production.',
    badge: 'Verified',
    tags: ['Accessories', 'Home', 'Office'],
    category: 'Consumer',
    price: '$35',
    status: 'Fast turnaround',
  },
  {
    title: 'Architectural Model Kit',
    description: 'Modular building pieces with clean detail. Ideal for scaled prototypes and display models.',
    badge: 'Quality Print',
    tags: ['Architecture', 'Display', 'Prototype'],
    category: 'Concept',
    price: '$65',
    status: 'Commercial license',
  },
  {
    title: 'Ergonomic Handle Grip',
    description: 'Comfort-driven design for tools and devices. Approved for production and shipping at scale.',
    badge: 'Best Seller',
    tags: ['Product', 'Tooling', 'Manufacturing'],
    category: 'Industrial',
    price: '$29',
    status: 'Ship-ready',
  },
  {
    title: 'Modular Drone Mount',
    description: 'Custom-fit mount designed for resilient outdoor use. Legal for commercial production and distribution.',
    badge: 'Commercial Use',
    tags: ['Drone', 'Outdoor', 'Technical'],
    category: 'Aerospace',
    price: '$58',
    status: 'Verified design',
  },
  {
    title: 'Retail Display Hook',
    description: 'Minimalist retail fixture designed for display and organization. Clear license for resell-ready prints.',
    badge: 'Verified',
    tags: ['Retail', 'Display', 'Commercial'],
    category: 'Retail',
    price: '$19',
    status: 'Printer-approved',
  },
];

interface User {
  email: string;
  password: string;
  username: string;
  role: 'buyer' | 'creator';
  avatar?: string;
}

interface Printer {
  id: string;
  username: string;
  rating: number; // 1-5 stars
  reviews: number;
  basePrice: number; // multiplied by rating
  turnaroundDays: number;
  materials: string[];
}

// Mock printers for local testing
const printers: Printer[] = [
  {
    id: 'printer1',
    username: 'FastPrint Co',
    rating: 4.8,
    reviews: 42,
    basePrice: 100,
    turnaroundDays: 3,
    materials: ['PLA', 'ABS', 'PETG'],
  },
  {
    id: 'printer2',
    username: 'Quality Prints LLC',
    rating: 4.5,
    reviews: 28,
    basePrice: 120,
    turnaroundDays: 5,
    materials: ['PLA', 'Resin', 'Nylon'],
  },
  {
    id: 'printer3',
    username: 'Budget 3D Prints',
    rating: 4.0,
    reviews: 15,
    basePrice: 80,
    turnaroundDays: 7,
    materials: ['PLA', 'ABS'],
  },
];

// Mock users for local testing
const users: User[] = [
  { email: 'creator@example.com', password: 'pass123', username: 'AliceDesigner', role: 'creator' },
  { email: 'buyer@example.com', password: 'pass123', username: 'BobBuyer', role: 'buyer' },
];

let currentUser: User | null = null;
let selectedDesignId: string | null = null;

interface CartItem {
  productTitle: string;
  printerId: string;
  quantity: number;
}

let cartItems: CartItem[] = [];
let lastOrderCount = 0;
let lastOrderTotal = 0;

const getProduct = (title: string) => products.find((product) => product.title === title);
const getPrinter = (id: string) => printers.find((printer) => printer.id === id);
const getCartCount = () => cartItems.reduce((count, item) => count + item.quantity, 0);
const getCartTotal = () =>
  cartItems.reduce((total, item) => {
    const product = getProduct(item.productTitle);
    const printer = getPrinter(item.printerId);
    const productPrice = product ? Number(product.price.replace('$', '')) : 0;
    const printerFee = printer ? printer.basePrice : 0;
    return total + (productPrice + printerFee) * item.quantity;
  }, 0);

const STORAGE_USER_KEY = 'gizmo-current-user';
const STORAGE_CART_KEY = 'gizmo-cart-items';
const STORAGE_DESIGNS_KEY = 'gizmo-user-designs';

const saveUserToStorage = () => {
  if (currentUser) {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
  } else {
    localStorage.removeItem(STORAGE_USER_KEY);
  }
};

const loadUserFromStorage = (): User | null => {
  const raw = localStorage.getItem(STORAGE_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveCartToStorage = () => {
  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems));
};

const saveDesignsToStorage = () => {
  const savedDesigns = products.filter((product: any) => product.author);
  localStorage.setItem(STORAGE_DESIGNS_KEY, JSON.stringify(savedDesigns));
};

const loadDesignsFromStorage = () => {
  const raw = localStorage.getItem(STORAGE_DESIGNS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const loadCartFromStorage = () => {
  const raw = localStorage.getItem(STORAGE_CART_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const initializeAppState = () => {
  currentUser = loadUserFromStorage();
  cartItems = loadCartFromStorage();
  const storedDesigns = loadDesignsFromStorage();
  if (storedDesigns.length) {
    products.push(...storedDesigns);
  }
};

const getHeaderHTML = () => {
  if (currentUser) {
    const isCreator = currentUser.role === 'creator';
    return `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="logo" href="#" data-page="home">Gizmo Marketplace</a>
        <nav>
          ${isCreator ? '<a href="#" data-page="workshop">My Workshop</a>' : ''}
          <a href="#" data-page="cart" class="cart-link">Cart (${getCartCount()})</a>
        </nav>
        <div class="header-right">
          <span class="username">${currentUser.username}</span>
          <button id="profileBtn" class="avatar">${currentUser.username.charAt(0).toUpperCase()}</button>
          <div id="profileDropdown" class="profile-dropdown">
            <a href="#" data-page="profile">Profile</a>
            <a href="#" data-page="settings">Settings</a>
            <a href="#" data-page="security">Security</a>
            <a href="#" data-page="payment">Payment</a>
            <a href="#" data-page="help">Ask for help</a>
            <a href="#" id="logoutBtn">Log out</a>
          </div>
        </div>
      </div>
    </header>
    `;
  }

  return `
    <header class="topbar">
      <div class="topbar-inner">
        <div class="logo-stack">
          <a class="logo" href="#" data-page="home">Gizmo Marketplace</a>
          <p class="logo-tagline">Buy, Sell, Create, Dream</p>
        </div>
        <nav class="header-links">
          <div class="primary-links">
            <a href="#" class="auth-link login">Login</a>
            <a href="#" class="auth-link signup">Sign up</a>
          </div>
          <div class="secondary-links">
            <a href="#" data-page="info">How it works</a>
            <a href="#" data-page="cart" class="cart-link">Cart (${getCartCount()})</a>
          </div>
        </nav>
      </div>
    </header>
  `;
};

const app = document.querySelector<HTMLDivElement>('#app');

const filterProducts = (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return products;
  return products.filter((product) => {
    return (
      product.title.toLowerCase().includes(normalized) ||
      product.description.toLowerCase().includes(normalized) ||
      product.badge.toLowerCase().includes(normalized) ||
      product.tags.some((tag) => tag.toLowerCase().includes(normalized)) ||
      product.category.toLowerCase().includes(normalized)
    );
  });
};

const renderProductGrid = (items: Product[]) => {
  return items
    .map(
      (product) => `
        <article class="product-card" data-product-title="${product.title}">
          <div class="product-card-badge">${product.badge}</div>
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <div class="product-meta">
            <span>${product.category}</span>
            <span>${product.price}</span>
            <span>${product.status}</span>
          </div>
          <div class="tag-list">
            ${product.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </article>
      `,
    )
    .join('');
};

const renderPopularList = (items: Product[]) => {
  return items
    .map(
      (p) => `
      <article class="popular-item">
        <h3>${p.title} <span class="popular-price">${p.price}</span></h3>
        <p class="popular-desc">${p.description}</p>
      </article>
    `,
    )
    .join('');
};

if (app) {
  const renderHomePage = () => `
    ${getHeaderHTML()}

    <main class="page-shell" id="home">
      <section class="search-section">
        <div class="search-container">
          <input type="search" id="topSearchInput" placeholder="Search designs, materials, categories..." aria-label="Search marketplace" />
        </div>
        <div class="filter-links">
          <a href="#trending" class="filter-link">Trending</a>
          <a href="#popular" class="filter-link">Popular</a>
          <a href="#for-you" class="filter-link">For you</a>
          <a href="#random" class="filter-link">Random</a>
        </div>
      </section>

      <section class="popular-section">
        <div class="section-heading">
          <p class="eyebrow">Popular Prints</p>
          <h2>Most popular prints</h2>
        </div>
        <div id="popularList" class="popular-list"></div>
      </section>

      <section class="gallery-section">
        <div class="section-heading">
          <p class="eyebrow">Product Gallery</p>
          <h2>Search commercial-ready designs for print and delivery.</h2>
          <div class="search-bar">
            <input id="searchInput" type="search" placeholder="Search by design, category, or material" aria-label="Search products" />
            <span class="search-hint">Try "drone", "display", or "PLA"</span>
          </div>
        </div>
        <div id="galleryGrid" class="gallery-grid"></div>
      </section>

      <section id="contact" class="contact-section">
        <h2>Ready to connect your designs, printers, and buyers?</h2>
        <p>Launch the marketplace for your 3D print community or preview the platform with a demo listing.</p>
        <a class="button primary" href="mailto:hello@gizmostoreprintshop.com">Request access</a>
      </section>
    </main>
  `;

  const renderInfoPage = () => `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="logo" href="#" data-page="home">Gizmo Marketplace</a>
          <a href="#" class="auth-link">Login</a>
          <a href="#" class="auth-link signup">Sign up</a>
        <nav>
          <a href="#" data-page="home">Browse</a>
        </nav>
      </div>
    </header>

    <main class="page-shell">
      <section id="how-it-works" class="steps-section">
        <div class="section-heading center">
          <p class="eyebrow">How it works</p>
          <h2>Marketplace workflow for designs, printing, and delivery.</h2>
        </div>
        <div class="steps-grid">
          <article class="step-card">
            <span>1</span>
            <h3>Designer uploads</h3>
            <p>Submit CAD files, add photos, specify print settings, and publish your design to the marketplace.</p>
          </article>
          <article class="step-card">
            <span>2</span>
            <h3>Printer accepts</h3>
            <p>Print partners select jobs, quote materials, and confirm production details before manufacturing.</p>
          </article>
          <article class="step-card">
            <span>3</span>
            <h3>Buyer orders</h3>
            <p>Buyers choose a design, pay for the print and delivery, and track the order until it arrives.</p>
          </article>
          <article class="step-card">
            <span>4</span>
            <h3>Profit sharing</h3>
            <p>Revenue is split so designers earn royalties, printers earn production fees, and the platform earns service commissions.</p>
          </article>
        </div>
      </section>

      <section class="hero">
        <div>
          <p class="eyebrow">Create · Print · Deliver</p>
          <h1>Connect 3D designers, printers, and buyers in one marketplace.</h1>
          <p class="description">
            Upload any 3D design file, match it with local or remote 3D printers, and let buyers discover finished prints with shipping built in.
            Designers earn royalties, printers earn production fees, and the platform earns for every successful order.
          </p>
          <div class="actions">
            <a class="button primary" href="#" data-page="home">Join as a designer</a>
            <a class="button secondary" href="#" data-page="home">Start browsing</a>
          </div>
        </div>

        <div class="hero-card">
          <h2>One marketplace for every role</h2>
          <p>From CAD files to finished products, the workflow is designed for designers, print partners, and buyers alike.</p>
          <ul>
            <li>Designer uploads, preview, and royalty tracking</li>
            <li>Printer quotes, production, and shipment management</li>
            <li>Buyer browsing, checkout, and delivery notifications</li>
          </ul>
        </div>
      </section>

      <section id="designers" class="role-section">
        <div class="section-heading">
          <p class="eyebrow">For Designers</p>
          <h2>Share your 3D creations and earn every time they print.</h2>
        </div>
        <div class="roles-grid">
          <article class="role-card">
            <h3>Upload any CAD file</h3>
            <p>Send STL, OBJ, STEP, or other common print-ready formats from Tinkercad, FreeCAD, Fusion 360, and more.</p>
          </article>
          <article class="role-card">
            <h3>Protect your design</h3>
            <p>Designers keep intellectual property control while the platform handles order processing and payments.</p>
          </article>
          <article class="role-card">
            <h3>Earn royalties</h3>
            <p>Receive a share of every sale when a printer produces your design and ships the final model.</p>
          </article>
        </div>
      </section>

      <section id="printers" class="role-section alternate">
        <div class="section-heading">
          <p class="eyebrow">For Print Partners</p>
          <h2>Turn designs into products and ship them to buyers.</h2>
        </div>
        <div class="roles-grid">
          <article class="role-card">
            <h3>Build with confidence</h3>
            <p>Access verified designs and manage print jobs from your printer dashboard.</p>
          </article>
          <article class="role-card">
            <h3>Quote and fulfill</h3>
            <p>Set your print pricing and shipping terms, then accept orders that fit your capacity.</p>
          </article>
          <article class="role-card">
            <h3>Get paid fast</h3>
            <p>Earn a share of each order once the print is complete and shipped to the buyer.</p>
          </article>
        </div>
      </section>

      <section id="buyers" class="role-section">
        <div class="section-heading">
          <p class="eyebrow">For Buyers</p>
          <h2>Browse, customize, and order printed 3D models with delivery included.</h2>
        </div>
        <div class="roles-grid">
          <article class="role-card">
            <h3>Explore thousands of designs</h3>
            <p>Search by category, material, or style and preview the final product before ordering.</p>
          </article>
          <article class="role-card">
            <h3>Choose the best printer</h3>
            <p>Pick a nearby or specialty printer with reviews, production speed, and shipping options.</p>
          </article>
          <article class="role-card">
            <h3>Track your order</h3>
            <p>Receive status updates from printing through shipping, so your item arrives as expected.</p>
          </article>
        </div>
      </section>
    </main>
  `;

  const renderLoginPage = () => `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="logo" href="#" data-page="home">Gizmo Marketplace</a>
      </div>
    </header>
    <main class="page-shell">
      <section class="auth-container">
        <div class="auth-card">
          <h1>Choose your account type</h1>
          <p>Log in as a buyer or as a creator (designer or printer).</p>
          <div class="role-buttons">
            <button class="role-btn" data-role="buyer">
              <h3>Buyer</h3>
              <p>Browse and purchase 3D prints</p>
            </button>
            <button class="role-btn" data-role="creator">
              <h3>Designer or Printer</h3>
              <p>Upload designs or print orders</p>
            </button>
          </div>
          <p class="back-link"><a href="#" data-page="home">← Back to marketplace</a></p>
        </div>
      </section>
    </main>
  `;

  const renderBuyerLogin = () => `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="logo" href="#" data-page="home">Gizmo Marketplace</a>
      </div>
    </header>
    <main class="page-shell">
      <section class="auth-container">
        <div class="auth-card">
          <h1>Buyer Login</h1>
          <form id="buyerLoginForm" class="auth-form">
            <label>Email</label>
            <input id="buyerEmail" type="email" placeholder="your@email.com" required />
            <label>Password</label>
            <input id="buyerPassword" type="password" placeholder="••••••••" required />
            <div id="buyerAuthError" class="auth-error"></div>
            <button type="submit" class="button primary">Log in</button>
          </form>
          <div class="auth-links">
            <a href="#" data-page="forgot-password">Forgot password?</a>
            <a href="#" data-page="forgot-login">Forgot login?</a>
          </div>
          <p class="back-link"><a href="#" data-page="login">← Choose account type</a></p>
        </div>
      </section>
    </main>
  `;

  const renderCreatorLogin = () => `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="logo" href="#" data-page="home">Gizmo Marketplace</a>
      </div>
    </header>
    <main class="page-shell">
      <section class="auth-container">
        <div class="auth-card">
          <h1>Designer & Printer Login</h1>
          <form id="creatorLoginForm" class="auth-form">
            <label>Email</label>
            <input id="creatorEmail" type="email" placeholder="your@email.com" required />
            <label>Password</label>
            <input id="creatorPassword" type="password" placeholder="••••••••" required />
            <div id="creatorAuthError" class="auth-error"></div>
            <button type="submit" class="button primary">Log in</button>
          </form>
          <div class="auth-links">
            <a href="#" data-page="forgot-password">Forgot password?</a>
            <a href="#" data-page="forgot-login">Forgot login?</a>
          </div>
          <p class="back-link"><a href="#" data-page="login">← Choose account type</a></p>
        </div>
      </section>
    </main>
  `;

  const renderEmailVerification = () => `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="logo" href="#" data-page="home">Gizmo Marketplace</a>
      </div>
    </header>
    <main class="page-shell">
      <section class="auth-container">
        <div class="auth-card">
          <h1>Verify Your Email</h1>
          <p>We sent a verification code to your email. Enter it below to continue.</p>
          <form id="verificationForm" class="auth-form">
            <label>Verification Code</label>
            <input type="text" placeholder="000000" maxlength="6" required />
            <button type="submit" class="button primary">Verify Email</button>
          </form>
          <p class="resend-text">Didn't receive a code? <a href="#" class="link">Resend</a></p>
          <p class="back-link"><a href="#" data-page="login">← Back</a></p>
        </div>
      </section>
    </main>
  `;

  const renderForgotPassword = () => `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="logo" href="#" data-page="home">Gizmo Marketplace</a>
      </div>
    </header>
    <main class="page-shell">
      <section class="auth-container">
        <div class="auth-card">
          <h1>Reset Password</h1>
          <p>Enter the email associated with your account and we'll send you a reset link.</p>
          <form id="forgotPasswordForm" class="auth-form">
            <label>Email</label>
            <input type="email" placeholder="your@email.com" required />
            <button type="submit" class="button primary">Send Reset Link</button>
          </form>
          <p class="back-link"><a href="#" data-page="login">← Back to login</a></p>
        </div>
      </section>
    </main>
  `;

  const renderForgotLogin = () => `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="logo" href="#" data-page="home">Gizmo Marketplace</a>
      </div>
    </header>
    <main class="page-shell">
      <section class="auth-container">
        <div class="auth-card">
          <h1>Find Your Account</h1>
          <p>Enter the email or phone number you used to create your account.</p>
          <form id="forgotLoginForm" class="auth-form">
            <label>Email or Phone</label>
            <input type="text" placeholder="your@email.com or +1 (555) 000-0000" required />
            <button type="submit" class="button primary">Find Account</button>
          </form>
          <p class="back-link"><a href="#" data-page="login">← Back to login</a></p>
        </div>
      </section>
    </main>
  `;

  let currentPage = 'home';

  const renderDesignDetailPage = (productId: string) => `
    ${getHeaderHTML()}
    <main class="page-shell" id="design-detail">
      <section class="detail-header">
        <a href="#" data-page="home" class="back-link">← Back to browse</a>
      </section>
      <section class="design-detail-container">
        <div class="design-info">
          <div class="design-preview">
            <div class="preview-placeholder">3D Model Preview</div>
          </div>
          <div class="design-meta">
            <h1>${products.find(p => p.title === productId)?.title || 'Design Title'}</h1>
            <p class="designer">By Designer Name</p>
            <p class="description">${products.find(p => p.title === productId)?.description}</p>
            
            <div class="design-specs">
              <h3>Specifications</h3>
              <div class="specs-grid">
                <div class="spec">
                  <label>Category</label>
                  <span>${products.find(p => p.title === productId)?.category}</span>
                </div>
                <div class="spec">
                  <label>Materials</label>
                  <span>${products.find(p => p.title === productId)?.tags.join(', ')}</span>
                </div>
                <div class="spec">
                  <label>File Format</label>
                  <span>STL, OBJ, STEP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="printer-options">
          <h2>Choose a printer</h2>
          <p>Prices and turnaround vary by printer quality and availability</p>
          <div class="printer-list">
            ${printers
              .map(
                (printer) => `
              <article class="printer-option">
                <div class="printer-header">
                  <h3>${printer.username}</h3>
                  <div class="rating">
                    <span class="stars">★ ${printer.rating}</span>
                    <span class="reviews">(${printer.reviews} reviews)</span>
                  </div>
                </div>
                <div class="printer-details">
                  <div class="detail-row">
                    <span>Materials:</span>
                    <strong>${printer.materials.join(', ')}</strong>
                  </div>
                  <div class="detail-row">
                    <span>Turnaround:</span>
                    <strong>${printer.turnaroundDays} days</strong>
                  </div>
                  <div class="detail-row">
                    <span>Base price:</span>
                    <strong>$${printer.basePrice}</strong>
                  </div>
                </div>
                <button class="button primary select-printer" data-printer-id="${printer.id}">
                  Select & Add to Cart
                </button>
              </article>
            `,
              )
              .join('')}
          </div>
        </div>
      </section>
    </main>
  `;

  const renderDesignerUploadPage = () => `
    ${getHeaderHTML()}
    <main class="page-shell" id="designer-upload">
      <section class="upload-header">
        <h1>Upload a New Design</h1>
        <p>Share your 3D creation with the marketplace</p>
      </section>

      <section class="upload-form-container">
        <form id="designUploadForm" class="design-upload-form">
          
          <fieldset>
            <legend>Design Information</legend>
            
            <div class="form-group">
              <label for="designTitle">Design Title *</label>
              <input type="text" id="designTitle" placeholder="e.g., Industrial Fan Shroud" required />
            </div>

            <div class="form-group">
              <label for="designDescription">Description *</label>
              <textarea id="designDescription" placeholder="Describe your design, materials, use cases..." rows="4" required></textarea>
            </div>

            <div class="form-group">
              <label for="designCategory">Category *</label>
              <select id="designCategory" required>
                <option value="">Select a category</option>
                <option value="consumer">Consumer</option>
                <option value="industrial">Industrial</option>
                <option value="aerospace">Aerospace</option>
                <option value="retail">Retail</option>
                <option value="concept">Concept</option>
              </select>
            </div>

            <div class="form-group">
              <label for="designTags">Tags (comma separated)</label>
              <input type="text" id="designTags" placeholder="e.g., PLA, ABS, PETG, Engineering" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Files & Specifications</legend>
            
            <div class="form-group">
              <label for="designFile">Upload CAD File *</label>
              <input type="file" id="designFile" accept=".stl,.obj,.step" required />
              <small>Accepted formats: STL, OBJ, STEP</small>
            </div>

            <div class="form-group">
              <label for="designImage">Preview Image</label>
              <input type="file" id="designImage" accept="image/*" />
            </div>

            <div class="form-group">
              <label for="designMaterials">Recommended Materials</label>
              <div class="checkbox-group">
                <label><input type="checkbox" name="material" value="PLA" /> PLA</label>
                <label><input type="checkbox" name="material" value="ABS" /> ABS</label>
                <label><input type="checkbox" name="material" value="PETG" /> PETG</label>
                <label><input type="checkbox" name="material" value="Resin" /> Resin</label>
                <label><input type="checkbox" name="material" value="Nylon" /> Nylon</label>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Pricing & License</legend>
            
            <div class="form-group">
              <label for="designPrice">Royalty per Sale ($) *</label>
              <input type="number" id="designPrice" placeholder="10.00" step="0.01" required />
              <small>You earn this amount each time a printer sells your design</small>
            </div>

            <div class="form-group">
              <label for="designLicense">License Type *</label>
              <select id="designLicense" required>
                <option value="">Select a license</option>
                <option value="personal">Personal Use Only</option>
                <option value="commercial">Commercial Use</option>
                <option value="derivative">Derivative Works Allowed</option>
              </select>
            </div>

            <div class="form-group">
              <label>
                <input type="checkbox" id="designTerms" required />
                I confirm this design is my original work
              </label>
            </div>
          </fieldset>

          <div class="form-actions">
            <button type="submit" class="button primary">Upload Design</button>
            <a href="#" data-page="workshop" class="button secondary">Cancel</a>
          </div>
        </form>
      </section>
    </main>
  `;

  const renderPage = (page: string) => {
    switch (page) {
      case 'design-detail':
        if (selectedDesignId) {
          app.innerHTML = renderDesignDetailPage(selectedDesignId);
        } else {
          renderPage('home');
        }
        break;
      case 'upload-design':
        if (currentUser && currentUser.role === 'creator') {
          app.innerHTML = renderDesignerUploadPage();
        } else {
          renderPage('login');
        }
        break;
      case 'workshop':
        app.innerHTML = renderWorkshopPage();
        break;
      case 'info':
        app.innerHTML = renderInfoPage();
        break;
      case 'login':
        app.innerHTML = renderLoginPage();
        break;
      case 'login-buyer':
        app.innerHTML = renderBuyerLogin();
        break;
      case 'login-creator':
        app.innerHTML = renderCreatorLogin();
        break;
      case 'verify-email':
        app.innerHTML = renderEmailVerification();
        break;
      case 'forgot-password':
        app.innerHTML = renderForgotPassword();
        break;
      case 'forgot-login':
        app.innerHTML = renderForgotLogin();
        break;
      default:
        app.innerHTML = renderHomePage();
        page = 'home';
    }
    currentPage = page;
    attachEventListeners();
    
    if (page === 'home') {
      setupGallery();
      setTimeout(() => attachProductCardListeners(), 0);
    }
    if (page === 'upload-design') {
      setupUploadForm();
    }
    if (page === 'design-detail') {
      attachPrinterListeners();
    }
  };

  const renderWorkshopPage = () => {
    return `
      ${getHeaderHTML()}
      <main class="page-shell">
        <section class="section-heading">
          <h2>My Workshop</h2>
          <p>Creator tools: upload designs, manage orders, and production settings.</p>
          <a href="#" data-page="upload-design" class="button primary">+ Upload New Design</a>
        </section>
        <section class="roles-grid">
          <article class="role-card">
            <h3>Upload Design</h3>
            <p>Upload STL/OBJ/STEP and set pricing, license, and preview images.</p>
            <a href="#" data-page="upload-design" class="button secondary">Upload Now</a>
          </article>
          <article class="role-card">
            <h3>Orders</h3>
            <p>View and manage accepted print jobs, communicate with buyers, and mark fulfillment.</p>
          </article>
          <article class="role-card">
            <h3>Settings</h3>
            <p>Configure your printer profiles, shipping options, and payout preferences.</p>
          </article>
        </section>
      </main>
    `;
  };

  const attachProductCardListeners = () => {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card) => {
      card.addEventListener('click', () => {
        const productTitle = card.getAttribute('data-product-title');
        if (productTitle) {
          selectedDesignId = productTitle;
          renderPage('design-detail');
          window.scrollTo(0, 0);
        }
      });
    });
  };

  const attachPrinterListeners = () => {
    const selectPrinterButtons = document.querySelectorAll('.select-printer');
    selectPrinterButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const printerId = btn.getAttribute('data-printer-id');
        console.log('Selected printer:', printerId);
        alert('Added to cart! (Feature coming soon)');
      });
    });
  };

  const attachEventListeners = () => {
    const pageLinks = document.querySelectorAll('[data-page]');
    pageLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = (e.target as HTMLElement).getAttribute('data-page');
        if (target) {
          renderPage(target);
          window.scrollTo(0, 0);
        }
      });
    });



    const authLinks = document.querySelectorAll('.auth-link');
    authLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        renderPage('login');
        window.scrollTo(0, 0);
      });
    });

    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        if (role === 'buyer') {
          renderPage('login-buyer');
        } else if (role === 'creator') {
          renderPage('login-creator');
        }
        window.scrollTo(0, 0);
      });
    });

    // Login form handlers
    const buyerForm = document.getElementById('buyerLoginForm') as HTMLFormElement | null;
    if (buyerForm) {
      buyerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = (document.getElementById('buyerEmail') as HTMLInputElement).value.trim();
        const pass = (document.getElementById('buyerPassword') as HTMLInputElement).value;
        const user = users.find((u) => u.email === email && u.password === pass && u.role === 'buyer');
        const err = document.getElementById('buyerAuthError');
        if (user) {
          currentUser = user;
          renderPage('home');
        } else if (err) {
          err.textContent = 'wrong e-mail and/or password';
        }
      });
    }

    const creatorForm = document.getElementById('creatorLoginForm') as HTMLFormElement | null;
    if (creatorForm) {
      creatorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = (document.getElementById('creatorEmail') as HTMLInputElement).value.trim();
        const pass = (document.getElementById('creatorPassword') as HTMLInputElement).value;
        const user = users.find((u) => u.email === email && u.password === pass && u.role === 'creator');
        const err = document.getElementById('creatorAuthError');
        if (user) {
          currentUser = user;
          renderPage('home');
        } else if (err) {
          err.textContent = 'wrong e-mail and/or password';
        }
      });
    }

    // Profile dropdown and logout
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileBtn && profileDropdown) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('open');
      });
      document.addEventListener('click', () => profileDropdown.classList.remove('open'));
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentUser = null;
        renderPage('home');
      });
    }
  };

  const setupUploadForm = () => {
    const form = document.getElementById('designUploadForm') as HTMLFormElement | null;
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = (document.getElementById('designTitle') as HTMLInputElement).value;
        const description = (document.getElementById('designDescription') as HTMLTextAreaElement).value;
        const category = (document.getElementById('designCategory') as HTMLSelectElement).value;
        const price = (document.getElementById('designPrice') as HTMLInputElement).value;

        console.log('Design uploaded:', { title, description, category, price });
        alert(`Design "${title}" uploaded successfully!`);
        renderPage('workshop');
        window.scrollTo(0, 0);
      });
    }
  };

  const setupGallery = () => {
    const galleryGrid = document.querySelector<HTMLDivElement>('#galleryGrid');
    const searchInput = document.querySelector<HTMLInputElement>('#searchInput');
    const topSearchInput = document.querySelector<HTMLInputElement>('#topSearchInput');

    const refreshGallery = (query = '') => {
      if (!galleryGrid) return;
      const items = filterProducts(query);
      galleryGrid.innerHTML = renderProductGrid(items);
    };

    refreshGallery();

    // render popular list (top 4 for demo)
    const popularListEl = document.querySelector<HTMLDivElement>('#popularList');
    if (popularListEl) {
      const popular = products.slice(0, 4);
      popularListEl.innerHTML = renderPopularList(popular);
    }

    searchInput?.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      refreshGallery(target.value);
    });

    topSearchInput?.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      if (searchInput) {
        searchInput.value = target.value;
      }
      refreshGallery(target.value);
      const gallerySection = document.querySelector('.gallery-section');
      gallerySection?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  renderPage('home');
}
