import React, { useEffect, useState } from "react";
import { Menu, Modal, ActionIcon } from "@mantine/core";
import { UserCircle, Login, UserPlus, User, Settings, Logout } from "tabler-icons-react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import UserLogin from "../features/auth/components/Login";
import UserRegister from "../features/auth/components/Register";
import SettingsMenu from "./SettingsPanel";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { loginSuccess, logout } from "../features/auth/authSlice";
import { useGetUserQuery} from "../features/auth/authApi";

const UserPanel: React.FC = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);
    const [formType, setFormType] = useState<"login" | "register">("");

    const dispatch: AppDispatch = useDispatch();
    const { data: currentUser , error, isLoding } = useGetUserQuery();
    const {colorScheme,} = useSelector((state: RootState) => state.news);

    useEffect(() => {
        close
    }, [currentUser]);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", colorScheme === "dark");
    }, [colorScheme]);

    const onLogin = (user: { token: string; id: number; name: string; email: string }) => {
        localStorage.setItem("token", user.token);
        dispatch(loginSuccess({ id: user.id, name: user.name, email: user.email }));
    };

    const onRegister = () => {
        close
    };

    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(logout());
        notifications.show({
            title: "Success",
            message: "Logged out successfully",
        });
    };

    const IconClass = currentUser ? UserCircle : Login;

    return (
        <>
            <div className="relative">
                {/* Menu Trigger */}
                <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <IconClass
                        size={40}
                        strokeWidth={2}
                        color={colorScheme === "dark" ? "white" : "black"}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-md z-10"
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        {currentUser ? (
                            <div className="py-2">
                                <p className="px-4 py-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                                    Logged in
                                </p>
                                <div
                                    className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-not-allowed"
                                    title={currentUser.name}
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    {currentUser.name}
                                </div>
                                <button
                                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={openSettings}
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </button>
                                <button
                                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={handleLogout}
                                >
                                    <Logout className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="py-2">
                                <p className="px-4 py-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                                    User
                                </p>
                                <button
                                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => {
                                        setFormType("login");
                                        open();
                                    }}
                                >
                                    <Login className="w-4 h-4 mr-2" />
                                    Login
                                </button>
                                <button
                                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => {
                                        setFormType("register");
                                        open();
                                    }}
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Register
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {opened && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg">
                        {/* Close Button */}
                        <button
                            onClick={close}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            aria-label="Close"
                        >
                            ✕
                        </button>

                        {/* Modal Content */}
                        <h2 className="text-lg font-bold mb-4">
                            {formType === "login" ? "Login" : "Register"}
                        </h2>
                        {formType === "login" && <UserLogin onLogin={close} />}
                        {formType === "register" && <UserRegister onRegister={close} />}
                    </div>
                </div>
            )}


            <Modal opened={settingsOpened} onClose={closeSettings} title="Settings" centered size="lg">
                <SettingsMenu />
            </Modal>
        </>
    );
};

export default UserPanel;
