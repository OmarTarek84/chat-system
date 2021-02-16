import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import axios from '../axios/axios';

const Form = ({
  defaultValues,
  authMode,
  submitAuthForm,
  updateProfile,
  closeModal,
}) => {

  const [imageUrl, setImageUrl] = useState(null);
  const [file, setfile] = useState('');
  const [imageLoading, setimageLoading] = useState(false);

  const { handleSubmit, register, errors } = useForm({
    defaultValues: defaultValues,
  });

  const {loading} = useSelector(state => state.user);

  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"\[\]{}%^&*:@~$+\-\(\)\}\{=#';(\\|\/)$|^(\\|\/).<>\\|`?_,])?[A-Za-z\d!"\[\]{}%^&*:$@\-=\(\)\}\{+~#';(\\|\/)$|^(\\|\/).<>\\|?_,`]{1,}$/;

  const submitAuth = (formData) => {
    submitAuthForm({...formData, avatar: imageUrl});
    if (updateProfile) {
      closeModal();
    }
  };

  const renderInputs = () => {
    if (authMode === "register") {
      return (
        <>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            ref={register({
              required: true,
              validate: (email) =>
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                  email
                ),
            })}
          />
          {errors.email && errors.email.type === "validate" ? (
            <p className="error">Invalid Email</p>
          ) : errors.email && errors.email.type === "required" ? (
            <p className="error">Email is required</p>
          ) : null}
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            ref={register({ required: "First Name is required" })}
          />
          {errors.firstName && (
            <p className="error">{errors.firstName.message}</p>
          )}
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            ref={register({ required: "Last Name is required" })}
          />
          {errors.lastName && (
            <p className="error">{errors.lastName.message}</p>
          )}
          <select name="gender" ref={register({ required: true })}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {!updateProfile && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              ref={register({
                required: "password is required",
                validate: (pass) => passwordRegex.test(pass),
              })}
            />
          )}
          {!updateProfile &&
          errors.password &&
          errors.password.type === "validate" ? (
            <p className="error">
              Password should have at least one upper character, one lower
              character and one number
            </p>
          ) : errors.password && errors.password.type === "required" ? (
            <p className="error">Password is required</p>
          ) : null}
        </>
      );
    } else {
      return (
        <>
          <input
            type="email"
            name="email"
            placeholder="Email"
            ref={register({
              required: "Email is Required",
            })}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            ref={register({
              required: "password is required",
            })}
          />
        </>
      );
    }
  };

  const imageUpload = async e => {
    const fileO = e.target.files[0];
    setimageLoading(true);
    const {data} = await axios.get('/user/getSignedUrl', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    if (data.imagePath && data.url) {
      await axios.put(data.url, fileO, {
        headers: { "Content-Type": "image/*" }
      })
    }
    setfile(URL.createObjectURL(fileO));
    setimageLoading(false);
    setImageUrl(data.imagePath);
  };

  const renderBtnAction = () => {
    if (updateProfile) {
      return (
        <div className="btnActions">
          <button onClick={closeModal}>Close</button>
          <button type="submit" disabled={imageLoading}>Update</button>
        </div>
      );
    } else {
      return (
        <button type="submit" disabled={loading} className="submitRegister">
          {authMode === "register" ? "Register Now" : "Login"}
        </button>
      );
    }
  };

  return (
    <form className="authform" onSubmit={handleSubmit(submitAuth)}>
      {renderInputs()}
      {
        updateProfile
        &&
        <div className="imageinputParent">
          <input type="file" onChange={imageUpload}  accept="image/png,image/gif,image/jpeg,image/jpg" />
          {imageLoading && <span>Uploading...</span>}
        </div>
      }
      {
        file && updateProfile
        &&
        <div className="imageP">
          <img src={file} alt="user image" width={150} height={150} />
        </div>
      }
      {renderBtnAction()}
    </form>
  );
};

export default Form;
