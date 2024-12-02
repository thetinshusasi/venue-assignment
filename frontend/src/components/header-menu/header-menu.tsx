'use client'
import React from 'react'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import styles from './header-menu.module.css'
import { toggleSidebar } from '../../lib/headeUtils'

export default function HeaderMenu() {
	return (
		<IconButton onClick={() => toggleSidebar()} className={styles.menuButton}>
			<MenuIcon />
		</IconButton>
	)
}
