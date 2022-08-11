const signUpButton = document.getElementById("signUp") as HTMLButtonElement;
const signInButton = document.getElementById("signIn") as HTMLButtonElement;
const container = document.getElementById("container") as HTMLDivElement;

// Sign in
const login = document.querySelector(".login") as HTMLButtonElement;

const loginEmail = document.querySelector(".loginEmail") as HTMLInputElement;
const loginPassword = document.querySelector(
  ".loginPassword"
) as HTMLInputElement;

// Sign up
const signup = document.querySelector(".signup") as HTMLButtonElement;

const signupName = document.querySelector(".name") as HTMLInputElement;
const signupEmail = document.querySelector(".email") as HTMLInputElement;
const signupPassword = document.querySelector(".pass") as HTMLInputElement;

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

//
class Users {
  static getUser() {
    return new Users();
  }

  constructor() {}

  loginUser(email: string, password: string) {
    const prom = new Promise<{
      error?: string;
      token?: string;
      message?: string;
    }>((resolve, reject) => {
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
      .catch((err) => console.log(err));
  }

  register(name: string, email: string, password: string) {
    const prom = new Promise<{ error?: string; message?: string }>(
      (resolve, reject) => {
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
      }
    );

    prom.then((data) => console.log(data)).catch((err) => console.log(err));
  }

  redirect() {
    const token = localStorage.getItem("token") as string;
    new Promise<{ Name: string; Role: string }>((resolve, reject) => {
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
      } else {
        location.href = "../user/index.html";
      }
    });
  }
}

login.addEventListener("click", (e: Event) => {
  e.preventDefault();
  const Email = loginEmail.value;
  const Password = loginPassword.value;
  if (Email == "" || Password === "") {
    console.error("Please fill in all Fields");
  } else {
    // console.log(Email + Password);
    Users.getUser().loginUser(Email, Password);
  }
});

signup.addEventListener("click", () => {
  const Name = signupName.value;
  const Email = signupEmail.value;
  const Password = signupPassword.value;
  if (Name == "" || Email == "" || Password === "") {
    console.log("Please fill in all Fields");
  } else {
    Users.getUser().register(Name, Email, Password);
  }
});
