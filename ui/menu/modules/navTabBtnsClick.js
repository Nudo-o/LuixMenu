function navTabBtnsClick(event) {
    let target = event.target

    if (!target) return

    if (target.classList.contains("nav-menu-navbar-list")) return

    while (!target.classList.contains("nav-menu-navbar-list-item")) {
        target = target.parentNode
    }

    const allTabBtns = document.querySelectorAll(".nav-menu-navbar-list-item")

    for (let i = 0; i < allTabBtns.length; i++) {
        allTabBtns[i].classList.remove("is-active")
    }

    target.classList.add("is-active")

    const tabName = target.getAttribute("data-nav-tabname")

    if (!tabName) return

    const allMenuTabs = document.querySelectorAll(".tab-menu-wrapper")

    for (let i = 0; i < allMenuTabs.length; i++) {
        allMenuTabs[i].classList.add("hidden")
    }

    const currentMenuTab = document.querySelector(`.tab-menu-wrapper[data-tabname="${tabName}"]`)

    if (!currentMenuTab) return

    currentMenuTab.classList.remove("hidden")
}

export default navTabBtnsClick