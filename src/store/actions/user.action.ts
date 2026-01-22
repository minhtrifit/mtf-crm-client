import { createAction } from '@reduxjs/toolkit';
import { UserType } from '@/types/auth';

export const toggleSidebar = createAction('users/toggleSidebar');
export const setSidebar = createAction<boolean>('users/setSidebar');
export const setUser = createAction<UserType>('users/setUser');
export const clearUser = createAction('users/clearUser');
export const toggleWebsiteModal = createAction('users/toggleWebsiteModal');
export const toggleMenuDrawer = createAction('cart/toggleMenuDrawer');
