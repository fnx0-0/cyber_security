
import { RenderAppBreadcrumb } from '@/ikon/components/app-breadcrumb';
import { RenderAppSidebar } from '@/ikon/components/app-sidebar';
import React from 'react';
const menuItems = [
    {
        title: 'Profile',
        href: '/setting/profile'
    },
   /*  {
        title: 'Account',
    }, */
   /*  {
        title: 'Collaborations',
        submenu: [
            {
                title: 'User Invitations',
            },
            {
                title: 'Share Apps',
            },
        ],
    }, */
    {
        title: 'Appearance',
        href: '/setting/appearance'
    },
  /*   {
        title: 'Notifications',
        href: '/setting/notification'
    }, */
   /*  {
        title: 'App display',
    }, */
    {
        title: 'App Settings',
        href: '/setting/app-settings'
    },
    {
        title: 'Users',
        href: '/setting/users'
    },
   /*  {
        title: 'Review',
        href: '/setting/review'
    } */

];

export default function Setting({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <RenderAppSidebar menuItems={menuItems} />
            <RenderAppBreadcrumb breadcrumb={{ level: 1, title: "Setting", href: "/setting" }} />
            {children}
        </>
    );
}
