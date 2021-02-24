import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../redux/actions/actionTypes";
import UpdateProfileModal from "./UpdateProfileModal";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [updateProfileModal, setUpdateProfileModal] = useState(false);
  const { first_name, last_name, avatar, email, gender } = useSelector((state) => state.user);

  const logoutBtnRef = useRef();
  const updateProfileRef = useRef();

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const closeMenuOnClick = (evt) => {
      if (
        evt.target != logoutBtnRef.current &&
        evt.target != updateProfileRef.current &&
        dropdownOpen
      ) {
        setDropdownOpen(false);
      }
    };
    document.body.addEventListener("click", closeMenuOnClick);
    return () => {
      document.body.removeEventListener("click", closeMenuOnClick);
    };
  }, [dropdownOpen]);

  const toggleModal = bool => {
      setUpdateProfileModal(bool);
  };

  const logout = () => {
    router.push('/auth');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    dispatch({type: LOGOUT});
  };

  return (
    <>
    <header className="navbar">
      <div className="logo">
        <h2>Chat System</h2>
      </div>
      <div className="user">
        <div className="image">
          <img
            src={avatar && avatar !== 'null' ? avatar : "/images/profilePic.jpeg"}
            alt="image"
          />
        </div>
        <div className="fullname">
          {first_name} {last_name}
        </div>
        <div className="dropDown">
          <svg
            onClick={() => setDropdownOpen(!dropdownOpen)}
            height="48"
            viewBox="0 0 48 48"
            width="48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14.83 16.42l9.17 9.17 9.17-9.17 2.83 2.83-12 12-12-12z" />
            <path d="M0-.75h48v48h-48z" fill="none" />
          </svg>
          {dropdownOpen && (
            <div className="dropMenu">
              <button ref={updateProfileRef} onClick={() => setUpdateProfileModal(true)}>Update Profile</button>
              <button ref={logoutBtnRef} onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
    {
        updateProfileModal &&
        <UpdateProfileModal closeModal={() => toggleModal(false)} first_name={first_name} last_name={last_name} email={email} gender={gender} />
    }
    </>
  );
};

export default Navbar;
