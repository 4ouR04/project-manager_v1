"use strict";
// import { Pform } from "./interfaces";
// --------------------Form inputs------------------------------------------------
const ProjectName = document.querySelector(".name");
const projectDescription = document.querySelector(".description");
const EndDate = document.querySelector(".end-date");
const AddBtn = document.querySelector(".assign-project-btn");
const Message = document.querySelector(".msg");
// ---------------------Project Header-----------------------------------------
const ProjectHead = document.querySelector(".projects-head");
// --------------------Project Container---------------------------------------
const ProjectContainer = document.querySelector(".project-container");
const projError = document.querySelector(".errproject");
const errcomplete = document.querySelector(".errcomplete-project");
const completeContainer = document.querySelector(".complete-project-container");
// ---------------------Modal section-0---------------------------------------
const userModal = document.querySelector(".user-modal");
// ================================================================================================================================
// ******************************* Data from Backend ****************
(() => {
    let Project = document.createElement("div");
    Project.className = "project";
    let div = document.createElement("div");
    div.className = "btns";
    let AssignBtn = document.createElement("button");
    let UpdateBtn = document.createElement("button");
    let DeleteBtn = document.createElement("button");
    DeleteBtn.className = "delete-btn";
    DeleteBtn.innerText = "Delete";
    UpdateBtn.className = "update-btn";
    UpdateBtn.innerText = "Update";
    AssignBtn.className = "assign-btn";
    AssignBtn.innerText = "Assign To";
    div.appendChild(AssignBtn);
    div.appendChild(UpdateBtn);
    div.appendChild(DeleteBtn);
    fetch("http://localhost:3002/projects/")
        .then((response) => response.json())
        .then((data) => {
        for (const element of data) {
            let id = element.ProjectId;
            console.log(id);
            const article = ` 
        <div id= ${id} >  
        <div class="avatar" ><img src="../images/images.jpeg"><p>Amos Mwongela</p></div>
        <hr>
        <p class="tname" >${element.ProjectName}</p>
        <p>${element.Description}</p>
        <p>Due before(<span class="date">${element.Due_date}</span>)</p>
        </div>
        `;
            Project.innerHTML = article;
            Project.appendChild(div);
            projError.style.display = "none";
            ProjectContainer.innerHTML += Project.outerHTML;
        }
    })
        .then(() => {
        (() => {
            let assignbtn = document.querySelectorAll(".assign-btn");
            assignbtn.forEach(btn => {
                btn.addEventListener("click", () => {
                    userModal.style.display = "flex";
                    userModal.addEventListener("click", () => {
                        userModal.remove();
                    });
                });
            });
            // *****************delete*************
            const delbtn = document.querySelectorAll(".delete-btn");
            delbtn.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    var _a, _b, _c;
                    let id = (_c = (_b = (_a = btn.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.firstElementChild) === null || _c === void 0 ? void 0 : _c.id;
                    deleteproject(id);
                });
            });
            const deleteproject = (id) => {
                fetch("http://localhost:3002/projects/" + id, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    method: "DELETE"
                }).then((res) => {
                    res.json();
                }).then((data) => {
                    return data;
                });
            };
            // *********************************
        })();
    })
        .then(() => {
        let completeProject = document.createElement("div");
        fetch("http://localhost:3002/projects/completed")
            .then((response) => response.json())
            .then((data) => {
            console.log(data);
            completeProject.innerHTML = `
            <div class="complete-project">  
                <p class="tname" >${data.Name}</p>
            </div>
            `;
            completeContainer.appendChild(completeProject);
            // ProjectContainer.insertAdjacentHTML("beforeend", rawproject);
            errcomplete.remove();
        });
    });
})();
// ***************************************************************************************
//--------------------------Functions--------------------------------------------
// Clear Inputs
const ClearInputs = () => {
    ProjectName.value = "";
    EndDate.value = "";
    projectDescription.value = "";
};
// accept data
const AcceptData = (name, description, date) => {
    const prom = new Promise((resolve, reject) => {
        fetch("http://localhost:3002/projects/", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                ProjectName: name,
                Description: description,
                Due_date: date,
            }),
        })
            .then((res) => {
            resolve(res.json());
        })
            .catch((err) => {
            reject(err);
        });
    });
    prom.then((data) => console.log(data)).catch((err) => console.log(err));
    ClearInputs();
    // window.location.reload()
};
// Validate Form
const ValidateForm = () => {
    const Name = ProjectName.value;
    const Description = projectDescription.value;
    const Date = EndDate.value;
    if (Name === "" || Description == "" || Date === "") {
        Message.innerHTML = `Fill all the fields`;
        Message.style.color = "red";
        setTimeout(() => {
            Message.innerHTML = ``;
        }, 3000);
        return false;
    }
    else {
        AcceptData(Name, Description, Date);
    }
};
//Event listeners
AddBtn.addEventListener("click", (e) => {
    e.preventDefault();
    ValidateForm();
});
