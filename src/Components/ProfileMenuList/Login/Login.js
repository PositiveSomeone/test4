import React, { useState, useRef } from "react";
import axios from "axios";
import KakaoLogin from "react-kakao-login";
import GoogleLogin from "react-google-login";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";

//LINK redux action
import { signin, closeLoginModal } from "../../../Redux/Actions/Index";

// LINK style
import {
  LoginModal,
  SocialLogin,
  Divider,
  InputForm,
  Footer,
  LoginDialog,
} from "./Login.Styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

// LINK key
import {
  KAKAO_TOKEN,
  SIGNIN_API_KAKAO,
  GOOGLE_TOKEN,
  SIGNIN_API_GOOGLE,
  SIGNIN_API_DEFAULT,
} from "../../../config";

const Login = ({ history }) => {
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  const [isPassword, setIsPassword] = useState(true);
  const [inputData, setInputData] = useState({
    email: null,
    password: null,
  });

  // ANCHOR redux
  // const signReducer = useSelector(({ signReducer }) => signReducer);
  // const userToken = signReducer.userToken;
  const dispatch = useDispatch();
  const signinAction = (token) => dispatch(signin(token));
  const closeLoginModalAction = () => dispatch(closeLoginModal());

  const dialog = useRef();

  const handleBlur = (e) => {
    !dialog.current.contains(e.target) && closeLoginModalAction();
  };

  const inputHandler = (e) => {
    setInputData({
      ...inputData,
      [e.target.dataset.name]: e.target.value,
    });
  };

  const handleLoginType = (e) => {
    setIsEmailLogin(!isEmailLogin);
  };

  const responseKaKao = async (res) => {
    const ACCESS_TOKEN = res.response.access_token;
    try {
      const profile = {
        headers: {
          AUTHORIZATION: ACCESS_TOKEN,
        },
      };
      const response = await axios.get(SIGNIN_API_KAKAO, profile);
      const validation = response && response.status === 200;
      !validation && new Error("cannot fetch the data");
      const result = response.data.AUTHORIZATION;
      console.log(result);
      Swal.fire({
        title: "????????? ??????",
        text: "???????????? ??????????????? ?????????????????????!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      // ANCHOR send REDUX
      signinAction(result);
      closeLoginModalAction();
    } catch (error) {
      console.log("!!!error!!!");
    }
  };

  const responseGoogle = async (res) => {
    const ACCESS_TOKEN = res.tokenId;
    try {
      const profile = {
        AUTHORIZATION: ACCESS_TOKEN,
      };
      const response = await axios.post(SIGNIN_API_GOOGLE, profile);
      console.log(response, "sdfsfsdsfss");
      const validation = response && response.status === 200;
      !validation && new Error("cannot fetch the data");
      const result = response.data.AUTHORIZATION;
      console.log(result);
      Swal.fire({
        title: "????????? ??????",
        text: "???????????? ??????????????? ?????????????????????!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      // ANCHOR send REDUX
      signinAction(result);
      closeLoginModalAction();
    } catch (error) {
      console.log("!!!error!!!");
    }
  };

  const responseLogin = async (res) => {
    const { email, password } = inputData;
    try {
      const profile = {
        email,
        password,
      };
      const response = await axios.post(SIGNIN_API_DEFAULT, profile);
      const validation = response && response.status === 200;
      !validation && new Error("cannot fetch the data");
      const result = response.data.AUTHORIZATION;
      console.log(result);
      Swal.fire({
        title: "????????? ??????",
        text: "???????????? ??????????????? ?????????????????????!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      // ANCHOR send REDUX
      signinAction(result);
      closeLoginModalAction();
    } catch (error) {
      console.log("!!!error!!!");
    }
  };

  const responseFail = (err) => {
    console.log(`!!! ${JSON.stringify(err)} !!!`);
  };

  const responseLogout = (res) => {
    console.log(`---${res}---`);
  };

  return (
    <LoginModal onClick={handleBlur}>
      <LoginDialog ref={dialog}>
        <section>
          <header>
            <div onClick={closeLoginModalAction}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
            <div>?????????</div>
          </header>
          <SocialLogin>
            <KakaoLogin
              token={KAKAO_TOKEN}
              onSuccess={responseKaKao}
              onFail={responseFail}
              onLogout={responseLogout}
            >
              <div>
                <img
                  src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
                  height="48"
                  alt="kakaoLogin"
                />
              </div>
            </KakaoLogin>
            <GoogleLogin
              clientId={GOOGLE_TOKEN}
              onSuccess={responseGoogle}
              onFailure={responseFail}
              buttonText="?????? ???????????? ?????????"
            />
          </SocialLogin>
          <Divider>
            <span />
            <span>??????</span>
            <span />
          </Divider>
          <InputForm email={isEmailLogin}>
            <div>
              {isEmailLogin ? (
                <input
                  type="text"
                  name="email"
                  data-name="email"
                  placeholder="????????? ??????"
                  onChange={inputHandler}
                />
              ) : (
                <>
                  <select name="locale">
                    <option value="+82">?????? (+82)</option>
                    <option value="+81">?????? (+81)</option>
                    <option value="+1">?????????????????? (+1)</option>
                    <option value="+33">????????? (+33)</option>
                    <option value="+63">????????? (+63)</option>
                    <option value="+36">????????? (+36)</option>
                  </select>
                  <input
                    type="text"
                    name="phone"
                    data-name="phoneNumber"
                    placeholder="????????????"
                    onChange={inputHandler}
                  />
                </>
              )}
            </div>
            <div>
              <input
                type={isPassword ? "password" : "text"}
                data-name="password"
                name="password"
                placeholder="????????????"
                onChange={inputHandler}
              />
            </div>
            <div>
              <div onClick={() => setIsPassword(!isPassword)}>
                {isPassword ? "???????????? ??????" : "???????????? ?????????"}
              </div>
              <div>
                <span onClick={handleLoginType}>
                  {isEmailLogin ? "??????????????? ?????????" : "???????????? ?????????"}
                </span>
                <span> ??? </span>
                <span>??????????????? ????????????????</span>
              </div>
            </div>
            <button onClick={responseLogin}>
              <div>?????????</div>
            </button>
          </InputForm>
          <Footer>
            <div>
              <span>??????????????? ????????? ?????????????</span>
              <span>?????? ??????</span>
            </div>
            <div>
              <span>
                <FontAwesomeIcon icon={faChevronLeft} />
              </span>
              <span>??????</span>
            </div>
          </Footer>
        </section>
      </LoginDialog>
    </LoginModal>
  );
};

export default withRouter(Login);
