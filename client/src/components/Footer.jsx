import React from "react";
import {CgGoogleTasks} from "react-icons/cg";

const Footer = () => {
    return (
        <footer className="bg-base-100 outline-none z-10 shadow-sm border-t-2 border-dotted">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 pb-2 ">
                <div className="md:flex md:justify-between ">
                    <div className="mb-6 md:mb-0">
                        <a href="#" className="flex items-center">
                            <CgGoogleTasks size={30} className="mr-2"/>
                            <span className="self-center  text-2xl font-semibold whitespace-nowrap ">
                                <span className="">Torus Assignment</span>
                            </span>
                        </a>
                    </div>
                </div>
                <hr className="my-6 border-white sm:mx-auto border-t-2 border-dotted"/>
            </div>
        </footer>
    );
};

export default Footer;
