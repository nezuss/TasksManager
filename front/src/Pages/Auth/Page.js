import { useState } from 'react';
import axios from 'axios';

function Page() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const CSTusername = (event) => { setUsername(event.target.value); };
    const CSTpassword = (event) => { setPassword(event.target.value); };
    const CSTconfirmPassword = (event) => { setConfirmPassword(event.target.value); };

    async function Login() {
        const responseContent = document.getElementById("response");
        const link = "http://localhost:5116/api/auth/login";
        
        try {
            const response = await axios.post(link, {
                username: username,
                password: password
            });
    
            responseContent.innerHTML = JSON.stringify(response.data, null, 2);
            const token = response.data.token;
            localStorage.setItem("token", token);

        } catch (error) {
            if (error.response) {
                responseContent.innerHTML = `Error: ${error.response.status} - ${JSON.stringify(error.response.data, null, 2)}`;
            } else {
                responseContent.innerHTML = "Error: " + error.message;
            }
        }
    }    

    async function Register() {
        const responseContent = document.getElementById("response");
        const link = "http://localhost:5116/api/auth/register";

        if (password!== confirmPassword) {
            responseContent.innerHTML = "Passwords do not match.";
            return;
        }

        try {
            const response = await axios.post(link, {
                username: username,
                password: password,
                confirmPassword: confirmPassword
            });
    
            responseContent.innerHTML = JSON.stringify(response.data, null, 2);
        } catch (error) {
            if (error.response) {
                responseContent.innerHTML = `Error: ${error.response.status} - ${JSON.stringify(error.response.data, null, 2)}`;
            } else {
                responseContent.innerHTML = "Error: " + error.message;
            }
        }
    }

    function Clear() {
        const responseContent = document.getElementById("response");

        if (localStorage.getItem("token") == null) responseContent.innerHTML = "Token not exist";
        else {
            localStorage.removeItem("token");
            responseContent.innerHTML = "Token seccessfully cleared";
        }
    }

    return (
        <div className="flex row align-start justify-center gap-12 p-12">
            <div className="flex column justify-center align-center gap-12 w-350" style={{paddingLeft: "13px", paddingRight: "13px"}}>
                <div className="flex gap-12 bg-2 b w-full p-12 br-12">
                    <div className="flex column w-full">
                        <h2>Login</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et.</p>
                        <br />
                        <div className="flex column gap-12">
                            <div className="flex column">
                                <label htmlFor="lf-username">Username</label>
                                <input id="lf-username" onChange={CSTusername} type="text" className="p-8 br-8" />
                            </div>
                            <div className="flex column">
                                <label htmlFor="lf-password">Password</label>
                                <input id="lf-password" onChange={CSTpassword} type="text" className="p-8 br-8" />
                            </div>
                        </div>
                        <br />
                        <button onClick={Login} type="submit" className="p-8 br-8">Login</button>
                    </div>
                </div>
                <div className="flex gap-12 bg-2 b w-full p-12 br-12">
                    <div className="flex column w-full">
                        <h2>Register</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique.</p>
                        <br />
                        <div className="flex column gap-12">
                            <div className="flex column">
                                <label htmlFor="rf-username">Username</label>
                                <input id="rf-username" onChange={CSTusername} type="text" className="p-8 br-8" />
                            </div>
                            <div className="flex column">
                                <label htmlFor="rf-password">Password</label>
                                <input id="rf-password" onChange={CSTpassword} type="text" className="p-8 br-8" />
                            </div>
                            <div className="flex column">
                                <label htmlFor="rf-confirmPassword">Confirm Password</label>
                                <input id="rf-confirmPassword" onChange={CSTconfirmPassword} type="text" className="p-8 br-8" />
                            </div>
                        </div>
                        <br />
                        <button onClick={Register} type="submit" className="p-8 br-8">Register</button>
                    </div>
                </div>
                <div className="flex gap-12 bg-2 b w-full max-w-600 p-12 br-12">
                    <div className="flex column w-full">
                        <h2>Logout</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam facilisis.</p>
                        <br />
                        <div className="flex gap-12 w-full">
                            <button onClick={Clear} type="submit" className="p-8 br-8 w-full">Logout</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sticky flex column gap-12 max-w-600 w-600 bg-2 b p-12 br-12 top-12">
                <h2 className="c-2">Response</h2>
                <hr />
                <div className="scroll-x">
                    <pre id="response"></pre>
                </div>
            </div>
        </div>
    );
}

export default Page;