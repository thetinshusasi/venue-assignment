'use client'

import React from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { useRouter } from 'next/navigation'
import styles from './Sidebar.module.css'
import { Drawer, Toolbar, ListItemIcon } from '@mui/material'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
const drawerWidth = 240

const Sidebar = () => {
	const router = useRouter()

	const navigateTo = (path: string) => {
		router.push(path)
	}

	return (
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerWidth,
					boxSizing: 'border-box',
				},
			}}
			variant="permanent"
			anchor="left"
		>
			<Toolbar />
			<Divider />
			<List>
				<ListItem key="Dashboard" disablePadding>
					<ListItemButton onClick={() => navigateTo('/dashboard')}>
						<ListItemIcon>
							<HomeRoundedIcon />
						</ListItemIcon>
						<ListItemText primary="Dashboard" />
					</ListItemButton>
				</ListItem>
				<ListItem key="Repository" disablePadding>
					<ListItemButton onClick={() => navigateTo('/dashboard/repository')}>
						<ListItemIcon>
							<DashboardRoundedIcon />
						</ListItemIcon>
						<ListItemText primary="Repository" />
					</ListItemButton>
				</ListItem>
			</List>
			<Divider />
		</Drawer>
	)
}

export default Sidebar
