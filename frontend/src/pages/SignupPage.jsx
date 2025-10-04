import { useState } from 'react';
import {ShipWheelIcon} from "lucide-react";
import { Link } from "react-router";

import useSignUp from "../hooks/useSignUp.js";

function SignupPage() {
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = async (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className='h-full flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="night">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base100 rounded-xl shadow-lg overflow-hidden'>
        
        {/* left side */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>

          {/* logo */}
          <div className='flex items-center mb-4 justify-start gap-2'>
            <ShipWheelIcon className='size-9 text-primary' />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>CloseCall</span>
          </div>

          {/* error message */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          {/* form */}
          <div className='w-full'>
            <form onSubmit={handleSignup}>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-xl font-semibold'>Create an Account</h2>
                  <p className='text-sm opacity-70'>
                  Join CloseCall and stay connected with the people who matter most.
                  </p>
                </div>

                <div className='space-y-3'>
                  {/* name */}
                  <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Full Name</span>
                  </label>

                  <input type='text'
                  placeholder='Name'
                  className='input input-bordered w-full'
                  value={signupData.fullName}
                  onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                  required
                  />
                  </div>

                  {/* email */}
                  <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Email</span>
                  </label>

                  <input type='email'
                  placeholder='Email'
                  className='input input-bordered w-full'
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                  />
                  </div>

                  {/* password */}
                  <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Password</span>
                  </label>

                  <input type='password'
                  placeholder='Password'
                  className='input input-bordered w-full'
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required  
                  />
                  <p className='text-xs opacity-70 mt-1'>
                    Password must be at least 6 characters long.
                  </p>
                  </div>

                  <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-2">
                        <input type="checkbox" className="checkbox checkbox-sm" required />
                        <span className="text-xs leading-tight">
                          I agree to the{" "}
                          <span className="text-primary hover:underline">terms of service</span> and{" "}
                          <span className="text-primary hover:underline">privacy policy</span>
                        </span>
                      </label>
                    </div>
                </div>

                <button className='btn btn-primary w-full ' type='submit'>
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* already have an account */}
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>

        </div>

        {/* right side */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/signup.png" alt="Signup illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Stay close with crystal-clear communication</h2>
              <p className="opacity-70">
                Connect instantly with high-quality video calls, secure messaging, and seamless group conversations
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SignupPage