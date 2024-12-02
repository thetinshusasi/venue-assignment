import React from 'react'

import styles from './header.module.css'
import HeaderMenu from '../header-menu/header-menu'

export default function Header() {
	return (
		<header className={styles.header}>
			<HeaderMenu />
		</header>
	)
}
