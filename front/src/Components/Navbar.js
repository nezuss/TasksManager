import React from "react";

function Navbar() {
    return (
        <nav className="flex row justify-center align-center p-12 bb">
            <ul className="flex gap-12">
                <li className="bg-1 p-8 br-12"><a href="/auth" className="c-1">Auth</a></li>
                <li className="bg-1 p-8 br-12"><a href="/categories" className="c-1">Categories</a></li>
                <li className="bg-1 p-8 br-12"><a href="/tasks" className="c-1">Tasks</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;