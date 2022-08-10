const signUpButton = document.getElementById("signUp") as HTMLButtonElement;
const signInButton = document.getElementById("signIn") as HTMLButtonElement;
const container = document.getElementById("container") as HTMLDivElement;

const inputName = document.querySelector(".name") as HTMLInputElement;
const inputEmail = document.querySelector(".email") as HTMLInputElement;
const inputPassword = document.querySelector(".pass") as HTMLInputElement;

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
      fetch("http://localhost:3000/projectmanager/login", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          Email: Email,
          Password: Password,
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
      .then((data) => {
        data.token ? localStorage.setItem("token", data.token) : "";
        this.redirect();
      })
      .catch((err) => console.log(err));
  }

  register(name: string, email: string, password: string) {
    const prom = new Promise<{ error?: string; message?: string }>(
      (resolve, reject) => {
        fetch("http://localhost:3000/user/signup", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            email: email,
            name: name,
            password: password,
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
    new Promise<{ name: string; role: string }>((resolve, reject) => {
      fetch("http://localhost:3000/user/check", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: token,
        },
        method: "GET",
      })
        .then((res) => resolve(res.json()))
        .catch((err) => reject(err));
    }).then((data) => {
      console.log(data);
      localStorage.setItem("name", data.name);
      if (data.role === "admin") {
        location.href = "adminDashboard.html";
      } else {
        location.href = "userdashboard.html";
      }
    });
  }
}

const Name = inputName.value;
const Email = inputEmail.value;
const Password = inputPassword.value;

signInButton.addEventListener("click", () => {
  if (Email == "" || Password == "") {
    console.log("Please fill in all Fields");
  } else {
    Users.getUser().loginUser(Email, Password);
  }
});

signUpButton.addEventListener("click", () => {
  if (Name == "" || Email == "" || Password === "") {
    console.log("Please fill in all Fields");
  } else {
    Users.getUser().register(Name, Email, Password);
  }
});
