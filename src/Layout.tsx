import classnames from "classnames";
import { Link, Outlet, useLocation, useMatch } from "react-router-dom";


const menus = [
  {
    path: "/",
    name: "主页"
  },
  {
    path: "/settings",
    name: "设置"
  },
  {
    path: "/about",
    name: "关于"
  },
]

export default function Layout() {
  const { pathname } = useLocation()
  
  return (
    <div>
      <div>
        <h1>Focus App</h1>
        <div className="navbar">
          {menus.map((menu) => {
            const isActive = pathname === menu.path
            const cls = classnames({
              'active': isActive,
            })
            return (
              <Link className={cls} to={menu.path} key={menu.name}>
                {menu.name}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}
