# Multikart E-Commerce Client

Modern, responsive e-commerce frontend built with Next.js 14.

> **✨ NEW:** Now integrated with real products from the admin backend! See [PRODUCT_INTEGRATION.md](PRODUCT_INTEGRATION.md) for details.

## 🚀 Features

- **Smart Header Navigation**

  - Sticky header with hide-on-scroll behavior
  - Shows on upward scroll, hides on downward scroll
  - Smooth animations and transitions
  - Prominent search bar with modern styling

- **Independent Category Bar**

  - Secondary navigation that becomes sticky independently
  - Horizontal scrollable category links
  - Smooth hover effects and interactions

- **Sidebar Menu**

  - Slide-in animation from left
  - Nested category support with expand/collapse
  - Background overlay with blur effect
  - Close on ESC, overlay click, or close button

- **Real Product Integration** ⭐ NEW

  - Fetches products from admin backend
  - Smart pagination with "Load More"
  - Automatic badge generation (New, Sale)
  - Loading states and error handling
  - Server-side caching for performance

- **Feed-Style Product Layout**

  - Social media-inspired card design
  - Responsive grid that adapts to screen size
  - Hover effects and micro-interactions
  - Multiple action types (Buy, Bid, Explore)

- **Auth Prompt Section**

  - Clean, centered design
  - Clear call-to-action buttons
  - Feature highlights

- **Professional Footer**
  - Multi-column link organization
  - Social media integration
  - Payment method badges
  - Fully responsive

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: CSS Modules
- **Components**: Functional React components with hooks
- **Icons**: Custom SVG icons
- **Animations**: CSS transitions and transforms

## 📁 Project Structure

```
client/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout
│   │   ├── page.js             # Homepage
│   │   └── page.module.css     # Homepage styles
│   ├── components/
│   │   ├── Header/             # Sticky header with hide/show
│   │   ├── CategoryBar/        # Independent sticky category bar
│   │   ├── Sidebar/            # Slide-in sidebar menu
│   │   ├── ProductCard/        # Reusable product card
│   │   ├── ProductFeed/        # Product grid layout
│   │   ├── AuthPrompt/         # Sign-in prompt section
│   │   └── Footer/             # Site footer
│   ├── hooks/
│   │   ├── useScroll.js        # Scroll direction & position
│   │   └── useThrottle.js      # Performance utilities
│   └── styles/
│       └── globals.css          # Global styles & CSS variables
├── package.json
├── next.config.js
└── jsconfig.json
```

## 🎨 Design Philosophy

- **Modern & Clean**: Premium UI with attention to spacing and typography
- **Performance First**: Optimized scroll listeners and animations
- **Mobile Responsive**: Desktop-first design that scales beautifully
- **Accessibility**: Semantic HTML, ARIA labels, keyboard support
- **Scalable**: Component-based architecture ready for growth

## 🚦 Getting Started

### Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   # Copy example env file
   cp .env.local.example .env.local

   # Edit .env.local and set:
   NEXT_PUBLIC_ADMIN_API_URL=http://localhost:3000
   ```

3. **Start admin backend** (Required for product data)

   ```bash
   cd ../admin/multikart
   npm run dev
   # Admin should be running on http://localhost:3000
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open browser**
   - Navigate to `http://localhost:3001`
   - Products from admin will appear in "Discover Products" section

### Without Admin Backend

If you want to run the client without the admin backend, you'll see:

- Empty product section with appropriate message
- All other UI components work normally
- Can add mock data back for demo purposes

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+ (optimized experience)
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

## 🎯 Component Features

### Header

- Fixed position with smart hide/show
- Search bar with focus states
- Icon buttons with badges
- Profile dropdown ready

### CategoryBar

- Becomes sticky after scrolling past header
- Horizontal scroll on mobile
- Category links with hover effects

### Sidebar

- Slides in from left (0.3s animation)
- Nested categories with expand/collapse
- Background overlay (40% opacity)
- ESC key support

### ProductCard

- 4:3 aspect ratio images
- Multiple badge types (New, Sale, Trending)
- Wishlist button on hover
- Three action types: Buy, Bid, Explore
- Price with discount display

## 🔧 Customization

### Colors

Edit CSS variables in `src/styles/globals.css`:

```css
--primary-color: #2563eb;
--text-primary: #1e293b;
--bg-secondary: #f8fafc;
```

### Categories

Update `CATEGORIES` array in `CategoryBar.js` and `MENU_CATEGORIES` in `Sidebar.js`

### Products

Replace `MOCK_PRODUCTS` in `ProductFeed.js` with API calls

## 🚀 Production Build

```bash
npm run build
npm start
```

## 📝 Notes

- Images use placeholder paths - replace with actual product images
- Mock data included for demonstration - integrate with your API
- All components support dynamic data from APIs
- Semantic HTML and accessibility best practices followed

## 🎨 Color Palette

- **Primary**: Blue (#2563eb)
- **Secondary**: Slate (#64748b)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Danger**: Red (#ef4444)

## 🔗 Next Steps

1. Connect to backend API endpoints
2. Add authentication flow
3. Implement search functionality
4. Add shopping cart logic
5. Set up product detail pages
6. Integrate payment gateway

---

Built with ❤️ using Next.js and modern web technologies
