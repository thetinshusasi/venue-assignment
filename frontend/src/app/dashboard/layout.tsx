import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import styles from './page.module.css'
import { Box } from '@mui/material'
interface DashboardLayoutProps {
	children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
	return (
		<div className={styles.container}>
			<Sidebar />
			<Box className={styles.boxContainer}>{children}</Box>
		</div>
	)
}

export default DashboardLayout
