// import { Pform } from "./interfaces";
// --------------------Form inputs------------------------------------------------

const ProjectName = document.querySelector(".name") as HTMLInputElement;
const projectDescription = document.querySelector(
  ".description"
) as HTMLInputElement;
const EndDate = document.querySelector(".end-date") as HTMLInputElement;
const AddBtn = document.querySelector(
  ".assign-project-btn"
) as HTMLInputElement;

const Message = document.querySelector(".msg") as HTMLParagraphElement;
// ---------------------Project Header-----------------------------------------

const ProjectHead = document.querySelector(".projects-head") as HTMLDivElement;

// --------------------Project Container---------------------------------------

const ProjectContainer = document.querySelector(
  ".project-container"
) as HTMLDivElement;

const projError = document.querySelector(".errproject") as HTMLDivElement;
const errcomplete = document.querySelector(
  ".errcomplete-project"
) as HTMLDivElement;

const completeContainer = document.querySelector(
  ".complete-project-container"
) as HTMLDivElement;
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

  fetch("http://localhost:3002/projects/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      data.forEach((element: any) => {
        console.log(element)
        console.log(element.ProjectName,)
          console.log(element.Description)
          console.log( element.Due_date)

        const article= ` 
        <div >  
        <div class="avatar" ><img src="../images/images.jpeg"><p>Amos Mwongela</p></div>
        <hr>
        <p class="tname" >${element.ProjectName}</p>
        <p>${element.Description}</p>
        <p>Due before(<span class="date">${element.Due_date}</span>)</p>
        </div>
        `;
        console.log(article)
        // console.log(element)
        // Project.innerHTML = article
        // Project.insertAdjacentElement("beforeend", article)
        Project.appendChild(div);
        ProjectContainer.innerHTML  = Project;
       
      });

      // ProjectContainer.insertAdjacentHTML("beforeend",Project);
      projError.style.display = "none";
    })
    .then(() => {
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

const AcceptData = (name: string, description: string, date: string) => {
  const prom = new Promise<{ error?: string; message?: string }>(
    (resolve, reject) => {
      fetch("http://localhost:3002/projects/", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          Name: name,
          Description: description,
          Date: date,
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

  ClearInputs();
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
  } else {
    AcceptData(Name, Description, Date);
  }
};

//Event listeners
AddBtn.addEventListener("click", (e: Event) => {
  e.preventDefault();
  ValidateForm();
});
