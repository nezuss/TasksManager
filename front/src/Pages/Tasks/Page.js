import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function Page() {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [expected, setExpected] = useState("");
    const called = useRef(false);

    const CSTid = (event) => { setId(event.target.value); };
    const CSTname = (event) => { setName(event.target.value); };
    const CSTcategory = (event) => { setCategory(event.target.value); };
    const CSTdescription = (event) => { setDescription(event.target.value); };
    const CSTexpected = (event) => { setExpected(event.target.value); };

    async function Add() {
        const responseContent = document.getElementById("response");
        const link = "http://localhost:5116/api/protected/tasks/add";

        try {
            console.log({name: name, description: description, category: category, expected: expected});
            const response = await axios.post(link, {
                name: name,
                category: category,
                description: description,
                expected: expected
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
        const link = "http://localhost:5116/api/protected/tasks/remove";

        try {
            const response = await axios.delete(link, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                data: { id: id }
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
        const link = "http://localhost:5116/api/protected/tasks/update";

        try {
            const response = await axios.patch(link, {
                id: id,
                name: name,
                category: category,
                description: description,
                expected: expected
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

    async function Submit() {
        const responseContent = document.getElementById("response");
        const tasks = document.getElementById("tasks");
        const link = "http://localhost:5116/api/protected/tasks/submit";
        const inputs = tasks.querySelectorAll("div > input");
        var ids = [];
        var results = [];

        try {
            inputs.forEach(element => {
                ids.push(Number(element.id));
                results.push(element.value);
            });
            console.log(results, ids);

            const response = await axios.post(link, {
                tasksId: ids,
                tasksResult: results
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

    async function GetTasks() {
        const responseContent = document.getElementById("response");
        const link = "http://localhost:5116/api/protected/tasks";

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

    function BLoadTasks() {
        const tasks = document.getElementById("tasks");
        tasks.innerHTML = "";
        LoadTasks();
    }

    async function LoadTasks() {
        const responseContent = document.getElementById("results");
        const tasks = document.getElementById("tasks");
        const link = "http://localhost:5116/api/protected/tasks";

        try {
            const response = await axios.get(link, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            response.data.forEach(element => {
                tasks.innerHTML += `
                    <div class="flex column gap-12">
                        <div>Name: ${element.name}</div>
                        <div>Description: ${element.description}</div>
                        <input type="text" id="${element.id}" class="p-8 br-8" />
                    </div>
                `;
            });
        } catch (error) {
            if (error.response) {
                responseContent.innerHTML = `Error: ${error.response.status} - ${JSON.stringify(error.response.data, null, 2)}`;
            } else {
                responseContent.innerHTML = "Error: " + error.message;
            }
        }
    }

    async function LoadResults() {
        const responseContent = document.getElementById("results");
        const link = "http://localhost:5116/api/protected/tasks/results";

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

    useEffect(() => {
        if (!called.current) {
            LoadTasks();
            called.current = true;
        }
        LoadResults();
    }, []);

    setInterval(LoadResults, 5000);

    return (
        <div className="flex row align-start justify-center gap-12 p-12">
            <div className="flex column justify-center align-center gap-12 w-350" style={{paddingLeft: "13px", paddingRight: "13px"}}>
                <div className="flex gap-12 bg-2 b w-full p-12 br-12">
                    <div className="flex column w-full">
                        <h2>Task add</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget.</p>
                        <br />
                        <div className="flex column gap-12">
                            <div className="flex column">
                                <label htmlFor="taf-name">Name</label>
                                <input id="taf-name" onChange={CSTname} type="text" className="p-8 br-8" />
                            </div>
                            <div className="flex column">
                                <label htmlFor="taf-category">Category</label>
                                <input id="taf-category" onChange={CSTcategory} type="text" className="p-8 br-8" />
                            </div>
                            <div className="flex column">
                                <label htmlFor="taf-description">Description</label>
                                <input id="taf-description" onChange={CSTdescription} type="text" className="p-8 br-8" />
                            </div>
                            <div className="flex column">
                                <label htmlFor="taf-expected">Expected</label>
                                <input id="taf-expected" onChange={CSTexpected} type="text" className="p-8 br-8" />
                            </div>
                        </div>
                        <br />
                        <button onClick={Add} type="submit" className="p-8 br-8">Add</button>
                    </div>
                </div>
                <div className="flex gap-12 bg-2 b w-full p-12 br-12">
                    <div className="flex column w-full">
                        <h2>Task remove</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim.</p>
                        <br />
                        <div className="flex column">
                            <label htmlFor="trf-id">Id</label>
                            <input id="trf-id" onChange={CSTid} type="text" className="p-8 br-8" />
                        </div>
                        <br />
                        <button onClick={Remove} type="submit" className="p-8 br-8">Remove</button>
                    </div>
                </div>
                <div className="flex gap-12 bg-2 b w-full p-12 br-12">
                    <div className="flex column w-full">
                        <h2>Task update</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi convallis.</p>
                        <br />
                        <div className="flex column gap-12">
                            <div className="flex column">
                                <label htmlFor="taf-name">Id</label>
                                <input id="taf-name" onChange={CSTid} type="text" className="p-8 br-8" />
                            </div>
                            <div className="flex column">
                                <label htmlFor="tuf-username">Name</label>
                                <input id="tuf-name" onChange={CSTname} type="text" className="p-8 br-8" />
                            </div>
                            <div className="flex column">
                                <label htmlFor="tuf-category">Category</label>
                                <input id="tuf-category" onChange={CSTcategory} type="text" className="p-8 br-8" />
                            </div>
                            <div className="flex column">
                                <label htmlFor="tuf-description">Description</label>
                                <input id="tuf-description" onChange={CSTdescription} type="text" className="p-8 br-8" />
                            </div>
                            <div className="flex column">
                                <label htmlFor="tuf-expected">Expected</label>
                                <input id="tuf-expected" onChange={CSTexpected} type="text" className="p-8 br-8" />
                            </div>
                        </div>
                        <br />
                        <button onClick={Update} type="submit" className="p-8 br-8">Update</button>
                    </div>
                </div>
                <div className="flex gap-12 bg-2 b w-full p-12 br-12">
                    <div className="flex column w-full">
                        <h2>Tasks get</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sit.</p>
                        <br />
                        <button onClick={GetTasks} type="submit" className="p-8 br-8">Get</button>
                    </div>
                </div>
                <div className="flex gap-12 bg-2 b w-full p-12 br-12">
                    <div className="flex column w-full">
                        <h2>Tasks</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at.</p>
                        <br />
                        <div className="flex column gap-12" id="tasks">
                        </div>
                        <br />
                        <div className="flex row gap-12">
                            <button onClick={Submit} type="submit" className="w-full p-8 br-8">Submit</button>
                            <button onClick={BLoadTasks} type="submit" className="w-full p-8 br-8">Update</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sticky flex column gap-12 top-12">
                <div className="flex column gap-12 max-w-600 w-600 bg-2 b p-12 br-12">
                    <h2 className="c-2">Response</h2>
                    <hr />
                    <div className="scroll-x">
                        <pre id="response"></pre>
                    </div>
                </div>
                <div className="flex column gap-12 max-w-600 w-600 bg-2 b p-12 br-12">
                    <h2 className="c-2">Results</h2>
                    <hr />
                    <div className="scroll-x">
                        <pre id="results"></pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;