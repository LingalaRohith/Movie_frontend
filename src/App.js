import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    //localStorage.setItem('isLogin', false);
  
    return (
      <div>
        <Router>
        <Header isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn}/>
          <Routes>
            <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="signup" element={<Signup setLoggedIn={setLoggedIn} />} />
            <Route path="login" element={<Login setLoggedIn={setLoggedIn} />} />
            <Route path="moviespage" element={<MoviesPage isLoggedIn={isLoggedIn} />} />
            <Route path="forgot-password" element={<ForgotPassword isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="email-sent" element={<EmailSent />} />
            <Route path="password-change" element={<PasswordChange />} />
            <Route path="password-confirmation" element={<PasswordConfirmation />} />
            <Route path="editprofile" element={<EditProfile isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn}/>} />
            <Route path="admin" element={<AdminMain isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="movie-info" element={<MovieInformationPage isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="admin/manage-users" element={<ManageUsers isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="admin/manage-movies" element={<ManageMovies isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="admin/manage-promotions" element={<ManagePromotions isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="bookseats" element={<BookSeats isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="ordersummary" element={<OrderSummary isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/order-confirmation" element={<OrderConfirmation isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/checkout" element={<Checkout isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/profilepage" element={<ProfilePage isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/verify-account" element={<VerifyAccount isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} /> 
            <Route path="/registration-confirmation" element={<RegistrationConfirmation isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} /> 
            <Route path="/forgotPasswordMail" element={<ForgotPasswordMail isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn}/>}/>
            <Route path="/admin/manage-price" element={<TicketPrice />} />

          </Routes>
        </Router>
        </div>
    );
  }
  
  export default App;
  