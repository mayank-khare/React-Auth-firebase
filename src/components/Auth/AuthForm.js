import { useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import classes from './AuthForm.module.css';
import AuthContext, { AuthContextProvider } from '../../store/auth-context';

const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

    const authCtx= useContext(AuthContext);

  
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    let url;

    if(isLogin){
      url='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA4BjRB3pC1aAVHpA2E_z3O2Dn6WXeZYIg';
    }
    else{
      url='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA4BjRB3pC1aAVHpA2E_z3O2Dn6WXeZYIg';
    }
      fetch(url,
      {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true
        }),
        header: {
          'content-type': 'application/json'
        }
      }
    )
      .then((res) => {
        setIsLoading(false);
        if(res.ok){
          return res.json();
        }else{
          return res.json().then((data) => {
            console.log(data);
            let errorMessage="Authentication Failed!";
            if(data && data.error && data.error.message){
              errorMessage=data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        const expirationTime = new Date(
          new Date().getTime() + (+data.expiresIn * 1000 )
        );
        authCtx.login(data.idToken, expirationTime.toISOString());
        history.replace('/');
        console.log(data);
      })
      .catch(err => {
        alert(err.message);
      });

  }


  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <h2>{isLogin ? 'Please Login' : 'Please Create Account'}</h2>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' ref={passwordInputRef} required />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? 'Login' : 'Create Account'}</button>
          )}
          {isLoading && <p>Sending Request....</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
