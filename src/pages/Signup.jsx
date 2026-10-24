import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";
import { objectToFormData } from "../utils/common";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  resetAuthState,
  selectAuth,
} from "../store/slices/authSlice";

const signupValidationSchema = Yup.object({
  firstname: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),

  lastname: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),

  email: Yup.string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),

  mobNumber: Yup.string()
    .trim()
    .matches(/^[0-9+() -]{7,15}$/, "Please enter a valid mobile phone number")
    .required("Mobile number is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  avatar: Yup.mixed()
    .required("Avatar (Profile picture) is required")
    .test("fileType", "Only JPEG, PNG, or WEBP images are allowed", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
          value.type,
        )
      );
    }),

  coverImage: Yup.mixed()
    .nullable()
    .test("fileType", "Only JPEG, PNG, or WEBP images are allowed", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
        value.type,
      );
    }),
});

const Signup = () => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Get state directly from Redux!
  const { isLoading, isError, isSuccess, message } = useSelector(selectAuth);

  // Clear messages when user leaves page
  useEffect(() => {
    return () => {
      dispatch(resetAuthState());
    };
  }, [dispatch]);

  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    mobNumber: "",
    password: "",
    avatar: null,
    coverImage: null,
  };

  const handleSignup = async (values, { resetForm }) => {
    // 2. Convert all fields and files into FormData
    const formDataPayload = objectToFormData(values);

    // 3. Dispatch Redux Thunk
    const response = await dispatch(registerUser(formDataPayload)).unwrap();
    console.log("response", response);

    // 4. On successful registration
    if (response?.statusCode === 200) {
      resetForm();
      setAvatarPreview(null);
      setCoverPreview(null);
      dispatch(resetAuthState());
      navigate("/login", {
        state: {
          email: values.email,
          message: "Account created successfully! Please log in to continue.",
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="w-full max-w-lg p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Fill in the details below to get started
          </p>
        </div>

        {/* 5. Error / Success Banner from Redux */}
        {(isError || isSuccess) && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              isError
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {message}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={signupValidationSchema}
          onSubmit={handleSignup}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <form
              className="space-y-4"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {/* File Uploads: Avatar & Cover Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b border-neutral-200 dark:border-neutral-800">
                {/* Avatar Field (Required) */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Avatar (Profile Picture){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border border-neutral-300 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-neutral-400 font-medium">
                          None
                        </span>
                      )}
                    </div>
                    <label className="cursor-pointer py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                      Choose Avatar
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0] || null;
                          setFieldValue("avatar", file);
                          if (file) {
                            setAvatarPreview(URL.createObjectURL(file));
                          } else {
                            setAvatarPreview(null);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {touched.avatar && errors.avatar && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {errors.avatar}
                    </p>
                  )}
                </div>

                {/* Cover Image Field (Optional) */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Cover Image{" "}
                    <span className="text-neutral-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 rounded-lg border border-neutral-300 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-neutral-400 font-medium">
                          None
                        </span>
                      )}
                    </div>
                    <label className="cursor-pointer py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                      Choose Cover
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0] || null;
                          setFieldValue("coverImage", file);
                          if (file) {
                            setCoverPreview(URL.createObjectURL(file));
                          } else {
                            setCoverPreview(null);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {touched.coverImage && errors.coverImage && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {errors.coverImage}
                    </p>
                  )}
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextInput
                  label="First Name"
                  id="firstname"
                  name="firstname"
                  placeholder="John"
                  value={values.firstname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstname && errors.firstname}
                  required
                />

                <TextInput
                  label="Last Name"
                  id="lastname"
                  name="lastname"
                  placeholder="Doe"
                  value={values.lastname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastname && errors.lastname}
                  required
                />
              </div>

              <TextInput
                label="Email Address"
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                required
              />

              <TextInput
                label="Mobile Number"
                id="mobNumber"
                name="mobNumber"
                type="tel"
                placeholder="+1 234 567 8900"
                value={values.mobNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.mobNumber && errors.mobNumber}
                required
              />

              <TextInput
                label="Password"
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
                required
              />

              <Button
                variant="primary"
                fullWidth
                type="submit"
                loading={isLoading}
              >
                Create Account
              </Button>
            </form>
          )}
        </Formik>

        <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
