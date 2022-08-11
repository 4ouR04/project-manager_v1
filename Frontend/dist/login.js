"use strict";
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
// Sign in
const login = document.querySelector(".login");
const loginEmail = document.querySelector(".loginEmail");
const loginPassword = document.querySelector(".loginPassword");
// Sign up
const signup = document.querySelector(".signup");
const signupName = document.querySelector(".name");
const signupEmail = document.querySelector(".email");
const signupPassword = document.querySelector(".pass");
class Users {
    static getUser() {
        return new Users();
    }
    constructor() { }
    loginUser(email, password) {
        const prom = new Promise((resolve, reject) => {
            fetch("http://localhost:3000/users/signin", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    Email: email,
                    Password: password,
                }),
            })
                .then((res) => {
                resolve(res.json());
            })
                .catch((err) => {
                reject(err);
            });
        });
        prom
            .then((Data) => {
            Data.token ? localStorage.setItem("token", Data.token) : "";
            this.redirect();
        })
            .catch((err) => console.error(err));
    }
    register(name, email, password) {
        const prom = new Promise((resolve, reject) => {
            fetch("http://localhost:3000/users/signup", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    Name: name,
                    Email: email,
                    Password: password,
                }),
            })
                .then((res) => {
                resolve(res.json());
            })
                .catch((err) => {
                reject(err);
            });
        });
        prom.then((data) => console.log(data)).catch((err) => console.error(err));
    }
    redirect() {
        const token = localStorage.getItem("token");
        new Promise((resolve, reject) => {
            fetch("http://localhost:3000/users/check", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    token: token,
                },
                method: "GET",
            })
                .then((res) => resolve(res.json()))
                .catch((err) => reject(err));
        }).then((Data) => {
            localStorage.setItem("Name", Data.Name);
            if (Data.Role === "Admin") {
                location.href = "../admin/index.html";
            }
            else {
                location.href = "../user/index.html";
            }
        });
    }
}
login === null || login === void 0 ? void 0 : login.addEventListener("click", (e) => {
    e.preventDefault();
    const Email = loginEmail.value;
    const Password = loginPassword.value;
    if (Email == "" || Password === "") {
        console.error("Please fill in all Fields");
    }
    else {
        // console.log(Email + Password);
        Users.getUser().loginUser(Email, Password);
    }
});
signup === null || signup === void 0 ? void 0 : signup.addEventListener("click", () => {
    const Name = signupName.value;
    const Email = signupEmail.value;
    const Password = signupPassword.value;
    if (Name == "" || Email == "" || Password === "") {
        console.error("Please fill in all Fields");
    }
    else {
        Users.getUser().register(Name, Email, Password);
    }
});
