import { TLAssetStore, uniqueId } from 'tldraw'

export const multiplayerAssetStore: TLAssetStore = {
	async upload(_asset, file) {
		const id = uniqueId()
		const objectName = `${id}-${file.name}`.replace(/[^a-zA-Z0-9.]/g, '-')
		const url = `/api/uploads/${objectName}`

		const response = await fetch(url, {
			method: 'POST',
			body: file,
		})

		if (!response.ok) {
			throw new Error(`Failed to upload asset: ${response.statusText}`)
		}

		return { src: url }
	},

	resolve(asset) {
		return asset.props.src
	},
}
