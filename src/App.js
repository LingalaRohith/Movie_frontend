import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';

import LandingPage from "./components/LandingPage";
import Signup from "./components/Signup";
import Login from "./components/Login";
import MoviesPage from "./components/MoviesPage";
import RegistrationConfirmation from './components/RegistrationConfirmation';
import EditProfile from "./components/EditProfile";
import AdminMain from "./components/AdminMain";
import MovieInformationPage from "./components/MovieInformationPage";
import ManageUsers from "./components/ManageUsers"; 
import ManageMovies from "./components/ManageMovies"; 
import ManagePromotions from "./components/ManagePromotions"; 
import BookSeats from "./components/BookSeats";
import OrderSummary from "./components/OrderSummary";
import OrderConfirmation from "./components/OrderConfirmation"; 
import Checkout from "./components/Checkout"; 
import ProfilePage from "./components/ProfilePage";
import ForgotPassword from "./components/ForgotPassword";
import EmailSent from "./components/EmailSent"
import PasswordChange from "./components/PasswordChange";
import PasswordConfirmation from './components/PasswordConfirmation';
import VerifyAccount from './components/VerifyAccount';
import ForgotPasswordMail from './components/ForgotPasswordMail';
import Header from './components/Header';
import TicketPrice from "./components/TicketPrice";
import UserProfile from './components/UserProfile';
import AddUser from './components/AddUser';
import AddAdmin from './components/AddAdmin';


function App() {
    //sessionStorage.setItem('isLogin', false);
  
    return (
      <div>
        <Router>
        <AuthProvider>
        <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="signup" element={<Signup  />} />
            <Route path="login" element={<Login  />} />
            <Route path="moviespage" element={<MoviesPage />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="email-sent" element={<EmailSent />} />
            <Route path="password-change" element={<PasswordChange />} />
            <Route path="password-confirmation" element={<PasswordConfirmation />} />
            <Route path="editprofile" element={<EditProfile />} />
            <Route path="admin" element={<AdminMain/>} />
            <Route path="movie-info" element={<MovieInformationPage />} />
            <Route path="admin/manage-users" element={<ManageUsers />} />
            <Route path="admin/manage-movies" element={<ManageMovies />} />
            <Route path="admin/manage-promotions" element={<ManagePromotions />} />
            <Route path="bookseats" element={<BookSeats />} />
            <Route path="ordersummary" element={<OrderSummary />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profilepage" element={<ProfilePage />} />
            <Route path="/verify-account" element={<VerifyAccount />} /> 
            <Route path="/registration-confirmation" element={<RegistrationConfirmation />} /> 
            <Route path="/forgotPasswordMail" element={<ForgotPasswordMail />}/>
            <Route path="/admin/manage-price" element={<TicketPrice />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/add-admin" element={<AddAdmin />} />

          </Routes>
          </AuthProvider>
        </Router>
        </div>
    );
  }
  
  export default App;
  