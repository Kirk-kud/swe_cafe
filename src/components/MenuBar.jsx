import React from "react";

const MenuBar = () => {
  const handleDropdown = () => {
    // Dropdown logic here
  };

  return (
    <div
      className=" lg:left-0 left-[-300px] 
  p-2 w-[300px] overflow-y-auto text-center shadow-lg h-screen rounded"
    >
      <div className="text-gray-100 text-xl">
        <div className="p-2.5 mt-1 flex items-center rounded-md ">
          <h1 className="text-[15px]  ml-3 text-xl text-black font-bold">
            Menu
          </h1>
        </div>
        <hr className="my-2 text-gray-600" />
        <div>
          <div className="p-2.5 mt-2 flex items-center rounded-md duration-300 cursor-pointer hover:bg-black group">
            <span className="text-[15px] ml-4 text-black group-hover:text-white">
              Home
            </span>
          </div>
          <div className="p-2.5 mt-2 flex items-center rounded-md  duration-300 cursor-pointer  hover:bg-black group">
            <span className="text-[15px] ml-4 text-black group-hover:text-white">
              Bookmark
            </span>
          </div>
          <div className="p-2.5 mt-2 flex items-center rounded-md  duration-300 cursor-pointer  hover:bg-black group">
            <span className="text-[15px] ml-4 text-black group-hover:text-white">
              Messages
            </span>
          </div>

          <div className="p-2.5 mt-2 flex items-center rounded-md  duration-300 cursor-pointer  hover:bg-black group">
            <i className="bi bi-chat-left-text-fill"></i>
            <div
              className="flex justify-between w-full items-center"
              onClick={handleDropdown}
            >
              <span className="text-[15px] ml-4 text-black group-hover:text-white">
                Chatbox
              </span>
            </div>
          </div>
          <div className="p-2.5 mt-3 flex items-center rounded-md  duration-300 cursor-pointer  hover:bg-black group">
            <span className="text-[15px] ml-4 text-black group-hover:text-white">
              Logout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
