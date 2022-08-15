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
    let AssignBtn = document.createElement("button");
    let DeleteBtn = document.createElement("button");
    DeleteBtn.className = "delete-btn";
    DeleteBtn.innerText = "Delete";
    AssignBtn.className = "assign-btn";
    AssignBtn.innerText = "Assign To";
    div.appendChild(AssignBtn);
    div.appendChild(DeleteBtn);
    fetch("http://localhost:3002/projects/")
        .then((response) => response.json())
        .then((data) => {
        for (const element of data) {
            const article = ` 
        <div >  
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
                    //  alert("Hi");
                    userModal.addEventListener("click", () => {
                        userModal.style.display = "none";
                    });
                });
            });
            console.log(assignbtn);
            if (ProjectContainer.children.length == 0) {
                ProjectHead.innerHTML = `
        <div><p>No Projects To Display</p></div>
        <div><img src="../images/noprojects.png"/><div>
    `;
            }
            else {
                ProjectHead.innerHTML = `
        <div><p>Current Projects</p></div>
        <div><img src="../images/projects.png"/><div>
    `;
            }
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
