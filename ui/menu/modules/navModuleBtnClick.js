function navModuleBtnClick(event) {
    let target = event.target

    if (!target) return

    if (target.classList.contains("is-active")) return

    while (!target.classList.contains("tab-menu-navbar-list-item")) {
        target = target.parentNode
    }

    const allNavModuleBtns = target.parentElement.querySelectorAll(".tab-menu-navbar-list-item")

    for (let i = 0; i < allNavModuleBtns.length; i++) {
        allNavModuleBtns[i].classList.remove("is-active")
        
        const moduleMenuName = allNavModuleBtns[i].getAttribute("data-nav-m-menuname")

        if (!moduleMenuName) continue

        const moduleMenu = document.querySelector(`.module-menu-container[data-m-menuname="${moduleMenuName}"]`)

        moduleMenu.classList.add("hidden")
    }

    target.classList.add("is-active")

    const moduleMenuName = target.getAttribute("data-nav-m-menuname")

    if (!moduleMenuName) return

    const moduleMenu = document.querySelector(`.module-menu-container[data-m-menuname="${moduleMenuName}"]`)

    moduleMenu.classList.remove("hidden")
}

export default navModuleBtnClick