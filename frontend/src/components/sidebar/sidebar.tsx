'use client'

import React, { useState } from 'react'
import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box'
import IconButton from '@mui/joy/IconButton'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemButton from '@mui/joy/ListItemButton'
import ListItemContent from '@mui/joy/ListItemContent'
import Typography from '@mui/joy/Typography'
import Divider from '@mui/joy/Divider'
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import styles from './Sidebar.module.css'

const Sidebar = () => {
	return (
		<div className={styles.sidebar}>
			<div className={styles.overlay} />
			<Box className={styles.header}>
				<IconButton variant="soft" color="primary" size="sm">
					<BrightnessAutoRoundedIcon />
				</IconButton>
				<Typography level="title-lg">Acme Co.</Typography>
			</Box>
			<Box className={styles.navigation}>
				<List size="sm" className={styles.list}>
					<ListItem>
						<ListItemButton>
							<HomeRoundedIcon />
							<ListItemContent>
								<Typography level="title-sm">Home</Typography>
							</ListItemContent>
						</ListItemButton>
					</ListItem>

					<ListItem>
						<ListItemButton>
							<DashboardRoundedIcon />
							<ListItemContent>
								<Typography level="title-sm">Dashboard</Typography>
							</ListItemContent>
						</ListItemButton>
					</ListItem>
				</List>
			</Box>
			<Divider />
			<Box className={styles.footer}>
				<Avatar
					variant="outlined"
					size="sm"
					src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
				/>
				<Box className={styles.userDetails}>
					<Typography level="title-sm">Siriwat K.</Typography>
					<Typography level="body-xs">siriwatk@test.com</Typography>
				</Box>
				<IconButton size="sm" variant="plain" color="neutral">
					<LogoutRoundedIcon />
				</IconButton>
			</Box>
		</div>
	)
}

export default Sidebar
