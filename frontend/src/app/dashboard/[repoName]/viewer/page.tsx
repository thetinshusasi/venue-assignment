import { NextPage } from 'next'
import FileViewer from '../../../../components/file-viewer/file-viewer'

interface Props {}

const Page: NextPage<Props> = async ({
	params,
}: {
	params: Promise<{ repoName: string }>
}) => {
	const slug = (await params).repoName

	return (
		<div>
			<FileViewer repoName={slug} />
		</div>
	)
}

export default Page
