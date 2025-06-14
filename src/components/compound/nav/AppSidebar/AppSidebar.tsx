"use client";

import React, { useState } from "react";
import {
  Home,
  Box,
  User,
  Kanban,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import styles from "./AppSidebar.module.css";

interface MenuItemType {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItemType[] = [
  { id: "dashboard", label: "Dashboard", icon: <Home /> },
  { id: "product", label: "Product", icon: <Box /> },
  { id: "account", label: "Account", icon: <User /> },
  { id: "kanban", label: "Kanban", icon: <Kanban /> },
];

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState<string>("dashboard");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleItemClick = (id: string) => {
    setActiveItem(id);
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ""}`}>
      {/* Top Section: Logo, Toggle, Nav */}
      <div className={styles.topSection}>
        <div className={styles.platformHeader}>
          <div className={styles.logoAndTitle}>
            <div className={styles.logoBox}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2c1 2 1 4 0 6 1-2 3-2 4 0-1 1-2 2-3 2 2 1 2 3 0 4 1-1 2-2 3-2-1 2-3 2-4 0 1 2 1 4 0 6" />
                <circle cx="12" cy="12" r="1" />
              </svg>
            </div>
            <div className={styles.platformLabel}>Flowbee</div>
          </div>

          <button
            className={styles.toggleButton}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <PanelLeftOpen size={24} /> : <PanelLeftClose size={24} />}
          </button>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`${styles.menuItem} ${
                activeItem === item.id ? styles.menuItemActive : ""
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Section: Settings & User */}
      <div className={styles.bottomSection}>
        <div className={styles.divider}></div>

        <div className={styles.settingsSection}>
          <button className={styles.menuItem}>
            <span>
              <Settings />
            </span>
            <span>Settings</span>
          </button>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.userSection}>
          <div className={styles.userContainer}>
            <div className={styles.avatar}>JD</div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>John Doe</p>
              <p className={styles.userEmail}>john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
