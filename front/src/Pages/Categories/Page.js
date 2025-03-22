import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function Page() {
    const [name, setName] = useState("");
    const [prevname, setPrevname] = useState("");

    const CSTname = (event) => { setName(event.target.value); };
    const CSTprevname = (event) => { setPrevname(event.target.value); };

    async function Add() {
        const responseContent = document.getElementById("response");
        const link = "http://localhost:5116/api/protected/categories/add";

        try {
            const response = await axios.post(link, {
                name: name
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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

    async function Remove() {
        const responseContent = document.getElementById("response");
        const link = "http://localhost:5116/api/protected/categories/remove";

        try {
            const response = await axios.delete(link, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                data: { name: name }
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

    async function Update() {
        const responseContent = document.getElementById("response");
        const link = "http://localhost:5116/api/protected/categories/update";

        try {
            const response = await axios.patch(link, {
                prevName: prevname,
                name: name
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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

    async function Get() {
        const responseContent = document.getElementById("response");
        const link = "http://localhost:5116/api/protected/categories";

        try {
            const response = await axios.get(link, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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

    return (
        <div className="flex row align-start justify-center gap-12 p-12">
            <div className="flex column justify-center align-center gap-12 w-350" style={{paddingLeft: "13px", paddingRight: "13px"}}>
                <div className="flex gap-12 bg-2 b w-full p-12 br-12">
                    <div className="flex column w-full">
                        <h2>Category add</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce auctor.</p>
                        <br />
                        <div className="flex column">
                            <label htmlFor="taf-name">Name</label>
                            <input id="taf-name" onChange={CSTname} type="text" className="p-8 br-8" />
                        </div>
                        <br />
                        <button onClick={Add} type="submit" className="p-8 br-8">Add</button>
                    </div>
                </div>
                <div className="flex gap-12 bg-2 b w-full p-12 br-12">
                    <div className="flex column w-full">
                        <h2>Category remove</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum placerat.</p>
                        <br />
                        <div className="flex column">
                            <label htmlFor="tuf-name">Name</label>
                            <input id="tuf-name" onChange={CSTname} type="text" className="p-8 br-8" />
                        </div>
                        <br />
                        <button onClick={Remove} type="submit" className="p-8 br-8">Remove</button>
                    </div>
                </div>
                <div className="flex gap-12 bg-2 b w-full p-12 br-12">
                    <div className="flex column w-full">
                        <h2>Category update</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit.</p>
                        <br />
                        <div className="flex column gap-12">
                            <div className="flex column">
                                <label htmlFor="tuf-prevname">Prev name</label>
                                <input id="tuf-prevname" onChange={CSTprevname} type="text" className="p-8 br-8" />
                            </div>
                            <div className="flex column">
                                <label htmlFor="tuf-name">Name</label>
                                <input id="tuf-name" onChange={CSTname} type="text" className="p-8 br-8" />
                            </div>
                        </div>
                        <br />
                        <button onClick={Update} type="submit" className="p-8 br-8">Update</button>
                    </div>
                </div>
                <div className="flex gap-12 bg-2 b w-full p-12 br-12">
                    <div className="flex column w-full">
                        <h2>Categories get</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis enim.</p>
                        <br />
                        <button onClick={Get} type="submit" className="p-8 br-8">Get</button>
                    </div>
                </div>
            </div>
            <div className="flex column gap-12 max-w-600 w-600 bg-2 b p-12 br-12">
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