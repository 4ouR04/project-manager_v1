const projectContainer = document.querySelector(
  ".project-container"
) as HTMLDivElement;
const projectHead = document.querySelector(".projects-head") as HTMLDivElement;

(() => {
  if (projectContainer.children.length == 0) {
    projectHead.innerHTML = ` 
        <div><p>No Projects Enjoy The Silence</p></div>
        <div><img src="../images/noprojects.png"/><div>
    `;
  } else {
    projectHead.innerHTML = `
        <div><p>Current Projects</p></div>
        <div><img src="../images/projects.png"/><div>
    `;
  }
})();
