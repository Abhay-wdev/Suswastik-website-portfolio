import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./admin/AdminLayout";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";

// Public pages…
import Home from "./pages/Home";
import Blog from "./components/Blog";
import BlogDetails from "./pages/BlogDetails";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import Products from "./pages/Products";
import LoginForm from "./pages/LoginForm";
import CustomerDistributorForm from "./components/CustomerDistributorForm";
import Cart from "./components/Cart";
import ProductPage from "./components/ProductPage";
import CheckoutPage from "./components/CheckoutPage";

// Admin pages
import Dashboard from "./admin/pages/Dashboard";
import ContactSystem from "./admin/pages/ContactSystem";
import DistributorDashboard from "./admin/pages/DistributorDashboard";
import BlogDashboard from "./admin/pages/BlogDashboard";
import EditBlog from "./admin/components/EditBlog";
import CreateBlog from "./admin/components/CreateBlog";
import HeroImageManager from "./admin/pages/HeroImageManager";
import CategoryManager from "./admin/pages/CategoryManager";
import SubCategoryPage from "./admin/components/SubCategoryPage";
import ProductManager from "./admin/components/ProductManager";
import TestimonialsManager from "./admin/pages/TestimonialsManager";
import CategoryCardsManager from "./admin/pages/CategoryCardsManager";
import UserList from "./admin/pages/UserList";
import SubscriberDashboard from "./admin/pages/SubscriberDashboard";
import VideoProductManager from "./admin/pages/VideoProductManager";
import CompanyManagement from "./admin/pages/CompanyManagement";
import UserfilePage from "./components/UserfilePage";
import OrdersPageWrapper from "./components/OrdersPage";
import SignupForm from "./components/SignupForm";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blogs/:slug" element={<BlogDetails />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/signup" element={<SignupForm/>} />
  <Route path="/forgot-password" element={ <ForgotPassword/>} />
            <Route path="/orders" element={<OrdersPageWrapper/>} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:ProductSlug" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/distributor" element={<CustomerDistributorForm />} />
           <Route path="/profile" element={<UserfilePage/>} />
        </Route>

        {/* ADMIN ROUTES (NOW 100% CORRECT) */}
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route  path="/admin/queries" element={<ContactSystem/>} />
            <Route  path="/admin/distributor" element={ <DistributorDashboard/>} />
            <Route  path="/admin/blogs" element={  <BlogDashboard/>} />
            <Route  path="/admin/blogs/:id" element={  <EditBlog/>} />
            <Route  path="/admin/blogs/new" element={  <CreateBlog/>} />
            <Route  path="/admin/hero" element={   <HeroImageManager/>} />
            <Route  path="/admin/category" element={   <CategoryManager/>} />
            <Route  path="/admin/category/:Slug" element={   <SubCategoryPage/> } />
            <Route  path="/admin/category/:Slug/:slug" element={    <ProductManager/>} />
            <Route  path="/admin/testimonials" element={   <TestimonialsManager/>} />
             <Route  path="/admin/categoryManager" element={   <CategoryCardsManager/>} />
              <Route  path="/admin/users" element={    <UserList/>} />
               <Route  path="/admin/subscriber" element={   <SubscriberDashboard/>} />
                 <Route  path="/admin/videoProductManager" element={    <VideoProductManager/>} />
                   <Route  path="/admin/company" element={   <CompanyManagement/>} />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
