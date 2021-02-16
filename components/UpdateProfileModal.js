import React from "react";
import { useDispatch } from "react-redux";
import Form from "./AuthForm";
import {updateProfile} from '../redux/actions/user';

const UpdateProfileModal = ({closeModal, first_name, last_name, gender, email}) => {

  const dispatch = useDispatch();
  const submitAuthForm = async (formData) => {
    dispatch(updateProfile(formData));
  };

  const defaultValues = {
    firstName: first_name,
    lastName: last_name,
    email: email,
    gender: gender,
  };

  return (
    <div className="backdrop">
      <div className="card">
        <div className="title">
          <h3>Update Profile</h3>
        </div>
        <div className="form">
          <Form
            defaultValues={defaultValues}
            updateProfile={true}
            authMode="register"
            submitAuthForm={submitAuthForm}
            closeModal={closeModal}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
