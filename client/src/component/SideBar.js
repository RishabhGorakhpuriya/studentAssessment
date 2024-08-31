import React, { useState } from 'react';
import { IoIosCreate } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import {
    FiGrid,
    FiUser,
    FiPieChart,
    FiShoppingCart,
    FiHeart,
    FiSettings
} from "react-icons/fi";
import '../assesst/SideBar.css';
import { Link } from 'react-router-dom'
// Define the sidebar links for teachers and students
const allLinks = {
    teacher: [
        {
            title: "Dashboard",
            icon: <FiGrid />,
            link: "/"
        },
        {
            title: "User",
            icon: <FiUser />,
            link: "/userprofile"
        },
        {
            title: "Create New Assessment",
            icon: <IoIosCreate />,
            link: "/createAssessment"
        },
        {
            title: "Student List",
            icon: <FiPieChart />,
            link: "/studentList"
        },
        {
            title: "Order",
            icon: <FiShoppingCart />,
            link: "#"
        },
        {
            title: "Saved",
            icon: <FiHeart />,
            link: "#"
        },
        {
            title: "Setting",
            icon: <FiSettings />,
            link: "#"
        }
    ],
    student: [
        {
            title: "Dashboard",
            icon: <FiGrid />,
            link: "/"
        },
        {
            title: "Assignments History",
            icon: <FaHistory />,
            link: `/assessmentHistory/${localStorage.getItem("id")}`
        },
        {
            title: "User",
            icon: <FiUser />,
            link: "/userprofile"
        },
        {
            title: "Saved",
            icon: <FiHeart />,
            link: "#"
        }
    ]
};


const SideBar = () => {
    const [activeBar, setActiveBar] = useState(false);
    const nevigate = useNavigate();
    // Get user role from localStorage
    const UserRole = localStorage.getItem('role');

    // Determine the links based on user role
    const links = allLinks[UserRole] || [];

    const fullName = localStorage.getItem('fullName');
    console.log(fullName);
    const handleLogout = () => {
        localStorage.removeItem('token');
        nevigate("/login");
    }
    return (
        <aside className={`sidebar ${activeBar ? "active" : ""}`}>
            <header className="header">
                <button
                    className="toggle-sidebar-btn"
                    onClick={() => setActiveBar(!activeBar)}
                >
                    |||
                </button>
            </header>

            <ul className="list-items">
                {Array.isArray(links) && links.map(({ title, icon, link }, index) => (
                    <li key={index} className="item">
                        <Link className="link" to={link}>
                            <figure className="link-icon">{icon}</figure>
                            <span className="link-name">{title}</span>
                        </Link>
                        <span className="tooltip">{title}</span>
                       
                    </li>
                ))}
            </ul>
            <button className="logout-btn" >
                <btton className="link-name " onClick={handleLogout}> <CiLogout size={20}  /></btton>
                <div className="user-name-wrapper">

                    <span className="user-name">{fullName}</span>
                </div>
            </button>
        </aside>
    );
};

export default SideBar;
