type NavLink = {
  name: string;
  path: string;
  icon: string;
  badge?: string;
  roles?: string[];
}

export const mainNavLinks: NavLink[] = [
  {
    name: "Dashboard",
    path: "/console",
    icon: "i-uil-apps",
    roles: ['ADMIN', 'USER']
  },
  {
    name: "Users",
    path: "/console/users",
    icon: "i-uil-users-alt",
    roles: ['ADMIN']
  },
];

export const otherLinks: NavLink[] = [
  {
    name: "APIs",
    path: "/console/apis",
    icon: "i-uil-chart-line",
    roles: ['ADMIN']
  },
];

export const accountLinks: NavLink[] = [
  {
    name: "Settings",
    path: "/console/settings",
    icon: "i-uil-setting",
    roles: ['ADMIN', 'USER']
  },
  {
    name: "Help",
    path: "/console/help",
    icon: "i-uil-question-circle",
    roles: ['ADMIN', 'USER']
  }
];
