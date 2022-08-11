// --------------------Form inputs------------------------------------------------

const ProjectName = document.querySelector(".name") as HTMLInputElement;
const Description = document.querySelector(".description") as HTMLInputElement;
const EndDate = document.querySelector(".end-date") as HTMLInputElement;
const AddBtn = document.querySelector(
  ".assign-project-btn"
) as HTMLInputElement;

const Message = document.querySelector(".msg") as HTMLParagraphElement;
// ---------------------Project Header-----------------------------------------

const ProjectHead = document.querySelector(
  ".projects-head"
) as HTMLParagraphElement;

// --------------------Project Container---------------------------------------

const ProjectContainer = document.querySelector(
  ".project-container"
) as HTMLDivElement;

//---------------------Assign Button-----------------------------------------------

// ---------------------Modal section-0---------------------------------------

const userModal = document.querySelector(".user-modal") as HTMLDivElement;

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
  AssignBtn.addEventListener("click", () => {
    userModal.style.display = "flex";
    userModal.addEventListener("click", () => {
      userModal.style.display = "none";
    });
  });
  div.appendChild(AssignBtn);
  div.appendChild(DeleteBtn);

  fetch("http://localhost:3000/users/projects")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((project: any) => {
        Project.innerHTML = `
      <div>  
      <p class="tname" >${project.Name}</p>
      <p>${project.Description}</p>
      <p>Due before(<span class="date">${project.end_date}</span>)</p>
      </div>
      `;

        Project.appendChild(div);
        ProjectContainer.appendChild(Project);
        // ProjectContainer.insertAdjacentHTML("beforeend", rawproject);
      });
    });
})();
// ***************************************************************************************8
(() => {
  if (ProjectContainer.children.length == 0) {
    ProjectHead.innerHTML = `
    <div><p>No Projects To Display</p></div>
    <div><img src="../images/noprojects.png"/><div>
    `;
  } else {
    ProjectHead.innerHTML = `
    <div><p>Current Projects</p></div>
    <div><img src="../images/projects.png"/><div>
    `;
  }
})();

//--------------------------Functions--------------------------------------------
// Clear Inputs

const ClearInputs = () => {
  ProjectName.value = "";
  EndDate.value = "";
  Description.value = "";
};

// accept data

const AcceptData = () => {
  // ProjectHead.innerHTML = `
  //   <div><p>Current Projects</p></div>
  //   <div><img src="../images/projects.png"/><div>
  // `;

  // let Project = document.createElement("div");
  // Project.className = "project";
  // let div = document.createElement("div");
  // let AssignBtn = document.createElement("button");
  // let DeleteBtn = document.createElement("button");
  // DeleteBtn.className = "delete-btn";
  // DeleteBtn.innerText = "Delete";
  // AssignBtn.className = "assign-btn";
  // AssignBtn.innerText = "Assign To";
  // AssignBtn.addEventListener("click", () => {
  //   userModal.style.display = "flex";
  //   userModal.addEventListener("click", () => {
  //     userModal.style.display = "none";
  //   });
  // });
  // div.appendChild(AssignBtn);
  // div.appendChild(DeleteBtn);
  // Project.innerHTML = `
  //    <div>
  //       <p class="tname" >${ProjectName.value}</p>
  //       <p>${Description.value}</p>
  //       <p>Due before(<span class="date">${EndDate.value}</span>)</p>
  //   </div>

  //   `;
  // Project.appendChild(div);

  // ProjectContainer.appendChild(Project);

  ClearInputs();
};

// Validate Form

const ValidateForm = () => {
  if (
    ProjectName.value === "" ||
    Description.value == "" ||
    EndDate.value === ""
  ) {
    Message.innerHTML = `Fill all fields`;
    Message.style.color = "red";

    setTimeout(() => {
      Message.innerHTML = ``;
    }, 3000);

    return false;
  } else {
    AcceptData();
  }
};

//Event listeners
AddBtn.addEventListener("click", (e: Event) => {
  e.preventDefault();
  ValidateForm();
});
